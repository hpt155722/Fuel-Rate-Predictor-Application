const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5500;

//When a client makes a GET request to this endpoint, the server will read the contents of the 'fuelquotehistory.json' file
//Uses the fs.readFile() function
//If an error occurs during reading, it will send a 500 status code and an error message
//Otherwise, it parses the JSON data read from the file and sends it back to the client as a JSON response

app.get('/fuelquotehistory', (req, res) => {
    console.log('Received request to /fuelquotehistory endpoint');
    fs.readFile('fuelquotehistory.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send("Error reading JSON file");
            return;
        }
        const fuelQuotes = JSON.parse(data);
        res.json(fuelQuotes);
    });
});


//Serve static files from the 'public' directory (where our HTML, CSS, Javascript files are)
app.use(express.static('public'));

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
