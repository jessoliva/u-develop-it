const express = require('express');
const canRouter = express.Router();
// import database connection code (connecting mysql to the application)
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// remove /api from all routes --> the prefix /api is added in server. js
// app.use('/api', apiRoutes);
// changed app to router

// Get all candidates
// added the mysql query inside the get route for the candidates api
// created an API endpoint to retrieve all the candidates from the candidates table
canRouter.get('/candidates', (req, res) => {

    // assign sql command to variable
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;
    // left join means, return all rows from the left table (candidates), even if there are no matches in the right table (parties)
  
    db.query(sql, (err, rows) => {
        if (err) {
            // send 500 (server error) status, and place error message within a JSON object
            res.status(500).json({ error: err.message });
            // exit out database call 
            return;
        }
        res.json({
            // if there ir no error, then err is null, and this is sent back
            // sending response as JSON object to browser using res in the Express.js route callback
            message: 'success',
            data: rows
        });
    });
});
// This route is designated with the endpoint /api/candidates. Remember, the api in the URL signifies that this is an API endpoint
// The callback function will handle the client's request and the database's response
// displays candidates data as JSON object @ http://localhost:3001/api/candidates
// returns an array of objects, with each object representing a row of the candidates table
// the db object is using the query() method
// method runs the SQL query and executes the callback with all the resulting rows that match the query
// Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response
// If there are no errors in the SQL query, the err value is null
// This method is the key component that allows SQL commands to be written in a Node.js application.

// Get a single candidate
// the endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database
// assign the captured value populated in the req.params object with the key id to params
canRouter.get('/candidate/:id', (req, res) => {

    // still able to use a WHERE clause with a JOIN, but we had to place it at the end of the statement
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`;
    // Because params can be accepted in the database call as an array, params is assigned as an array with a single element, req.params.id
    const params = [req.params.id];
    
    // The database call will then query the candidates table with this id and retrieve the row specified
    db.query(sql, params, (err, row) => {
        if (err) {
            // error status code was changed to 400 to notify the client that their request wasn't accepted and to try a different request
            res.status(400).json({ error: err.message });
            return;
        } // In the route response, we'll send the row back to the client in a JSON object
        res.json({
            message: 'success',
            data: row
        });
    });
});
// selecting a single candidate by their primary key (id) is the only way to ensure that the candidate requested is the one that's returned
// http://localhost:3001/api/candidate/1

// Create a candidate
// The req.body object allows you to access data in a string or JSON object from the client side. You generally use the req.body object to receive data through POST and PUT requests in the Express server.
canRouter.post('/candidate', ({ body }, res) => {
    // using { body } instead of req.body

    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    // 'first_name', 'last_name', 'industry_connected' = ...props

    // if there are errors
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // params assignment contains three elements in its array that contains the user data collected in req.body

    db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.json({
        message: 'success',
        data: body
    });
    });
});
// In the callback function, we'll use the object req.body to populate the candidate's data and we're using object destructuring to pull the body property out of the request object in { body } instead of req in parameter
// If the inputCheck() function returns an error, an error message is returned to the client as a 400 status code, to prompt for a different user request with a JSON object that contains the reasons for the errors

// Update a candidate's party
canRouter.put('/candidate/:id', (req, res) => {

    // be extra sure that a party_id was provided before we attempt to update the database
    // This now forces any PUT request to /api/candidate/:id to include a party_id property
    // Even if the intention is to remove a party affiliation by setting it to null, the party_id property is still required -- null
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    // we're using a parameter for the candidate's id (req.params.id), the request body contains the party's id (req.body.party_id
    // The affected row's id should always be part of the route (e.g., /api/candidate/2) while the actual fields we're updating should be part of the body.

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
            message: 'Candidate not found'
            });
        } else {
            res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
            });
        }
    });
});

// Delete a candidate
canRouter.delete('/candidate/:id', (req, res) => {

    const sql = `DELETE FROM candidates WHERE id = ?`;

    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } 
        // If there are no affectedRows as a result of the delete query, that means that there was no candidate by that id
        else if (!result.affectedRows) {
            res.json({
            message: 'Candidate not found'
            });
        } 
        else {
            res.json({
            message: 'deleted',
            changes: result.affectedRows, // this will verify whether any rows were changed
            id: req.params.id
            });
        }
    });
});
// The DELETE statement has a question mark (?) that denotes a placeholder, making this a prepared statement. A prepared statement can execute the same SQL statements repeatedly using different values in place of the placeholder
// An additional param argument following the prepared statement provides values to use in place of the prepared statement's placeholders

// export it
module.exports = canRouter;