// New user with only aw_id in URL (no utm) -> sends as aimwel traffic

setupSharedMocks();
mockCookies(null, null);
mockGetUrl(urlData.params_awid);

const mockData = getMockData({});

const expected = buildExpectedUrl({
    campaignParams: urlData.params_awid,
    trafficType: 'aimwel'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url).isEqualTo(expected);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('sendPixel').wasCalled();
assertApi('setCookie').wasCalledWith(PARAMS_COOKIE, urlData.params_awid, cookieOptionsParams);
