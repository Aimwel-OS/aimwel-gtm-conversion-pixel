// Shared test setup for GTM template tests

const logToConsole = require("logToConsole");

// Cookie names
const SESSION_COOKIE = '_aimwel_session';
const PARAMS_COOKIE = '_aimwel_params';

// Cookie options (must match pixel.js)
const cookieOptionsSession = {
    domain: 'auto',
    path: '/',
    'max-age': 1800,
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
const getMockData = (overrides) => {
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
};

// Shared mocks (called in each test's setup)
const setupSharedMocks = () => {
    mock('getTimestampMillis', () => 1000);
    mock('generateRandom', () => 1234);
    mock('getContainerVersion', () => ({
        version: '1',
        debugMode: false,
        previewMode: false
    }));

    mock('getReferrerUrl', (component) => {
        if (component === 'host') return referrerData.ref_host;
        if (component === 'path') return referrerData.ref_path;
        return '';
    });

    mock('setCookie', (name, value, options) => {
        cookies[name] = value;
    });
};

// Helper to mock getUrl with specific query params
const mockGetUrl = (queryParams) => {
    mock('getUrl', (component) => {
        if (component === 'query') return queryParams;
        if (component === 'host') return urlData.curr_host;
        if (component === 'path') return urlData.curr_path;
        return '';
    });
};

// Helper to mock getCookieValues
const mockCookies = (sessionId, paramsValue) => {
    mock('getCookieValues', (name) => {
        if (name === SESSION_COOKIE) return sessionId ? [sessionId] : [undefined];
        if (name === PARAMS_COOKIE) return paramsValue ? [paramsValue] : [undefined];
        return [undefined];
    });
};

// Helper to build expected URL
const buildExpectedUrl = (options) => {
    const {
        endpoint = 'https://test.t2.aimwel.com',
        testMode = false,
        sessionId = '1234.1234',
        eventType = 'view',
        attrWindow = 90,
        jobId = 'job_123',
        brand = 'test_brand',
        campaignParams = '',
        trafficType = 'all'
    } = options;

    let url = endpoint + (testMode ? '/test' : '') +
        '?timestamp=1000' +
        '&session_id=' + sessionId +
        '&event_type=' + eventType +
        '&px_v=1' +
        '&px_dm=false' +
        '&px_pm=false' +
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

    url += '&t=' + trafficType;

    return url;
};
