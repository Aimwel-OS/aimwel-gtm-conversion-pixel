// Trailing slash: should be stripped from endpoint URL

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({
    aimwel_api_endpoint: 'https://test.t2.aimwel.com/'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    // Should NOT have double slash
    assertThat(url.indexOf('aimwel.com//')).isEqualTo(-1);
    // Should start with correct URL (no trailing slash before query)
    assertThat(url.indexOf('https://test.t2.aimwel.com?')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
