const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors'); // Import CORS

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use CORS

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Your MySQL root password
    database: 'book_nest'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to the database!');
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../')));

// Serve the signup.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../signup.html')); // Adjust path to reach "signup.html"
});

// signup route
app.post('/signup', (req, res) => {
    const { first_name, last_name, email, phone_number, gender, password } = req.body;

    console.log('Received Data:', req.body); // Log received data

    if (!first_name || !last_name || !email || !phone_number || !gender || !password) {
        console.log('Validation Failed:', req.body); // Log what was received
        res.status(400).send({ error: 'All fields are required!' });
        return;
    }

    // Check if the user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error('Error checking user:', err.message);
            res.status(500).send({ error: 'Error checking user' });
            return;
        }

        if (results.length > 0) {
            res.status(400).send({ error: 'Email already exists!' });
            return;
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err.message);
                res.status(500).send({ error: 'Error processing request' });
                return;
            }

            // Insert the new user
            const query = `
                INSERT INTO users (first_name, last_name, email, phone_number, gender, password)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(query, [first_name, last_name, email, phone_number, gender, hashedPassword], (err, result) => {
                if (err) {
                    // Check for duplicate entry error
                    if (err.code === 'ER_DUP_ENTRY') {
                        res.status(400).send({ error: 'Email already exists!' });
                    } else {
                        console.error('Error inserting data:', err.message);
                        res.status(500).send({ error: 'Error inserting data' });
                    }
                    return;
                }
                res.status(200).send({ message: 'User registered successfully!' });
            });
        });
    });
});

//login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        res.status(400).send({error: 'Email and password are required.'});
        return;
    }
    const query = `SELECT * FROM users WHERE email=?`;
    db.query(query, [email, password], (err, results) => {
        if(err){
            console.log('Error checking user: ', err.message);
            res.status(500).send({ error: 'Error checking user '});
            return;
        }
        if(results.length == 0){
            res.status(400).send({ error: 'User not found' });
            return;
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if(err){
                console.error('Error comparing password: ', err.message);
                res.status(500).send({ error: 'Error processing request!' });
                return;
            }
            if(!match){
                res.status(400).send({ error: 'Incorrect password!' });
                return;
            }
            res.status(200).send({ message: 'Login successful!' });

        });
    });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
