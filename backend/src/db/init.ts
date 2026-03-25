import db from "./database";

export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      weight REAL,
      calorie_goal INTEGER DEFAULT 2000,
      notes TEXT,
      mood TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_log_id INTEGER NOT NULL,
      meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast','lunch','dinner','snack')),
      food_name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL DEFAULT 0,
      carbs REAL DEFAULT 0,
      fats REAL DEFAULT 0,
      quantity TEXT,
      time TEXT,
      FOREIGN KEY (daily_log_id) REFERENCES daily_logs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_log_id INTEGER NOT NULL,
      workout_type TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      calories_burned INTEGER DEFAULT 0,
      intensity TEXT CHECK(intensity IN ('low','medium','high')),
      notes TEXT,
      FOREIGN KEY (daily_log_id) REFERENCES daily_logs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      unlocked_at TEXT
    );

    INSERT OR IGNORE INTO achievements (code, title, description) VALUES
      ('first_day',     'First Steps',              'Registered your first day'),
      ('streak_3',      'Forming a Habit',           '3 days streak'),
      ('streak_7',      'Hunter Discipline',         '7 days streak'),
      ('streak_30',     'Shadow Monarch of Consistency', '30 days streak'),
      ('first_workout', 'Body Awakening',            'Logged your first workout'),
      ('workouts_10',   'Iron Body',                 '10 workouts logged'),
      ('under_goal_5',  'Cutting Mode',              '5 days under calorie goal'),
      ('first_food',    'Nutritional Awareness',     'Logged your first meal');
  `);

  console.log("✅ Database initialized");
}
