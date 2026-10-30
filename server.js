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

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/auth/login");
  }
  next();
};

// Make user info available to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user_id
    ? { id: req.session.user_id, username: req.session.username }
    : null;
  next();
});

// Separated Routes for each Resource
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
const quizRoutes = require("./routes/quizzes");
const questionRoutes = require("./routes/questions");
const attemptRoutes = require("./routes/attempts");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
app.use("/auth", authRoutes(db));
app.use("/home", homeRoutes(db));
app.use("/users", requireAuth, usersRoutes(db));
app.use("/quiz", quizRoutes(db));
app.use("/questions", requireAuth, questionRoutes(db));
app.use("/attempts", attemptRoutes(db));
app.use("/widgets", widgetsRoutes(db));

// Home page
app.get("/", (req, res) => {
  const userId = req.session.user_id || null;
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
