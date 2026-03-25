import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import type { FoodEntry, MealType, DailyLog } from "../types";
import { MEAL_LABELS } from "../types";
import { foodsApi, daysApi } from "../services/api";
import FoodForm from "../components/FoodForm";

export default function FoodDiaryPage() {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [day, setDay] = useState<DailyLog | null>(null);
  const [activeTab, setActiveTab] = useState<MealType>("breakfast");
  const [weight, setWeight] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [f, d] = await Promise.all([
        foodsApi.getByDate(date),
        daysApi.getByDate(date),
      ]);
      setFoods(f);
      setDay(d);
      setWeight(d.weight ? String(d.weight) : "");
      setCalorieGoal(String(d.calorie_goal ?? 2000));
      setNotes(d.notes ?? "");
    } catch {
      // silently miss
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDeleteFood = async (id: number) => {
    await foodsApi.delete(id);
    load();
  };

  const handleSaveDay = async () => {
    await daysApi.update(date, {
      weight: weight ? parseFloat(weight) : undefined,
      calorie_goal: calorieGoal ? parseInt(calorieGoal, 10) : undefined,
      notes: notes || undefined,
    });
    load();
  };

  const byMeal = (mt: MealType) => foods.filter((f) => f.meal_type === mt);
  const totalCalories = foods.reduce((s, f) => s + f.calories, 0);
  const totalProtein = foods.reduce((s, f) => s + (f.protein ?? 0), 0);
  const totalCarbs = foods.reduce((s, f) => s + (f.carbs ?? 0), 0);
  const totalFats = foods.reduce((s, f) => s + (f.fats ?? 0), 0);
  const goal = day?.calorie_goal ?? 2000;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🍽️ Diario Alimentare</h1>
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

      <div className="day-settings card">
        <h3>📋 Impostazioni Giorno</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="kg"
              step="0.1"
              min={0}
            />
          </div>
          <div className="form-group">
            <label>Obiettivo Calorie</label>
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              placeholder="kcal"
              min={0}
            />
          </div>
          <div className="form-group flex-2">
            <label>Note del giorno</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Come ti senti oggi?"
            />
          </div>
          <div className="form-group form-group--center">
            <button className="btn btn--primary" onClick={handleSaveDay}>
              Salva
            </button>
          </div>
        </div>
      </div>

      <div className="calories-summary card">
        <div className="macro-grid">
          <div className="macro-item macro-item--cal">
            <span className="macro-value">{totalCalories}</span>
            <span className="macro-label">kcal</span>
            <span className="macro-goal">/ {goal}</span>
          </div>
          <div className="macro-item">
            <span className="macro-value">{totalProtein.toFixed(1)}g</span>
            <span className="macro-label">Proteine</span>
          </div>
          <div className="macro-item">
            <span className="macro-value">{totalCarbs.toFixed(1)}g</span>
            <span className="macro-label">Carboidrati</span>
          </div>
          <div className="macro-item">
            <span className="macro-value">{totalFats.toFixed(1)}g</span>
            <span className="macro-label">Grassi</span>
          </div>
        </div>
        <div className="progress-bar-track" style={{ marginTop: "0.75rem" }}>
          <div
            className={`progress-bar-fill ${totalCalories > goal ? "progress-bar-fill--over" : ""}`}
            style={{ width: `${Math.min(100, (totalCalories / goal) * 100)}%` }}
          />
        </div>
      </div>

      <div className="meal-tabs">
        {(Object.keys(MEAL_LABELS) as MealType[]).map((mt) => (
          <button
            key={mt}
            className={`meal-tab ${activeTab === mt ? "meal-tab--active" : ""}`}
            onClick={() => setActiveTab(mt)}
          >
            {MEAL_LABELS[mt]}
            {byMeal(mt).length > 0 && (
              <span className="meal-tab-count">{byMeal(mt).reduce((s, f) => s + f.calories, 0)} kcal</span>
            )}
          </button>
        ))}
      </div>

      <div className="food-list card">
        {loading ? (
          <div className="loading">Caricamento...</div>
        ) : byMeal(activeTab).length === 0 ? (
          <div className="empty-state">Nessun alimento per {MEAL_LABELS[activeTab]}</div>
        ) : (
          byMeal(activeTab).map((food) => (
            <div key={food.id} className="food-item">
              <div className="food-item-info">
                <span className="food-item-name">{food.food_name}</span>
                {food.quantity && <span className="food-item-qty">{food.quantity}</span>}
              </div>
              <div className="food-item-macros">
                <span className="food-cal">{food.calories} kcal</span>
                {food.protein > 0 && <span className="macro-chip macro-chip--p">P {food.protein}g</span>}
                {food.carbs > 0 && <span className="macro-chip macro-chip--c">C {food.carbs}g</span>}
                {food.fats > 0 && <span className="macro-chip macro-chip--f">F {food.fats}g</span>}
              </div>
              <button
                className="btn btn--danger btn--sm"
                onClick={() => handleDeleteFood(food.id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <FoodForm date={date} onAdded={load} />
    </div>
  );
}
