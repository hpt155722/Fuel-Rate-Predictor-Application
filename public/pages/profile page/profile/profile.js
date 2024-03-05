// Function to output the profile onto the page
async function populate() {
    // Temp json data to populate table
    var data = {
            "Full Name": "John Smith",
            "Address 1": "123 Main St",
            "Address 2": "",
            "City": "Springfield",
            "State": "IL",
            "Zip Code": "12345-6789"
        }
    populateTable(data);    
}

function populateTable(obj) {
    const table = document.querySelector("table");
    const array = ['Full Name','Address 1','Address 2','City','State','Zip Code'];
    for (let i = 0; i < 6; ++i) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = array[i] + ": ";
        tr.appendChild(td);
        const content = document.createElement("td");
        content.textContent = obj[array[i]];
        tr.appendChild(content);
        table.appendChild(tr);
    }
}

populate();