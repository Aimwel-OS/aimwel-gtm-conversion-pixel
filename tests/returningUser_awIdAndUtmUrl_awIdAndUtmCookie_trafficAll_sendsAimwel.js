// Returning user: same aw_id+utm in both URL and cookie -> sends aimwel, cookie updated

setupSharedMocks();
mockCookies('existing.session', urlData.params_alt_full);  // Cookie has old params
mockGetUrl(urlData.params_full);  // URL has new params

const mockData = getMockData({
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    sessionId: 'existing.session',
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
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_full, cookieOptionsParams);
