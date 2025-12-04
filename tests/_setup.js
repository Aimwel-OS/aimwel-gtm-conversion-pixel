// Shared test setup for GTM template tests

const logToConsole = require("logToConsole");

// Cookie names
const SESSION_COOKIE = '_aimwel_session';
const PARAMS_COOKIE = '_aimwel_params';
const GA_COOKIE = '_ga';

// Cookie options (must match pixel.js)
const cookieOptionsSession = {
    domain: 'auto',
    path: '/',
    samesite: 'Lax',
    secure: true
};

const cookieOptionsParams = {
    domain: 'auto',
    path: '/',
    'max-age': 90 * 24 * 60 * 60,
    samesite: 'Lax',
    secure: true
};

// Test data
const urlData = {
    params_full: 'utm_source=test&utm_medium=test&aw_id=123',
    params_awid: 'aw_id=123',
    params_utm: 'utm_source=test&utm_medium=test',
    params_alt_full: 'utm_source=example&utm_medium=example&aw_id=456',
    params_alt_awid: 'aw_id=456',
    params_alt_utm: 'utm_source=example&utm_medium=example',
    params_empty: '',
    curr_host: 'example.com',
    curr_path: '/job_123.html',
};

const referrerData = {
    ref_host: 'google.com',
    ref_path: '/search',
};

// Cookie storage for tests
const cookies = {};

// Base mock data factory
function getMockData(overrides) {
    const defaults = {
        aimwel_api_endpoint: 'https://test.t2.aimwel.com',
        event_type: 'view',
        traffic_scope: 'all',
        test: false,
        debug: true,
        url_params_storage_duration_days: '90',
        platformParameters: [
            { key: 'job_id', value: 'job_123' },
            { key: 'brand', value: 'test_brand' }
        ]
    };

    for (var key in overrides) {
        defaults[key] = overrides[key];
    }

    return defaults;
}

// Shared mocks (called in each test's setup)
function setupSharedMocks() {
    mock('getTimestampMillis', function() { return 1000; });
    mock('generateRandom', function() { return 1234; });
    mock('getContainerVersion', function() {
        return {
            containerId: 'GTM-TEST123',
            version: '1',
            environmentName: '',
            debugMode: false,
            previewMode: false
        };
    });

    mock('getReferrerUrl', function(component) {
        if (component === 'host') return referrerData.ref_host;
        if (component === 'path') return referrerData.ref_path;
        return '';
    });

    mock('setCookie', function(name, value, options) {
        cookies[name] = value;
    });
}

// Helper to mock getUrl with specific query params
function mockGetUrl(queryParams) {
    mock('getUrl', function(component) {
        if (component === 'query') return queryParams;
        if (component === 'host') return urlData.curr_host;
        if (component === 'path') return urlData.curr_path;
        return '';
    });
}

// Helper to mock getCookieValues
function mockCookies(sessionId, paramsValue, gaValue) {
    mock('getCookieValues', function(name) {
        if (name === SESSION_COOKIE) return sessionId ? [sessionId] : [undefined];
        if (name === PARAMS_COOKIE) return paramsValue ? [paramsValue] : [undefined];
        if (name === GA_COOKIE) return gaValue ? [gaValue] : [undefined];
        return [undefined];
    });
}

// Helper to build expected URL
function buildExpectedUrl(options) {
    var endpoint = options.endpoint || 'https://test.t2.aimwel.com';
    var testMode = options.testMode || false;
    var sessionId = options.sessionId || '1234.1234';
    var eventType = options.eventType || 'view';
    var attrWindow = options.attrWindow || 90;
    var jobId = options.jobId || 'job_123';
    var brand = options.brand || 'test_brand';
    var campaignParams = options.campaignParams || '';
    var gaValue = options.gaValue || '';
    var trafficType = options.trafficType || 'all';

    var url = endpoint + (testMode ? '/test' : '') +
        '?timestamp=1000' +
        '&session_id=' + sessionId +
        '&event_type=' + eventType +
        '&px_v=__GIT_SHA__' +
        '&cv_id=GTM-TEST123' +
        '&cv_v=1' +
        '&cv_env=' +
        '&cv_dm=false' +
        '&cv_pm=false' +
        '&attr_window=' + attrWindow +
        '&ref_host=' + referrerData.ref_host +
        '&ref_path=' + referrerData.ref_path +
        '&curr_host=' + urlData.curr_host +
        '&curr_path=' + urlData.curr_path +
        '&job_id=' + jobId +
        '&brand=' + brand;

    if (campaignParams) {
        url += '&' + campaignParams;
    }

    if (gaValue) {
        url += '&_ga=' + gaValue;
    }

    url += '&t=' + trafficType;

    return url;
}
