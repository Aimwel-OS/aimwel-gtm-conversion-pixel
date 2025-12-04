// Returning user: no URL params, aw_id+utm in cookie -> sends aimwel

setupSharedMocks();
mockCookies('existing.session', urlData.params_full);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    sessionId: 'existing.session',
    campaignParams: urlData.params_full,
    trafficType: 'aimwel'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
