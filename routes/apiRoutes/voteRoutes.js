const express = require('express');
const voteRouter = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// get all votes
voteRouter.get('/votes', (req, res) => {


    const sql = `SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
                FROM votes
                LEFT JOIN candidates ON votes.candidate_id = candidates.id
                LEFT JOIN parties ON candidates.party_id = parties.id
                GROUP BY candidate_id ORDER BY count DESC;`;

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
// LEFT JOIN clause selects data starting from the left table (votes). It matches each row from the left table (votes) with every row from the right table(candidates and parties) based on the join_condition
// LEFT JOIN returns all rows from the left table regardless of whether a row from the left table has a matching row from the right table or not
// If there is no match, the columns of the row from the right table will contain NULL

// create a vote
voteRouter.post('/vote', ({ body }, res) => {

    // Data validation
    const errors = inputCheck(body, 'voter_id', 'candidate_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?,?)`;
    const params = [body.voter_id, body.candidate_id];
  
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            changes: result.affectedRows
        });
    });
});

module.exports = voteRouter;