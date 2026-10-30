# KWEZAP — Interactive Quiz Builder & Sharing Platform

**Live Interactive Demo:** [https://haithamca.github.io/kwezap/](https://haithamca.github.io/kwezap/)

KWEZAP is a full-stack web application that lets users create custom quizzes, control quiz visibility (public or unlisted/private), attempt community quizzes, view instant graded results with an answer key, and share direct links to quizzes and score reports.

---

## Features

- **Explore Public Quizzes**: Visitors and logged-in users can browse and take public quizzes from the home feed.
- **Create Custom Quizzes**: Build multi-question quizzes with multiple-choice or True/False options.
- **Public & Private Visibility**: Mark quizzes as private (unlisted) so only people with the direct link can access them, or toggle visibility anytime from the user dashboard.
- **Interactive Quiz Attempts & Instant Grading**: Submit answers, calculate scores automatically, and persist attempts in PostgreSQL.
- **Shareable Quiz & Result Links**: One-click link copying to share a quiz (`/quiz/:id`) or a specific attempt result (`/attempts/:id`).

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL (`pg`)
- **Templating & Styling**: EJS, SCSS / Sass, jQuery
- **Session Management**: `cookie-session`

---

## Running Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env` and set your local PostgreSQL credentials:
   ```bash
   cp .env.example .env
   ```

3. **Initialize and seed the database**
   ```bash
   npm run db:reset
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Then open `http://localhost:8080/` (or the `PORT` configured in `.env`).
