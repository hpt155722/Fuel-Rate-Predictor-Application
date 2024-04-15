function populateTable() {
    return fetch('/profiles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to access user data');
            }
            return response.json();
        })
        .then(data => {
            const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
            const userData = data.filter(function(user) {
                return user.username === currentUser.username;
            });
            return userData[0];
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            return [];
        })
}

function getQuote(userData) {
    // This is the "Pricing Module" that takes in user input and fills the corresponding fields as required
    let statePrice = .02;
    let historyPrice = 0.0;
    let gallonDiscount = .03;
    let gallons = document.getElementById("gallonsRequested").value;
    if (userData.history.length > 0) {
        historyPrice = .01;
    }
    if (userData.state != "TX") {
        statePrice = .04;
    }
    if (gallons > 1000) {
        gallonDiscount = 0.02;
    }
    const priceModule = (1.50 * (statePrice - historyPrice + 0.1 + gallonDiscount));
    document.getElementById("suggestedPrice").value = priceModule + 1.50;
    document.getElementById("totalAmountDue").value = (priceModule + 1.50) * gallons;
}

function submitForm(userData) {
    // Append the new quote to the end of "history"
    userData.history.push(
        {
            gallonsRequested: document.getElementById("gallonsRequested").value,
            deliveryDate: document.getElementById("deliveryDate").value,
            totalAmountDue: document.getElementById("totalAmountDue").value
        }
    )
    // Submits the form to the server
    fetch('/updateHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '../../home page/home.html';
        }
        else {
            console.error('History update failed: ', data.message);
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

populateTable()
    .then(userData => {
        // Select the form
        const address1 = document.getElementById("address1");
        address1.value = userData.address1;
        const address2 = document.getElementById("address2");
        address2.value = userData.address2;
        const getQuoteButton = document.getElementById("getQuote");
        getQuoteButton.onclick = function () {
            getQuote(userData);
        }
        const submitButton = document.getElementById("submit");
        submitButton.onclick = function () {
            submitForm(userData);
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    });

// Function to check if Gallons Requested and Delivery Date fields are empty
function checkFormEmpty() {
    return $('#gallonsRequested').val() === '' || $('#deliveryDate').val() === '';
}


if (checkFormEmpty()) {
    $('#getQuote, #submit').hide();
}

// Show/hide buttons based on form input
$('form input[type="number"], form input[type="date"]').on('input', function() {
    if (checkFormEmpty()) {
        $('#getQuote, #submit').hide();
    } else {
        $('#getQuote, #submit').show();
    }
});

module.exports = { populateTable, getQuote, submitForm };
