
const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const db = pgp('postgres://username:password@localhost:5432/database_name');
const app = express();

app.use(bodyParser.json());

// Define your API route for saving data.
app.post('/save-data', (req, res) => {
  // Handle saving the data to the PostgreSQL database here.
  // Parse the request body to get the data to save.
  const data = req.body;

  // Add code to save the data to the PostgreSQL database.
  // You'll need to establish a connection and use pg-promise or another PostgreSQL library to perform database operations.

    // Insert the data into the database.
    db.none('INSERT INTO your_table (firstName, lastName, cardID, tel, email, year, month, day, sex, agreement1, agreement2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [
        data.firstName,
        data.lastName,
        data.cardID,
        data.tel,
        data.email,
        data.year,
        data.month,
        data.day,
        data.sex,
        data.agreement1,
        data.agreement2,
    ])
        .then(() => {
        res.status(201).json({ message: 'Data saved successfully' });
        })
        .catch((error) => {
        res.status(500).json({ error: 'An error occurred while saving data' });
        });

  // Send a response to the client once data is saved.
  res.status(201).json({ message: 'Data saved successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
