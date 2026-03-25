import { useState } from "react";
import type { Intensity } from "../types";
import { QUICK_WORKOUTS } from "../types";
import { workoutsApi } from "../services/api";

interface WorkoutFormProps {
  date: string;
  onAdded: () => void;
}

export default function WorkoutForm({ date, onAdded }: WorkoutFormProps) {
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("medium");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fillQuick = (q: (typeof QUICK_WORKOUTS)[number]) => {
    setWorkoutType(q.name);
    setDuration(String(q.duration));
    setCaloriesBurned(String(q.estimatedCalories));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const dur = parseInt(duration, 10);
    if (!workoutType.trim() || isNaN(dur) || dur <= 0) {
      setError("Tipo allenamento e durata sono obbligatori");
      return;
    }
    setLoading(true);
    try {
      await workoutsApi.add({
        date,
        workout_type: workoutType.trim(),
        duration_minutes: dur,
        calories_burned: caloriesBurned ? parseInt(caloriesBurned, 10) : undefined,
        intensity,
        notes: notes || undefined,
      });
      setWorkoutType("");
      setDuration("");
      setCaloriesBurned("");
      setNotes("");
      onAdded();
    } catch {
      setError("Errore nel salvataggio dell'allenamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <h3 className="form-title">💪 Aggiungi Allenamento</h3>

      <div className="quick-buttons">
        {QUICK_WORKOUTS.map((q) => (
          <button
            key={q.name}
            type="button"
            className="quick-btn"
            onClick={() => fillQuick(q)}
          >
            {q.name}
          </button>
        ))}
      </div>

      <div className="form-row">
        <div className="form-group flex-2">
          <label>Tipo allenamento *</label>
          <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="es. Corsa, Palestra, Calcio..."
            required
          />
        </div>
        <div className="form-group">
          <label>Durata (min) *</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="min"
            min={1}
            required
          />
        </div>
        <div className="form-group">
          <label>Kcal bruciate</label>
          <input
            type="number"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(e.target.value)}
            placeholder="auto"
            min={0}
          />
        </div>
        <div className="form-group">
          <label>Intensità</label>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as Intensity)}
          >
            <option value="low">Bassa</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Note</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Note opzionali..."
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Salvataggio..." : "Aggiungi Allenamento"}
      </button>
    </form>
  );
}
