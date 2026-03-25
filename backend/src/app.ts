import express from "express";
import cors from "cors";
import daysRouter from "./routes/days.routes";
import foodsRouter from "./routes/foods.routes";
import workoutsRouter from "./routes/workouts.routes";
import progressRouter from "./routes/progress.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/days", daysRouter);
app.use("/api/foods", foodsRouter);
app.use("/api/workouts", workoutsRouter);
app.use("/api/progress", progressRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
