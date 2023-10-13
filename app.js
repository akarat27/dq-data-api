
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const mysql = require('mysql2');
//const connection = mysql.createConnection(process.env.DATABASE_URL)
//const getConnection = require("./mysql-client");

const app = express();

app.use(bodyParser.json());

console.log(process.env.DATABASE_URL)

// Create a MySQL connection using the provided database URL.
// const pool = mysql.createPool({ connectionLimit: 10, host: process.env.DATABASE_URL });
// console.log(pool)  

// Define your API route for saving data.
app.post('/save-data', (req, res) => {
  // Handle saving the data to the PostgreSQL database here.
  // Parse the request body to get the data to save.
  const data = req.body;

  // Add code to save the data to the PostgreSQL database.
  // You'll need to establish a connection and use pg-promise or another PostgreSQL library to perform database operations.

    // Insert the data into the database.
    // Use a connection from the pool to insert the data into the database.
    pool.getConnection((err, connection) => {
        if (err) {
        console.log(err)
            //print error to console for debugging purposes 
            //print stack trace to console for debugging purposes 


        res.status(500).json({ error: 'Database connection error '+err+ ' ' +err.stack });
        return;
        }

        const query = 'INSERT INTO dq_data (firstName, lastName, cardID, tel, email, year, month, day, sex, agreement1, agreement2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
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
        ];

        connection.query(query, values, (queryError) => {
        connection.release(); // Release the connection back to the pool.

        if (queryError) {
            res.status(500).json({ error: 'An error occurred while saving data' });
        } else {
            res.status(201).json({ message: 'Data saved successfully' });
        }
        });
    });

  // Send a response to the client once data is saved.
  //res.status(201).json({ message: 'Data saved successfully' });
});

app.get('/get-data', async(req, res) => {
    res.status(201).json({ message: 'Data consume successfully' });

    // let connection = await getConnection();
      
    // const query = 'SELECT * FROM dq_data';

    // connection.query(query, (queryError, result) => {
    // connection.release(); // Release the connection back to the pool.

    // if (queryError) {
    //     res.status(500).json({ error: 'An error occurred while saving data' });
    // } else {
    //     res.status(201).json(result);
    // }
    // });    
}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
