import useLookups from "../hooks/useLookups";

export default function SprintSummary({ tasks }) {
  const { peopleMap } = useLookups();

  const total = tasks.length;
  const newCount = tasks.filter(t => t.status === "New").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const done = tasks.filter(t => t.status === "Done").length;

  const effortDone = tasks
    .filter(t => t.status === "Done")
    .reduce((sum, t) => sum + t.effort, 0);

  const byPerson = {};
  tasks.forEach(t => {
    if (t.status === "Done" && t.assignee) {
      byPerson[t.assignee] =
        (byPerson[t.assignee] || 0) + t.effort;
    }
  });

  return (
    <div className="card">
      <h3>Sprint Summary</h3>

      {/* High-level stats */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <Stat label="Total Tasks" value={total} />
        <Stat label="New" value={newCount} />
        <Stat label="In Progress" value={inProgress} />
        <Stat label="Completed" value={done} />
        <Stat label="Effort Done" value={`${effortDone} pts`} />
      </div>

      {/* Per-person effort */}
      {Object.keys(byPerson).length > 0 && (
        <>
          <hr style={{ margin: "16px 0", opacity: 0.2 }} />
          <h4>Effort by Person (Done)</h4>

          {Object.entries(byPerson).map(([personId, effort]) => (
            <p key={personId}>
              {peopleMap[personId] || "Unassigned"}: {effort} pts
            </p>
          ))}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: "13px", opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: 600 }}>{value}</div>
    </div>
  );
}
