import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import type { ProgressSummary, WeightPoint, CaloriesPoint } from "../types";
import { progressApi } from "../services/api";
import XPBar from "../components/XPBar";
import AchievementCard from "../components/AchievementCard";
import StatCard from "../components/StatCard";
import dayjs from "dayjs";

export default function ProgressPage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightPoint[]>([]);
  const [caloriesHistory, setCaloriesHistory] = useState<CaloriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      progressApi.getSummary(),
      progressApi.getWeightHistory(days),
      progressApi.getCaloriesHistory(days),
    ])
      .then(([s, w, c]) => {
        setSummary(s);
        setWeightHistory(w);
        setCaloriesHistory(c);
      })
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) return <div className="loading">⏳ Caricamento progressi...</div>;
  if (!summary) return null;

  const fmtDate = (d: unknown) => dayjs(String(d)).format("DD/MM");

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 Rank Progress</h1>
      </div>

      <XPBar
        level={summary.level}
        xpProgress={summary.xpProgress}
        xpForNextLevel={summary.xpForNextLevel}
        totalXP={summary.totalXP}
      />

      <div className="stats-grid">
        <StatCard label="Streak Attivo" value={`${summary.streak} gg`} icon="🔥" color="orange" />
        <StatCard label="Streak Massimo" value={`${summary.longestStreak} gg`} icon="👑" color="purple" />
        <StatCard label="Giorni Totali" value={summary.totalDays} icon="📅" color="blue" />
        <StatCard label="Allenamenti Totali" value={summary.totalWorkouts} icon="💪" color="green" />
        <StatCard label="Media Calorie/gg" value={`${summary.avgCalories} kcal`} icon="🍽️" color="blue" />
        <StatCard label="Livello" value={`Lv. ${summary.level}`} icon="⚔️" color="purple" />
      </div>

      <div className="chart-controls">
        {[7, 14, 30, 60].map((d) => (
          <button
            key={d}
            className={`btn btn--ghost ${days === d ? "btn--active" : ""}`}
            onClick={() => setDays(d)}
          >
            {d} giorni
          </button>
        ))}
      </div>

      {weightHistory.length >= 2 && (
        <div className="card chart-card">
          <h3 className="section-title">⚖️ Peso nel Tempo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weightHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="date" tickFormatter={fmtDate} stroke="#8880cc" tick={{ fontSize: 12 }} />
              <YAxis domain={["auto", "auto"]} stroke="#8880cc" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #7c3aed", borderRadius: 8 }}
                labelFormatter={fmtDate}
                formatter={(v: unknown) => [`${Number(v).toFixed(1)} kg`, "Peso"]}
              />
              <Line type="monotone" dataKey="weight" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {caloriesHistory.length >= 1 && (
        <div className="card chart-card">
          <h3 className="section-title">🔥 Calorie Giornaliere</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={caloriesHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="date" tickFormatter={fmtDate} stroke="#8880cc" tick={{ fontSize: 12 }} />
              <YAxis stroke="#8880cc" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #7c3aed", borderRadius: 8 }}
                labelFormatter={fmtDate}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
              <ReferenceLine
                y={caloriesHistory[0]?.goal ?? 2000}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{ value: "Goal", fill: "#f59e0b", fontSize: 12 }}
              />
              <Bar dataKey="calories_in" name="Calorie In" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="calories_burned" name="Bruciate" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3 className="section-title">🏆 Achievements</h3>
        <div className="achievements-grid">
          {summary.achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
