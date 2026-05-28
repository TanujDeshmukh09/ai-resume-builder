# 🤖 AI Resume Builder

> *"Build a job-winning resume in minutes — powered by AI."*

A full-stack AI-powered web application that allows users to create, edit, and export professional resumes with AI-generated content, real-time preview, ATS compatibility scoring, and certificate credibility analysis.

---

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Technology Stack](#-technology-stack)
- [Features & Functionalities](#-features--functionalities)
- [Installation & Execution Steps](#-installation--execution-steps)
- [Team Members](#-team-members)
- [Screenshots & Output](#-screenshots--output)

---

## 📌 Project Description

**AI Resume Builder** is a full-stack web application that solves a critical problem faced by students and fresh graduates: **75% of resumes never reach a human recruiter because they fail ATS (Applicant Tracking System) filters.**

The platform guides users through a 9-step form to build a structured resume, uses **Claude 3 Haiku AI** (via OpenRouter) to generate professional, ATS-optimized bullet points for experience, projects, and summary sections, and provides a real-time ATS compatibility score with actionable feedback.

### Problem Statement
- Most students don't know how to write ATS-optimized bullet points or quantify achievements.
- Existing tools (Canva, Zety, LinkedIn) either lock features behind paywalls, produce ATS-unfriendly designs, or provide no AI content assistance.
- Students submit resumes with paragraphs instead of bullets, no action verbs, and weak summaries — reducing interview callbacks significantly.

### Solution
A free, AI-assisted resume builder that:
- Generates professional content through prompt-engineered LLM calls.
- Scores the resume against ATS criteria and tells users exactly what to improve.
- Verifies certificate credibility against trusted issuers.
- Exports a clean, print-ready PDF.

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 + Vite** | UI framework with fast HMR for development |
| **Redux Toolkit** | Global state management for real-time preview sync |
| **Framer Motion** | Step transitions, 3D tilt animation on live preview |
| **Tailwind CSS** | Utility-first styling |
| **react-simple-wysiwyg** | Rich text editor for experience/project bullet points |
| **html2pdf.js** | Client-side HTML-to-PDF export |
| **Axios** | HTTP client with cookie credential support |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server (MVC architecture) |
| **MongoDB + Mongoose** | NoSQL database with schema validation |
| **bcrypt** | Password hashing (salt rounds: 10) |
| **jsonwebtoken (JWT)** | Stateless authentication via httpOnly cookies |
| **cookie-parser + CORS** | Cross-origin cookie handling |

### AI / LLM
| Technology | Purpose |
|---|---|
| **Claude 3 Haiku (Anthropic)** | LLM for content generation |
| **OpenRouter API** | Unified LLM API gateway (model-agnostic) |

---

## ✨ Features & Functionalities

### 1. 🔐 User Authentication
- Secure registration and login with **bcrypt password hashing** (salt rounds: 10).
- **JWT-based authentication** stored in httpOnly cookies — protected against XSS attacks.
- Persistent sessions across page refreshes; tokens expire after 24 hours.
- Middleware validates token on every protected route before any database query.

### 2. 📝 9-Step Guided Resume Builder
A multi-step wizard that walks users through every resume section:
`Personal Details → Summary → Experience → Projects → Research Papers → Education → Skills → Certifications → ATS Score`
- Progress bar and clickable step tabs for easy navigation.
- Per-section Save buttons with real-time Redux state sync.
- Animated step transitions via Framer Motion `AnimatePresence`.

### 3. 🤖 AI Content Generation (Claude 3 Haiku)
- **Professional Summary**: Generates 3 tone-varied summary options from a user's rough draft.
- **Experience Bullets**: Generates 3–4 concise action-verb bullet points per job role.
- **Project Description**: Generates 3 ATS-friendly bullet points per project.
- Structured JSON prompt engineering ensures consistent, parseable AI output.
- Robust error handling: strips markdown fences, handles key-name variations, falls back gracefully on parse failure.

### 4. 👁 Real-Time Live Preview with 3D Tilt
- Right-panel preview updates instantly as the user types or saves.
- **3D mouse-tracking tilt effect** using Framer Motion `useMotionValue` + `useSpring`.
- Custom `normalizeToHtmlBullets()` utility converts all content formats (AI output, WYSIWYG HTML, plain text) into consistent `<ul><li>` bullet rendering.
- Theme color customization applied across all preview elements in real-time.

### 5. 📊 ATS Compatibility Scoring
A rule-based scoring algorithm (0–100) evaluated across 4 weighted categories:
| Category | Max Points | Key Criteria |
|---|---|---|
| Skills | 25 pts | ≥7 skills = full score |
| Projects | 30 pts | Count + GitHub/Demo URL bonus |
| Certifications | 20 pts | Count + credibility score integration |
| Experience | 25 pts | Count + description completeness |
- Displays a circular progress ring with color-coded score.
- Provides **specific, actionable improvement suggestions** per category.

### 6. 🎓 Certificate Credibility Analysis
- Analyzes certificate issuer name and credential URL.
- Cross-references against a curated list of trusted providers (Coursera, Google, AWS, Microsoft, etc.).
- Returns a credibility score and explains which signals raised or lowered trust.

### 7. 📄 PDF Export & Resume Sharing
- One-click PDF download using `html2pdf.js` (scale: 2 for retina quality, letter format).
- Shareable resume link for public viewing.

### 8. 🔬 Research Papers Section
- Dedicated section for academic publications — unique feature not found in most resume builders.
- Fields: Paper Title, Authors, Journal/Conference, Publication Date, DOI/URL, Abstract.
- Targets academic job seekers, PhD applicants, and R&D role candidates.

### 9. 🗂 Multi-Resume Dashboard
- Manage multiple resumes from a single dashboard.
- Create, edit, view, download, and delete resumes.
- Each resume has an independent title and theme color.

---

## 🚀 Installation & Execution Steps

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local instance)
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/<your-github-username>/ai-resume-builder.git
cd ai-resume-builder
```

---

### Step 2 — Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-resume-builder
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```
> Backend will run on `http://localhost:5000`

---

### Step 3 — Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend/` directory:
```env
VITE_BASE_URL=http://localhost:5000
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> Get a free OpenRouter API key at [openrouter.ai](https://openrouter.ai)

Start the frontend development server:
```bash
npm run dev
```
> Frontend will run on `http://localhost:5173`

---

### Step 4 — Open the App

Open your browser and go to:
```
http://localhost:5173
```

Register a new account and start building your resume!

---

### Folder Structure
```
ai-resume-builder/
├── backend/
│   ├── controllers/       # Business logic (user, resume)
│   ├── middleware/        # JWT authentication middleware
│   ├── models/            # Mongoose schemas (User, Resume)
│   ├── routes/            # Express route definitions
│   └── server.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── redux/         # Redux slices (editResume, editUser)
│   │   ├── utils/         # AI session, content normalization
│   │   └── App.jsx        # Root component
│   └── index.html
└── README.md
```

---

## 👥 Team Members

| Name | Enrollment No. | Role |
|---|---|---|
| **Tanuj Deshmukh** | SC23CS302036 | Full-Stack Development, AI Integration, ATS Algorithm |
| **Rabjyot Singh Rajpal** | SC23CS302031 | Frontend Development, UI/UX, PDF Export |

---

## 📸 Screenshots & Output

### 1. Landing Page — Hero Section
AI-powered resume builder homepage with "Get Started" and "View on GitHub" CTAs.

![Landing Page Hero](./Screenshot/Screenshot%202026-05-29%20003804.png)

### 2. Landing Page — Feature Showcase
Animated mockup cards showing AI Generated, ATS Optimized, and Download PDF features.

![Landing Page Mockups](./Screenshot/Screenshot%202026-05-29%20003821.png)

### 3. Landing Page — Why Choose & How It Works
Feature highlights (AI-Powered Content, Lightning Fast, ATS Optimized) and 3-step process (Sign Up → Fill Details → Download & Share).

![Landing Page Features](./Screenshot/Screenshot%202026-05-29%20003836.png)

### 4. Landing Page — CTA Footer
"Ready to land your dream job?" call-to-action with Start Building Free button.

![Landing Page CTA](./Screenshot/Screenshot%202026-05-29%20003850.png)

### 5. Authentication — Sign In / Sign Up
Clean login and registration interface with secure JWT + bcrypt session management.

![Sign In Page](./Screenshot/Screenshot%202026-05-29%20003909.png)

### 6. Dashboard — Multi-Resume Management
User dashboard showing created resumes with View, Edit, and Delete options. Displays last edited date and Share resume shortcut.

![Dashboard](./Screenshot/Screenshot%202026-05-29%20003924.png)

### 7. Step 1 of 9 — Personal Details with Live Preview
9-step guided form with a real-time live preview panel on the right showing the fully populated resume as it builds.

![Personal Details](./Screenshot/Screenshot%202026-05-29%20003941.png)

### 8. Step 2 of 9 — Summary with AI Generation
User fills in job title, clicks "Generate from AI" — Claude AI returns a professional summary. 250-character limit enforced in real-time.

![Summary AI Generation](./Screenshot/Screenshot%202026-05-29%20003958.png)

### 9. Step 3 of 9 — Experience with AI-Generated Bullet Points
Position title, company, dates, and WYSIWYG editor with "Generate from AI" producing ATS-friendly action-verb bullet points.

![Experience Section](./Screenshot/Screenshot%202026-05-29%20004018.png)

### 10. Step 4 of 9 — Projects with GitHub & Demo URLs
Project name, tech stack, GitHub repository URL, live demo URL, and AI-generated project description bullets. GitHub/Demo URLs earn bonus ATS points.

![Projects Section](./Screenshot/Screenshot%202026-05-29%20004036.png)

### 11. Step 5 of 9 — Research Papers (Optional)
Dedicated section for academic publications — unique feature not found in most resume builders.

![Research Papers Section](./Screenshot/Screenshot%202026-05-29%20004048.png)

### 12. Step 6 of 9 — Education
University name, degree, major, dates, CGPA, and description — all reflected instantly in the live preview.

![Education Section](./Screenshot/Screenshot%202026-05-29%20004100.png)

### 13. Step 7 of 9 — Skills with Star Ratings
Add professional skills with proficiency ratings visualized as progress bars in the live resume preview.

![Skills Section](./Screenshot/Screenshot%202026-05-29%20004113.png)

### 14. Step 8 of 9 — Certifications with Credibility Analysis
Add certifications with issuer name and credential URL. "Analyze Credibility" button cross-references against trusted providers (Coursera, IBM, Google, AWS, etc.).

![Certifications with Credibility](./Screenshot/Screenshot%202026-05-29%20004126.png)

### 15. Step 9 of 9 — ATS Compatibility Score
Final ATS score (0–100) with circular progress ring, category breakdown (Skills: Good, Projects: Verified Excellent, Certifications: Needs Improvement, Experience: Included), and actionable "Areas to Improve" suggestions.

![ATS Score](./Screenshot/Screenshot%202026-05-29%20004146.png)

### 16. Resume Complete — Download PDF & Share
"Your Resume is Ready!" screen with one-click PDF download and shareable resume link generation.

![Resume Ready - Download & Share](./Screenshot/Screenshot%202026-05-29%20004204.png)

---

## 📁 Repository Contents

```
├── backend/               # Node.js + Express REST API
├── frontend/              # React 18 + Vite SPA
├── project-report/        # Full project report (PDF)
├── screenshots/           # Application screenshots
└── README.md              # This file
```

---

## 🔮 Future Scope

- Move OpenRouter API key to a secure backend proxy.
- Add LinkedIn profile import for auto-filling resume data.
- Implement job description matching to tailor resume content per role.
- Add rate limiting and Redis caching for AI endpoints.
- Server-side PDF generation using Puppeteer for higher fidelity.
- GitHub Actions CI/CD pipeline for automated deployment.

---

*Built with ❤️ as a Mini Project — AI Resume Builder helps students build job-winning resumes powered by AI.*
