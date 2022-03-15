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

module.exports = voterRouter;

