import db from "../db/database";
import dayjs from "dayjs";

export interface DailyLog {
  id: number;
  date: string;
  weight?: number;
  calorie_goal: number;
  notes?: string;
  mood?: string;
  created_at: string;
}

export interface DailyLogWithTotals extends DailyLog {
  total_calories_in: number;
  total_calories_burned: number;
  net_calories: number;
  xp: number;
}

function calculateXP(log: DailyLogWithTotals, streak: number): number {
  let xp = 10; // base for logging the day
  if (log.total_calories_in > 0) xp += 10;
  if (log.total_calories_burned > 0) xp += 15;
  const goal = log.calorie_goal ?? 2000;
  if (log.total_calories_in > 0 && log.total_calories_in <= goal) xp += 20;
  if (streak >= 7) xp += 30;
  else if (streak >= 3) xp += 10;
  return xp;
}

export function findOrCreateDay(date: string): DailyLog {
  const existing = db
    .prepare("SELECT * FROM daily_logs WHERE date = ?")
    .get(date) as DailyLog | undefined;
  if (existing) return existing;

  const result = db
    .prepare("INSERT INTO daily_logs (date, calorie_goal) VALUES (?, 2000)")
    .run(date);
  return db
    .prepare("SELECT * FROM daily_logs WHERE id = ?")
    .get(result.lastInsertRowid) as DailyLog;
}

export function getDayByDate(date: string): DailyLogWithTotals | undefined {
  const log = db
    .prepare("SELECT * FROM daily_logs WHERE date = ?")
    .get(date) as DailyLog | undefined;
  if (!log) return undefined;
  return enrichLog(log);
}

export function getAllDays(): DailyLogWithTotals[] {
  const logs = db
    .prepare("SELECT * FROM daily_logs ORDER BY date DESC")
    .all() as DailyLog[];
  return logs.map((l) => enrichLog(l));
}

function enrichLog(log: DailyLog): DailyLogWithTotals {
  const caloriesIn =
    (
      db
        .prepare(
          "SELECT COALESCE(SUM(calories),0) as total FROM food_entries WHERE daily_log_id = ?"
        )
        .get(log.id) as { total: number }
    ).total ?? 0;

  const caloriesBurned =
    (
      db
        .prepare(
          "SELECT COALESCE(SUM(calories_burned),0) as total FROM workouts WHERE daily_log_id = ?"
        )
        .get(log.id) as { total: number }
    ).total ?? 0;

  const enriched: DailyLogWithTotals = {
    ...log,
    total_calories_in: caloriesIn,
    total_calories_burned: caloriesBurned,
    net_calories: caloriesIn - caloriesBurned,
    xp: 0,
  };

  const streak = getStreak();
  enriched.xp = calculateXP(enriched, streak.streak);
  return enriched;
}

export function updateDay(
  date: string,
  data: Partial<Pick<DailyLog, "weight" | "calorie_goal" | "notes" | "mood">>
): DailyLogWithTotals {
  findOrCreateDay(date);
  const fields = Object.keys(data)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = [...Object.values(data), date];
  db.prepare(`UPDATE daily_logs SET ${fields} WHERE date = ?`).run(...values);
  return getDayByDate(date)!;
}

export function deleteDay(date: string): void {
  db.prepare("DELETE FROM daily_logs WHERE date = ?").run(date);
}

export interface StreakResult {
  streak: number;
  longestStreak: number;
}

export function getStreak(): StreakResult {
  const logs = db
    .prepare(
      `SELECT d.date FROM daily_logs d
       WHERE EXISTS (SELECT 1 FROM food_entries f WHERE f.daily_log_id = d.id)
          OR EXISTS (SELECT 1 FROM workouts w WHERE w.daily_log_id = d.id)
          OR d.weight IS NOT NULL
       ORDER BY d.date DESC`
    )
    .all() as { date: string }[];

  if (logs.length === 0) return { streak: 0, longestStreak: 0 };

  let streak = 0;
  let longestStreak = 0;
  let current = 1;
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const first = logs[0].date;
  if (first !== today && first !== yesterday) return { streak: 0, longestStreak: 1 };

  streak = 1;
  for (let i = 1; i < logs.length; i++) {
    const prev = dayjs(logs[i - 1].date);
    const curr = dayjs(logs[i].date);
    if (prev.diff(curr, "day") === 1) {
      streak++;
      current++;
    } else {
      longestStreak = Math.max(longestStreak, current);
      current = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak, current);
  return { streak, longestStreak };
}

export function getLevelInfo(): {
  totalXP: number;
  level: number;
  xpForNextLevel: number;
  xpProgress: number;
} {
  const logs = getAllDays();
  const totalXP = logs.reduce((sum, l) => sum + l.xp, 0);
  const level = Math.floor(totalXP / 100) + 1;
  const xpForNextLevel = level * 100;
  const xpProgress = totalXP % 100;
  return { totalXP, level, xpForNextLevel, xpProgress };
}
