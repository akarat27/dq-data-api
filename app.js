
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const mysql = require('mysql2');

// const getConnection = require("./mysql-client");

const app = express();
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(bodyParser.json());

console.log(process.env.DATABASE_URL)

// Create a MySQL connection using the provided database URL.
// const pool = mysql.createPool({ connectionLimit: 10, host: process.env.DATABASE_URL });
// console.log(pool)  

// Define your API route for saving data.
app.post('/save-data', async(req, res) => {
  // Handle saving the data to the PostgreSQL database here.
  // Parse the request body to get the data to save.
  const data = req.body;

  // Add code to save the data to the PostgreSQL database.
  // You'll need to establish a connection and use pg-promise or another PostgreSQL library to perform database operations.
  let connection =  mysql.createConnection(process.env.DATABASE_URL)
//   await getConnection();

  const sqlquery = 'INSERT INTO dq_data (firstName, lastName, cardID, tel, email, year, month, day, sex, agreement1, agreement2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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

  const [rows] = await connection.query(sqlquery, values, (queryError) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while saving data : '+ error });
        } else {
            return res.status(201).json({ message: 'Data saved successfully' });
        }
    });
  connection.release();

  // Send a response to the client once data is saved.
  //res.status(201).json({ message: 'Data saved successfully' });
});

app.get('/get-data', async(req, res) => {

    //let connection = await getConnection();
    let connection =  mysql.createConnection(process.env.DATABASE_URL)
    
    const sqlquery = 'SELECT * FROM dq_data';

    const [rows] = await connection.query(sqlquery);

    res.status(201).json([rows]);

    connection.release();
}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
