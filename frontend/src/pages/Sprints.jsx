import { useEffect, useState } from "react";
import api from "../api";

const API = "/sprints";

export default function Sprints() {
  const [sprints, setSprints] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await api.get(API);
    setSprints(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const addSprint = async () => {
    if (!name.trim()) return;
    await api.post(API, { name });
    setName("");
    load();
  };

  const removeSprint = async (id) => {
    await api.delete(`${API}/${id}`);
    load();
  };

  return (
    <>
      <h2>Sprints</h2>

      <div className="card">
        <label>Sprint Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <button onClick={addSprint}>Add Sprint</button>
      </div>

      {sprints.map(s => (
        <div key={s.id} className="card">
          {s.name}
          <button
            className="secondary"
            onClick={() => removeSprint(s.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}
