// Returning user: aw_id URL overwrites utm cookie -> sends aimwel (gains aw_id)

setupSharedMocks();
mockCookies('existing.session', urlData.params_utm);  // Cookie has only utm
mockGetUrl(urlData.params_awid);  // URL has aw_id

const mockData = getMockData({
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    sessionId: 'existing.session',
    campaignParams: urlData.params_awid,
    trafficType: 'aimwel'
});

mock('sendPixel', function(url, onSuccess, onFailure) {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_awid, cookieOptionsParams);
