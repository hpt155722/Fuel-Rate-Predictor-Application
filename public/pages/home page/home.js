document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logoutLink');
    const profileButton = document.getElementById('profileButton');
    const fuelQuoteButton = document.getElementById('fuelQuoteButton');
    const fuelQuotePageButton = document.getElementById('fuelQuotePageButton');
    
    // check if the user is authenticated
    const isAuthenticated = sessionStorage.getItem('loggedInUser');
    if(!isAuthenticated) {
        window.location.href = '../../index.html';
    }
    logoutLink.addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = '../../index.html';
    });

    profileButton.addEventListener('click', function() {
        window.location.href = '../profile page/profile/profile.html';
    });

    fuelQuoteButton.addEventListener('click', function() {
        window.location.href = '../fuel quote form page/fuel quote history/fuelquotehistory.html';
    });

    fuelQuotePageButton.addEventListener('click', function() {
        window.location.href = '../fuel quote form page/fuel quote form/fuelquoteform.html';
    });
});
