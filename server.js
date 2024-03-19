const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5500;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Access fuel quote history JSON file
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

// POST endpoint for initial registration
app.post('/initial_register', (req, res) => {
    // Get username and password
    const { username, password } = req.body;

    // Read existing users from the JSON file
    let users = [];
    try {
        const usersData = fs.readFileSync('users.json', 'utf8');
        users = JSON.parse(usersData);
    } catch (error) {
        console.error('Error reading users file:', error);
    }


    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Create a new user object
    const newUser = { username, password };
    // Add the new user to the existing users array
    users.push(newUser);

    // Write the updated users array to user.JSON
    fs.writeFile('users.json', JSON.stringify(users, null, 4), (err) => {
        if (err) {
            console.error('Error writing to users file:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        console.log('User registered and saved to users file:', newUser);
        res.json({ success: true });
    });
});


//Serve static files from the 'public' directory (where our HTML, CSS, Javascript files are)
app.use(express.static('public'));

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
