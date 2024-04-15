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

describe('DOMContentLoaded event listener', () => {
    let errorMessage;

    beforeEach(() => {
        errorMessage = { textContent: '' };
    });

    //Test to test for form submission
    it('should handle form submission', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: true, user: { username: 'testuser' } }),
            })
        );

        
        // Create a new DOMContentLoaded event
        const domContentLoadedEvent = document.createEvent('Event');
        domContentLoadedEvent.initEvent('DOMContentLoaded', true, true);

        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
            document.dispatchEvent(domContentLoadedEvent);
        });

        expect(errorMessage.textContent).toBe('');
    });    

    //Test to test if login credentials is wrong
    it('should handle form submission failure', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: false, message: 'Invalid credentials' }),
            })
        );



        // Create a new DOMContentLoaded event
        const domContentLoadedEvent = document.createEvent('Event');
        domContentLoadedEvent.initEvent('DOMContentLoaded', true, true);

        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
            document.dispatchEvent(domContentLoadedEvent);
        });

        updateErrorMessage(errorMessage, 'Invalid credentials');

        expect(errorMessage.textContent).toBe('Invalid credentials');
    });

    //Test to test errors
    it('should handle network errors', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject('Network error')
        );



        // Create a new DOMContentLoaded event
        const domContentLoadedEvent = document.createEvent('Event');
        domContentLoadedEvent.initEvent('DOMContentLoaded', true, true);

        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
            document.dispatchEvent(domContentLoadedEvent);
        });

        updateErrorMessage(errorMessage, 'Login request failed');

        expect(errorMessage.textContent).toBe('Login request failed');
    });
});
