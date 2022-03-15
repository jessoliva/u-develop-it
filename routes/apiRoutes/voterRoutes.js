const express = require('express');
const voterRouter = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// get all voters 
voterRouter.get('/voters', (req, res) => {

    // sort data in alphabetical order by last name
    const sql = `SELECT * FROM voters ORDER BY last_name`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get single voter
voterRouter.get('/voter/:id', (req, res) => {
    
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// The end goal is to allow people to register through the app (a POST request), update their email address (a PUT request), and deactivate their account (a DELETE request).

// create a voter
voterRouter.post('/voter', ({ body }, res) => {

    // Data validation
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];
  
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

// update voter email address
// this will require a combination of req.params (to capture who is being updated) and req.body (to capture what is being updated)
voterRouter.put('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
  
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];
  
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
            message: 'Voter not found'
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

// delete voter from database
voterRouter.delete('/voter/:id', (req, res) => {

    const sql = `DELETE FROM voters WHERE id = ?`;

    // didn't create a params variable, just added the params here as req.params.id
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
            message: 'Voter not found'
            });
        } else {
            res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
            });
        }
    });
});

module.exports = voterRouter;

