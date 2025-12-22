import api from "../api";
import { useEffect, useState } from "react";

export default function AddTask({ onAdd }) {
  const [people, setPeople] = useState([]);
  const [sprints, setSprints] = useState([]);

  const [task, setTask] = useState({
    title: "",
    description: "",
    effort: 1,
    assignee: null,     // ✅ start unassigned
    sprintId: "",       // ✅ must be selected
    status: "New"
  });

  useEffect(() => {
    const load = async () => {
      const peopleRes = await api.get("/people");
      const sprintRes = await api.get("/sprints");

      setPeople(peopleRes.data);
      setSprints(sprintRes.data);
    };

    load();
  }, []);

  const submit = async () => {
    if (!task.sprintId) {
      alert("Please select a sprint");
      return;
    }

    await api.post("/tasks", task);

    setTask({
      title: "",
      description: "",
      effort: 1,
      assignee: null,
      sprintId: "",
      status: "New"
    });

    onAdd && onAdd();
  };

  return (
  <div className="card">
    <h3>Add Task</h3>

    <label>Title</label>
    <input
      value={task.title}
      onChange={e => setTask({ ...task, title: e.target.value })}
    />

    <label>Description</label>
    <input
      value={task.description}
      onChange={e => setTask({ ...task, description: e.target.value })}
    />

    <label>Effort (points)</label>
    <input
      type="number"
      min="1"
      value={task.effort}
      onChange={e => setTask({ ...task, effort: +e.target.value })}
    />

    <label>Assignee</label>
    <select
      value={task.assignee || ""}
      onChange={e =>
        setTask({ ...task, assignee: e.target.value || null })
      }
    >
      <option value="">Unassigned</option>
      {people.map(p => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>

    <label>Sprint</label>
    <select
      value={task.sprintId}
      onChange={e => setTask({ ...task, sprintId: e.target.value })}
    >
      <option value="">Select Sprint</option>
      {sprints.map(s => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>

    <button onClick={submit}>Add Task</button>
  </div>
);
}
