import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import People from "./pages/People";
import Sprints from "./pages/Sprints";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/people" element={<People />} />
        <Route path="/sprints" element={<Sprints />} />
      </Route>
    </Routes>
  );
}