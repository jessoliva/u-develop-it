// import mysql2 package
const mysql = require('mysql2');

// to use Express.js
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

// Express middleware
// Middleware is a function or piece of code that is called (run) between when a server gets a request from a client and when it sends a response back to the client
// a method inbuilt in express to recognize the incoming Request Object as strings or arrays
// Express.urlencoded() expects request data to be sent encoded in the URL, usually in strings or arrays --> .../Name=Pikachu&Type=Banana&Number+In+Stable=12
app.use(express.urlencoded({ extended: false }));
// a method inbuilt in express to recognize the incoming Request Object as a JSON Object
// Express.json() expects request data to be sent in JSON format --> {"Name": "Pikachu", "Type": "Banana", "Number In Stable": 12}
app.use(express.json());
// need these middleware for POST and PUT requests because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request

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

// GET all candidates
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });
// returns an array of objects, with each object representing a row of the candidates table
// the db object is using the query() method
// method runs the SQL query and executes the callback with all the resulting rows that match the query
// Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response
// If there are no errors in the SQL query, the err value is null
// This method is the key component that allows SQL commands to be written in a Node.js application.

// GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(row);
// });
// selecting a single candidate by their primary key (id) is the only way to ensure that the candidate requested is the one that's returned

// Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
// });
// The DELETE statement has a question mark (?) that denotes a placeholder, making this a prepared statement. A prepared statement can execute the same SQL statements repeatedly using different values in place of the placeholder
// An additional param argument following the prepared statement provides values to use in place of the prepared statement's placeholders

// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// //
// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });


// order of routes matter so this route should be at the very end since it's a catchall
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});