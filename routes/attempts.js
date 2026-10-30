const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // View a specific attempt result (shareable result link)
  router.get("/:attempt_id", async (req, res) => {
    const attemptId = req.params.attempt_id;
    const userId = req.session.user_id || null;
    try {
      const attemptResult = await db.query(
        `SELECT previous_attempts.id AS attempt_id,
                previous_attempts.score,
                previous_attempts.quiz_id,
                previous_attempts.user_id,
                taker.username AS taker_username,
                quizzes.title AS quiz_title,
                quizzes.description AS quiz_description,
                owner.username AS owner_username,
                (SELECT COUNT(*)::int FROM questions WHERE questions.quiz_id = quizzes.id) AS total_questions
         FROM previous_attempts
         JOIN quizzes ON quizzes.id = previous_attempts.quiz_id
         JOIN users AS taker ON taker.id = previous_attempts.user_id
         JOIN users AS owner ON owner.id = quizzes.owner_id
         WHERE previous_attempts.id = $1;`,
        [attemptId]
      );

      if (attemptResult.rows.length === 0) {
        return res.status(404).send("Result not found");
      }

      const attempt = attemptResult.rows[0];

      const qaResult = await db.query(
        `SELECT questions.id AS question_id, questions.question, answers.answer AS correct_answer
         FROM questions
         LEFT JOIN answers ON answers.question_id = questions.id AND answers.is_correct = true
         WHERE questions.quiz_id = $1
         ORDER BY questions.id;`,
        [attempt.quiz_id]
      );

      res.render("../views/results", {
        attempt,
        questions: qaResult.rows,
        user_id: userId,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // View most recent attempt for a quiz & user (or redirect to quiz if none yet)
  router.get("/:quiz_id/:user_id", async (req, res) => {
    const { quiz_id, user_id } = req.params;
    try {
      const result = await db.query(
        `SELECT id FROM previous_attempts
         WHERE quiz_id = $1 AND user_id = $2
         ORDER BY id DESC
         LIMIT 1;`,
        [quiz_id, user_id]
      );
      if (result.rows.length > 0) {
        return res.redirect(`/attempts/${result.rows[0].id}`);
      }
      return res.redirect(`/quiz/${quiz_id}`);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
