/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
module.exports = (db) => {
  // quiz in it's page
  router.get("/:quiz_id", (req, res) => {
    db.query(
      `
    SELECT username, owner_id, quizzes.title, questions.question, questions.quiz_id, answers.question_id, answers.answer, answers.is_correct
    FROM answers
    JOIN questions ON questions.id = answers.question_id
    JOIN quizzes ON quizzes.id = questions.quiz_id
    JOIN users ON owner_id = users.id
    WHERE quiz_id = $1
    GROUP BY username, owner_id, question_id, quizzes.title, questions.question, answers.answer, questions.quiz_id, answers.is_correct, questions.id
    ORDER BY questions.id;`,
      [req.params.quiz_id]
    )
      .then((data) => {
        const templateVar = { quizzes: data.rows };
        res.render("../views/quiz", templateVar);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // adding a question after creating the quiz
  router.get("/:quiz_id/questions", (req, res) => {
    req.session.quiz_id = req.params.quiz_id;
    db.query(`SELECT id, owner_id FROM quizzes WHERE id = $1`, [
      req.params.quiz_id,
    ]).then((data) => {
      let templateVar = { quizId: req.params.quiz_id, user: data.rows[0] };
      res.render("../views/questions", templateVar);
    });
  });

  router.post("/:quizid/questions", (req, res) => {
    let query = `INSERT INTO questions (quiz_id, question)
                VALUES ($1, $2);`;
    let values = [req.params.quizid, req.body.question];
    req.session.quiz_id = req.params.quizid;
    db.query(query, values)
      .then((data) => {
        const question = data.rows;
        let questionID = question[0].id;
        res.redirect(`/quiz/${req.session.quiz_id}/questions/${questionID}`);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:quizid/questions/:questionid", (req, res) => {
    db.query(
      `SELECT question, owner_id
              FROM questions
              JOIN quizzes ON quiz_id = quizzes.id
              WHERE questions.id = $1;`,
      [req.params.questionid]
    ).then((data) => {
      let question = data.rows[0];
      let templateVars = {
        quiz_id: req.params.quizid,
        question_id: req.params.questionid,
        question,
      };
      res.render("../views/answers", templateVars);
    });
  });

  return router;
};
