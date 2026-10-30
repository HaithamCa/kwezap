const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:questionid", (req, res) => {
    db.query(`SELECT question, quiz_id FROM questions WHERE id = $1;`, [
      req.params.questionid,
    ])
      .then((data) => {
        const row = data.rows[0];
        res.render("../views/questions", {
          quizId: row ? row.quiz_id : req.session.quiz_id,
          question_id: req.params.questionid,
          question: row ? row.question : "",
          existingQuestions: [],
          user_id: req.session.user_id || 1,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:questionId", (req, res) => {
    const questionId = req.params.questionId;
    const a1 = (req.body.answer1 || "").trim();
    const a2 = (req.body.answer2 || "").trim();
    const a3 = (req.body.answer3 || "").trim();
    const a4 = (req.body.answer4 || "").trim();

    if (!a1 || !a2 || !a3 || !a4) {
      return res
        .status(400)
        .send("Please go back and complete all four answer options.");
    }

    const queryString = `
      INSERT INTO answers (question_id, answer, is_correct)
      VALUES
        ($1, $2, $3),
        ($1, $4, $5),
        ($1, $6, $7),
        ($1, $8, $9)
      RETURNING *;
    `;
    const values = [
      questionId,
      a1,
      req.body.isCorrecta1 === "true",
      a2,
      req.body.isCorrecta2 === "true",
      a3,
      req.body.isCorrecta3 === "true",
      a4,
      req.body.isCorrecta4 === "true",
    ];

    db.query(queryString, values)
      .then((data) => {
        const savedQuestionId = data.rows[0].question_id;
        return db.query(
          `SELECT quiz_id FROM questions WHERE questions.id = $1;`,
          [savedQuestionId]
        );
      })
      .then((response) => {
        const quizid = response.rows[0].quiz_id;
        if (req.body.action === "add_another") {
          res.redirect(`/quiz/${quizid}/questions`);
        } else {
          res.redirect(`/quiz/${quizid}`);
        }
      })
      .catch((err) => {
        res.status(500).send(`Please click back and complete the form.`);
      });
  });

  return router;
};
