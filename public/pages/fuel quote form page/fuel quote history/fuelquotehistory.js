$(document).ready(function() {
    // Fetch data from JSON database using AJAX
    $.ajax({
        url: '/fuelquotehistory',
        type: 'GET',
        success: function(data) {
            console.log('Received data:', data);
            // Iterate through the fetched data and append rows to the table
            data.forEach(function(quote) {
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
