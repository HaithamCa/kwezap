/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
module.exports = (db) => {

    router.get('/:question_id', (req, res) => {
        db.query(`SELECT question FROM questions WHERE id = $1;`, [req.params.question_id])
          .then(data => {
            let question = data.rows[0].question;
            let templateVars = { question_id: req.params.question_id, question };
            res.render('../views/questions', templateVars);
          });
      });

      

  return router;
};



