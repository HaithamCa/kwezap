const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Display quiz page to take a quiz
  router.get("/:quiz_id", async (req, res) => {
    const quizId = req.params.quiz_id;
    const userId = req.session.user_id || 1;
    try {
      const quizResult = await db.query(
        `SELECT quizzes.*, users.username
         FROM quizzes
         JOIN users ON users.id = quizzes.owner_id
         WHERE quizzes.id = $1;`,
        [quizId]
      );

      if (quizResult.rows.length === 0) {
        return res.status(404).send("Quiz not found");
      }

      const quiz = quizResult.rows[0];
      const qaResult = await db.query(
        `SELECT questions.id AS question_id, questions.question,
                answers.id AS answer_id, answers.answer, answers.is_correct
         FROM questions
         LEFT JOIN answers ON answers.question_id = questions.id
         WHERE questions.quiz_id = $1
         ORDER BY questions.id, answers.id;`,
        [quizId]
      );

      const questionsMap = new Map();
      for (const row of qaResult.rows) {
        if (!questionsMap.has(row.question_id)) {
          questionsMap.set(row.question_id, {
            id: row.question_id,
            question: row.question,
            answers: [],
          });
        }
        if (row.answer_id) {
          questionsMap.get(row.question_id).answers.push({
            id: row.answer_id,
            answer: row.answer,
            is_correct: row.is_correct,
          });
        }
      }

      res.render("../views/quiz", {
        quiz,
        questions: Array.from(questionsMap.values()),
        quizzes: qaResult.rows,
        user_id: userId,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Submit a quiz attempt and calculate score
  router.post("/:quiz_id/submit", async (req, res) => {
    const quizId = req.params.quiz_id;
    const userId = req.session.user_id || 1;
    try {
      const questionsResult = await db.query(
        `SELECT questions.id AS question_id, answers.id AS answer_id, answers.is_correct
         FROM questions
         JOIN answers ON answers.question_id = questions.id
         WHERE questions.quiz_id = $1;`,
        [quizId]
      );

      const correctByQuestion = new Map();
      const questionIds = new Set();
      for (const row of questionsResult.rows) {
        questionIds.add(row.question_id);
        if (row.is_correct) {
          correctByQuestion.set(row.question_id, String(row.answer_id));
        }
      }

      let score = 0;
      for (const qId of questionIds) {
        const submittedAnswerId = String(req.body[`question_${qId}`] || "");
        if (
          submittedAnswerId &&
          submittedAnswerId === correctByQuestion.get(qId)
        ) {
          score++;
        }
      }

      const attemptInsert = await db.query(
        `INSERT INTO previous_attempts (quiz_id, user_id, score)
         VALUES ($1, $2, $3)
         RETURNING id;`,
        [quizId, userId, score]
      );

      const attemptId = attemptInsert.rows[0].id;
      res.redirect(`/attempts/${attemptId}`);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Adding a question after creating the quiz
  router.get("/:quiz_id/questions", async (req, res) => {
    req.session.quiz_id = req.params.quiz_id;
    const userId = req.session.user_id || 1;
    try {
      const quizData = await db.query(
        `SELECT id, owner_id, title FROM quizzes WHERE id = $1;`,
        [req.params.quiz_id]
      );
      const existingQuestions = await db.query(
        `SELECT id, question FROM questions WHERE quiz_id = $1 ORDER BY id;`,
        [req.params.quiz_id]
      );
      res.render("../views/questions", {
        quizId: req.params.quiz_id,
        quiz: quizData.rows[0],
        user: quizData.rows[0],
        existingQuestions: existingQuestions.rows,
        user_id: userId,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/:quizid/questions", (req, res) => {
    const questionText = (req.body.question || "").trim();
    if (!questionText) {
      return res.redirect(`/quiz/${req.params.quizid}/questions`);
    }
    let query = `INSERT INTO questions (quiz_id, question)
                VALUES ($1, $2)
                RETURNING id;`;
    let values = [req.params.quizid, questionText];
    req.session.quiz_id = req.params.quizid;
    db.query(query, values)
      .then((data) => {
        let questionID = data.rows[0].id;
        res.redirect(`/quiz/${req.params.quizid}/questions/${questionID}`);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:quizid/questions/:questionid", (req, res) => {
    db.query(
      `SELECT questions.question, quizzes.owner_id, quizzes.title
       FROM questions
       JOIN quizzes ON quiz_id = quizzes.id
       WHERE questions.id = $1;`,
      [req.params.questionid]
    )
      .then((data) => {
        let question = data.rows[0];
        let templateVars = {
          quiz_id: req.params.quizid,
          question_id: req.params.questionid,
          question,
          user_id: req.session.user_id || 1,
        };
        res.render("../views/answers", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
