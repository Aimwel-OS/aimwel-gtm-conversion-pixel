// Empty referrer: URL should still build correctly

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

// Override referrer to be empty
mock('getReferrerUrl', (component) => {
    return '';
});

const mockData = getMockData({});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url.indexOf('&ref_host=')).isGreaterThan(-1);
    assertThat(url.indexOf('&ref_path=')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
