// Import the populateTable function
const populateTable = require('../public/pages/profile page/profile/profile');

// Import jest-fetch-mock for mocking fetch requests
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('populateTable function', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mock before each test
  });

  test('should populate table with user data', async () => {
    // Mock fetch response with sample user data
    const sampleUserData = [
      { username: 'john_doe', fullName: 'John Doe', address1: '123 Main St', city: 'Anytown', state: 'CA', zipcode: '12345' },
      // Add more sample user data as needed
    ];
    fetchMock.mockResponseOnce(JSON.stringify(sampleUserData));

    // Mock sessionStorage getItem method
    const sessionStorageMock = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'john_doe' })),
    };
    global.sessionStorage = sessionStorageMock;

    // Mock document.createElement and document.querySelector
    global.document.createElement = jest.fn(tagName => ({
      tagName,
      textContent: '',
      appendChild: jest.fn()
    }));
    global.document.querySelector = jest.fn(() => ({ appendChild: jest.fn() }));

    // Call populateTable function
    await populateTable();

    // Assertions
    expect(fetchMock).toHaveBeenCalled();
    expect(sessionStorageMock.getItem).toHaveBeenCalledWith('loggedInUser');
  });
});
