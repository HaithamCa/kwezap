# KWEZAP — Interactive Quiz Builder & Sharing Platform

**Live Interactive Demo:** [https://haithamca.github.io/kwezap/](https://haithamca.github.io/kwezap/)

KWEZAP is a full-stack web application that lets users create accounts, build custom quizzes, control quiz visibility (public or unlisted/private), attempt community quizzes, view instant graded results with an answer key, and share direct links to quizzes and score reports.

---

## Features

### Authentication & User Management
- **User Registration & Login**: Secure authentication with bcrypt password hashing
- **Session Management**: Persistent login sessions with cookie-based authentication
- **User Dashboards**: Each user has their own dashboard to manage quizzes and view attempt history

### Quiz Management
- **Create Custom Quizzes**: Build multi-question quizzes with multiple-choice or True/False options
- **Public & Private Visibility**: 
  - **Public**: Listed on the home feed for everyone to discover
  - **Private (Unlisted)**: Only accessible via direct link - perfect for testing specific groups
- **Edit & Delete**: Full control over your own quizzes
- **Ownership Protection**: Users can only edit/delete their own quizzes

### Quiz Taking & Results
- **Browse Public Quizzes**: Visitors can explore public quizzes from the home feed
- **Interactive Quiz Attempts**: Submit answers and get instant grading
- **Detailed Results**: View your score, percentage, and a complete answer key
- **Attempt History**: Track all your quiz attempts on your dashboard

### Sharing Features
- **Shareable Quiz Links**: One-click copy of quiz URLs to share with others
- **Shareable Result Links**: Share your quiz scores and results via direct links

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL (`pg`)
- **Authentication**: bcrypt password hashing, cookie-session
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

4. **Hash the demo user passwords**
   ```bash
   node bin/hash-passwords.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Then open `http://localhost:3005/` (or the `PORT` configured in `.env`).

---

## Demo Login Credentials

After running the database setup, you can log in with:

- **Email**: `cmacgiffin0@squarespace.com`
- **Password**: `password123`

(All seeded users use the password: `password123`)

Or register a new account at `/auth/register`

---

## User Stories

- ✅ As a visitor, I can browse and attempt public quizzes
- ✅ As a user, I can register and log in to my account
- ✅ As a logged-in user, I can create custom quizzes
- ✅ As a logged-in user, I can make my quizzes private (unlisted) to limit access
- ✅ As a logged-in user, I can share links to my quizzes
- ✅ As a user, I can attempt quizzes and see my graded results
- ✅ As a user, I can share links to my quiz results
- ✅ As a user, I can view my quiz creation and attempt history on my dashboard
- ✅ As a quiz owner, I can toggle visibility between public and private
- ✅ As a quiz owner, I can delete my own quizzes
