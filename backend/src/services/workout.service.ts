import db from "../db/database";
import { findOrCreateDay } from "./day.service";

export type Intensity = "low" | "medium" | "high";

export interface Workout {
  id: number;
  daily_log_id: number;
  workout_type: string;
  duration_minutes: number;
  calories_burned: number;
  intensity?: Intensity;
  notes?: string;
}

export interface CreateWorkoutPayload {
  date: string;
  workout_type: string;
  duration_minutes: number;
  calories_burned?: number;
  intensity?: Intensity;
  notes?: string;
}

// Calorie estimates per minute by workout type
const CALORIE_RATES: Record<string, number> = {
  camminata: 4,
  corsa: 8,
  palestra: 5,
  calcio: 8,
  ciclismo: 6,
  nuoto: 7,
  yoga: 3,
  default: 5,
};

export function estimateCalories(type: string, minutes: number): number {
  const normalized = type.toLowerCase();
  const rate =
    CALORIE_RATES[normalized] ??
    Object.entries(CALORIE_RATES).find(([k]) =>
      normalized.includes(k)
    )?.[1] ??
    CALORIE_RATES.default;
  return Math.round(rate * minutes);
}

export function getWorkoutsByDate(date: string): Workout[] {
  const log = db
    .prepare("SELECT id FROM daily_logs WHERE date = ?")
    .get(date) as { id: number } | undefined;
  if (!log) return [];
  return db
    .prepare("SELECT * FROM workouts WHERE daily_log_id = ? ORDER BY id")
    .all(log.id) as Workout[];
}

export function addWorkout(payload: CreateWorkoutPayload): {
  workout: Workout;
  totalCaloriesBurned: number;
} {
  const day = findOrCreateDay(payload.date);
  const calories =
    payload.calories_burned ??
    estimateCalories(payload.workout_type, payload.duration_minutes);

  const result = db
    .prepare(
      `INSERT INTO workouts
        (daily_log_id, workout_type, duration_minutes, calories_burned, intensity, notes)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      day.id,
      payload.workout_type,
      payload.duration_minutes,
      calories,
      payload.intensity ?? null,
      payload.notes ?? null
    );

  const workout = db
    .prepare("SELECT * FROM workouts WHERE id = ?")
    .get(result.lastInsertRowid) as Workout;

  const totalCaloriesBurned = (
    db
      .prepare(
        "SELECT COALESCE(SUM(calories_burned),0) as total FROM workouts WHERE daily_log_id = ?"
      )
      .get(day.id) as { total: number }
  ).total;

  return { workout, totalCaloriesBurned };
}

export function updateWorkout(
  id: number,
  data: Partial<Omit<Workout, "id" | "daily_log_id">>
): Workout {
  const fields = Object.keys(data)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = [...Object.values(data), id];
  db.prepare(`UPDATE workouts SET ${fields} WHERE id = ?`).run(...values);
  return db.prepare("SELECT * FROM workouts WHERE id = ?").get(id) as Workout;
}

export function deleteWorkout(id: number): void {
  db.prepare("DELETE FROM workouts WHERE id = ?").run(id);
}
