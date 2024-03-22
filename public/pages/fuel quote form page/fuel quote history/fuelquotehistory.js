function fetchFuelQuoteHistory() {
    // Fetch data from JSON database using fetch API
    return fetch('/fuelquotehistory')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Retrieve the logged-in user from session storage
            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

            // Filter the data based on the logged-in user's username
            const filteredData = data.filter(function(quote) {
                return quote.username === loggedInUser.username;
            });

            // Return the filtered data
            return filteredData;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Return an empty array in case of error
            return [];
        });
}

// Call the function and handle the returned Promise
fetchFuelQuoteHistory()
    .then(filteredData => {
        console.log(filteredData);
        // Do something with filteredData here
    })
    .catch(error => {
        console.error('Error:', error);
    });

module.exports = fetchFuelQuoteHistory;
