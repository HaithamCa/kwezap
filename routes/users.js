const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // The user homepage where they can see their quizzes and attempts
  router.get("/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    
    // Ensure user can only view their own dashboard
    if (req.session.user_id !== parseInt(userId)) {
      return res.redirect(`/users/${req.session.user_id}`);
    }
    
    try {
      const userResult = await db.query(
        `SELECT id, username, email FROM users WHERE id = $1;`,
        [userId]
      );
      const quizzesResult = await db.query(
        `SELECT users.id AS user_id, users.username, quizzes.id AS quiz_id, quizzes.id, quizzes.owner_id, quizzes.title, quizzes.description, quizzes.public,
                COUNT(questions.id)::int AS question_count
         FROM quizzes
         JOIN users ON quizzes.owner_id = users.id
         LEFT JOIN questions ON questions.quiz_id = quizzes.id
         WHERE quizzes.owner_id = $1
         GROUP BY users.id, users.username, quizzes.id
         ORDER BY quizzes.id DESC;`,
        [userId]
      );
      const attemptsResult = await db.query(
        `SELECT previous_attempts.id AS attempt_id, previous_attempts.quiz_id, previous_attempts.score,
                quizzes.title,
                (SELECT COUNT(*)::int FROM questions WHERE questions.quiz_id = quizzes.id) AS total_questions
         FROM previous_attempts
         JOIN quizzes ON quizzes.id = previous_attempts.quiz_id
         WHERE previous_attempts.user_id = $1
         ORDER BY previous_attempts.id DESC
         LIMIT 20;`,
        [userId]
      );

      const templateVar = {
        user: userResult.rows[0] || { id: userId, username: `User #${userId}` },
        userInfo: quizzesResult.rows,
        attempts: attemptsResult.rows,
        user_id: userId,
      };
      res.render("../views/users", templateVar);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // creating a quiz page
  router.get("/createquiz/:user_id", (req, res) => {
    // Ensure user can only create quiz for themselves
    if (req.session.user_id !== parseInt(req.params.user_id)) {
      return res.redirect(`/users/createquiz/${req.session.user_id}`);
    }
    
    let templateVar = { user_id: req.params.user_id, error: null };
    res.render("../views/create_quiz", templateVar);
  });

  // storing created quizzes into the database
  router.post("/:user_id/createquiz", (req, res) => {
    // Ensure user can only create quiz for themselves
    if (req.session.user_id !== parseInt(req.params.user_id)) {
      return res.status(403).send("You don't have permission to create a quiz for another user");
    }
    
    const title = (req.body.title || req.body.name || "").trim();
    const description = (req.body.description || "").trim();
    const isPublic = req.body.public === "false" ? false : true;

    if (!title || !description) {
      return res.render("../views/create_quiz", {
        user_id: req.params.user_id,
        error: "Please provide both a quiz title and description.",
      });
    }

    let queryString = `INSERT INTO quizzes (owner_id, title, description, public)
                VALUES ($1, $2, $3, $4) RETURNING id;`;
    let values = [req.params.user_id, title, description, isPublic];
    db.query(queryString, values)
      .then((data) => {
        let quizId = data.rows[0].id;
        res.redirect(`/quiz/${quizId}/questions`);
      })
      .catch((err) => {
        res.status(500).send("Please complete the form.");
      });
  });

  // toggle quiz public/private status
  router.post("/:user_id/visibility/:quiz_id", async (req, res) => {
    try {
      // Verify ownership
      const quiz = await db.query(
        `SELECT owner_id FROM quizzes WHERE id = $1;`,
        [req.params.quiz_id]
      );
      
      if (quiz.rows.length === 0) {
        return res.status(404).send("Quiz not found");
      }
      
      if (quiz.rows[0].owner_id !== parseInt(req.params.user_id) || 
          req.session.user_id !== parseInt(req.params.user_id)) {
        return res.status(403).send("You don't have permission to modify this quiz");
      }

      await db.query(
        `UPDATE quizzes SET public = NOT public WHERE id = $1 AND owner_id = $2;`,
        [req.params.quiz_id, req.params.user_id]
      );
      res.redirect(`/users/${req.params.user_id}`);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // delete a quiz
  router.post("/:user_id/delete/:quiz_id", async (req, res) => {
    try {
      // Verify ownership
      const quiz = await db.query(
        `SELECT owner_id FROM quizzes WHERE id = $1;`,
        [req.params.quiz_id]
      );
      
      if (quiz.rows.length === 0) {
        return res.status(404).send("Quiz not found");
      }
      
      if (quiz.rows[0].owner_id !== parseInt(req.params.user_id) || 
          req.session.user_id !== parseInt(req.params.user_id)) {
        return res.status(403).send("You don't have permission to delete this quiz");
      }

      await db.query(`DELETE FROM quizzes WHERE id = $1 AND owner_id = $2;`, [
        req.params.quiz_id,
        req.params.user_id,
      ]);
      res.redirect(`/users/${req.params.user_id}`);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
