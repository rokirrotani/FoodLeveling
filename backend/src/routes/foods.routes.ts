import { Router, Request, Response } from "express";
import {
  getFoodsByDate,
  addFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  MealType,
} from "../services/food.service";
import { checkAndUnlockAchievements } from "../services/progress.service";

const router = Router();

const VALID_MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

// GET /api/foods/:date
router.get("/:date", (req: Request, res: Response) => {
  const date = String(req.params.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid date format" });
    return;
  }
  const foods = getFoodsByDate(date);
  res.json(foods);
});

// POST /api/foods
router.post("/", (req: Request, res: Response) => {
  const { date, meal_type, food_name, calories, protein, carbs, fats, quantity, time } =
    req.body as {
      date?: string;
      meal_type?: string;
      food_name?: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fats?: number;
      quantity?: string;
      time?: string;
    };

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid or missing date" });
    return;
  }
  if (!meal_type || !VALID_MEAL_TYPES.includes(meal_type as MealType)) {
    res.status(400).json({ error: "Invalid meal_type" });
    return;
  }
  if (!food_name || typeof food_name !== "string" || food_name.trim().length === 0) {
    res.status(400).json({ error: "food_name is required" });
    return;
  }
  if (calories === undefined || typeof calories !== "number" || calories < 0) {
    res.status(400).json({ error: "calories must be a non-negative number" });
    return;
  }

  const result = addFoodEntry({
    date,
    meal_type: meal_type as MealType,
    food_name: food_name.trim(),
    calories,
    protein,
    carbs,
    fats,
    quantity,
    time,
  });
  checkAndUnlockAchievements();
  res.status(201).json(result);
});

// PUT /api/foods/:id
router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { meal_type, food_name, calories, protein, carbs, fats, quantity, time } =
    req.body as Partial<{
      meal_type: MealType;
      food_name: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      quantity: string;
      time: string;
    }>;

  if (meal_type && !VALID_MEAL_TYPES.includes(meal_type)) {
    res.status(400).json({ error: "Invalid meal_type" });
    return;
  }
  if (calories !== undefined && (typeof calories !== "number" || calories < 0)) {
    res.status(400).json({ error: "calories must be a non-negative number" });
    return;
  }

  const updated = updateFoodEntry(id, {
    meal_type,
    food_name: food_name?.trim(),
    calories,
    protein,
    carbs,
    fats,
    quantity,
    time,
  });
  res.json(updated);
});

// DELETE /api/foods/:id
router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  deleteFoodEntry(id);
  res.json({ success: true });
});

export default router;
