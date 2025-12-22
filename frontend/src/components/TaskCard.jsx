import { useState, useEffect } from "react";
import axios from "axios";
import useLookups from "../hooks/useLookups";

const API = "http://localhost:4000/tasks";

export default function TaskCard({ task, refresh }) {
  const [expanded, setExpanded] = useState(false);
  const { peopleMap, sprintMap } = useLookups();

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [draftTitle, setDraftTitle] = useState(() => task?.title || "");
  const [draftDesc, setDraftDesc] = useState(() => task?.description || "");

  useEffect(() => {
    setDraftTitle(task?.title || "");
    setDraftDesc(task?.description || "");
  }, [task]);

  const updateTask = async (patch) => {
    await axios.put(`${API}/${task.id}`, patch);
    refresh();
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className={`card task ${expanded ? "expanded" : "compact"} ${task.status
        .toLowerCase()
        .replace(" ", "-")}`}
      tabIndex={0}
      onClick={() => setExpanded(!expanded)}
      onKeyDown={e => {
        if (e.key === "Enter") setExpanded(true);
        if (e.key === "Escape") setExpanded(false);
      }}
    >
      {/* Title always visible */}
      {editingTitle ? (
        <input
          autoFocus
          value={draftTitle}
          onChange={e => setDraftTitle(e.target.value)}
          onBlur={() => {
            updateTask({ title: draftTitle });
            setEditingTitle(false);
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              updateTask({ title: draftTitle });
              setEditingTitle(false);
            }
            if (e.key === "Escape") {
              setDraftTitle(task.title);
              setEditingTitle(false);
            }
          }}
        />
      ) : (
        <h4 onClick={e => {
          e.stopPropagation();
          setEditingTitle(true);
        }}>
          {task.title}
        </h4>
      )}


      {/* Compact meta (visible only when collapsed) */}
      {!expanded && (
        <div className="task-compact-meta">
          <span
            className={`status-dot ${task.status
              .toLowerCase()
              .replace(" ", "-")}`}
          />
          <span className="assignee">
            {task.assignee ? peopleMap[task.assignee] : "Unassigned"}
          </span>
          <span className="effort">{task.effort} pts</span>
        </div>
      )}

      
      {/* Expanded content */}
      <div className="task-expanded">
        {editingDesc ? (
          <textarea
            autoFocus
            value={draftDesc}
            onChange={e => setDraftDesc(e.target.value)}
            onBlur={() => {
              updateTask({ description: draftDesc });
              setEditingDesc(false);
            }}
            onKeyDown={e => {
              if (e.key === "Escape") {
                setDraftDesc(task.description);
                setEditingDesc(false);
              }
            }}
          />
        ) : (
          <p
            onClick={e => {
              e.stopPropagation();
              setEditingDesc(true);
            }}
            style={{ cursor: "text" }}
          >
            {task.description || "Add description"}
          </p>
        )}

        <div className="task-meta" onClick={stop}>
          {/* Assignee */}
          <label>Assignee</label>
          <select
            value={task.assignee || ""}
            onChange={e =>
              updateTask({ assignee: e.target.value || null })
            }
          >
            <option value="">Unassigned</option>
            {Object.entries(peopleMap).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          {/* Sprint */}
          <label>Sprint</label>
          <select
            value={task.sprintId}
            onChange={e =>
              updateTask({ sprintId: e.target.value })
            }
          >
            {Object.entries(sprintMap).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          {/* Effort */}
          <label>Effort</label>
          <input
            type="number"
            min="1"
            value={task.effort}
            onChange={e =>
              updateTask({ effort: Number(e.target.value) })
            }
          />

          {/* Status */}
          <label>Status</label>
          <select
            value={task.status}
            onChange={e =>
              updateTask({ status: e.target.value })
            }
          >
            <option>New</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <div className="task-actions" onClick={stop}>
          <button
            className="secondary"
            onClick={() =>
              axios.delete(`${API}/${task.id}`).then(refresh)
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
