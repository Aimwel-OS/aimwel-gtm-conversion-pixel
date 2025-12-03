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
const LOG_PREFIX = '[Aimwel] ';


// Config
const endpoint = data.aimwel_api_endpoint;
const eventType = data.event_type;
const trafficScope = data.traffic_scope;
const isTestMode = data.test;
const attrDays = (1 * data.url_params_storage_duration_days) || 90;
const log = data.debug ? logToConsole : function() {};


// Log configuration
log(LOG_PREFIX + 'Configuration:');
log(LOG_PREFIX + '  endpoint: ' + endpoint);
log(LOG_PREFIX + '  event_type: ' + eventType);
log(LOG_PREFIX + '  traffic_scope: ' + trafficScope);
log(LOG_PREFIX + '  test_mode: ' + isTestMode);
log(LOG_PREFIX + '  attribution_days: ' + attrDays);

data.platformParameters.forEach(function(p) {
    log(LOG_PREFIX + '  ' + p.key + ': ' + p.value);
});


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
const existingSessionId = getCookieValues(SESSION_COOKIE)[0];
const sessionId = existingSessionId || genSessionId();
const sessionStatus = existingSessionId ? '[EXISTING]' : '[NEW]';

log(LOG_PREFIX + 'Session ' + sessionStatus + ': ' + sessionId);

setCookie(SESSION_COOKIE, sessionId, sessionCookieOpts);


// Campaign params management
const campaignParamsBefore = getCookieValues(PARAMS_COOKIE)[0];

log(LOG_PREFIX + 'Campaign params (before): ' + (campaignParamsBefore || '(empty)'));

const urlParams = getUrl('query');
const urlHasParams = contains(urlParams, AW_ID) || contains(urlParams, UTM_SOURCE);

let campaignParams = campaignParamsBefore;

if (urlHasParams) {
    setCookie(PARAMS_COOKIE, urlParams, paramsCookieOpts);

    campaignParams = urlParams;

    log(LOG_PREFIX + 'Campaign params (after): ' + campaignParams + ' [UPDATED FROM URL]');
} else if (campaignParams) {
    log(LOG_PREFIX + 'Campaign params (after): ' + campaignParams + ' [UNCHANGED]');
} else {
    log(LOG_PREFIX + 'Campaign params (after): (empty) [NO PARAMS]');
}


// Flags
const hasAwId = contains(campaignParams, AW_ID);
const hasUtm = contains(campaignParams, UTM_SOURCE);


// Build URL
function buildUrl() {
    const cv = getContainerVersion();

    let url = endpoint + (isTestMode ? '/test' : '') +
        '?timestamp=' + getTimestampMillis() +
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

    data.platformParameters.forEach(function(p) {
        url += '&' + encodeUriComponent(p.key) + '=' + encodeUriComponent(p.value);
    });

    if (campaignParams) {
        url += '&' + campaignParams;
    }

    return url;
}


// Send pixel
function send(trafficType) {
    const url = buildUrl() + '&t=' + trafficType;

    log(LOG_PREFIX + 'Traffic type: ' + trafficType);
    log(LOG_PREFIX + 'Request URL: ' + url);

    sendPixel(url, function() {
        log(LOG_PREFIX + 'Result: SUCCESS');

        data.gtmOnSuccess();
    }, function() {
        log(LOG_PREFIX + 'Result: FAILED');

        data.gtmOnFailure();
    });
}


// Execute
if (hasAwId) {
    send('aimwel');
} else if (trafficScope === 'all' && (hasUtm || !campaignParams)) {
    send('all');
} else {
    log(LOG_PREFIX + 'Traffic type: (none)');
    log(LOG_PREFIX + 'Result: NOT SENT - traffic scope is "aimwel" but no aw_id found');

    data.gtmOnSuccess();
}
