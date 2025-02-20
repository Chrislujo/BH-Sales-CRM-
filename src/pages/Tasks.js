import React, { useState } from "react";
import TaskForm from "../components/TaskForm";
import "./Tasks.css";

const TASK_STATUS = {
  PENDING: { label: "Pending", color: "#ffc107" },
  IN_PROGRESS: { label: "In Progress", color: "#17a2b8" },
  COMPLETED: { label: "Completed", color: "#28a745" },
  CANCELLED: { label: "Cancelled", color: "#dc3545" },
};

const Tasks = ({ tasks, setTasks, contacts }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const handleCreateTask = (newTask) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === newTask.id ? newTask : task)));
      setEditingTask(null);
    } else {
      setTasks([newTask, ...tasks]);
    }
    setIsFormOpen(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filteredTasks = filterStatus
    ? tasks.filter((task) => task.status === filterStatus)
    : tasks;

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="tasks-title">
          <h1>Tasks</h1>
          <span className="task-count">{tasks.length} tasks</span>
        </div>
        <button className="create-task-btn" onClick={() => setIsFormOpen(true)}>
          + New Task
        </button>
      </div>

      <div className="tasks-filters">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="">All Status</option>
          {Object.entries(TASK_STATUS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <span className={`task-type type-${task.type.toLowerCase()}`}>
                {task.type}
              </span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className={`status-badge status-${task.status.toLowerCase()}`}
              >
                {Object.entries(TASK_STATUS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <h3>{task.title}</h3>
            <p className="task-description">{task.description}</p>
            <div className="task-footer">
              <div className="task-due">
                Due:{" "}
                {new Date(`${task.dueDate} ${task.dueTime}`).toLocaleString()}
              </div>
              <button
                className="edit-task-btn"
                onClick={() => {
                  setEditingTask(task);
                  setIsFormOpen(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default Tasks;
