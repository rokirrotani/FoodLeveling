import type { Achievement } from "../types";

interface AchievementCardProps {
  achievement: Achievement;
}

const ICONS: Record<string, string> = {
  first_day: "🌟",
  streak_3: "🔥",
  streak_7: "⚡",
  streak_30: "👑",
  first_workout: "💪",
  workouts_10: "🛡️",
  under_goal_5: "⚔️",
  first_food: "🍽️",
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const unlocked = !!achievement.unlocked_at;
  return (
    <div className={`achievement-card ${unlocked ? "achievement-card--unlocked" : "achievement-card--locked"}`}>
      <span className="achievement-icon">
        {unlocked ? (ICONS[achievement.code] ?? "🏆") : "🔒"}
      </span>
      <div>
        <div className="achievement-title">{achievement.title}</div>
        <div className="achievement-desc">{achievement.description}</div>
        {unlocked && achievement.unlocked_at && (
          <div className="achievement-date">
            Sbloccato: {new Date(achievement.unlocked_at).toLocaleDateString("it-IT")}
          </div>
        )}
      </div>
    </div>
  );
}
