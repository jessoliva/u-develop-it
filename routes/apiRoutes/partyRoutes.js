const express = require('express');
const partyRouter = express.Router();
const db = require('../../db/connection');

// get all parties
partyRouter.get('/parties', (req, res) => {

    const sql = `SELECT * FROM parties`;

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

// get party based on id
partyRouter.get('/party/:id', (req, res) => {
    
    const sql = `SELECT * FROM parties WHERE id = ?`;
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

// delete a party
// when a party is deleted, the candidates will have a NULL value if it had that party
partyRouter.delete('/party/:id', (req, res) => {

    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
        // checks if anything was deleted
      } else if (!result.affectedRows) {
        res.json({
          message: 'Party not found'
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

module.exports = partyRouter;