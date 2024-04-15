const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const app = express();
const PORT = 5500;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(session({
  secret: 'key that will sign cookie',
  resave: false,
  saveUninitialized: false
}));

// Authentication middleware
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

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

// Access users JSON file
app.get('/profiles', (req, res) => {
    console.log('Recieved request');
    fs.readFile('profiles.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.JSON: ', err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        const users = JSON.parse(data);
        res.json(users);
    });
});

// route to handle login requests
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
          res.status(500).json({ success: false, message: 'Error reading user data' });
          return;
      }
      let userData = JSON.parse(data);
      const user = userData.find(user => user.username === username);
      if (!user) {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
          return;
      }
      // Compare hashed password
      bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
              res.status(401).json({ success: false, message: 'Invalid username or password' });
              return;
          }
          // Passwords match, login successful
          const { username, fullName, address1, address2, city, state, zipcode } = user;
          res.json({ 
              success: true, 
              message: 'Login successful', 
              user: { 
                  username, 
                  fullName, 
                  address1, 
                  address2, 
                  city, 
                  state, 
                  zipcode 
              }, 
              redirectTo: '/public/pages/home.html' 
          });
      });
  });
});

// route to handle initial register requests
app.post('/initial_register', (req, res) => {
    const { username, password } = req.body;
    //hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }
      // read existing user data form users.json
    fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
          res.status(500).json({ success: false, message: 'Error reading user data' });
          return;
      }
      let userData = JSON.parse(data);
      // check if the username already exists
      if(userData.find(user => user.username === username)){
          res.status(400).json({ success: false, message: 'Username already exists'});
          return;
      }
      // add the new user to userData
      userData.push({ username, password: hashedPassword});
      // write the updated user data back to users.json
      fs.writeFile('users.json', JSON.stringify(userData, null, 2), err => {
          if (err) {
              res.status(500).json({ success: false, message: 'Error writing user data'});
              return;
          }
          // successful, redirect to the profile registration page
          res.json({ success: true, message: 'User registered successfully', redirectTo: '/pubilc/pages/profile page/registration/registration.html' });
      });
    });
  });
});

// Second registration handler
app.post('/registration', (req, res) => {
    const { username, fullName, address1, address2, city, state, zipcode, history } = req.body;
    fs.readFile('profiles.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading profiles.json:', err);
            res.status(500).send('Error reading JSON file');
            return;
        }

        try {
            let currentData = JSON.parse(data);
            // Check if the username already exists
            const existingUser = currentData.find(user => user.username === username);
            if (existingUser) {
                console.error('Username already exists');
                return res.status(400).json({ success: false, message: 'Username already exists' });
            }

            // Add the new user to userData
            currentData.push({
                username, fullName, address1, address2, city, state, zipcode, history
            });

            // Write the updated user data back to profiles.json
            fs.writeFile('profiles.json', JSON.stringify(currentData, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to profiles.json:', writeErr);
                    return res.status(500).send('Error writing to JSON file');
                }
                console.log('User data updated successfully');
                return res.json({ success: true, message: 'User data updated successfully' });
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});


app.post('/updateHistory', (req, res) => {
    const { username, fullName, address1, address2, city, state, zipcode, history } = req.body;
    fs.readFile('profiles.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.JSON: ', err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        try {
            let currentData = JSON.parse(data);
            const userToRegister = currentData.findIndex(user => user.username === username);
            if (userToRegister != -1) {
                currentData.splice(userToRegister, 1);
                currentData.push({
                    username, fullName, address1, address2, city, state, zipcode, history
                })
                fs.writeFile('profiles.json', JSON.stringify(currentData, null, 2), (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing to profiles.json: ', writeErr);
                        res.status(500).send('Error writing to JSON file');
                        return;
                    }
                    console.log('User data updated successfully');
                    res.json({ success: true, message: 'User data updated successfully' });
                });
            } else {
                console.error("Username not found");
                res.status(404).json({ success: false, message: 'Username not found'});
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).send('Error parsing JSON');
        }
    });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Protected route that requires login
app.get('/protected', requireLogin, (req, res) => {
  res.json({ message: 'You have access to protected data' });
});

//Serve static files from the 'public' directory (where our HTML, CSS, Javascript files are)
app.use(express.static('public'));

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



