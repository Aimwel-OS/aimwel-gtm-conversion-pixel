// Returning user: no URL params, aw_id in cookie -> sends as aimwel

setupSharedMocks();
mockCookies('existing.session', urlData.params_awid);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({});

const expected = buildExpectedUrl({
    sessionId: 'existing.session',
    campaignParams: urlData.params_awid,
    trafficType: 'aimwel'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
