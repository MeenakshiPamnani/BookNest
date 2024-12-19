// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// // /signup route
// router.post('/signup', (req, res) => {
//     const { first_name, last_name, email, phone_number, gender, password } = req.body;
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//             console.error('Error hashing password:', err.message);
//             res.status(500).send('Error processing request');
//             return;
//         }

//         const query = `
//         INSERT INTO users (first_name, last_name, email, phone_number, gender, password)
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;

//         db.query(query, [first_name, last_name, email, phone_number, gender, hashedPassword], (err, result) => {
//             if (err) {
//                 console.error('Error inserting data:', err.message);
//                 res.status(500).send('Error inserting data');
//                 return;
//             }
//             res.status(200).send('User registered successfully!');
//         });
//     });
// });