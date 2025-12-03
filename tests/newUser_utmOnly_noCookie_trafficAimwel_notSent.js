// New user with only utm params, traffic_scope=aimwel -> does NOT send (no aw_id)

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_utm);

const mockData = getMockData({
    traffic_scope: 'aimwel'
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasNotCalled();
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_utm, cookieOptionsParams);
