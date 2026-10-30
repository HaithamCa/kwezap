const STORAGE_KEY = "kwezap_portfolio_state_v2";

const DEFAULT_DATA = {
  currentUser: null, // Changed to null to require login
  users: [
    { id: 1, username: "aenderwick0", email: "demo@kwezap.com", password: "demo" },
    { id: 2, username: "gtinn1", email: "user2@kwezap.com", password: "demo" },
  ],
  quizzes: [
    {
      id: 101,
      owner_id: 1,
      username: "aenderwick0",
      title: "JavaScript & Web Fundamentals",
      description: "Test your core knowledge of JavaScript, ES6, and browser fundamentals.",
      public: true,
      questions: [
        {
          id: 1001,
          question: "Which keyword declares a block-scoped constant in JavaScript?",
          answers: [
            { id: 1, answer: "const", is_correct: true },
            { id: 2, answer: "var", is_correct: false },
            { id: 3, answer: "let", is_correct: false },
            { id: 4, answer: "static", is_correct: false },
          ],
        },
        {
          id: 1002,
          question: "What does Array.prototype.map() return?",
          answers: [
            { id: 5, answer: "A new array with transformed elements", is_correct: true },
            { id: 6, answer: "The original array mutated in place", is_correct: false },
            { id: 7, answer: "A single accumulated value", is_correct: false },
            { id: 8, answer: "undefined", is_correct: false },
          ],
        },
        {
          id: 1003,
          question: "Which HTTP status code represents 'Created'?",
          answers: [
            { id: 9, answer: "201", is_correct: true },
            { id: 10, answer: "200", is_correct: false },
            { id: 11, answer: "204", is_correct: false },
            { id: 12, answer: "302", is_correct: false },
          ],
        },
      ],
    },
    {
      id: 1,
      owner_id: 1,
      username: "aenderwick0",
      title: "Pop Culture & Television Trivia",
      description: "True or False trivia on TV shows, movies, and Hollywood Walk of Fame.",
      public: true,
      questions: [
        {
          id: 1,
          question: "Friends star Lisa Kudrow was originally cast in the sitcom Frasier",
          answers: [
            { id: 101, answer: "TRUE", is_correct: true },
            { id: 102, answer: "FALSE", is_correct: false },
          ],
        },
        {
          id: 2,
          question: "If you are born between May 1st and 20th, then you are a Gemini",
          answers: [
            { id: 103, answer: "TRUE", is_correct: false },
            { id: 104, answer: "FALSE", is_correct: true },
          ],
        },
        {
          id: 3,
          question: "Emma Roberts is the daughter of Julia Roberts",
          answers: [
            { id: 105, answer: "TRUE", is_correct: false },
            { id: 106, answer: "FALSE", is_correct: true },
          ],
        },
        {
          id: 4,
          question: "There are over 2,500 stars on the Hollywood Walk of Fame",
          answers: [
            { id: 107, answer: "TRUE", is_correct: true },
            { id: 108, answer: "FALSE", is_correct: false },
          ],
        },
      ],
    },
    {
      id: 2,
      owner_id: 2,
      username: "gtinn1",
      title: "Space & Earth Science",
      description: "Quick science facts about space exploration and southern hemisphere cyclones.",
      public: true,
      questions: [
        {
          id: 5,
          question: "Fruit flies were the first living creatures sent into space",
          answers: [
            { id: 109, answer: "TRUE", is_correct: true },
            { id: 110, answer: "FALSE", is_correct: false },
          ],
        },
        {
          id: 6,
          question: "Cyclones spin in a clockwise direction in the southern hemisphere",
          answers: [
            { id: 111, answer: "TRUE", is_correct: true },
            { id: 112, answer: "FALSE", is_correct: false },
          ],
        },
      ],
    },
    {
      id: 5,
      owner_id: 5,
      username: "wdooley4",
      title: "World Records, Nature & Cinema",
      description: "From octopuses and the Channel Tunnel to Star Wars and Wimbledon.",
      public: true,
      questions: [
        {
          id: 10,
          question: "Roger Federer has won the most Wimbledon titles of any male player at the time of this quiz",
          answers: [
            { id: 113, answer: "TRUE", is_correct: false },
            { id: 114, answer: "FALSE", is_correct: true },
          ],
        },
        {
          id: 11,
          question: "An octopus has five hearts",
          answers: [
            { id: 115, answer: "TRUE", is_correct: false },
            { id: 116, answer: "FALSE", is_correct: true },
          ],
        },
        {
          id: 12,
          question: "Brazil is the only country in the Americas to have the official language of Portuguese",
          answers: [
            { id: 117, answer: "TRUE", is_correct: true },
            { id: 118, answer: "FALSE", is_correct: false },
          ],
        },
      ],
    },
    {
      id: 8,
      owner_id: 8,
      username: "acasarino7",
      title: "History, Law & Curiosities",
      description: "The Statue of Liberty, Scottish laws, the Great Wall of China, and silk tea bags.",
      public: true,
      questions: [
        {
          id: 23,
          question: "The Statue of Liberty was a gift from France",
          answers: [
            { id: 119, answer: "TRUE", is_correct: true },
            { id: 120, answer: "FALSE", is_correct: false },
          ],
        },
        {
          id: 24,
          question: "According to Scottish law, it is illegal to be drunk in charge of a cow",
          answers: [
            { id: 121, answer: "TRUE", is_correct: true },
            { id: 122, answer: "FALSE", is_correct: false },
          ],
        },
        {
          id: 25,
          question: "The Great Wall of China is visible from space with the unaided eye",
          answers: [
            { id: 123, answer: "TRUE", is_correct: false },
            { id: 124, answer: "FALSE", is_correct: true },
          ],
        },
      ],
    },
  ],
  attempts: [
    {
      id: 1,
      quiz_id: 101,
      user_id: 1,
      taker_username: "aenderwick0",
      score: 3,
      total: 3,
    },
  ],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function copyShareUrl(hashPath, btn) {
  const url = `${window.location.origin}${window.location.pathname}${hashPath}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url);
  }
  const toast = document.getElementById("toast");
  if (toast) {
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }
  if (btn) {
    const original = btn.textContent;
    btn.textContent = "Copied Link!";
    setTimeout(() => {
      btn.textContent = original;
    }, 1600);
  }
}

function renderHome() {
  const publicQuizzes = state.quizzes.filter((q) => q.public);
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="hero-card">
      <h1>Welcome to KWEZAP!</h1>
      <p class="subtitle">Browse public quizzes created by the community, test yourself, or ${state.currentUser ? 'build your own quiz' : 'login to create your own quizzes'}.</p>
    </div>

    <h2 class="section-title">Public Quizzes (${publicQuizzes.length})</h2>
    <div class="links-container">
      ${publicQuizzes
        .map(
          (quiz) => `
        <div class="quiz-card">
          <div class="quiz-card-body">
            <div class="quiz-meta">
              <span class="badge">${quiz.questions.length} Questions</span>
              <span class="author">By @${escapeHtml(quiz.username)}</span>
            </div>
            <h3><a href="#quiz/${quiz.id}">${escapeHtml(quiz.title)}</a></h3>
            <p>${escapeHtml(quiz.description)}</p>
          </div>
          <div class="quiz-card-actions">
            <a href="#quiz/${quiz.id}" class="btn primary">Take Quiz</a>
            <button type="button" class="btn secondary" data-share="#quiz/${quiz.id}">Share Link</button>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="form-card auth-card">
      <h1>Login to KWEZAP</h1>
      <p class="subtitle">Access your quizzes and create new ones</p>
      <div id="login-error" class="alert-error" style="display: none;"></div>
      
      <form id="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" placeholder="demo@kwezap.com" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" name="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn primary full-width">Login</button>
      </form>

      <p class="auth-footer">
        Don't have an account? <a href="#register">Register here</a><br>
        <small>Demo: demo@kwezap.com / demo</small>
      </p>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get("email").toLowerCase().trim();
    const password = fd.get("password");

    const user = state.users.find((u) => u.email === email && u.password === password);
    if (!user) {
      const errorDiv = document.getElementById("login-error");
      errorDiv.textContent = "Invalid email or password";
      errorDiv.style.display = "block";
      return;
    }

    state.currentUser = { id: user.id, username: user.username };
    saveState(state);
    window.location.hash = "#home";
  });
}

function renderRegister() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="form-card auth-card">
      <h1>Join KWEZAP</h1>
      <p class="subtitle">Create an account to build and share quizzes</p>
      <div id="register-error" class="alert-error" style="display: none;"></div>
      
      <form id="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" type="text" name="username" placeholder="Choose a username" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" placeholder="you@example.com" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" name="password" placeholder="At least 6 characters" required minlength="6" />
        </div>

        <div class="form-group">
          <label for="password_confirm">Confirm Password</label>
          <input id="password_confirm" type="password" name="password_confirm" placeholder="Re-enter password" required />
        </div>

        <button type="submit" class="btn primary full-width">Create Account</button>
      </form>

      <p class="auth-footer">
        Already have an account? <a href="#login">Login here</a>
      </p>
    </div>
  `;

  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const username = fd.get("username").trim();
    const email = fd.get("email").toLowerCase().trim();
    const password = fd.get("password");
    const passwordConfirm = fd.get("password_confirm");
    const errorDiv = document.getElementById("register-error");

    if (password !== passwordConfirm) {
      errorDiv.textContent = "Passwords do not match";
      errorDiv.style.display = "block";
      return;
    }

    if (state.users.find((u) => u.email === email)) {
      errorDiv.textContent = "Email already registered";
      errorDiv.style.display = "block";
      return;
    }

    const newId = state.users.length + 1;
    const newUser = { id: newId, username, email, password };
    state.users.push(newUser);
    state.currentUser = { id: newId, username };
    saveState(state);
    window.location.hash = "#home";
  });
}

function renderDashboard() {
  if (!state.currentUser) {
    window.location.hash = "#login";
    return;
  }
  
  const myQuizzes = state.quizzes.filter((q) => q.owner_id === state.currentUser.id);
  const myAttempts = [...state.attempts].filter(a => a.user_id === state.currentUser.id).reverse();
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="hero-card">
      <h1>Welcome, ${escapeHtml(state.currentUser.username)}!</h1>
      <p class="subtitle">Manage your quizzes, control privacy settings, and share your quiz links or recent scores.</p>
      <a href="#create" class="btn primary">+ Create a New Quiz</a>
    </div>

    <h2 class="section-title">Your Created Quizzes (${myQuizzes.length})</h2>
    <div class="links-container">
      ${
        myQuizzes.length > 0
          ? myQuizzes
              .map(
                (quiz) => `
          <div class="quiz-card">
            <div class="quiz-card-body">
              <div class="quiz-meta">
                <span class="badge ${quiz.public ? "badge-public" : "badge-private"}">
                  ${quiz.public ? "Public" : "Private (Unlisted)"}
                </span>
                <span class="badge">${quiz.questions.length} Questions</span>
              </div>
              <h3><a href="#quiz/${quiz.id}">${escapeHtml(quiz.title)}</a></h3>
              <p>${escapeHtml(quiz.description)}</p>
            </div>
            <div class="quiz-card-actions">
              <a href="#quiz/${quiz.id}" class="btn primary">Take / View</a>
              <a href="#add-question/${quiz.id}" class="btn secondary">+ Question</a>
              <button type="button" class="btn secondary" data-share="#quiz/${quiz.id}">Share Quiz</button>
              <button type="button" class="btn secondary" data-toggle-public="${quiz.id}">
                Make ${quiz.public ? "Private" : "Public"}
              </button>
              <button type="button" class="btn danger" data-delete-quiz="${quiz.id}">Delete</button>
            </div>
          </div>
        `
              )
              .join("")
          : `<div class="empty-state"><p>You haven't created any quizzes yet.</p></div>`
      }
    </div>

    <h2 class="section-title">Your Recent Quiz Results (${myAttempts.length})</h2>
    <div class="links-container">
      ${
        myAttempts.length > 0
          ? myAttempts
              .map((att) => {
                const quiz = state.quizzes.find((q) => q.id === att.quiz_id);
                const title = quiz ? quiz.title : "Quiz #" + att.quiz_id;
                return `
            <div class="quiz-card">
              <div class="quiz-card-body">
                <div class="quiz-meta">
                  <span class="badge badge-score">Score: ${att.score} / ${att.total}</span>
                </div>
                <h3><a href="#result/${att.id}">${escapeHtml(title)}</a></h3>
              </div>
              <div class="quiz-card-actions">
                <a href="#result/${att.id}" class="btn primary">View Result</a>
                <button type="button" class="btn secondary" data-share="#result/${att.id}">Share Result</button>
              </div>
            </div>
          `;
              })
              .join("")
          : `<div class="empty-state"><p>No quiz attempts recorded yet.</p></div>`
      }
    </div>
  `;
}

function renderCreateQuiz() {
  if (!state.currentUser) {
    window.location.hash = "#login";
    return;
  }
  
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="form-card">
      <h1>Create Your Quiz!</h1>
      <form id="create-quiz-form">
        <div class="form-group">
          <label for="quiz-title">Quiz Title</label>
          <input id="quiz-title" type="text" name="title" placeholder="e.g., World Geography Challenge" required />
        </div>

        <div class="form-group">
          <label for="quiz-description">Quiz Description</label>
          <textarea id="quiz-description" name="description" rows="3" placeholder="What is this quiz about?" required></textarea>
        </div>

        <div class="form-group">
          <label>Visibility</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" name="public" value="true" checked />
              Public (Listed on home page)
            </label>
            <label class="radio-option">
              <input type="radio" name="public" value="false" />
              Private (Only people with the link can access)
            </label>
          </div>
        </div>

        <button type="submit" class="btn primary full-width">Create Quiz & Add Questions</button>
      </form>
    </div>
  `;

  document.getElementById("create-quiz-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newId = Date.now();
    const newQuiz = {
      id: newId,
      owner_id: state.currentUser.id,
      username: state.currentUser.username,
      title: formData.get("title").trim(),
      description: formData.get("description").trim(),
      public: formData.get("public") === "true",
      questions: [],
    };
    state.quizzes.unshift(newQuiz);
    saveState(state);
    window.location.hash = `#add-question/${newId}`;
  });
}

function renderAddQuestion(quizId) {
  if (!state.currentUser) {
    window.location.hash = "#login";
    return;
  }
  
  const quiz = state.quizzes.find((q) => q.id === Number(quizId));
  const app = document.getElementById("app");
  if (!quiz) {
    app.innerHTML = `<div class="empty-state"><p>Quiz not found.</p><a href="#home" class="btn primary">Back Home</a></div>`;
    return;
  }
  
  if (quiz.owner_id !== state.currentUser.id) {
    app.innerHTML = `<div class="empty-state"><p>You don't have permission to edit this quiz.</p><a href="#home" class="btn primary">Back Home</a></div>`;
    return;
  }

  app.innerHTML = `
    <div class="form-card">
      <h2>Add a Question to "${escapeHtml(quiz.title)}"</h2>
      <p class="subtitle">Questions in this quiz so far: <strong>${quiz.questions.length}</strong></p>
      <form id="add-question-form">
        <div class="form-group">
          <label for="q-prompt">Question Prompt</label>
          <input id="q-prompt" type="text" name="question" placeholder="Enter your question..." required />
        </div>

        <div class="answer-builder-row">
          <label>Answer 1 (Correct Answer)</label>
          <input class="textbox" type="text" name="a1" placeholder="Correct option" required />
        </div>
        <div class="answer-builder-row">
          <label>Answer 2</label>
          <input class="textbox" type="text" name="a2" placeholder="Distractor option 2" required />
        </div>
        <div class="answer-builder-row">
          <label>Answer 3</label>
          <input class="textbox" type="text" name="a3" placeholder="Distractor option 3" required />
        </div>
        <div class="answer-builder-row">
          <label>Answer 4</label>
          <input class="textbox" type="text" name="a4" placeholder="Distractor option 4" required />
        </div>

        <div class="form-actions">
          <button type="submit" data-next="finish" class="btn primary">Save & View Quiz</button>
          <button type="submit" data-next="another" class="btn secondary">Save & Add Another Question</button>
        </div>
      </form>
    </div>
  `;

  let nextAction = "finish";
  app.querySelectorAll("button[type='submit']").forEach((btn) => {
    btn.addEventListener("click", () => {
      nextAction = btn.getAttribute("data-next");
    });
  });

  document.getElementById("add-question-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const baseId = Date.now();
    quiz.questions.push({
      id: baseId,
      question: fd.get("question").trim(),
      answers: [
        { id: baseId + 1, answer: fd.get("a1").trim(), is_correct: true },
        { id: baseId + 2, answer: fd.get("a2").trim(), is_correct: false },
        { id: baseId + 3, answer: fd.get("a3").trim(), is_correct: false },
        { id: baseId + 4, answer: fd.get("a4").trim(), is_correct: false },
      ],
    });
    saveState(state);
    if (nextAction === "another") {
      renderAddQuestion(quiz.id);
    } else {
      window.location.hash = `#quiz/${quiz.id}`;
    }
  });
}

function renderQuiz(quizId) {
  const quiz = state.quizzes.find((q) => q.id === Number(quizId));
  const app = document.getElementById("app");
  if (!quiz) {
    app.innerHTML = `<div class="empty-state"><p>Quiz not found.</p><a href="#home" class="btn primary">Back Home</a></div>`;
    return;
  }

  app.innerHTML = `
    <div class="hero-card">
      <div class="quiz-meta">
        <span class="badge ${quiz.public ? "badge-public" : "badge-private"}">
          ${quiz.public ? "Public Quiz" : "Private Quiz"}
        </span>
        <span class="author">Created by @${escapeHtml(quiz.username)}</span>
      </div>
      <h1>${escapeHtml(quiz.title)}</h1>
      <p class="subtitle">${escapeHtml(quiz.description)}</p>
      <div class="quiz-card-actions">
        <button type="button" class="btn secondary" data-share="#quiz/${quiz.id}">Share Quiz Link</button>
        <a href="#add-question/${quiz.id}" class="btn secondary">+ Add Question</a>
      </div>
    </div>

    ${
      quiz.questions.length > 0
        ? `<form id="attempt-form">
            ${quiz.questions
              .map(
                (q, idx) => `
              <div class="question-card">
                <h3>Question ${idx + 1} of ${quiz.questions.length}</h3>
                <p class="question-prompt">${escapeHtml(q.question)}</p>
                <div class="options-list">
                  ${q.answers
                    .map(
                      (ans) => `
                    <label class="option-item">
                      <input type="radio" name="q_${q.id}" value="${ans.id}" required />
                      <span>${escapeHtml(ans.answer)}</span>
                    </label>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `
              )
              .join("")}
            <button type="submit" class="btn primary full-width">Submit Quiz & See Results</button>
          </form>`
        : `<div class="empty-state">
            <p>This quiz doesn't have any questions yet.</p>
            <a href="#add-question/${quiz.id}" class="btn primary">+ Add First Question</a>
          </div>`
    }
  `;

  const form = document.getElementById("attempt-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      if (!state.currentUser) {
        window.location.hash = "#login";
        return;
      }
      
      const fd = new FormData(form);
      let score = 0;
      for (const q of quiz.questions) {
        const picked = Number(fd.get(`q_${q.id}`));
        const correct = q.answers.find((a) => a.is_correct);
        if (correct && picked === correct.id) {
          score++;
        }
      }
      const attemptId = state.attempts.length + 1;
      state.attempts.push({
        id: attemptId,
        quiz_id: quiz.id,
        user_id: state.currentUser.id,
        taker_username: state.currentUser.username,
        score,
        total: quiz.questions.length,
      });
      saveState(state);
      window.location.hash = `#result/${attemptId}`;
    });
  }
}

function renderResult(attemptId) {
  const attempt = state.attempts.find((a) => a.id === Number(attemptId));
  const app = document.getElementById("app");
  if (!attempt) {
    app.innerHTML = `<div class="empty-state"><p>Result not found.</p><a href="#home" class="btn primary">Back Home</a></div>`;
    return;
  }
  const quiz = state.quizzes.find((q) => q.id === attempt.quiz_id) || {
    title: "Quiz #" + attempt.quiz_id,
    username: "user",
    questions: [],
  };
  const pct = Math.round((attempt.score / (attempt.total || 1)) * 100);

  app.innerHTML = `
    <div class="result-banner">
      <span class="badge badge-score">Attempt #${attempt.id}</span>
      <h1>${escapeHtml(quiz.title)}</h1>
      <p class="subtitle">Completed by <strong>@${escapeHtml(attempt.taker_username)}</strong> (Quiz by @${escapeHtml(quiz.username)})</p>

      <div class="score-circle">
        <div class="score-number">${attempt.score} / ${attempt.total}</div>
        <div class="score-percent">${pct}% Correct</div>
      </div>

      <div class="quiz-card-actions center-actions">
        <button type="button" class="btn primary" data-share="#result/${attempt.id}">Share Result Link</button>
        <a href="#quiz/${attempt.quiz_id}" class="btn secondary">Retake Quiz</a>
        <a href="#home" class="btn secondary">Back to Home</a>
      </div>
    </div>

    <h2 class="section-title">Answer Key</h2>
    <div class="links-container">
      ${quiz.questions
        .map((q, idx) => {
          const correct = q.answers.find((a) => a.is_correct);
          return `
            <div class="question-card">
              <h3>Question ${idx + 1}</h3>
              <p class="question-prompt">${escapeHtml(q.question)}</p>
              <p class="correct-answer-label">Correct Answer: <strong>${escapeHtml(correct ? correct.answer : "N/A")}</strong></p>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function router() {
  const hash = window.location.hash || "#home";
  if (hash === "#home" || hash === "") {
    renderHome();
  } else if (hash === "#login") {
    renderLogin();
  } else if (hash === "#register") {
    renderRegister();
  } else if (hash === "#dashboard") {
    renderDashboard();
  } else if (hash === "#create") {
    renderCreateQuiz();
  } else if (hash.startsWith("#quiz/")) {
    renderQuiz(hash.split("/")[1]);
  } else if (hash.startsWith("#add-question/")) {
    renderAddQuestion(hash.split("/")[1]);
  } else if (hash.startsWith("#result/")) {
    renderResult(hash.split("/")[1]);
  } else {
    renderHome();
  }
}

document.addEventListener("click", (e) => {
  const shareBtn = e.target.closest("[data-share]");
  if (shareBtn) {
    copyShareUrl(shareBtn.getAttribute("data-share"), shareBtn);
    return;
  }

  const toggleBtn = e.target.closest("[data-toggle-public]");
  if (toggleBtn) {
    if (!state.currentUser) {
      window.location.hash = "#login";
      return;
    }
    const id = Number(toggleBtn.getAttribute("data-toggle-public"));
    const quiz = state.quizzes.find((q) => q.id === id);
    if (quiz && quiz.owner_id === state.currentUser.id) {
      quiz.public = !quiz.public;
      saveState(state);
      renderDashboard();
    }
    return;
  }

  const deleteBtn = e.target.closest("[data-delete-quiz]");
  if (deleteBtn) {
    if (!state.currentUser) {
      window.location.hash = "#login";
      return;
    }
    const id = Number(deleteBtn.getAttribute("data-delete-quiz"));
    const quiz = state.quizzes.find((q) => q.id === id);
    if (quiz && quiz.owner_id === state.currentUser.id) {
      state.quizzes = state.quizzes.filter((q) => q.id !== id);
      saveState(state);
      renderDashboard();
    }
  }
  
  const logoutBtn = e.target.closest("[data-logout]");
  if (logoutBtn) {
    state.currentUser = null;
    saveState(state);
    window.location.hash = "#home";
  }
});

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
