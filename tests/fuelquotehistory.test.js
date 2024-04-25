// Import the fetch mock library
const fetchMock = require('fetch-mock');

// Import the functions to test
const { fetchFuelQuoteHistory, populateTable } = require('../public/pages/fuel quote form page/fuel quote history/fuelquotehistory.js');
// Mock sessionStorage
global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

describe('fetchFuelQuoteHistory function', () => {
    afterEach(() => {
        fetchMock.reset();
    });

    it('should fetch fuel quote history from the server', async () => {
        const mockProfile = {
            username: 'testUser',
            address1: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipcode: '12345',
            history: [
                {
                    gallonsRequested: 100,
                    deliveryDate: '2024-04-16',
                    suggestedPricePerGallon: 2.5,
                    totalAmountDue: 250
                }
            ]
        };
        global.sessionStorage.getItem.mockReturnValueOnce(JSON.stringify({ username: 'testUser' }));

        fetchMock.getOnce('/profiles', { status: 200, body: [mockProfile] });

        const result = await fetchFuelQuoteHistory();
        expect(result).toEqual({
            address: {
                address1: '123 Test St',
                address2: '',
                city: 'Test City',
                state: 'TS',
                zipcode: '12345'
            },
            history: [
                {
                    gallonsRequested: 100,
                    deliveryDate: '2024-04-16',
                    suggestedPricePerGallon: 2.5,
                    totalAmountDue: 250
                }
            ]
        });
    });

    it('should handle network errors', async () => {
        fetchMock.getOnce('/profiles', { status: 404 });

        const result = await fetchFuelQuoteHistory();
        expect(result).toEqual([]);
    });
});

describe('populateTable function', () => {
    it('should populate the table with fuel quote history and user\'s address details', () => {
        const data = {
            address: {
                address1: '123 Test St',
                address2: '',
                city: 'Test City',
                state: 'TS',
                zipcode: '12345'
            },
            history: [
                {
                    gallonsRequested: 100,
                    deliveryDate: '2024-04-16',
                    suggestedPricePerGallon: 2.5,
                    totalAmountDue: 250
                }
            ]
        };

        document.body.innerHTML = `
            <table id="fuelQuoteTable">
                <tbody></tbody>
            </table>
        `;

        populateTable(data);

        const tableRows = document.querySelectorAll('#fuelQuoteTable tbody tr');
        expect(tableRows.length).toBe(1);

        const [row] = tableRows;
        expect(row.innerHTML).toContain('123 Test St');
        expect(row.innerHTML).toContain('Test City');
        expect(row.innerHTML).toContain('TS');
        expect(row.innerHTML).toContain('12345');
        expect(row.innerHTML).toContain('100');
        expect(row.innerHTML).toContain('2024-04-16');
        expect(row.innerHTML).toContain('2.5');
        expect(row.innerHTML).toContain('$250');
    });

    it('should handle unexpected data format', () => {
        const data = { some: 'unexpected format' };

        console.error = jest.fn();

        populateTable(data);

        expect(console.error).toHaveBeenCalledWith('Data is not in the expected format:', data);
    });
});