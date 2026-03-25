import { Router, Request, Response } from "express";
import {
  getDayByDate,
  getAllDays,
  findOrCreateDay,
  updateDay,
  deleteDay,
  getStreak,
  getLevelInfo,
} from "../services/day.service";
import { checkAndUnlockAchievements } from "../services/progress.service";

const router = Router();

// GET /api/days
router.get("/", (_req: Request, res: Response) => {
  const days = getAllDays();
  res.json(days);
});

// GET /api/days/:date
router.get("/:date", (req: Request, res: Response) => {
  const date = String(req.params.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
    return;
  }
  const day = getDayByDate(date);
  if (!day) {
    // Auto-create if not exists
    const created = findOrCreateDay(date);
    res.json(getDayByDate(created.date));
    return;
  }
  res.json(day);
});

// POST /api/days
router.post("/", (req: Request, res: Response) => {
  const { date } = req.body as { date?: string };
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid or missing date" });
    return;
  }
  const day = findOrCreateDay(date);
  checkAndUnlockAchievements();
  res.status(201).json(getDayByDate(day.date));
});

// PUT /api/days/:date
router.put("/:date", (req: Request, res: Response) => {
  const date = String(req.params.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid date format" });
    return;
  }
  const { weight, calorie_goal, notes, mood } = req.body as {
    weight?: number;
    calorie_goal?: number;
    notes?: string;
    mood?: string;
  };
  const updated = updateDay(date, { weight, calorie_goal, notes, mood });
  checkAndUnlockAchievements();
  res.json(updated);
});

// DELETE /api/days/:date
router.delete("/:date", (req: Request, res: Response) => {
  const date = String(req.params.date);
  deleteDay(date);
  res.json({ success: true });
});

export default router;
