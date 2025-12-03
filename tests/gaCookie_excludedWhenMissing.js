// GA cookie: excluded from request when not present

setupSharedMocks();
mockCookies(null, null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({});

const expected = buildExpectedUrl({
    campaignParams: urlData.params_full,
    gaValue: '',
    trafficType: 'aimwel'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    assertThat(url.indexOf('&_ga=')).isEqualTo(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
