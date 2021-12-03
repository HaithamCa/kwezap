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
  router.get("/:id", (req, res) => {
    db.query(`SELECT users.id AS user_id, users.username, quizzes.id AS quiz_id, quizzes.title, quizzes.description, quizzes.public
              from users JOIN quizzes on owner_id = users.id
              WHERE owner_id = $1
              GROUP BY users.id, users.username, quizzes.id, quizzes.title, quizzes.description, quizzes.public;`, 
              [req.params.id])
      .then(user => {
        const templateVar = {userInfo: user.rows, user_id: req.params.id};
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
  })

  


  return router;
};



