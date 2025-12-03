// GA cookie: included in request when present

setupSharedMocks();
mockCookies(null, null, 'GA1.2.123456789.1234567890');
mockGetUrl(urlData.params_full);

const mockData = getMockData({});

const expected = buildExpectedUrl({
    campaignParams: urlData.params_full,
    gaValue: 'GA1.2.123456789.1234567890',
    trafficType: 'aimwel'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    assertThat(url.indexOf('&_ga=GA1.2.123456789.1234567890')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
