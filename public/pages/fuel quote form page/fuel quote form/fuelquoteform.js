document.addEventListener('DOMContentLoaded', function() {
    // Fill delivery address with user info
    function getUserInfoFromSession() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        return loggedInUser;
    }

    function populateFormWithUserInfo(user) {
        document.getElementById('deliveryAddress').value = user.address1; 
    }

    const userInfo = getUserInfoFromSession();
    if (userInfo) {
        populateFormWithUserInfo(userInfo);
    }

    // Form submission
    document.getElementById('fuelQuoteForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Gather form data
        const formData = {
            username: userInfo.username,
            gallonsRequested: parseFloat(document.getElementById('gallonsRequested').value),
            deliveryAddress: document.getElementById('deliveryAddress').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            suggestedPricePerGallon: parseFloat(document.getElementById('suggestedPrice').value),
            totalAmountDue: parseFloat(document.getElementById('totalAmountDue').value)
        };

        // Append form data to fuelquotehistory.json here 
    });

});
