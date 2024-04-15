const { populateTable, getQuote, submitForm } = require('../public/pages/fuel quote form page/fuel quote form/fuelquoteform');
const { JSDOM } = require('jsdom');

describe('Testing populateTable', () => {
    let dom;

    beforeEach(() => {
        // Create mock elements to simulate the form
        

        // Mock the fetch function to return a resolved promise with mocked data
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    [
                        {
                            username: 'testuser',
                            address1: '123 Test St',
                            address2: 'Apt 101',
                            state: 'TX',
                            history: []
                        }
                    ]
                ])
            })
        );

        // Mock sessionStorage getItem to return a JSON string
        global.sessionStorage = {
            getItem: jest.fn(() => JSON.stringify({ loggedInUser: { username: 'testuser' } }))
        };
    });


    test('Should populate form fields and attach event handlers', async () => {
        // Call populateTable
        dom = new JSDOM(`
            <form>
                <input type="number" id="gallonsRequested" name="gallonsRequested" required><br><br>
                <input type="text" id="address1" readonly><br><br>
                <input type="text" id="address2" readonly><br><br>
                <input type="date" id="deliveryDate" required><br><br>
                <input type="number" id="suggestedPrice" readonly placeholder="Price per gallon"><br><br>
                <input type="number" id="totalAmountDue" readonly placeholder="Total amount"><br><br>
                <input type="button" id="getQuote" value="Get Quote">
                <input type="submit" id="submit" value="Submit">
            </form>
        `);
        global.document = dom.window.document;
        global.window = dom.window;
        await populateTable();

        // Simulate button clicks and check if event handlers are attached
        const getQuoteButton = document.getElementById('getQuote');
        const submitButton = document.getElementById('submit');

        expect(getQuoteButton).toBeTruthy();
        expect(submitButton).toBeTruthy();

        // Check if event handlers are attached
        const getQuoteClickHandler = getQuoteButton.onclick;
        const submitClickHandler = submitButton.onclick;

        expect(typeof getQuoteClickHandler).toBe('object');
        expect(typeof submitClickHandler).toBe('object');

        document.getElementById('gallonsRequested').value = '500';
        document.getElementById('deliveryDate').value = '2024-04-15';

        // Simulate button clicks and check if they trigger the expected event handlers
        const userData = {
            username: 'testuser',
            address1: '123 Test St',
            address2: 'Apt 101',
            state: 'TX',
            history: []
        }
        getQuote(userData);
        const suggestedPriceInput = document.getElementById('suggestedPrice');
        const totalAmountDueInput = document.getElementById('totalAmountDue');

        expect(suggestedPriceInput.value).toBe("1.725");
        expect(totalAmountDueInput.value).toBe("862.5");

        submitForm(userData);
        // Add assertions for submitForm event handler, if any
    });

    test('Should handle error when fetching data', async () => {
        // Mock fetch to return an error response
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        // Call populateTable, which should catch the error and return an empty array
        const result = await populateTable();
        expect(result).toEqual([]);
    });
});
