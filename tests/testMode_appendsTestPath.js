// Test mode enabled -> /test path appended to endpoint

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({
    test: true,
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    testMode: true,
    campaignParams: '',
    trafficType: 'all'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    assertThat(url.indexOf('/test?')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
