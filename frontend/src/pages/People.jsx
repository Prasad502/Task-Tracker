import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/people";

export default function People() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const addPerson = async () => {
    if (!name.trim()) return;
    await axios.post(API, { name });
    setName("");
    load();
  };

  const removePerson = async (id) => {
    await axios.delete(`${API}/${id}`);
    load();
  };

  return (
    <>
      <h2>People</h2>

      <div className="card">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <button onClick={addPerson}>Add Person</button>
      </div>

      {people.map(p => (
        <div key={p.id} className="card">
          {p.name}
          <button
            className="secondary"
            onClick={() => removePerson(p.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </>
  );
}
