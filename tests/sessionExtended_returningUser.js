// Returning user: session cookie is extended (setCookie called with existing session)

setupSharedMocks();
mockCookies('existing.session.id', null);
mockGetUrl(urlData.params_empty);

const mockData = getMockData({
    traffic_scope: 'all'
});

mock('sendPixel', (url, onSuccess, onFailure) => {
    assertThat(url.indexOf('&session_id=existing.session.id')).isGreaterThan(-1);
    onSuccess();
});

runCode(mockData);

assertApi('gtmOnSuccess').wasCalled();
assertApi('setCookie').wasCalledWith(SESSION_COOKIE, 'existing.session.id', cookieOptionsSession);
