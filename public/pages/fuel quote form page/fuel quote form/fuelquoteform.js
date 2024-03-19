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
    // Add submit event listener to the form
    $('#fuelQuoteForm').submit(function(event) {
        event.preventDefault(); 
        // Your form submission logic goes here
    });
});
