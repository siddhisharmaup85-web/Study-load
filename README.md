# 📚 Smart Study Load Balancer

> **An intelligent study planning application that helps students balance academic workload, prioritize deadlines, and build sustainable study habits.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript\&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Recharts](https://img.shields.io/badge/Recharts-Data%20Visualization-8884D8)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live Demo:** [study-load-eight.vercel.app](https://study-load-eight.vercel.app/)

**Repository:** [github.com/nishchaygaur/STUDY-LOAD](https://github.com/nishchaygaur/STUDY-LOAD)

---

## 🎯 Overview

**Smart Study Load Balancer** is a web-based study management application designed to help students organize their academic workload and create balanced weekly study schedules.

Instead of treating every subject equally, the application considers factors such as:

* 📌 Subject difficulty
* ⏰ Upcoming deadlines
* 📊 Previous study performance
* 🎯 Weekly study-hour targets
* 🧠 Productivity patterns
* ☕ Break requirements
* 🛌 Rest-day preferences

The goal is to transform scattered academic tasks into a structured and manageable study plan while reducing the risk of overloading the student.

---

## ✨ Key Features

### 📊 Dashboard

Get a quick overview of your current study workload and progress.

* Weekly study statistics
* Study streak tracking
* Weekly hours completed
* Subjects covered
* Productivity trends
* Upcoming deadlines

### 📚 Subject Management

Manage all your subjects from one place.

* Add new subjects
* Set difficulty levels
* Define weekly study-hour targets
* Add upcoming exams and assignment deadlines
* Assign subject colors
* Edit and delete subjects
* View subject-related history

### ⏱️ Study Session Tracking

Record your study sessions and track productivity.

Each session can include:

* Subject
* Date and time
* Duration
* Productivity rating
* Personal notes

This historical data can be used to understand study patterns and improve future scheduling.

### 🧠 Smart Study Load Balancing

The core scheduling logic considers multiple factors when distributing study time.

The balancing process considers:

1. Deadline urgency
2. Subject difficulty
3. Target weekly hours
4. Previous study consistency
5. Peak productivity periods
6. Session duration
7. Break requirements
8. Workload distribution
9. Rest-day preferences

The objective is to create a schedule that is productive without unnecessarily concentrating difficult subjects or study sessions.

### 📅 Weekly Study Plan

Generate and visualize a structured weekly schedule.

* 7-day calendar view
* Morning, afternoon, and evening sessions
* Color-coded subjects
* Recommended study blocks
* Workload distribution
* Schedule regeneration

### 📈 Analytics

Visualize study performance over time using interactive charts.

Includes:

* Weekly study-hour trends
* Subject distribution
* Productivity trends
* Goal completion
* Study streaks

### ⚙️ Personalization

Customize the planner according to individual study habits.

Settings include:

* Daily study-hour limits
* Preferred study periods
* Break duration
* Rest days
* Productivity preferences
* Notification preferences

### 📱 Responsive Design

The application is designed to work across:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

The interface adapts its navigation and layout according to screen size.

---

## 🖥️ Application Structure

```text
Smart Study Load Balancer
│
├── Dashboard
│   ├── Study Statistics
│   ├── Upcoming Deadlines
│   ├── Study Streak
│   └── Productivity Overview
│
├── Subjects
│   ├── Add Subject
│   ├── Edit Subject
│   └── Subject History
│
├── Study Sessions
│   ├── Log Session
│   ├── Productivity Rating
│   └── Session History
│
├── Weekly Plan
│   ├── Study Calendar
│   ├── Workload Distribution
│   └── Study Recommendations
│
└── Settings
    ├── Study Limits
    ├── Peak Hours
    ├── Break Preferences
    └── Rest Days
```

---

## 🧠 How the Study Balancer Works

The scheduling logic follows a simplified workload-balancing approach.

```text
Student Data
     │
     ├── Subjects
     ├── Difficulty
     ├── Target Hours
     ├── Deadlines
     ├── Study History
     └── Productivity Patterns
              │
              ▼
       Calculate Urgency
              │
              ▼
     Analyze Study Patterns
              │
              ▼
       Balance Workload
              │
              ▼
    Allocate Study Sessions
              │
              ▼
       Weekly Study Plan
```

### Scheduling considerations

**Deadline proximity**

Subjects with approaching deadlines receive higher priority.

**Difficulty**

Difficult subjects can receive more strategic placement during productive periods.

**Study history**

Previous study sessions can help identify consistency and productivity patterns.

**Workload balancing**

The planner attempts to prevent excessive concentration of demanding subjects on the same day.

**Break management**

Study sessions are separated using configurable break periods.

**Rest**

The planner can reserve rest periods to help maintain a sustainable workload.

---

## 🛠️ Tech Stack

| Technology              | Purpose                       |
| ----------------------- | ----------------------------- |
| **React 18**            | Frontend application          |
| **Vite**                | Development and build tooling |
| **JavaScript**          | Application logic             |
| **CSS / CSS Variables** | Styling and responsive UI     |
| **React Context**       | Application state             |
| **useReducer**          | State management              |
| **Recharts**            | Data visualization            |
| **Lucide React**        | UI icons                      |
| **date-fns**            | Date and time handling        |
| **LocalStorage**        | Client-side persistence       |
| **Vercel**              | Deployment                    |

The repository's package configuration currently uses React 18, Vite, Recharts, Lucide React, and date-fns.

---

## 📁 Project Structure

```text
STUDY-LOAD/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   └── StatsCard.jsx
│   │   │
│   │   ├── Subjects/
│   │   │   ├── SubjectCard.jsx
│   │   │   └── SubjectForm.jsx
│   │   │
│   │   ├── Sessions/
│   │   │   ├── SessionForm.jsx
│   │   │   └── SessionList.jsx
│   │   │
│   │   └── WeeklyPlan/
│   │       ├── CalendarGrid.jsx
│   │       └── TimeSlot.jsx
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
├── SPEC.md
├── TODO.md
└── README.md
```

The repository currently contains the React/Vite source structure, specification, TODO tracking, and Vercel deployment configuration.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/) 18+
* npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/nishchaygaur/STUDY-LOAD.git
```

### 2. Navigate into the project

```bash
cd STUDY-LOAD
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

---

## 📦 Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

These scripts are defined in the project's current `package.json`.

---

## 💾 Data Storage

The current application uses **browser LocalStorage** for demo data persistence.

The primary data models include:

```text
Subject
├── id
├── name
├── color
├── difficulty
├── targetHours
├── deadline
└── createdAt
```

```text
Session
├── id
├── subjectId
├── date
├── duration
├── productivity
└── notes
```

```text
Settings
├── dailyLimit
├── peakHours
├── breakDuration
└── restDays
```

```text
WeeklyPlan
├── id
├── weekStart
└── sessions[]
```

The project specification defines LocalStorage as the current demo storage layer, with the architecture allowing future expansion toward a backend API.

---

## 🎨 Design System

The application follows a dark, modern productivity-dashboard design.

### Primary Colors

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

The design specification defines the application's dark theme, teal/purple accent palette, responsive breakpoints, and component styling.

---

## 📱 Responsive Breakpoints

```text
Desktop
> 1024px
└── Full sidebar navigation

Tablet
768px – 1024px
└── Collapsible sidebar

Mobile
< 768px
└── Mobile navigation
```

---

## 🔮 Future Improvements

Potential future enhancements include:

* 🤖 More advanced personalized scheduling
* 📥 Bulk study-session import
* ☁️ Backend synchronization
* 🔐 User authentication
* 📅 Calendar integration
* 📤 ICS calendar export
* 🔔 Study reminders and notifications
* 📊 More advanced learning analytics
* 🧠 Adaptive workload recommendations
* 📱 Progressive Web App support

---

## 🗺️ Project Status

The project is currently an actively developed study-planning application.

### Current focus

* Responsive UI
* Study management
* Session tracking
* Weekly planning
* Analytics
* Local data persistence

Development tasks and progress are tracked in [`TODO.md`](TODO.md).

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### Contribution workflow

```bash
# Fork the repository

# Clone your fork
git clone https://github.com/YOUR-USERNAME/STUDY-LOAD.git

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes

# Commit
git add .
git commit -m "Add: your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request.

---

## 📄 License

This project is intended for educational and portfolio purposes.

If you add a formal open-source license, update this section and include the corresponding `LICENSE` file in the repository.

---

## 👨‍💻 Author

### Nishchay Gaur

**B.Tech Computer Science — Cybersecurity & Forensics**

Interested in:

* Cybersecurity
* Software Development
* AI-powered applications
* Data Analytics
* Full-Stack Development

### Connect

* **GitHub:** [@nishchaygaur](https://github.com/nishchaygaur)
* **Project:** [STUDY-LOAD](https://github.com/nishchaygaur/STUDY-LOAD)
* **Live Demo:** [Study Load Balancer](https://study-load-eight.vercel.app/)

---

<div align="center">

### 📚 Study smarter. Balance better. Learn sustainably.

**Built with React + Vite**

⭐ If you find this project useful, consider giving it a star!

</div>
