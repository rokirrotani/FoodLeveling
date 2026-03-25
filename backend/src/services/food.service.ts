import db from "../db/database";
import { findOrCreateDay } from "./day.service";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodEntry {
  id: number;
  daily_log_id: number;
  meal_type: MealType;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity?: string;
  time?: string;
}

export interface CreateFoodPayload {
  date: string;
  meal_type: MealType;
  food_name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  quantity?: string;
  time?: string;
}

export function getFoodsByDate(date: string): FoodEntry[] {
  const log = db
    .prepare("SELECT id FROM daily_logs WHERE date = ?")
    .get(date) as { id: number } | undefined;
  if (!log) return [];
  return db
    .prepare("SELECT * FROM food_entries WHERE daily_log_id = ? ORDER BY meal_type, time")
    .all(log.id) as FoodEntry[];
}

export function addFoodEntry(payload: CreateFoodPayload): {
  entry: FoodEntry;
  totalCalories: number;
} {
  const day = findOrCreateDay(payload.date);
  const result = db
    .prepare(
      `INSERT INTO food_entries
        (daily_log_id, meal_type, food_name, calories, protein, carbs, fats, quantity, time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      day.id,
      payload.meal_type,
      payload.food_name,
      payload.calories,
      payload.protein ?? 0,
      payload.carbs ?? 0,
      payload.fats ?? 0,
      payload.quantity ?? null,
      payload.time ?? null
    );

  const entry = db
    .prepare("SELECT * FROM food_entries WHERE id = ?")
    .get(result.lastInsertRowid) as FoodEntry;

  const totalCalories = (
    db
      .prepare(
        "SELECT COALESCE(SUM(calories),0) as total FROM food_entries WHERE daily_log_id = ?"
      )
      .get(day.id) as { total: number }
  ).total;

  return { entry, totalCalories };
}

export function updateFoodEntry(
  id: number,
  data: Partial<Omit<FoodEntry, "id" | "daily_log_id">>
): FoodEntry {
  const fields = Object.keys(data)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = [...Object.values(data), id];
  db.prepare(`UPDATE food_entries SET ${fields} WHERE id = ?`).run(...values);
  return db
    .prepare("SELECT * FROM food_entries WHERE id = ?")
    .get(id) as FoodEntry;
}

export function deleteFoodEntry(id: number): void {
  db.prepare("DELETE FROM food_entries WHERE id = ?").run(id);
}
