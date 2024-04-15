function fetchLogin(username, password, storage) {
    const formData = {
        username: username,
        password: password
    };

    return fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            storage.loggedInUser = data.user;
            return data; 
        } else {
            throw new Error('Invalid credentials'); 
        }
    })
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Login request failed');
    });
}



document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        fetchLogin(username, password, sessionStorage)
        .then(data => {
            if (data.success) {
                // store user information in session storage
                sessionStorage.setItem('loggedInUser', JSON.stringify(data.user));

                // redirect to the home page
                window.location.href = '/pages/home page/home.html';
            } else {
                errorMessage.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'Login request failed';
        });
    });
});


module.exports = {
    fetchLogin
};
