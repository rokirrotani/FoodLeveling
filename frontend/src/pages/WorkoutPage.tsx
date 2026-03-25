import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import type { Workout } from "../types";
import { workoutsApi } from "../services/api";
import WorkoutForm from "../components/WorkoutForm";

const INTENSITY_LABELS: Record<string, string> = {
  low: "🟢 Bassa",
  medium: "🟡 Media",
  high: "🔴 Alta",
};

export default function WorkoutPage() {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const w = await workoutsApi.getByDate(date);
      setWorkouts(w);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    await workoutsApi.delete(id);
    load();
  };

  const totalBurned = workouts.reduce((s, w) => s + w.calories_burned, 0);
  const totalMinutes = workouts.reduce((s, w) => s + w.duration_minutes, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">💪 Allenamenti</h1>
        <div className="date-picker-row">
          <button
            className="btn btn--ghost"
            onClick={() => setDate(dayjs(date).subtract(1, "day").format("YYYY-MM-DD"))}
          >
            ◀
          </button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />
          <button
            className="btn btn--ghost"
            onClick={() => setDate(dayjs(date).add(1, "day").format("YYYY-MM-DD"))}
          >
            ▶
          </button>
          <button className="btn btn--ghost" onClick={() => setDate(dayjs().format("YYYY-MM-DD"))}>
            Oggi
          </button>
        </div>
      </div>

      {workouts.length > 0 && (
        <div className="calories-summary card">
          <div className="macro-grid">
            <div className="macro-item macro-item--cal">
              <span className="macro-value">{totalBurned}</span>
              <span className="macro-label">kcal bruciate</span>
            </div>
            <div className="macro-item">
              <span className="macro-value">{totalMinutes} min</span>
              <span className="macro-label">Durata totale</span>
            </div>
            <div className="macro-item">
              <span className="macro-value">{workouts.length}</span>
              <span className="macro-label">Allenamenti</span>
            </div>
          </div>
        </div>
      )}

      <div className="food-list card">
        <h3 className="section-title">🗡️ Workout Cleared</h3>
        {loading ? (
          <div className="loading">Caricamento...</div>
        ) : workouts.length === 0 ? (
          <div className="empty-state">Nessun allenamento registrato per questo giorno.</div>
        ) : (
          workouts.map((w) => (
            <div key={w.id} className="food-item">
              <div className="food-item-info">
                <span className="food-item-name">{w.workout_type}</span>
                {w.intensity && (
                  <span className="food-item-qty">{INTENSITY_LABELS[w.intensity]}</span>
                )}
                {w.notes && <span className="food-item-qty">📝 {w.notes}</span>}
              </div>
              <div className="food-item-macros">
                <span className="food-cal">🔥 {w.calories_burned} kcal</span>
                <span className="macro-chip">⏱️ {w.duration_minutes} min</span>
              </div>
              <button
                className="btn btn--danger btn--sm"
                onClick={() => handleDelete(w.id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <WorkoutForm date={date} onAdded={load} />
    </div>
  );
}
