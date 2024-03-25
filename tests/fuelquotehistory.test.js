//Import
const fetchFuelQuoteHistory = require('../public/pages/fuel quote form page/fuel quote history/fuelquotehistory.js');
const fuelQuotes = require('../fuelquotehistory.json');


// Mock sessionStorage
global.sessionStorage = {
    getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'john_doe' }))
};


// Mock fetch API
global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fuelQuotes),
    })
);

describe('fetchFuelQuoteHistory', () => {

    it('should fetch and filter fuel quote history for logged-in user', async () => {
        const { username } = JSON.parse(global.sessionStorage.getItem());
        console.log("Username:", username); // Log the username
        const filteredData = await fetchFuelQuoteHistory();
        console.log("Filtered Data:", filteredData); // Log the filtered data
        const expectedLength = fuelQuotes.filter(quote => quote.username === username).length;
        expect(filteredData).toHaveLength(expectedLength);
    });
    
    
    

    it('should return an empty array in case of error', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                json: () => Promise.resolve([]),
            })
        );

        
        const filteredData = await fetchFuelQuoteHistory();
        expect(filteredData).toEqual([]); // Expecting an empty array
    });
});
