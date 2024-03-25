document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
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

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const formData = {
            username: username,
            password: password
        };

        fetch('/login', {
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
                sessionStorage.setItem('loggedInUser', JSON.stringify(data.user));

                // redirect to the home page
                window.location.href = '/pages/home page/home.html';
            } else {
                errorMessage.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
