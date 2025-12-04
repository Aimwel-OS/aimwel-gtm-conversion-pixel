// New user with no URL params, traffic_scope=all -> sends as all traffic

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    campaignParams: '',
    trafficType: 'all'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
assertApi('setCookie').wasNotCalledWith(PARAMS_COOKIE, cookies[PARAMS_COOKIE], cookieOptionsParams);
