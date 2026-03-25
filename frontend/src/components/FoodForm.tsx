import { useState } from "react";
import type { MealType } from "../types";
import { MEAL_LABELS, QUICK_FOODS } from "../types";
import { foodsApi } from "../services/api";

interface FoodFormProps {
  date: string;
  onAdded: () => void;
}

export default function FoodForm({ date, onAdded }: FoodFormProps) {
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fillQuick = (q: (typeof QUICK_FOODS)[number]) => {
    setFoodName(q.name);
    setCalories(String(q.calories));
    setProtein(String(q.protein ?? ""));
    setCarbs(String(q.carbs ?? ""));
    setFats(String(q.fats ?? ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cal = parseInt(calories, 10);
    if (!foodName.trim() || isNaN(cal) || cal < 0) {
      setError("Nome cibo e calorie sono obbligatori");
      return;
    }
    setLoading(true);
    try {
      await foodsApi.add({
        date,
        meal_type: mealType,
        food_name: foodName.trim(),
        calories: cal,
        protein: protein ? parseFloat(protein) : undefined,
        carbs: carbs ? parseFloat(carbs) : undefined,
        fats: fats ? parseFloat(fats) : undefined,
        quantity: quantity || undefined,
      });
      setFoodName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFats("");
      setQuantity("");
      onAdded();
    } catch {
      setError("Errore nel salvataggio del pasto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <h3 className="form-title">➕ Aggiungi Pasto</h3>

      <div className="quick-buttons">
        {QUICK_FOODS.map((q) => (
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
        <div className="form-group">
          <label>Pasto</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
          >
            {(Object.keys(MEAL_LABELS) as MealType[]).map((k) => (
              <option key={k} value={k}>
                {MEAL_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group flex-2">
          <label>Nome cibo *</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="es. Pasta al pomodoro"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Calorie *</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="kcal"
            min={0}
            required
          />
        </div>
        <div className="form-group">
          <label>Proteine (g)</label>
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="g"
            min={0}
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label>Carboidrati (g)</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="g"
            min={0}
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label>Grassi (g)</label>
          <input
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            placeholder="g"
            min={0}
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label>Quantità</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="es. 100g"
          />
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Salvataggio..." : "Aggiungi Pasto"}
      </button>
    </form>
  );
}
