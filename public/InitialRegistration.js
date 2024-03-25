document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');

    let eye = document.getElementById('eye');
    let pass = document.getElementById('password');

    eye.onclick = function(){
        if(pass.type == 'password'){
            pass.type = 'text';
            eye.classList.remove('fa-regular', 'fa-eye-slash');
            eye.classList.add('fa-regular', 'fa-eye');
        }else{
            pass.type = 'password';
            eye.classList.remove('fa-regular', 'fa-eye');
            eye.classList.add('fa-regular', 'fa-eye-slash');
        }
    }

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
                errorMessage.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
