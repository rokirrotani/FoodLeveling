import { Router, Request, Response } from "express";
import {
  getSummary,
  getWeightHistory,
  getCaloriesHistory,
} from "../services/progress.service";
import { getStreak, getLevelInfo } from "../services/day.service";

const router = Router();

// GET /api/progress/summary
router.get("/summary", (_req: Request, res: Response) => {
  res.json(getSummary());
});

// GET /api/progress/weight-history?days=30
router.get("/weight-history", (req: Request, res: Response) => {
  const days = parseInt((req.query.days as string) ?? "30", 10);
  res.json(getWeightHistory(isNaN(days) ? 30 : days));
});

// GET /api/progress/calories-history?days=30
router.get("/calories-history", (req: Request, res: Response) => {
  const days = parseInt((req.query.days as string) ?? "30", 10);
  res.json(getCaloriesHistory(isNaN(days) ? 30 : days));
});

// GET /api/progress/streak
router.get("/streak", (_req: Request, res: Response) => {
  res.json(getStreak());
});

// GET /api/progress/level
router.get("/level", (_req: Request, res: Response) => {
  res.json(getLevelInfo());
});

export default router;
