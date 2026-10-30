const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const renderHome = (req, res) => {
    const userId = req.params.user_id || req.session.user_id || 1;
    req.session.user_id = userId;
    db.query(
      `SELECT quizzes.*, users.username, COUNT(questions.id)::int AS question_count
       FROM quizzes
       JOIN users ON users.id = quizzes.owner_id
       LEFT JOIN questions ON questions.quiz_id = quizzes.id
       WHERE quizzes.public = true
       GROUP BY quizzes.id, users.username
       ORDER BY (COUNT(questions.id) > 0) DESC, quizzes.id DESC;`
    )
      .then((data) => {
        const templateVar = { quizzes: data.rows, user_id: userId };
        res.render("../views/index", templateVar);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  };

  router.get("/", renderHome);
  router.get("/:user_id", renderHome);

  return router;
};
