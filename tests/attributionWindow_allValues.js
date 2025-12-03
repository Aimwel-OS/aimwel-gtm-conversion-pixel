// Attribution window: test all values (30, 60, 90 days)

const testAttributionWindow = (days) => {
    setupSharedMocks();
    mockCookies(null, null);
    mockGetUrl(urlData.params_full);

    const mockData = getMockData({
        url_params_storage_duration_days: String(days)
    });

    const expectedCookieOptions = {
        domain: 'auto',
        path: '/',
        'max-age': days * 24 * 60 * 60,
        samesite: 'Lax',
        secure: true
    };

    mock('sendPixel', (url, onSuccess, onFailure) => {
        assertThat(url.indexOf('&attr_window=' + days)).isGreaterThan(-1);
        onSuccess();
    });

    runCode(mockData);

    assertApi('gtmOnSuccess').wasCalled();
    assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_full, expectedCookieOptions);
};

// Test all attribution window values
testAttributionWindow(30);
testAttributionWindow(60);
testAttributionWindow(90);
