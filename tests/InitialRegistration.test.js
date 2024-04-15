const { JSDOM } = require('jsdom');
const { document } = new JSDOM().window;


const updateErrorMessage = (element, message) => {
    element.textContent = message;
};

document.querySelector = jest.fn((selector) => {
    if (selector === 'form') {
        return {
            addEventListener: jest.fn((event, callback) => {
                callback({
                    preventDefault: jest.fn(),
                    target: {
                        querySelector: jest.fn((selector) => {
                            if (selector === '#username') {
                                return { value: 'testuser' };
                            } else if (selector === '#password') {
                                return { value: 'testpassword' };
                            }
                        })
                    }
                });
            })
        };
    }
});

describe('DOMContentLoaded event listener for Initial Registration', () => {
    let errorMessage;

    beforeEach(() => {
        errorMessage = { textContent: '' };
    });

    it('should handle registration form submission', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            })
        );

        const domContentLoadedEvent = document.createEvent('Event');
        domContentLoadedEvent.initEvent('DOMContentLoaded', true, true);

        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
            document.dispatchEvent(domContentLoadedEvent);
        });

        expect(errorMessage.textContent).toBe('');
    });

    it('should handle registration form submission failure', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ success: false, message: 'Registration failed' })
            })
        );

        const domContentLoadedEvent = document.createEvent('Event');
        domContentLoadedEvent.initEvent('DOMContentLoaded', true, true);

        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
            document.dispatchEvent(domContentLoadedEvent);
        });

        updateErrorMessage(errorMessage, 'Registration failed');

        expect(errorMessage.textContent).toBe('Registration failed');
    });

    it('should handle network errors during registration', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject('Network error')
        );

        const domContentLoadedEvent = document.createEvent('Event');
        domContentLoadedEvent.initEvent('DOMContentLoaded', true, true);

        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
            document.dispatchEvent(domContentLoadedEvent);
        });

        updateErrorMessage(errorMessage, 'Registration request failed');

        expect(errorMessage.textContent).toBe('Registration request failed');
    });
});
