// New user with only aw_id in URL, traffic_scope=aimwel -> sends aimwel

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_awid);

const mockData = getMockData({
    traffic_scope: 'aimwel'
});

const expected = buildExpectedUrl({
    campaignParams: urlData.params_awid,
    trafficType: 'aimwel'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
