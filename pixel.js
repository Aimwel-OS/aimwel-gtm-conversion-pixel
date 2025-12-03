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
const sessionId = getCookieValues(SESSION_COOKIE)[0] || genSessionId();

log(getCookieValues(SESSION_COOKIE)[0] ? 'Session exists: extending' : 'Session created');

setCookie(SESSION_COOKIE, sessionId, sessionCookieOpts);


// Campaign params management
let campaignParams = getCookieValues(PARAMS_COOKIE)[0];

const urlParams = getUrl('query');
const urlHasParams = contains(urlParams, AW_ID) || contains(urlParams, UTM_SOURCE);

if (urlHasParams) {
    log('URL params detected: updating cookie');

    setCookie(PARAMS_COOKIE, urlParams, paramsCookieOpts);

    campaignParams = urlParams;
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
        if (!p.key) return;

        const val = p.value || (p.key === 'job_id' ? 'unknown' : null);

        if (p.key === 'job_id' && !p.value) {
            log('Warning: job_id is empty, using "unknown"');
        }

        if (val) {
            url += '&' + encodeUriComponent(p.key) + '=' + encodeUriComponent(val);
        }
    });

    if (campaignParams) {
        url += '&' + campaignParams;
    }

    return url;
}


// Send pixel
function send(trafficType) {
    const url = buildUrl() + '&t=' + trafficType;

    log('Sending: ' + url);

    sendPixel(url, data.gtmOnSuccess, data.gtmOnFailure);
}


// Execute
if (hasAwId) {
    send('aimwel');
} else if (trafficScope === 'all' && (hasUtm || !campaignParams)) {
    send('all');
} else {
    log('Not sending: traffic scope restrictions');

    data.gtmOnSuccess();
}
