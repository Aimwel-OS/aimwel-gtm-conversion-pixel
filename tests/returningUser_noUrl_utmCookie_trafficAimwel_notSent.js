// Returning user: no URL params, utm only in cookie, traffic_scope=aimwel -> NOT sent

setupSharedMocks();
mockCookies('existing.session', urlData.params_utm);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({
    traffic_scope: 'aimwel'
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasNotCalled();
