interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: "purple" | "blue" | "green" | "orange" | "red";
  icon?: string;
}

const COLOR_MAP: Record<string, string> = {
  purple: "stat-card--purple",
  blue: "stat-card--blue",
  green: "stat-card--green",
  orange: "stat-card--orange",
  red: "stat-card--red",
};

export default function StatCard({ label, value, sub, color = "purple", icon }: StatCardProps) {
  return (
    <div className={`stat-card ${COLOR_MAP[color]}`}>
      {icon && <span className="stat-card__icon">{icon}</span>}
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  );
}
