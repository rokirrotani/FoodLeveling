<div align="center">

```
███████╗ ██████╗  ██████╗ ██████╗     ██╗     ███████╗██╗   ██╗███████╗██╗     ██╗███╗   ██╗ ██████╗ 
██╔════╝██╔═══██╗██╔═══██╗██╔══██╗    ██║     ██╔════╝██║   ██║██╔════╝██║     ██║████╗  ██║██╔════╝ 
█████╗  ██║   ██║██║   ██║██║  ██║    ██║     █████╗  ██║   ██║█████╗  ██║     ██║██╔██╗ ██║██║  ███╗
██╔══╝  ██║   ██║██║   ██║██║  ██║    ██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║██║╚██╗██║██║   ██║
██║     ╚██████╔╝╚██████╔╝██████╔╝    ███████╗███████╗ ╚████╔╝ ███████╗███████╗██║██║ ╚████║╚██████╔╝
╚═╝      ╚═════╝  ╚═════╝ ╚═════╝     ╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
```

# ⚔️ FoodLeveling — Track Food. Train Hard. Level Up.

> *"A real hunter doesn't skip leg day. Or lunch."*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://github.com/WiseLibs/better-sqlite3)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)](LICENSE)

</div>

---

## 🧬 Overview

**FoodLeveling** is a full-stack fitness tracking application built with a Solo Leveling RPG aesthetic. Log meals, track workouts, earn XP, climb ranks, and unlock achievements — all while staying on top of your calorie goals.

No cloud. No subscription. No bullshit. Just you, your data, and a local SQLite database.

---

## ✨ Features

### 🍽️ Food Diary
- Log meals across **4 categories**: Breakfast, Lunch, Dinner, Snack
- Track **Calories, Protein, Carbs, Fats** per entry
- Quick-add with pre-built food templates (pasta, chicken, banana, ...)
- Delete and manage individual food entries per day
- Set daily **calorie goals** and record body weight per day

### 💪 Workout Tracker
- Log workouts with **type, duration, intensity**
- Auto-estimate calories burned from workout type (running = 8 kcal/min, cycling = 6, yoga = 3...)
- Override calorie estimate with custom values
- Quick-add templates: Corsa, Palestra, Calcio, Nuoto, Yoga...

### 📊 Progress & Analytics
- **Weight history** chart (line chart over time)
- **Daily calories in vs. burned** bar chart with goal reference line
- Configurable time window: 7 / 14 / 30 / 90 days
- Average calorie intake, total days logged, total workouts

### ⚔️ RPG Gamification System
- **XP system**: Earn points every day for logging meals, workouts, hitting your goal
- **Streak bonuses**: 3-day (+10 XP) and 7-day (+30 XP) active streaks rewarded
- **Level & Rank progression** from E-Rank Hunter all the way to S-Rank Hunter
- **8 unlockable achievements** with real-time automatic detection:

| Achievement | Trigger |
|---|---|
| 🌟 First Steps | Log your first day |
| 🍽️ Nutritional Awareness | Log your first meal |
| 💪 Body Awakening | Log your first workout |
| 🔥 Forming a Habit | 3-day streak |
| ⚡ Hunter Discipline | 7-day streak |
| 👑 Shadow Monarch of Consistency | 30-day streak |
| 🛡️ Iron Body | 10 workouts total |
| ⚔️ Cutting Mode | 5 days under calorie goal |

### 📅 History
- Browse all past days in a timeline
- Per-day breakdown: calories in/out, net calories, XP earned, mood
- Weight logged per day at a glance

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 19 + TypeScript | Type-safe reactive UI |
| **Routing** | React Router v7 | Client-side SPA routing |
| **Charts** | Recharts v3 | Composable, SVG-based charts |
| **HTTP Client** | Axios | Clean API layer with typed responses |
| **Styling** | Custom CSS + dark theme | Zero framework bloat, full control |
| **Build** | Vite 8 | Instant HMR, fast production builds |
| **Backend** | Express 5 + TypeScript | Modern async-first API framework |
| **Database** | better-sqlite3 | Synchronous SQLite — zero-latency, zero-config |
| **Date utils** | Day.js | Lightweight Moment.js alternative |
| **Runtime** | tsx / Node.js | TypeScript-native execution in dev |

---

## 🗂️ Project Structure

```
FoodLeveling/
├── backend/
│   └── src/
│       ├── app.ts                  # Express app configuration + middleware
│       ├── server.ts               # Entry point
│       ├── db/
│       │   ├── database.ts         # better-sqlite3 connection (WAL mode enabled)
│       │   └── init.ts             # Schema creation + achievement seeding
│       ├── routes/
│       │   ├── days.routes.ts      # Full CRUD for daily logs
│       │   ├── foods.routes.ts     # Food entries with strict input validation
│       │   ├── workouts.routes.ts  # Workout endpoints + calorie estimator route
│       │   └── progress.routes.ts  # Stats, chart data, streak, level info
│       └── services/
│           ├── day.service.ts      # Daily log logic, XP calculation, streak algorithm
│           ├── food.service.ts     # Food entry CRUD
│           ├── workout.service.ts  # Workout CRUD + calorie estimation by type
│           └── progress.service.ts # Summaries, achievement unlocking, history
└── frontend/
    └── src/
        ├── App.tsx                 # BrowserRouter + route definitions
        ├── pages/
        │   ├── DashboardPage.tsx   # Main HUD: stats, XP bar, quick actions
        │   ├── FoodDiaryPage.tsx   # Food log by day + day settings panel
        │   ├── WorkoutPage.tsx     # Workout log per day
        │   ├── ProgressPage.tsx    # Charts, achievements, global stats
        │   └── HistoryPage.tsx     # All past days timeline
        ├── components/
        │   ├── XPBar.tsx           # Animated XP/Level progress bar with rank title
        │   ├── AchievementCard.tsx # Achievement with locked/unlocked visual state
        │   ├── StatCard.tsx        # Reusable colored metric card
        │   ├── FoodForm.tsx        # Add-food form with quick-fill buttons
        │   ├── WorkoutForm.tsx     # Add-workout form with quick-fill buttons
        │   └── Navbar.tsx          # Responsive navigation sidebar
        ├── services/
        │   └── api.ts              # Fully typed Axios API client for all endpoints
        └── types/
            └── index.ts            # Shared TS interfaces + MEAL_LABELS, QUICK_FOODS constants
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v8+

### 1. Clone & Install

```bash
git clone https://github.com/youruser/FoodLeveling.git
cd FoodLeveling

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start the Backend

```bash
cd backend
npm run dev
# ✅ Database initialized
# 🚀 FoodLeveling backend running on http://localhost:3001
```

The database is created automatically at `backend/data/fitness.db` on first run.

### 3. Start the Frontend

```bash
cd frontend
npm run dev
# → App running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and start your hunter journey.

---

## 🔌 API Reference

**Base URL:** `http://localhost:3001/api`

### Days

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/days` | Get all logged days |
| `GET` | `/days/:date` | Get (or auto-create) a day by date |
| `POST` | `/days` | Create a day `{ date }` |
| `PUT` | `/days/:date` | Update day `{ weight, calorie_goal, notes, mood }` |
| `DELETE` | `/days/:date` | Delete a day — cascades food & workouts |

### Foods

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/foods/:date` | Get all food entries for a date |
| `POST` | `/foods` | Add food entry `{ date, meal_type, food_name, calories, ... }` |
| `PUT` | `/foods/:id` | Update food entry fields |
| `DELETE` | `/foods/:id` | Delete food entry |

### Workouts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/workouts/:date` | Get all workouts for a date |
| `POST` | `/workouts` | Add workout (auto-estimates calories if not provided) |
| `GET` | `/workouts/estimate/:type/:minutes` | Preview calorie estimate |
| `PUT` | `/workouts/:id` | Update workout |
| `DELETE` | `/workouts/:id` | Delete workout |

### Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/progress/summary` | Full stats: XP, level, streak, achievements |
| `GET` | `/progress/weight-history?days=30` | Weight data points for charting |
| `GET` | `/progress/calories-history?days=30` | Daily calorie in/out/net breakdown |
| `GET` | `/progress/streak` | Current streak & longest streak |
| `GET` | `/progress/level` | Level, XP progress, XP for next level |

### Health Check

```bash
GET /api/health
# → { "status": "ok", "timestamp": "2026-03-25T15:35:17.602Z" }
```

---

## 🧠 Architecture & Design Decisions

### Synchronous SQLite (`better-sqlite3`)
SQLite with a synchronous API is the perfect fit for a single-user local application. No connection pool management, no async overhead, no ORM abstraction layer. Every query is a direct function call. Mean query time: < 1ms.

### Express 5
Express 5 propagates async errors natively. Combined with TypeScript route types, every handler is clean and predictable without `try/catch` wrappers everywhere.

### No ORM
Raw parameterized SQL with TypeScript type casting keeps queries transparent, fast, and completely in your control. No magic, no hidden N+1 queries.

### Streak Algorithm
Days with at least one food entry, workout, or recorded weight are considered "active". They are fetched ordered descending and walked sequentially — if consecutive days differ by exactly 1 calendar day, the streak counter increments. Lightweight and runs in < 5ms even at scale.

### XP Formula

```
Daily XP = 10 (base)
         + 10  if any meal logged
         + 15  if any workout logged
         + 20  if calories_in ≤ calorie_goal (and > 0)
         + 10  streak bonus if streak ≥ 3 days
         + 30  streak bonus if streak ≥ 7 days

Total XP = Σ(daily XP across all days)
Level    = ⌊Total XP / 100⌋ + 1
```

### Rank System

| Level Range | Rank |
|---|---|
| 1 – 4 | E-Rank Hunter |
| 5 – 9 | D-Rank Hunter |
| 10 – 19 | C-Rank Hunter |
| 20 – 34 | B-Rank Hunter |
| 35 – 49 | A-Rank Hunter |
| 50+ | **S-Rank Hunter** |

---

## 🔒 Security

- **Input validation** on every POST/PUT endpoint: date format regex, enum checks for meal type and intensity, non-negative number enforcement
- **Parameterized SQL queries** everywhere — zero risk of SQL injection
- **CORS** restricted to `http://localhost:5173` only
- **SQLite foreign keys** enforced at pragma level with CASCADE delete
- **WAL mode** enabled for safe concurrent read access

---

## 📦 Scripts

### Backend
```bash
npm run dev      # Start with tsx watch (hot reload in development)
npm run build    # Compile TypeScript → dist/
npm run start    # Run compiled production build
```

### Frontend
```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # TypeScript check + optimised production bundle
npm run lint     # ESLint with react-hooks rules
npm run preview  # Serve the production build locally
```

---

## 🛣️ Roadmap

- [ ] Barcode scanner for food entries
- [ ] Macro pie chart per meal type
- [ ] Export all data to CSV / JSON
- [ ] Custom achievement definitions
- [ ] Weekly auto-summary report
- [ ] PWA support with offline mode
- [ ] Dark / light theme toggle

---

## 👤 Author

Built with 🔥 obsessive attention to type safety and zero-dependency philosophy.

> *"Every calorie tracked. Every rep logged. Every level earned."*

---

<div align="center">
<sub>Crafted with TypeScript · React · Express · SQLite · pure Hunter discipline</sub>
</div>
