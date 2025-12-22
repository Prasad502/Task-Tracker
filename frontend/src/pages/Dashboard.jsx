import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../components/TaskCard";
import SprintSummary from "../components/SprintSummary";
import useLookups from "../hooks/useLookups";

const API = "http://localhost:4000/tasks";
const STATUSES = ["New", "In Progress", "Done"];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    sprintId: "",
    assignee: "",
    status: ""
  });

  const { peopleMap, sprintMap } = useLookups();

  /* -------------------- Load tasks -------------------- */
  const loadTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /* -------------------- Filtering -------------------- */
  const filteredTasks = tasks.filter(t => {
    if (filters.sprintId && t.sprintId !== filters.sprintId) return false;
    if (filters.assignee && t.assignee !== filters.assignee) return false;
    if (filters.status && t.status !== filters.status) return false;
    return true;
  });

  /* -------------------- Sprint summary -------------------- */
  const activeSprintId =
    filters.sprintId || (tasks.length > 0 ? tasks[0].sprintId : null);

  const sprintTasks = activeSprintId
    ? tasks.filter(t => t.sprintId === activeSprintId)
    : [];

  /* -------------------- Drag & Drop -------------------- */
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    await axios.put(`${API}/${draggableId}`, {
      status: destination.droppableId
    });

    loadTasks();
  };

  return (
    <>
      <h2>Dashboard</h2>

      {/* Sprint Summary */}
      {activeSprintId && (
        <>
          <div style={{ marginBottom: "8px", opacity: 0.6 }}>
            Showing summary for sprint:{" "}
            <strong>{sprintMap[activeSprintId]}</strong>
          </div>

          <SprintSummary tasks={sprintTasks} />
        </>
      )}

      {/* Filters */}
      <div className="card filters">
        <select
          value={filters.sprintId}
          onChange={e =>
            setFilters(f => ({ ...f, sprintId: e.target.value }))
          }
        >
          <option value="">All Sprints</option>
          {Object.entries(sprintMap).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={filters.assignee}
          onChange={e =>
            setFilters(f => ({ ...f, assignee: e.target.value }))
          }
        >
          <option value="">All People</option>
          {Object.entries(peopleMap).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={e =>
            setFilters(f => ({ ...f, status: e.target.value }))
          }
        >
          <option value="">All Status</option>
          {STATUSES.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Kanban Grid with Drag & Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {STATUSES.map(status => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="kanban-column"
                >
                  <h3>{status}</h3>

                  {filteredTasks
                    .filter(t => t.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? "dragging" : ""}
                          >
                            <TaskCard
                              task={task}
                              refresh={loadTasks}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
