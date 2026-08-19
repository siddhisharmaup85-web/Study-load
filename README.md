# 📚 Smart Study Load Balancer

> **An AI-based smart study planning platform that helps students balance academic workload, optimize study time, and prevent burnout.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript\&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Recharts](https://img.shields.io/badge/Recharts-Data%20Visualization-8884D8)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-Educational-lightgrey)](#license)

🌐 **Live Demo:** https://study-load-balancer.vercel.app/

📂 **Repository:** https://github.com/siddhisharmaup85-web/Study-load

---

## 📖 Overview

**Smart Study Load Balancer** is a modern web application designed to help students create a balanced and personalized study routine.

Instead of treating every subject equally, the application considers factors such as:

* 📌 Subject difficulty
* ⏱️ Required weekly study hours
* 📅 Upcoming deadlines
* 📈 Previous study performance
* 🧠 Productivity patterns
* 🕐 Preferred study hours
* ☕ Break requirements
* 🛌 Rest-day preferences

The system uses these factors to distribute study workload across the week and generate a structured study plan.

The project is designed for **high-school, college, and university students** who want to improve productivity while reducing academic overload and burnout.

---

## ✨ Key Features

### 🏠 Dashboard

The dashboard provides a quick overview of the student's study activity.

* Weekly study hours
* Study streak
* Subjects covered
* Productivity trends
* Goal completion
* Upcoming deadlines

---

### 📚 Subject Management

Students can manage their academic subjects from a centralized interface.

Each subject can contain:

* Subject name
* Difficulty level
* Weekly target hours
* Color identifier
* Upcoming exam or assignment deadline
* Subject history

Supported difficulty levels:

* 🟢 Easy
* 🟡 Medium
* 🔴 Hard

---

### ⏱️ Study Session Tracking

Students can record individual study sessions.

Each session can include:

* Subject
* Date and time
* Study duration
* Productivity rating
* Personal notes

This historical information can be used by the balancing logic to improve future study plans.

---

### 🤖 Smart Study Load Balancing

The core of the application is the **study load balancing algorithm**.

It considers:

1. Deadline urgency
2. Subject difficulty
3. Target study hours
4. Historical study consistency
5. Peak productivity periods
6. Session duration
7. Break requirements
8. Distribution of difficult subjects
9. Rest-day requirements

### Example balancing logic

```text
Deadline proximity
        ↓
Subject urgency
        ↓
Historical study patterns
        ↓
Productivity preferences
        ↓
Workload balancing
        ↓
Break/rest optimization
        ↓
Weekly Study Plan
```

The goal is to avoid concentrating too much workload on a single day while ensuring important subjects receive sufficient attention.

---

## 📅 Weekly Study Plan

The Weekly Plan provides a structured view of planned study sessions.

Features include:

* 7-day weekly view
* Morning / afternoon / evening slots
* Color-coded subjects
* Study session blocks
* AI recommendation indicators
* Schedule regeneration
* Rescheduling support

The planned architecture also supports calendar export through **ICS format**.

---

## 📊 Analytics Dashboard

The application provides visual insights into study behavior using charts.

Analytics include:

### Weekly Study Hours

Visualizes study time across the week.

### Subject Distribution

Shows how study time is divided between subjects.

### Productivity Trend

Tracks changes in self-reported productivity.

### Study Streak

Monitors consecutive study activity.

### Goal Completion

Shows progress toward weekly study targets.

Charts are implemented using **Recharts**.

---

## ⚙️ Settings & Preferences

Students can customize their study environment.

Available preferences include:

* Daily study-hour limit
* Preferred study periods
* Break duration
* Rest days
* Notification preferences
* Peak productivity hours

Settings are persisted locally so preferences remain available between sessions.

---

## 📱 Responsive Design

The application is designed to work across different screen sizes.

| Device      | Layout                   |
| ----------- | ------------------------ |
| 🖥️ Desktop | Full sidebar navigation  |
| 💻 Tablet   | Collapsible sidebar      |
| 📱 Mobile   | Mobile/bottom navigation |

Responsive breakpoints:

```text
Desktop  : > 1024px
Tablet   : 768px – 1024px
Mobile   : < 768px
```

---

## 🎨 UI / UX

The application follows a modern dark-themed interface.

### Color Palette

| Purpose        | Color     |
| -------------- | --------- |
| Background     | `#0D1117` |
| Surface        | `#161B22` |
| Surface Light  | `#21262D` |
| Primary        | `#00D9A5` |
| Secondary      | `#8B5CF6` |
| Accent         | `#F97316` |
| Primary Text   | `#E6EDF3` |
| Secondary Text | `#8B949E` |
| Success        | `#22C55E` |
| Warning        | `#EAB308` |
| Error          | `#EF4444` |

Typography uses:

* **Outfit** for headings
* **DM Sans** for body text

---

## 🛠️ Technology Stack

### Frontend

* React 18
* JavaScript / ES6+
* Vite
* CSS / CSS Variables

### Libraries

* **Recharts** — Data visualization
* **Lucide React** — Icons
* **date-fns** — Date manipulation

### State & Storage

* React Context
* `useReducer`
* Browser LocalStorage

The current implementation is designed around local storage for the demo and can later be extended with a backend API.

---

## 📂 Project Structure

```text
Study-load/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.module.css
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   └── StatsCard.module.css
│   │   │
│   │   ├── Subjects/
│   │   │   ├── SubjectCard.jsx
│   │   │   └── SubjectForm.jsx
│   │   │
│   │   ├── Sessions/
│   │   │   ├── SessionForm.jsx
│   │   │   └── SessionList.jsx
│   │   │
│   │   ├── WeeklyPlan/
│   │   │   ├── CalendarGrid.jsx
│   │   │   └── TimeSlot.jsx
│   │   │
│   │   └── Settings/
│   │       └── SettingsForm.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Subjects.jsx
│   │   ├── Sessions.jsx
│   │   ├── WeeklyPlan.jsx
│   │   └── Settings.jsx
│   │
│   ├── context/
│   │   └── StudyContext.jsx
│   │
│   ├── utils/
│   │   ├── aiBalancer.js
│   │   ├── storage.js
│   │   └── dateHelpers.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── Spec.md
├── TODO.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git

Verify your installation:

```bash
node --version
npm --version
git --version
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/siddhisharmaup85-web/Study-load.git
```

Navigate into the project:

```bash
cd Study-load
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Application

Start the Vite development server:

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

Open the URL in your browser.

---

## 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The available npm scripts are defined in the project's `package.json`.

---

## 💾 Data Storage

The current version uses **browser LocalStorage** for demo data persistence.

### Subject

```javascript
{
  id,
  name,
  color,
  difficulty,
  targetHours,
  deadline,
  createdAt
}
```

### Study Session

```javascript
{
  id,
  subjectId,
  date,
  duration,
  productivity,
  notes
}
```

### Settings

```javascript
{
  dailyLimit,
  peakHours,
  breakDuration,
  restDays
}
```

### Weekly Plan

```javascript
{
  id,
  weekStart,
  sessions: []
}
```

The storage layer can later be replaced or extended with a backend database/API.

---

## 🧠 Study Load Balancing Logic

The balancing system follows a multi-factor approach.

### 1. Calculate urgency

Subjects with approaching deadlines receive a higher priority.

### 2. Consider difficulty

More difficult subjects receive additional attention.

### 3. Analyze study history

Previous study sessions and productivity ratings help identify study patterns.

### 4. Consider peak productivity

The system can prioritize preferred productivity periods.

### 5. Balance daily workload

The algorithm attempts to avoid excessive concentration of difficult subjects.

### 6. Add breaks

Minimum break periods are maintained between study sessions.

### 7. Distribute workload

Required study hours are distributed across the available week.

```text
Subjects
   │
   ├── Difficulty
   ├── Target Hours
   ├── Deadline
   └── Study History
          │
          ▼
   Priority Calculation
          │
          ▼
   Workload Balancing
          │
          ▼
   Time Allocation
          │
          ▼
   Break Optimization
          │
          ▼
   📅 Weekly Study Plan
```

---

## 🔮 Future Enhancements

Potential improvements include:

* [ ] Backend API integration
* [ ] User authentication
* [ ] Cloud database synchronization
* [ ] AI/ML-based workload prediction
* [ ] Automatic productivity pattern detection
* [ ] Calendar integration
* [ ] ICS calendar export
* [ ] Push notifications
* [ ] Email reminders
* [ ] Mobile application
* [ ] Bulk session import
* [ ] Advanced performance analytics
* [ ] Personalized burnout-risk detection
* [ ] AI-generated study recommendations

---

## 🧪 Development & Testing

Before submitting changes, verify:

```bash
npm run build
```

Also check that:

* No console errors are present
* Subject CRUD operations work
* Study sessions can be logged
* Weekly plans generate correctly
* Analytics update with data changes
* Settings persist after refresh
* Mobile navigation works correctly

The project specification defines performance goals including fast page loading, smooth animations, and reliable LocalStorage operations.

---

## 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork https://github.com/siddhisharmaup85-web/Study-load
```

### 2. Clone your fork

```bash
git clone <your-fork-url>
cd Study-load
```

### 3. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 4. Make your changes

Follow the existing project structure and coding conventions.

### 5. Test the application

```bash
npm run build
```

### 6. Commit your changes

```bash
git add .
git commit -m "feat: add your feature"
```

### 7. Push the branch

```bash
git push origin feature/your-feature
```

### 8. Open a Pull Request

Describe:

* What was changed
* Why it was changed
* How it was tested
* Any future considerations

---

## 📄 Project Documentation

Additional project documentation is available in:

* `Spec.md` — Complete application specification
* `TODO.md` — Development tasks and progress
* `CHECKPOINT-ABOUT-PAGE.md` — About-page implementation notes
* `TODO-ABOUT-CREATORS.md` — Creator/about-page tasks

The repository currently contains these supporting documents alongside the React application source.

---

## 👥 Contributors

This project was developed as a collaborative academic/software project.

### Contributors

* **Siddhi Sharma**
* **Project Team**

---

## 🎓 Project Purpose

Smart Study Load Balancer demonstrates how modern web technologies can be combined with intelligent workload-planning concepts to address a common student problem:

> **How can students study consistently without overloading themselves?**

Rather than simply creating a timetable, the project focuses on **adaptive workload distribution**, taking deadlines, difficulty, study history, productivity, breaks, and rest into account.

---

## 📜 License

This project is intended primarily for **educational and academic purposes**.

If you reuse or extend this project, please provide appropriate attribution to the original contributors.

---

## ⭐ Support the Project

If you find this project useful:

⭐ Star the repository
🍴 Fork it
🐛 Report issues
💡 Suggest improvements
🤝 Contribute enhancements

---

## 🔗 Links

* 🌐 **Live Application:** https://study-load-balancer.vercel.app/
* 💻 **GitHub Repository:** https://github.com/siddhisharmaup85-web/Study-load

---

### Made with ❤️ for smarter and healthier studying.
