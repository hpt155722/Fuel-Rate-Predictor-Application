function prepareData() {
    // Validate the data on the backend
    const fullNameInput = document.getElementById("name").value;
    const address1Input = document.getElementById("address1").value;
    const address2Input = document.getElementById("address2").value;
    const cityInput = document.getElementById("city").value;
    const stateInput = document.getElementById("state").value;
    const zipCodeInput = document.getElementById("zip_code").value;
    if (!/^\d*$/.test(parseInt(zipCodeInput)) || zipCodeInput.length < 5 || zipCodeInput.length > 9) {
        alert("Please enter a valid Zip Code");
        return false;
    }
    
    // Data to be sent to the server if all validation passes
    const currentUser = JSON.parse(sessionStorage.getItem('registeredUser'));
    const username = currentUser.username;
    const userData = {
        username: username,
        fullName: fullNameInput,
        address1: address1Input,
        address2: address2Input,
        city: cityInput,
        state: stateInput,
        zipcode: zipCodeInput,
        history: []
    };
    fetch('/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/index.html';
        }
        else {
            console.error('Registration failed: ', data.message);
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

module.exports = prepareData;
