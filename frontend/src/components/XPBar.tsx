interface XPBarProps {
  level: number;
  xpProgress: number;
  xpForNextLevel: number;
  totalXP: number;
}

export default function XPBar({ level, xpProgress, xpForNextLevel, totalXP }: XPBarProps) {
  const pct = Math.min(100, Math.round((xpProgress / 100) * 100));

  const rankTitle = (lvl: number): string => {
    if (lvl < 5) return "E-Rank Hunter";
    if (lvl < 10) return "D-Rank Hunter";
    if (lvl < 20) return "C-Rank Hunter";
    if (lvl < 35) return "B-Rank Hunter";
    if (lvl < 50) return "A-Rank Hunter";
    return "S-Rank Hunter";
  };

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-header">
        <span className="xp-level">⚔️ Lv. {level}</span>
        <span className="xp-rank">{rankTitle(level)}</span>
        <span className="xp-total">{totalXP} XP totali</span>
      </div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="xp-bar-footer">
        <span>{xpProgress} / 100 XP</span>
        <span>Prossimo livello: {xpForNextLevel} XP</span>
      </div>
    </div>
  );
}
