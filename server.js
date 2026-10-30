// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  })
);

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
const homeRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
const quizRoutes = require("./routes/quizzes");
const questionRoutes = require("./routes/questions");
const attemptRoutes = require("./routes/attempts");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
app.use("/home", homeRoutes(db));
app.use("/users", usersRoutes(db));
app.use("/quiz", quizRoutes(db));
app.use("/questions", questionRoutes(db));
app.use("/attempts", attemptRoutes(db));
app.use("/widgets", widgetsRoutes(db));

// Home page
app.get("/", (req, res) => {
  const userId = req.session.user_id || 1;
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
      res.render("index", { quizzes: data.rows, user_id: userId });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
