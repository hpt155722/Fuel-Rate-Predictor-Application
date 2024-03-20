document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.querySelector('form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const formData = {
            username: username,
            password: password
        };

        fetch('/initial_register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // store user information in session storage
                sessionStorage.setItem('registeredUser', JSON.stringify(formData));
                window.location.href = '/pages/profile page/registration/registration.html';
            } else {
                console.error('Registration failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
