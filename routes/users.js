/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // // the home page with all users
  // router.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then(data => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  // The user homepage when they can see their quizzes
  router.get("/:user_id", (req, res) => {
    db.query(`SELECT users.id AS user_id, users.username, quizzes.id AS quiz_id, quizzes.title, quizzes.description, quizzes.public
              from users JOIN quizzes on owner_id = users.id
              WHERE owner_id = $1
              GROUP BY users.id, users.username, quizzes.id, quizzes.title, quizzes.description, quizzes.public;`, 
              [req.params.user_id])
      .then(user => {
        const templateVar = {userInfo: user.rows, user_id: req.params.user_id};
        res.render("../views/users", templateVar);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // creating a quiz page
  router.get("/createquiz/:user_id", (req, res) => {
    let templateVar = { user_id: req.params.user_id };
    res.render('../views/create_quiz', templateVar);
  });

  // storing created quizzes into the database
  router.post("/createquiz/:user_id", (req, res) => {
    let queryString = `INSERT INTO quizzes (owner_id, title, description, public)
                VALUES ($1, $2, $3, $4) RETURNING id;`;
    let values = [req.params.user_id, req.body.title, req.body.description, req.body.public];
    db.query(queryString, values)
      .then(data => {
        let quizId = data.rows[0].id
        res.redirect(`/quiz/${quizId}/questions`);
      })
      .catch(err => {
        const errMsg = 'Please complete the form.'
        res.send(errMsg);
      });
  });

  


  return router;
};