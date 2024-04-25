// Function to fetch fuel quote history from the server
function fetchFuelQuoteHistory() {
    return fetch('/profiles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Retrieve the logged-in user from session storage
            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

            // Find the user's profile in the data
            const userProfile = data.find(profile => profile.username === loggedInUser.username);

            // Extract address details from the user's profile
            const userAddress = {
                address1: userProfile.address1 || '',
                address2: userProfile.address2 || '',
                city: userProfile.city || '',
                state: userProfile.state || '',
                zipcode: userProfile.zipcode || ''
            };
        
            // Return an object containing both address details and fuel quote history of the user
            return {
                address: userAddress,
                history: userProfile ? userProfile.history : []
            };
        
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Return an empty array in case of error
            return [];
        });
}

// Function to populate the table with fuel quote history and user's address details
function populateTable(data) {
    const tableBody = document.querySelector('#fuelQuoteTable tbody');
    tableBody.innerHTML = ''; // Clear previous data

    // Check if data is in the expected format
    if (data && data.history && Array.isArray(data.history)) {
        data.history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.gallonsRequested}</td>
                <td>${data.address.address1}, ${data.address.address2 ? data.address.address2 + ', ' : ''}${data.address.city}, ${data.address.state} ${data.address.zipcode}</td>
                <td>${entry.deliveryDate}</td>
                <td>${entry.suggestedPricePerGallon}</td>
                <td>$${entry.totalAmountDue}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.error('Data is not in the expected format:', data);
    }
}



// Call the function and populate the table
fetchFuelQuoteHistory()
    .then(historyData => {
        console.log(historyData);
        populateTable(historyData);
    })
    .catch(error => {
        console.error('Error:', error);
    });


    module.exports = {
        fetchFuelQuoteHistory,
        populateTable
    };
    