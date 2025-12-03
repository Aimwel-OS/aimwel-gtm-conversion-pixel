// When sendPixel fails, gtmOnFailure should be called

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({});

mock('sendPixel', function(url, onSuccess, onFailure) {
    onFailure();  // Simulate request failure
});

runCode(mockData);

assertApi('gtmOnFailure').wasCalled();
assertApi('gtmOnSuccess').wasNotCalled();
