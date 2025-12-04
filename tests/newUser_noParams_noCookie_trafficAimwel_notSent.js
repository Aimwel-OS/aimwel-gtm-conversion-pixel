// New user with no URL params, traffic_scope=aimwel -> does NOT send

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({
    traffic_scope: 'aimwel'
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasNotCalled();
