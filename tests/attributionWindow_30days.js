// Attribution window 30 days -> cookie max-age is 30 days

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({
    url_params_storage_duration_days: '30'
});

const cookieOptionsParams30 = {
    domain: 'auto',
    path: '/',
    'max-age': 30 * 24 * 60 * 60,
    samesite: 'Lax',
    secure: true
};

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url.indexOf('&attr_window=30')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_full, cookieOptionsParams30);
