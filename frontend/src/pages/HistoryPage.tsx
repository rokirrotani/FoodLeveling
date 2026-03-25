import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import type { DailyLog } from "../types";
import { daysApi } from "../services/api";

export default function HistoryPage() {
  const [days, setDays] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    daysApi
      .getAll()
      .then(setDays)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">⏳ Caricamento storico...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📅 Storico Giornaliero</h1>
        <p className="page-subtitle">{days.length} giorni registrati</p>
      </div>

      {days.length === 0 ? (
        <div className="empty-state card">
          <p>Nessun giorno registrato. Inizia oggi!</p>
          <Link to="/" className="btn btn--primary">
            Vai alla Dashboard
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {days.map((d) => {
            const goal = d.calorie_goal ?? 2000;
            const isUnder = d.total_calories_in > 0 && d.total_calories_in <= goal;
            const isOver = d.total_calories_in > goal;
            return (
              <Link to={`/diary?date=${d.date}`} key={d.id} className="history-item card">
                <div className="history-item-date">
                  <span className="history-day">{dayjs(d.date).format("DD")}</span>
                  <span className="history-month">{dayjs(d.date).format("MMM YYYY")}</span>
                </div>
                <div className="history-item-stats">
                  <span className="history-stat">
                    🍽️ {d.total_calories_in} kcal
                  </span>
                  {d.total_calories_burned > 0 && (
                    <span className="history-stat">
                      🔥 -{d.total_calories_burned} kcal
                    </span>
                  )}
                  {d.weight && (
                    <span className="history-stat">⚖️ {d.weight} kg</span>
                  )}
                </div>
                <div className="history-item-status">
                  {isUnder && <span className="status-badge status-badge--green">✅ In target</span>}
                  {isOver && <span className="status-badge status-badge--red">❌ Over</span>}
                  {!isUnder && !isOver && (
                    <span className="status-badge status-badge--grey">— Vuoto</span>
                  )}
                  <span className="history-xp">+{d.xp} XP</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
