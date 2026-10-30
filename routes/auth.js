const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  // Show login page
  router.get("/login", (req, res) => {
    res.render("../views/login", {
      error: null,
      user_id: req.session.user_id || null,
    });
  });

  // Show register page
  router.get("/register", (req, res) => {
    res.render("../views/register", {
      error: null,
      user_id: req.session.user_id || null,
    });
  });

  // Handle login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("../views/login", {
        error: "Email and password are required",
        user_id: null,
      });
    }

    try {
      const result = await db.query(
        `SELECT id, username, email, password FROM users WHERE email = $1;`,
        [email.toLowerCase().trim()]
      );

      if (result.rows.length === 0) {
        return res.render("../views/login", {
          error: "Invalid email or password",
          user_id: null,
        });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.render("../views/login", {
          error: "Invalid email or password",
          user_id: null,
        });
      }

      req.session.user_id = user.id;
      req.session.username = user.username;
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.render("../views/login", {
        error: "An error occurred. Please try again.",
        user_id: null,
      });
    }
  });

  // Handle registration
  router.post("/register", async (req, res) => {
    const { username, email, password, password_confirm } = req.body;

    if (!username || !email || !password || !password_confirm) {
      return res.render("../views/register", {
        error: "All fields are required",
        user_id: null,
      });
    }

    if (password !== password_confirm) {
      return res.render("../views/register", {
        error: "Passwords do not match",
        user_id: null,
      });
    }

    if (password.length < 6) {
      return res.render("../views/register", {
        error: "Password must be at least 6 characters",
        user_id: null,
      });
    }

    try {
      const existingUser = await db.query(
        `SELECT id FROM users WHERE email = $1;`,
        [email.toLowerCase().trim()]
      );

      if (existingUser.rows.length > 0) {
        return res.render("../views/register", {
          error: "Email already registered",
          user_id: null,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        `INSERT INTO users (username, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, username;`,
        [username.trim(), email.toLowerCase().trim(), hashedPassword]
      );

      const newUser = result.rows[0];
      req.session.user_id = newUser.id;
      req.session.username = newUser.username;
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.render("../views/register", {
        error: "An error occurred. Please try again.",
        user_id: null,
      });
    }
  });

  // Handle logout
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};
