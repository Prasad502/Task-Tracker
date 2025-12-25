import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Profile from './Profile';

export default function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <div className="app-header">
          <Profile />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
