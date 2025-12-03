// GTM Sandboxed JavaScript APIs
const getUrl = require('getUrl');
const sendPixel = require('sendPixel');
const setCookie = require('setCookie');
const getCookieValues = require('getCookieValues');
const logToConsole = require('logToConsole');
const getReferrerUrl = require('getReferrerUrl');
const generateRandom = require('generateRandom');
const encodeUriComponent = require('encodeUriComponent');
const getTimestampMillis = require('getTimestampMillis');
const getContainerVersion = require('getContainerVersion');


// Constants
const SESSION_COOKIE = '_aimwel_session';
const PARAMS_COOKIE = '_aimwel_params';
const AW_ID = 'aw_id';
const UTM_SOURCE = 'utm_source';


// Config
const endpoint = data.aimwel_api_endpoint;
const eventType = data.event_type;
const trafficScope = data.traffic_scope;
const isTestMode = data.test;
const attrDays = (1 * data.url_params_storage_duration_days) || 90;
const log = data.debug ? logToConsole : function() {};


// Log prefix for easy filtering in console
const LOG_PREFIX = '[Aimwel Pixel] ';

function logInfo(msg) {
    log(LOG_PREFIX + msg);
}

function logError(msg) {
    log(LOG_PREFIX + 'ERROR: ' + msg);
}

function logDebug(label, value) {
    log(LOG_PREFIX + label + ': ' + value);
}


// Initialization logging
logInfo('Initializing...');
logDebug('Endpoint', endpoint);
logDebug('Event type', eventType);
logDebug('Traffic scope', trafficScope);
logDebug('Test mode', isTestMode);
logDebug('Attribution window (days)', attrDays);


// Cookie configs
const sessionCookieOpts = {
    domain: 'auto',
    path: '/',
    'max-age': 1800,
    samesite: 'Lax',
    secure: true
};

const paramsCookieOpts = {
    domain: 'auto',
    path: '/',
    'max-age': attrDays * 86400,
    samesite: 'Lax',
    secure: true
};


// Helpers
function contains(str, substr) {
    return str && str.indexOf(substr) !== -1;
}

function genSessionId() {
    return generateRandom(1000000, 9999999) + '.' + generateRandom(1000000, 9999999);
}


// Session management
logInfo('Processing session...');

const existingSessionId = getCookieValues(SESSION_COOKIE)[0];
const sessionId = existingSessionId || genSessionId();

if (existingSessionId) {
    logDebug('Session cookie found', existingSessionId);
    logInfo('Extending session cookie lifetime');
} else {
    logInfo('No session cookie found, creating new session');
    logDebug('New session ID', sessionId);
}

setCookie(SESSION_COOKIE, sessionId, sessionCookieOpts);

logInfo('Session cookie set');


// Campaign params management
logInfo('Processing campaign parameters...');

let campaignParams = getCookieValues(PARAMS_COOKIE)[0];

logDebug('Campaign params from cookie', campaignParams || '(none)');

const urlParams = getUrl('query');

logDebug('URL query string', urlParams || '(empty)');

const urlHasAwId = contains(urlParams, AW_ID);
const urlHasUtm = contains(urlParams, UTM_SOURCE);
const urlHasParams = urlHasAwId || urlHasUtm;

logDebug('URL contains aw_id', urlHasAwId);
logDebug('URL contains utm_source', urlHasUtm);

if (urlHasParams) {
    logInfo('Campaign parameters detected in URL, updating cookie');

    setCookie(PARAMS_COOKIE, urlParams, paramsCookieOpts);

    campaignParams = urlParams;

    logDebug('Campaign params cookie updated', campaignParams);
} else if (campaignParams) {
    logInfo('Using existing campaign params from cookie');
} else {
    logInfo('No campaign parameters available (URL or cookie)');
}


// Flags
const hasAwId = contains(campaignParams, AW_ID);
const hasUtm = contains(campaignParams, UTM_SOURCE);

logDebug('Campaign params contain aw_id', hasAwId);
logDebug('Campaign params contain utm_source', hasUtm);


// Build URL
function buildUrl() {
    logInfo('Building tracking URL...');

    const cv = getContainerVersion();
    const timestamp = getTimestampMillis();

    logDebug('Container version', cv.version);
    logDebug('Debug mode', cv.debugMode);
    logDebug('Preview mode', cv.previewMode);
    logDebug('Timestamp', timestamp);

    let url = endpoint + (isTestMode ? '/test' : '') +
        '?timestamp=' + timestamp +
        '&session_id=' + sessionId +
        '&event_type=' + eventType +
        '&px_v=' + cv.version +
        '&px_dm=' + cv.debugMode +
        '&px_pm=' + cv.previewMode +
        '&attr_window=' + attrDays +
        '&ref_host=' + getReferrerUrl('host') +
        '&ref_path=' + getReferrerUrl('path') +
        '&curr_host=' + getUrl('host') +
        '&curr_path=' + getUrl('path');

    logDebug('Referrer host', getReferrerUrl('host') || '(none)');
    logDebug('Referrer path', getReferrerUrl('path') || '(none)');
    logDebug('Current host', getUrl('host'));
    logDebug('Current path', getUrl('path'));

    logInfo('Processing platform parameters...');

    data.platformParameters.forEach(function(p, index) {
        logDebug('Platform param [' + index + '] key', p.key || '(empty)');
        logDebug('Platform param [' + index + '] value', p.value || '(empty)');

        if (!p.key) {
            logError('Platform param [' + index + '] has no key, skipping');

            return;
        }

        const val = p.value || (p.key === 'job_id' ? 'unknown' : null);

        if (p.key === 'job_id' && !p.value) {
            logError('job_id is empty, using "unknown" - please check your configuration');
        }

        if (val) {
            url += '&' + encodeUriComponent(p.key) + '=' + encodeUriComponent(val);
        }
    });

    if (campaignParams) {
        logInfo('Appending campaign parameters to URL');

        url += '&' + campaignParams;
    } else {
        logInfo('No campaign parameters to append');
    }

    return url;
}


// Send pixel
function send(trafficType) {
    const url = buildUrl() + '&t=' + trafficType;

    logInfo('Sending pixel...');
    logDebug('Traffic type', trafficType);
    logDebug('Full URL', url);

    sendPixel(url, function() {
        logInfo('Pixel sent successfully');

        data.gtmOnSuccess();
    }, function() {
        logError('Pixel request failed');

        data.gtmOnFailure();
    });
}


// Execute
logInfo('Determining send conditions...');
logDebug('Has aw_id', hasAwId);
logDebug('Has utm_source', hasUtm);
logDebug('Traffic scope setting', trafficScope);

if (hasAwId) {
    logInfo('Condition met: aw_id present -> sending as Aimwel traffic');

    send('aimwel');
} else if (trafficScope === 'all' && (hasUtm || !campaignParams)) {
    logInfo('Condition met: traffic scope "all" with UTM or no params -> sending as all traffic');

    send('all');
} else {
    logInfo('No send condition met, not sending pixel');
    logDebug('Reason', trafficScope === 'aimwel' ? 'Traffic scope limited to Aimwel only' : 'Unknown traffic scope or params mismatch');

    data.gtmOnSuccess();
}

logInfo('Execution complete');
