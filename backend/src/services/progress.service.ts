import db from "../db/database";
import dayjs from "dayjs";
import { getStreak, getLevelInfo } from "./day.service";

export interface WeightPoint {
  date: string;
  weight: number;
}

export interface CaloriesPoint {
  date: string;
  calories_in: number;
  calories_burned: number;
  net: number;
  goal: number;
}

export function getWeightHistory(days = 30): WeightPoint[] {
  const from = dayjs().subtract(days, "day").format("YYYY-MM-DD");
  return db
    .prepare(
      "SELECT date, weight FROM daily_logs WHERE date >= ? AND weight IS NOT NULL ORDER BY date"
    )
    .all(from) as WeightPoint[];
}

export function getCaloriesHistory(days = 30): CaloriesPoint[] {
  const from = dayjs().subtract(days, "day").format("YYYY-MM-DD");
  const logs = db
    .prepare(
      "SELECT id, date, calorie_goal FROM daily_logs WHERE date >= ? ORDER BY date"
    )
    .all(from) as { id: number; date: string; calorie_goal: number }[];

  return logs.map((log) => {
    const caloriesIn = (
      db
        .prepare(
          "SELECT COALESCE(SUM(calories),0) as total FROM food_entries WHERE daily_log_id = ?"
        )
        .get(log.id) as { total: number }
    ).total;

    const caloriesBurned = (
      db
        .prepare(
          "SELECT COALESCE(SUM(calories_burned),0) as total FROM workouts WHERE daily_log_id = ?"
        )
        .get(log.id) as { total: number }
    ).total;

    return {
      date: log.date,
      calories_in: caloriesIn,
      calories_burned: caloriesBurned,
      net: caloriesIn - caloriesBurned,
      goal: log.calorie_goal ?? 2000,
    };
  });
}

export function getSummary() {
  const streak = getStreak();
  const level = getLevelInfo();

  const totalDays = (
    db.prepare("SELECT COUNT(*) as c FROM daily_logs").get() as { c: number }
  ).c;

  const totalWorkouts = (
    db.prepare("SELECT COUNT(*) as c FROM workouts").get() as { c: number }
  ).c;

  const avgCalories = (
    db
      .prepare(
        `SELECT COALESCE(AVG(t.total),0) as avg FROM
         (SELECT SUM(calories) as total FROM food_entries GROUP BY daily_log_id) t`
      )
      .get() as { avg: number }
  ).avg;

  const achievements = db
    .prepare("SELECT * FROM achievements ORDER BY unlocked_at DESC NULLS LAST")
    .all();

  return {
    totalDays,
    totalWorkouts,
    avgCalories: Math.round(avgCalories),
    streak: streak.streak,
    longestStreak: streak.longestStreak,
    level: level.level,
    totalXP: level.totalXP,
    xpForNextLevel: level.xpForNextLevel,
    xpProgress: level.xpProgress,
    achievements,
  };
}

export function checkAndUnlockAchievements(): void {
  const totalDays = (
    db.prepare("SELECT COUNT(*) as c FROM daily_logs").get() as { c: number }
  ).c;
  const totalWorkouts = (
    db.prepare("SELECT COUNT(*) as c FROM workouts").get() as { c: number }
  ).c;
  const totalFoods = (
    db.prepare("SELECT COUNT(*) as c FROM food_entries").get() as { c: number }
  ).c;

  const streak = getStreak();
  const now = dayjs().toISOString();

  function unlock(code: string) {
    db.prepare(
      "UPDATE achievements SET unlocked_at = ? WHERE code = ? AND unlocked_at IS NULL"
    ).run(now, code);
  }

  if (totalDays >= 1) unlock("first_day");
  if (totalFoods >= 1) unlock("first_food");
  if (totalWorkouts >= 1) unlock("first_workout");
  if (totalWorkouts >= 10) unlock("workouts_10");
  if (streak.streak >= 3) unlock("streak_3");
  if (streak.streak >= 7) unlock("streak_7");
  if (streak.streak >= 30) unlock("streak_30");

  // under goal 5 days
  const underGoalDays = (
    db
      .prepare(
        `SELECT COUNT(*) as c FROM (
          SELECT d.id, d.calorie_goal, COALESCE(SUM(f.calories),0) as total
          FROM daily_logs d
          LEFT JOIN food_entries f ON f.daily_log_id = d.id
          GROUP BY d.id
          HAVING total > 0 AND total <= d.calorie_goal
        )`
      )
      .get() as { c: number }
  ).c;
  if (underGoalDays >= 5) unlock("under_goal_5");
}
