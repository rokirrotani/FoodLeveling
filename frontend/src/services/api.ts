import axios from "axios";
import type {
  DailyLog,
  FoodEntry,
  Workout,
  ProgressSummary,
  WeightPoint,
  CaloriesPoint,
  StreakResult,
  LevelInfo,
  MealType,
  Intensity,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

// Days
export const daysApi = {
  getAll: () => api.get<DailyLog[]>("/days").then((r) => r.data),
  getByDate: (date: string) => api.get<DailyLog>(`/days/${date}`).then((r) => r.data),
  create: (date: string) => api.post<DailyLog>("/days", { date }).then((r) => r.data),
  update: (
    date: string,
    data: Partial<{ weight: number; calorie_goal: number; notes: string; mood: string }>
  ) => api.put<DailyLog>(`/days/${date}`, data).then((r) => r.data),
  delete: (date: string) => api.delete(`/days/${date}`).then((r) => r.data),
};

// Foods
export const foodsApi = {
  getByDate: (date: string) =>
    api.get<FoodEntry[]>(`/foods/${date}`).then((r) => r.data),
  add: (data: {
    date: string;
    meal_type: MealType;
    food_name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    quantity?: string;
    time?: string;
  }) =>
    api
      .post<{ entry: FoodEntry; totalCalories: number }>("/foods", data)
      .then((r) => r.data),
  update: (
    id: number,
    data: Partial<{
      meal_type: MealType;
      food_name: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      quantity: string;
      time: string;
    }>
  ) => api.put<FoodEntry>(`/foods/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/foods/${id}`).then((r) => r.data),
};

// Workouts
export const workoutsApi = {
  getByDate: (date: string) =>
    api.get<Workout[]>(`/workouts/${date}`).then((r) => r.data),
  add: (data: {
    date: string;
    workout_type: string;
    duration_minutes: number;
    calories_burned?: number;
    intensity?: Intensity;
    notes?: string;
  }) =>
    api
      .post<{ workout: Workout; totalCaloriesBurned: number }>("/workouts", data)
      .then((r) => r.data),
  update: (
    id: number,
    data: Partial<{
      workout_type: string;
      duration_minutes: number;
      calories_burned: number;
      intensity: Intensity;
      notes: string;
    }>
  ) => api.put<Workout>(`/workouts/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/workouts/${id}`).then((r) => r.data),
};

// Progress
export const progressApi = {
  getSummary: () => api.get<ProgressSummary>("/progress/summary").then((r) => r.data),
  getWeightHistory: (days?: number) =>
    api
      .get<WeightPoint[]>("/progress/weight-history", { params: { days } })
      .then((r) => r.data),
  getCaloriesHistory: (days?: number) =>
    api
      .get<CaloriesPoint[]>("/progress/calories-history", { params: { days } })
      .then((r) => r.data),
  getStreak: () => api.get<StreakResult>("/progress/streak").then((r) => r.data),
  getLevel: () => api.get<LevelInfo>("/progress/level").then((r) => r.data),
};

export default api;
