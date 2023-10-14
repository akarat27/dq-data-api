
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const mysql = require('mysql2/promise');

const DATABASE_URL=`mysql://${process.env.PLANETSCALE_DB_USERNAME}:${process.env.PLANETSCALE_DB_PASSWORD}@${process.env.PLANETSCALE_DB_HOST}/${process.env.PLANETSCALE_DB}?ssl={"rejectUnauthorized":true}`    
console.log(`DATABASE_URL: ${DATABASE_URL}`)

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
  let connection = await mysql.createConnection(DATABASE_URL)
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
  connection.end();

  // Send a response to the client once data is saved.
  //res.status(201).json({ message: 'Data saved successfully' });
});

app.post('/is-exists', async(req, res) => {
    const data = req.body;
    const sqlquery = 'SELECT * FROM dq_data WHERE (cardID = ? AND tel = ?) or (cardID = ? AND email = ?)';
    const values = [
        data.cardID,
        data.tel,
        data.cardID,
        data.email,
    ];
    let connection = await mysql.createConnection(DATABASE_URL)
    const [rows] = await connection.query(sqlquery, values);
    connection.end();
    if (rows.length > 0) {
        return res.status(201).json({ message: 'Data exists' });
    } else {
        return res.status(201).json({ message: 'Data not exists' });
    }
}   
);
    
app.post('/login', async(req, res) => {
    const data = req.body;
    const sqlquery = 'SELECT * FROM dq_data WHERE firstName = ? AND lastName = ?';
    const values = [
        data.firstName,
        data.lastName,
    ];
    let connection = await mysql.createConnection(DATABASE_URL)
    const [rows] = await connection.query(sqlquery, values);
    connection.end();
    if (rows.length > 0) {
        return res.status(201).json({ message: 'login success' });
    } else {
        return res.status(201).json({ message: 'login fail' });
    }
}   
);


app.get('/get-data', async(req, res) => {

    //let connection = await getConnection();
    let connection =  await mysql.createConnection(DATABASE_URL)
    
    const sqlquery = 'SELECT * FROM dq_data';

    const [rows] = await connection.query(sqlquery);

    res.status(201).json([rows]);

    connection.end();
}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
