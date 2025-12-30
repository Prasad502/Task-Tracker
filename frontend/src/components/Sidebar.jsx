import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.body.dataset.theme = saved === "dark" ? "dark" : "";
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.dataset.theme = next === "dark" ? "dark" : "";
  };

  return (
    <aside className="sidebar">
      <h2>Tasker</h2>

      <NavLink to="/" className="nav">
        Dashboard
      </NavLink>

      <NavLink to="/tasks" className="nav">
        Add Task
      </NavLink>

      <NavLink to="/people" className="nav">
        People
      </NavLink>

      <NavLink to="/sprints" className="nav">
        Sprints
      </NavLink>

      <NavLink to="/chat" className="nav">
        Chat
      </NavLink>

      <div style={{ marginTop: "auto" }}>
        <button className="secondary" onClick={toggleTheme}>
          {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
