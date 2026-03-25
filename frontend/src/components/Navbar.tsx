import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">⚔️</span>
        <span className="navbar-title">Shadow Log</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link nav-link--active" : "nav-link"}>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/diary" className={({ isActive }) => isActive ? "nav-link nav-link--active" : "nav-link"}>
          🍽️ Diario
        </NavLink>
        <NavLink to="/workout" className={({ isActive }) => isActive ? "nav-link nav-link--active" : "nav-link"}>
          💪 Allenamento
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => isActive ? "nav-link nav-link--active" : "nav-link"}>
          📊 Progressi
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? "nav-link nav-link--active" : "nav-link"}>
          📅 Storico
        </NavLink>
      </div>
    </nav>
  );
}
