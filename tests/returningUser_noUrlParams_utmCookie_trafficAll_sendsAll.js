// Returning user: no URL params, utm only in cookie, traffic_scope=all -> sends all

setupSharedMocks();
mockCookies('existing.session', urlData.params_utm);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    sessionId: 'existing.session',
    campaignParams: urlData.params_utm,
    trafficType: 'all'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
