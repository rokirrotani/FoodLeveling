import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { daysApi } from "../services/api";
import { progressApi } from "../services/api";
import type { DailyLog, ProgressSummary } from "../types";
import StatCard from "../components/StatCard";
import XPBar from "../components/XPBar";

export default function DashboardPage() {
  const today = dayjs().format("YYYY-MM-DD");
  const [day, setDay] = useState<DailyLog | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      daysApi.getByDate(today),
      progressApi.getSummary(),
    ])
      .then(([d, s]) => {
        setDay(d);
        setSummary(s);
      })
      .catch(() => setError("Backend non raggiungibile. Avvia il server con npm run dev"))
      .finally(() => setLoading(false));
  }, [today]);

  if (loading) return <div className="loading">⏳ Caricamento sistema...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!day || !summary) return null;

  const calorieGoal = day.calorie_goal ?? 2000;
  const calIn = day.total_calories_in;
  const calBurned = day.total_calories_burned;
  const netCal = day.net_calories;
  const calPct = Math.min(100, Math.round((calIn / calorieGoal) * 100));
  const isUnder = calIn <= calorieGoal && calIn > 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">⚔️ Daily Quest — {dayjs(today).format("DD/MM/YYYY")}</h1>
        <p className="page-subtitle">
          {isUnder ? "🎯 In target oggi!" : calIn === 0 ? "Registra i tuoi pasti, Hunter!" : "⚠️ Sopra l'obiettivo"}
        </p>
      </div>

      <XPBar
        level={summary.level}
        xpProgress={summary.xpProgress}
        xpForNextLevel={summary.xpForNextLevel}
        totalXP={summary.totalXP}
      />

      <div className="stats-grid">
        <StatCard
          label="Calorie Ingerite"
          value={`${calIn} kcal`}
          sub={`Obiettivo: ${calorieGoal} kcal`}
          color="blue"
          icon="🍽️"
        />
        <StatCard
          label="Calorie Bruciate"
          value={`${calBurned} kcal`}
          sub="Workout oggi"
          color="orange"
          icon="🔥"
        />
        <StatCard
          label="Calorie Nette"
          value={`${netCal} kcal`}
          sub={netCal <= calorieGoal ? "✅ In target" : "❌ Sopra target"}
          color={netCal <= calorieGoal ? "green" : "red"}
          icon="⚡"
        />
        <StatCard
          label="Streak Attivo"
          value={`${summary.streak} gg`}
          sub={`Massimo: ${summary.longestStreak} giorni`}
          color="purple"
          icon="🔥"
        />
        <StatCard
          label="Peso Attuale"
          value={day.weight ? `${day.weight} kg` : "—"}
          sub="Aggiorna nella pagina diario"
          color="blue"
          icon="⚖️"
        />
        <StatCard
          label="Lvl & Rank"
          value={`Lv. ${summary.level}`}
          sub={`${summary.totalXP} XP totali`}
          color="purple"
          icon="⚔️"
        />
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-label">
          <span>Calorie obiettivo giornaliero</span>
          <span>{calPct}%</span>
        </div>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${calPct >= 100 ? "progress-bar-fill--over" : ""}`}
            style={{ width: `${calPct}%` }}
          />
        </div>
      </div>

      <div className="quick-actions">
        <h2 className="section-title">🗡️ Azioni Rapide</h2>
        <div className="action-buttons">
          <Link to="/diary" className="action-btn action-btn--food">
            🍽️ Aggiungi Pasto
          </Link>
          <Link to="/workout" className="action-btn action-btn--workout">
            💪 Aggiungi Allenamento
          </Link>
          <Link to="/progress" className="action-btn action-btn--progress">
            📊 Vedi Progressi
          </Link>
        </div>
      </div>
    </div>
  );
}
