// Returning user: utm URL overwrites aw_id cookie -> sends all (loses aw_id!)
// This is an important edge case: new UTM params replace old aw_id attribution

setupSharedMocks();
mockCookies('existing.session', urlData.params_awid);  // Cookie has aw_id
mockGetUrl(urlData.params_utm);  // URL has only utm (no aw_id)

const mockData = getMockData({
    traffic_scope: 'all'
});

const expected = buildExpectedUrl({
    sessionId: 'existing.session',
    campaignParams: urlData.params_utm,  // UTM from URL, aw_id lost
    trafficType: 'all'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_utm, cookieOptionsParams);
