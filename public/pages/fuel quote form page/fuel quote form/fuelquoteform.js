$(document).ready(function() {
    // Function to fetch fuel quote history using AJAX
    function fetchFuelQuoteForm() {
        $.ajax({
            url: '/fuelquoteform', 
            type: 'GET',
            success: function(data) {
                data.forEach(function(quote) {
                    var row = '<tr><td>' + quote.date + '</td><td>' + quote.gallonsRequested + '</td><td>' + quote.suggestedPrice + '</td><td>' + quote.totalAmountDue + '</td></tr>';
                    $('#fuelQuoteTableBody').append(row);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching fuel quote history:', error);
            }
        });
    }
    fetchFuelQuoteForm();
    
    // Listen for form submission
    $('#fuelQuoteForm').submit(function(event) {
        event.preventDefault();

        const userInfo = JSON.parse(sessionStorage.getItem('loggedInUser'));

        // Gather form data
        const formData = {
            username: userInfo.username,
            gallonsRequested: parseFloat($('#gallonsRequested').val()),
            deliveryAddress: $('#deliveryAddress').val(),
            deliveryDate: $('#deliveryDate').val(),
            suggestedPricePerGallon: parseFloat($('#suggestedPrice').val()),
            totalAmountDue: parseFloat($('#totalAmountDue').val())
        };

        // AJAX POST request to send form data to the server
        $.ajax({
            url: '/updatefuelquotehistory', // Make sure this endpoint is set up on your server
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                console.log('Fuel quote form submitted successfully', response);
                // Optionally, refresh the page or display a success message
            },
            error: function(xhr, status, error) {
                console.error('Error submitting fuel quote form:', error);
            }
        });
    });
});
