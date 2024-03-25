// Function to output the profile onto the page
function populateTable() {
    // Temp json data to populate table
    return fetch('/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('User data not found');
            }
            return response.json();
        })
        .then(data => {
            const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
            const userData = data.filter(function(user) {
                return user.username === currentUser.username;
            });
            return userData;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return [];
        });
}

populateTable()
    .then(userData => {
        console.log(userData[0]);
        const table = document.querySelector("table");
        const array = ['Full Name','Address 1','Address 2','City','State','Zip Code'];
        const variableArray = ['fullName', 'address1', 'address2', 'city', 'state', 'zipcode'];
        for (let i = 0; i < 6; ++i) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.textContent = array[i] + ": ";
            tr.appendChild(td);
            const content = document.createElement("td");
            content.textContent = userData[0][variableArray[i]];
            tr.appendChild(content);
            table.appendChild(tr);
        }
    })
    .catch(error => {
        console.error('Error: ', error);
    });

populateTable();