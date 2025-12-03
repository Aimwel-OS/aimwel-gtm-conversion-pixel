// Required necessary APIs
const getUrl = require('getUrl');
const sendPixel = require('sendPixel');
const setCookie = require('setCookie');
const getCookie = require('getCookieValues');
const logToConsole = require('logToConsole');
const getReferrerUrl = require('getReferrerUrl');
const generateRandom = require('generateRandom');
const encodeUriComponent = require('encodeUriComponent');
const getTimestampMillis = require('getTimestampMillis');
const getContainerVersion = require('getContainerVersion');
const currentTimestampInMilliseconds = getTimestampMillis();

// Template Version
const containerVersion = getContainerVersion();

// Assign data fields to variables
const apiEndpoint = data.aimwel_api_endpoint;
const eventType = data.event_type;
const trafficScope = data.traffic_scope;
const testEndpoint = data.test;
const urlParamsStorageDurationDays = (1 * data.url_params_storage_duration_days) || 90;
const debugging = data.debug;

// Debugging option
const log = debugging ? logToConsole : (() => { });

// Set cookie names
const sessionCookieName = '_aimwel_session';
const paramsCookieName = '_aimwel_params';

// Get required cookie and query params values
const sessionIdFromCookie = getCookie(sessionCookieName)[0]; // undefined if empty array
let paramsFromCookie = getCookie(paramsCookieName)[0]; // undefined if empty array
const paramsFromUrl = getUrl('query');
const currentHost = getUrl('host');
const currentPath = getUrl('path');
const referrerHost = getReferrerUrl('host');
const referrerPath = getReferrerUrl('path');

// Set parameter name
const awId = 'aw_id';
const utmSource = 'utm_source';

// get/set sessionId cookie
const cookieOptionsSession = {
    domain: 'auto',
    path: '/',
    'max-age': 1800, // 30 minutes
    samesite: 'Lax',
    secure: true
};

let sessionId = sessionIdFromCookie;

if (!sessionId) {
    log('Session cookie nonexistent: creating sessionId and session cookie');
    sessionId = generateRandom(1000000, 9999999) + '.' + generateRandom(1000000, 9999999);
    setCookie(sessionCookieName, sessionId, cookieOptionsSession);
    log('Session cookie set: ' + sessionId);
} else {
    log('Session cookie exists: extending lifetime');
    setCookie(sessionCookieName, sessionId, cookieOptionsSession);
    log('Session cookie extended: ' + sessionId);
}

// get/set params cookie
const cookieOptionsParams = {
    domain: 'auto',
    path: '/',
    'max-age': urlParamsStorageDurationDays * 24 * 60 * 60,
    samesite: 'Lax',
    secure: true
};

const urlContainsAimwelParams = paramsFromUrl.indexOf(awId) !== -1;
const urlContainsUtmParams = paramsFromUrl.indexOf(utmSource) !== -1;
const urlContainsParams = urlContainsAimwelParams || urlContainsUtmParams;

if (urlContainsParams) {
    log('Campaign parameters detected in url: creating or overwriting params cookie');
    setCookie(paramsCookieName, paramsFromUrl, cookieOptionsParams);
    paramsFromCookie = paramsFromUrl;
    log('Campaign params cookie set/overwritten: ' + paramsFromCookie);
} else {
    if (!paramsFromCookie) {
        log('Campaign params cookie nonexistent and URL does not contain campaign params: continuing without');
    } else {
        log('Campaign params cookie exists: continuing with existing');
    }
}

// Function to build URL with required and additional components
function buildUrl() {
    let url = apiEndpoint;

    if (testEndpoint) {
        log('Testing feature enabled: test endpoint active');
        url += '/test';
    }

    url += '?timestamp=' + currentTimestampInMilliseconds;
    url += '&session_id=' + sessionId;
    url += '&event_type=' + eventType;
    url += '&px_v=' + containerVersion.version;
    url += '&px_dm=' + containerVersion.debugMode;
    url += '&px_pm=' + containerVersion.previewMode;
    url += '&attr_window=' + urlParamsStorageDurationDays;
    url += '&ref_host=' + referrerHost;
    url += '&ref_path=' + referrerPath;
    url += '&curr_host=' + currentHost;
    url += '&curr_path=' + currentPath;

    data.platformParameters.forEach(param => {
      if (param.key) {
          if (param.key === 'job_id' && !param.value) {
              param.value = 'unknown';
              log('The job id parameter value seems to be missing/empty, this is a required value: please check how the job id value is set and/or if it is available at the moment this tag is fired');
          }

          if (param.value) {
              url += '&' + encodeUriComponent(param.key) + '=' + encodeUriComponent(param.value);
          }
        }
    });

    if (paramsFromCookie) {
        url += '&' + paramsFromCookie;
    } else {
        log('Campaign params omitted in URL builder due to nonexistent campaign params cookie or nonexistent url campaign parameters');
    }

    return url;
}

// Placeholder URL variable; only build full URL if sending pixel
let fullUrl;

let cookieContainsAimwelParams, cookieContainsUtmParams;

if (paramsFromCookie) {
    cookieContainsAimwelParams = paramsFromCookie.indexOf(awId) !== -1;
    cookieContainsUtmParams = paramsFromCookie.indexOf(utmSource) !== -1;
}

// Build URL and Send GET request if conditions are met
if (paramsFromCookie && cookieContainsAimwelParams) {
    fullUrl = buildUrl();

    if (testEndpoint) {
      log('Sending pixel to test endpoint: Aimwel campaign');
    } else {
        log('Sending pixel: Aimwel campaign');
    }

    sendPixel(fullUrl + '&t=aimwel', data.gtmOnSuccess, data.gtmOnFailure);
    log('URL sent: ' + fullUrl + '&t=aimwel');
} else {
    if (trafficScope == 'all' && (cookieContainsUtmParams || !paramsFromCookie)) {
        fullUrl = buildUrl();

        if (testEndpoint) {
          log('Sending pixel to test endpoint: all traffic allowed');
        } else {
          log('Sending pixel: all traffic allowed');
        }

        sendPixel(fullUrl + '&t=all', data.gtmOnSuccess, data.gtmOnFailure);
        log('URL sent: ' + fullUrl + '&t=all');
    } else if (trafficScope == 'aimwel') {
        log('Not sending pixel: limited traffic allowed');
        data.gtmOnSuccess();
    } else {
        log('Not sending pixel: no campaign params present and traffic scoping incorrect/unknown');
        data.gtmOnSuccess();
    }
}