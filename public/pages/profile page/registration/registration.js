function prepareData() {
    // Validate the data on the backend
    const fullNameInput = document.getElementById("name").value;
    if (fullNameInput.length > 50 || fullNameInput.length == 0) {
        alert("Invalid Name field. Please try again.");
        return false;
    }
    const address1Input = document.getElementById("address1").value;
    if (address1Input.length > 100 || address1Input.length == 0) {
        alert("Invalid Address 1 field. Please try again.");
        return false;
    }
    const address2Input = document.getElementById("address2").value;
    if (address2Input.length > 100) {
        alert("Invalid Address 2 field. Please try again.");
        return false;
    }
    const cityInput = document.getElementById("city").value;
    if (cityInput.length > 100 || cityInput.length == 0) {
        alert("Invalid City field. Please try again.");
        return false;
    }
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
        password: currentUser.password,
        fullName: fullNameInput,
        address1: address1Input,
        address2: address2Input,
        city: cityInput,
        state: stateInput,
        zipcode: zipCodeInput
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