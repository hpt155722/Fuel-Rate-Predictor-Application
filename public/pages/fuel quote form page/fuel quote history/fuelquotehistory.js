$(document).ready(function() {
    // Fetch data from JSON database using AJAX
    $.ajax({
        url: '/fuelquotehistory',
        type: 'GET',
        success: function(data) {
            // Retrieve the logged-in user from session storage
            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
            
            // Filter the data based on the logged-in user's username
            const filteredData = data.filter(function(quote) {
                return quote.username === loggedInUser.username;
            });
            
            // Iterate through the filtered data and append rows to the table
            filteredData.forEach(function(quote) {
                console.log('Processing quote:', quote);
                $('#fuelQuoteTable tbody').append(
                    `<tr>
                        <td>${quote.gallonsRequested}</td>
                        <td>${quote.deliveryAddress}</td>
                        <td>${quote.deliveryDate}</td>
                        <td>${quote.suggestedPricePerGallon}</td>
                        <td>${quote.totalAmountDue}</td>
                    </tr>`
                );
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });
});
