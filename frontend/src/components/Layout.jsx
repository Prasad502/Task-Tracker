import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
