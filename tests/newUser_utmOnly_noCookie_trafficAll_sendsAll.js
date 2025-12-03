// New user with only utm params, traffic_scope=all -> sends as all traffic

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_utm);

const mockData = getMockData({
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    campaignParams: urlData.params_utm,
    trafficType: 'all'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_utm, cookieOptionsParams);
