// New user with aw_id + utm params in URL -> sends as aimwel traffic

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_full);

const mockData = getMockData({});

const expected = buildExpectedUrl({
    campaignParams: urlData.params_full,
    trafficType: 'aimwel'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
assertApi('setCookie').wasCalledWith(SESSION_COOKIE, cookies[SESSION_COOKIE], cookieOptionsSession);
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_full, cookieOptionsParams);
