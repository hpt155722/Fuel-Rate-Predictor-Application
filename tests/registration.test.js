// Import jsdom to mock the DOM
const { JSDOM } = require('jsdom');

// Import the prepareData function
const prepareData = require('../public/pages/profile page/registration/registration');

describe('prepareData function', () => {
  test('should validate form data and send POST request', async () => {
    // Set up the DOM environment
    const dom = new JSDOM(`
      <html>
        <body>
          <input type="text" id="name" value="John Doe" />
          <input type="text" id="address1" value="123 Main St" />
          <input type="text" id="address2" value="Apt 1" />
          <input type="text" id="city" value="Anytown" />
          <input type="text" id="state" value="CA" />
          <input type="text" id="zip_code" value="12345" />
        </body>
      </html>
    `);
    global.document = dom.window.document;

    // Mock fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );

    // Mock sessionStorage getItem method
    global.sessionStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testuser' })),
    };

    // Call prepareData function
    const result = await prepareData();

    // Assertions
    expect(sessionStorage.getItem).toHaveBeenCalledWith('registeredUser');
    expect(fetch).toHaveBeenCalledWith('/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        fullName: 'John Doe',
        address1: '123 Main St',
        address2: 'Apt 1',
        city: 'Anytown',
        state: 'CA',
        zipcode: '12345',
        history: [],
      }),
    });
  });
});
