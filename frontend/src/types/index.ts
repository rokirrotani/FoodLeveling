export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type Intensity = "low" | "medium" | "high";
export type Mood = "great" | "good" | "ok" | "bad" | "terrible";

export interface DailyLog {
  id: number;
  date: string;
  weight?: number;
  calorie_goal: number;
  notes?: string;
  mood?: string;
  created_at: string;
  total_calories_in: number;
  total_calories_burned: number;
  net_calories: number;
  xp: number;
}

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

export interface Workout {
  id: number;
  daily_log_id: number;
  workout_type: string;
  duration_minutes: number;
  calories_burned: number;
  intensity?: Intensity;
  notes?: string;
}

export interface Achievement {
  id: number;
  code: string;
  title: string;
  description: string;
  unlocked_at?: string;
}

export interface ProgressSummary {
  totalDays: number;
  totalWorkouts: number;
  avgCalories: number;
  streak: number;
  longestStreak: number;
  level: number;
  totalXP: number;
  xpForNextLevel: number;
  xpProgress: number;
  achievements: Achievement[];
}

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

export interface StreakResult {
  streak: number;
  longestStreak: number;
}

export interface LevelInfo {
  totalXP: number;
  level: number;
  xpForNextLevel: number;
  xpProgress: number;
}

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Colazione",
  lunch: "Pranzo",
  dinner: "Cena",
  snack: "Spuntino",
};

export const QUICK_FOODS: Array<{ name: string; calories: number; protein?: number; carbs?: number; fats?: number }> = [
  { name: "Pasta 100g", calories: 350, protein: 12, carbs: 70, fats: 2 },
  { name: "Petto di pollo 150g", calories: 248, protein: 46, carbs: 0, fats: 5 },
  { name: "Banana", calories: 89, protein: 1, carbs: 23, fats: 0 },
  { name: "Yogurt greco 150g", calories: 132, protein: 15, carbs: 6, fats: 5 },
  { name: "Uova 2 pezzi", calories: 140, protein: 12, carbs: 1, fats: 10 },
  { name: "Mela", calories: 72, protein: 0, carbs: 19, fats: 0 },
  { name: "Riso 100g", calories: 360, protein: 7, carbs: 79, fats: 1 },
  { name: "Tonno al naturale 80g", calories: 70, protein: 16, carbs: 0, fats: 1 },
];

export const QUICK_WORKOUTS: Array<{ name: string; duration: number; estimatedCalories: number }> = [
  { name: "Camminata", duration: 30, estimatedCalories: 120 },
  { name: "Corsa", duration: 30, estimatedCalories: 250 },
  { name: "Palestra", duration: 45, estimatedCalories: 220 },
  { name: "Calcio", duration: 60, estimatedCalories: 500 },
  { name: "Ciclismo", duration: 30, estimatedCalories: 180 },
  { name: "Nuoto", duration: 30, estimatedCalories: 210 },
  { name: "Yoga", duration: 45, estimatedCalories: 135 },
];
