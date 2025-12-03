// Event type: finished_apply

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({
    event_type: 'finished_apply'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url.indexOf('&event_type=finished_apply')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
