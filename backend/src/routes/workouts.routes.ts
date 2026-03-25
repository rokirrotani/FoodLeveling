import { Router, Request, Response } from "express";
import {
  getWorkoutsByDate,
  addWorkout,
  updateWorkout,
  deleteWorkout,
  estimateCalories,
  Intensity,
} from "../services/workout.service";
import { checkAndUnlockAchievements } from "../services/progress.service";

const router = Router();

const VALID_INTENSITIES: Intensity[] = ["low", "medium", "high"];

// GET /api/workouts/:date
router.get("/:date", (req: Request, res: Response) => {
  const date = String(req.params.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid date format" });
    return;
  }
  res.json(getWorkoutsByDate(date));
});

// POST /api/workouts
router.post("/", (req: Request, res: Response) => {
  const { date, workout_type, duration_minutes, calories_burned, intensity, notes } =
    req.body as {
      date?: string;
      workout_type?: string;
      duration_minutes?: number;
      calories_burned?: number;
      intensity?: string;
      notes?: string;
    };

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid or missing date" });
    return;
  }
  if (!workout_type || typeof workout_type !== "string" || workout_type.trim().length === 0) {
    res.status(400).json({ error: "workout_type is required" });
    return;
  }
  if (!duration_minutes || typeof duration_minutes !== "number" || duration_minutes <= 0) {
    res.status(400).json({ error: "duration_minutes must be a positive number" });
    return;
  }
  if (intensity && !VALID_INTENSITIES.includes(intensity as Intensity)) {
    res.status(400).json({ error: "intensity must be low, medium, or high" });
    return;
  }

  const result = addWorkout({
    date,
    workout_type: workout_type.trim(),
    duration_minutes,
    calories_burned,
    intensity: intensity as Intensity | undefined,
    notes,
  });
  checkAndUnlockAchievements();
  res.status(201).json(result);
});

// GET /api/workouts/estimate
router.get("/estimate/:type/:minutes", (req: Request, res: Response) => {
  const minutes = parseInt(String(req.params.minutes), 10);
  if (isNaN(minutes) || minutes <= 0) {
    res.status(400).json({ error: "Invalid minutes" });
    return;
  }
  res.json({ calories: estimateCalories(String(req.params.type), minutes) });
});

// PUT /api/workouts/:id
router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { workout_type, duration_minutes, calories_burned, intensity, notes } = req.body as {
    workout_type?: string;
    duration_minutes?: number;
    calories_burned?: number;
    intensity?: Intensity;
    notes?: string;
  };

  if (intensity && !VALID_INTENSITIES.includes(intensity)) {
    res.status(400).json({ error: "Invalid intensity" });
    return;
  }

  const updated = updateWorkout(id, {
    workout_type: workout_type?.trim(),
    duration_minutes,
    calories_burned,
    intensity,
    notes,
  });
  res.json(updated);
});

// DELETE /api/workouts/:id
router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  deleteWorkout(id);
  res.json({ success: true });
});

export default router;
