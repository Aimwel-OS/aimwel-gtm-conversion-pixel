// New user with aw_id + utm in URL, traffic_scope=aimwel -> sends aimwel (aw_id present)

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({
    traffic_scope: 'aimwel'
});

const expected = buildExpectedUrl({
    campaignParams: urlData.params_full,
    trafficType: 'aimwel'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
