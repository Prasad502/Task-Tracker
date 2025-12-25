import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import People from "./pages/People";
import Sprints from "./pages/Sprints";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public: login */}
      <Route path="/login" element={<Login />} />

      {/* Protected area */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/people" element={<People />} />
          <Route path="/sprints" element={<Sprints />} />
        </Route>
      </Route>
    </Routes>
  );
}