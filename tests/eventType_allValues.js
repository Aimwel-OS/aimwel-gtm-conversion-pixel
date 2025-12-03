// Event type: test all values (view, apply, finished_apply, registration)

const testEventType = (eventType) => {
    setupSharedMocks();
    mockCookies(null, null);
    mockGetUrl(urlData.params_full);

    const mockData = getMockData({
        event_type: eventType
    });

    mock('sendPixel', (url, onSuccess, onFailure) => {
        assertThat(url.indexOf('&event_type=' + eventType)).isGreaterThan(-1);
        onSuccess();
    });

    runCode(mockData);

    assertApi('gtmOnSuccess').wasCalled();
    assertApi('sendPixel').wasCalled();
};

// Test all event types
testEventType('view');
testEventType('apply');
testEventType('finished_apply');
testEventType('registration');
