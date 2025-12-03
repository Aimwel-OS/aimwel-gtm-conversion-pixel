// Event type: registration

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({
    event_type: 'registration'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url.indexOf('&event_type=registration')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
