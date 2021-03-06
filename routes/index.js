/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
    router.get('/:user_id', (req, res) => {
        req.session.user_id = req.params.user_id;
        db.query(`
        SELECT * FROM quizzes WHERE public = true;
        `)
        .then(data => {
          const templateVar = {quizzes: data.rows, user_id: req.params.user_id};
          res.render('../views/index', templateVar);
        })
      });
      return router;
    };
