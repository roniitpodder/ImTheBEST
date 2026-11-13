# ImTheBEST — Personal FAANG Engineering OS

> **"252 Days. 3 Hours a Day. One Goal: Become Exceptional."**

**ImTheBEST** is a complete, responsive, Apple-inspired personal learning management system (LMS), coding tracker, project manager, revision platform, and career preparation dashboard designed for aspiring Software Engineers and Backend Engineers targeting top-tier product tech companies (Apple, Google, Microsoft, Amazon, Meta).

---

## 🚀 Key Features

1. **Apple-Inspired Executive Dashboard**
   - Live welcome banner with dynamic roadmap day, month, and date.
   - 7 interactive metrics: Overall Roadmap completion, DSA progress, Backend units cleared, study streak, total hours invested, and remaining days.
   - **Today's Focus**: Daily 3-hour breakdown (75m DSA + 90m Backend + 15m Revision/Git).
   - Rotating motivational statements.
   - **252-Day Contribution Heatmap**: Full GitHub-style activity matrix tracking daily intensity.

2. **Complete 252-Day Structured Roadmap**
   - 9 monthly sections with 4 weekly subdivisions each.
   - **All 252 days individually and meaningfully defined** with realistic workloads:
     - Month 1: Java Fundamentals + DSA Foundations (Console Banking Engine)
     - Month 2: Intermediate DSA + Spring Boot Fundamentals (Task REST API)
     - Month 3: Advanced DSA + PostgreSQL & JPA (Inventory Service)
     - Month 4: Graphs + Backend Security & Testing (E-Commerce JWT Backend)
     - Month 5: Dynamic Programming + Redis & Kafka (Event-Driven Microservice)
     - Month 6: DevOps, Docker, AWS Cloud & CI/CD (Cloud Deployment)
     - Month 7: System Design & Distributed Scalability (Flash Sale Architecture)
     - Month 8: Advanced Resilience & Major Capstone (Distributed Payment Gateway)
     - Month 9: FAANG Interview Drills, CS Fundamentals & Career Sprint
   - Expandable daily cards with completion tracking, personal notes, and resource links.

3. **DSA Problem Tracker**
   - Filter by Topic, Difficulty (Easy, Medium, Hard), and Status (Not Started, Attempted, Solved, Revised).
   - Time and space complexity annotations, LeetCode direct links, and solution notes.
   - Full CRUD capability to add, edit, or delete problems.

4. **Backend Engineering Tracker**
   - 8 deep-dive modules (Java 21, Spring Boot 3, PostgreSQL, Spring Security 6, Redis, Kafka, System Design, Observability).
   - Lesson checkboxes, duration metrics, and documentation links.

5. **Projects Manager**
   - 7 production backend projects with milestones, tech stack tags, status tracking, GitHub repo links, and live cloud URLs.
   - Interactive milestone checklist with real-time percentage progress.
   - Custom project creation modal.

6. **Technical Knowledge Base & Notes**
   - Categorized markdown-ready notes (Java, DSA, Spring Boot, SQL, DBMS, OS, Networks, System Design).
   - Searchable, pin-to-top feature, and copy-to-clipboard functionality.

7. **Weekly Assessments & Diagnostics**
   - Technical MCQ quizzes every 7 days with immediate grading, explanations, and practical coding challenge prompts.

8. **Monthly Analytics**
   - Real calculated metrics: study hours, consistency streak, topic mastery bars, and 9-month progression charts.

9. **Multi-User Auth, Cloud Sync & Portability**
   - **Firebase Authentication (Google Sign-In)** + per-user **Cloud Firestore** storage so multiple users each have their own private workspace starting at **0%**.
   - **JSON Export / Import**: Download your full data backup or import into your account on any device.
   - Reset progress option with confirmation modal.
   - Dark mode & Light mode toggle with glassmorphic cards and responsive mobile drawer navigation.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure Firebase Auth + Cloud Firestore
# Without .env credentials, ImTheBEST automatically runs in Local Workspace Mode
# with browser-isolated localStorage persistence per profile.
cp .env.example .env

# 3. Start Vite development server
npm run dev
```

Visit `http://localhost:3000` to view the app.

---

## 🌐 Free Deployment to GitHub Pages

1. Ensure `firebase-applet-config.json` and `.env` are **not** committed to Git (both are listed in `.gitignore`). If `firebase-applet-config.json` was previously committed, remove it from Git tracking before pushing:
   ```bash
   git rm --cached firebase-applet-config.json
   git commit -m "chore: untrack local firebase config"
   ```
2. In your GitHub repository, go to **Settings → Secrets and variables → Actions → New repository secret** and add the 7 secrets listed in `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_ID`
3. Push your code to `main` so `.github/workflows/main.yml` injects those secrets at build time and deploys `./dist` to GitHub Pages.
4. **Important for Google Sign-In on GitHub Pages**:
   - Open the [Firebase Console](https://console.firebase.google.com/) for your Firebase project.
   - Go to **Authentication → Settings → Authorized domains**.
   - Click **Add domain** and enter `<your-username>.github.io`.
   - Once added, every user visiting your live GitHub Pages URL can sign in with Google and save their personal 0%–100% progress.


