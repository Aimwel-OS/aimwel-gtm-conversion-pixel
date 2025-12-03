// Returning user: URL params override cookie params, sends aimwel

setupSharedMocks();
mockCookies('existing.session', urlData.params_alt_utm);  // Cookie has old utm params
mockGetUrl(urlData.params_full);  // URL has new aw_id + utm

const mockData = getMockData({});

const expected = buildExpectedUrl({
    sessionId: 'existing.session',
    campaignParams: urlData.params_full,  // URL params used, not cookie
    trafficType: 'aimwel'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_full, cookieOptionsParams);
