// modularize the database connection logic
// removed from server.js

// import mysql2 package
const mysql = require('mysql2');

// connects the application to the MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'pek3jed1',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// bc this file is its own module now, you'll need to export it
module.exports = db;