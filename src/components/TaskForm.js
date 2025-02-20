import React, { useState, useEffect } from "react";
import "./TaskForm.css";

const TASK_TYPES = {
  CALL: "📞 Call",
  EMAIL: "✉️ Email",
  MEETING: "📅 Meeting",
  FOLLOW_UP: "🔄 Follow Up",
  VISIT: "🏢 Visit",
  OTHER: "📋 Other",
};

const TASK_PRIORITIES = {
  HIGH: { label: "High", color: "#dc3545" },
  MEDIUM: { label: "Medium", color: "#ffc107" },
  LOW: { label: "Low", color: "#28a745" },
};

const TaskForm = ({ onSubmit, onClose, initialData = null }) => {
  const [task, setTask] = useState({
    type: "CALL",
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    priority: "MEDIUM",
    status: "PENDING",
  });

  useEffect(() => {
    if (initialData) {
      setTask(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...task,
      id: initialData?.id || Date.now(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      status: initialData?.status || "PENDING",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-form">
        <div className="modal-header">
          <h2>{initialData ? "Edit Task" : "Create New Task"}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Type</label>
            <select
              value={task.type}
              onChange={(e) => setTask({ ...task, type: e.target.value })}
            >
              {Object.entries(TASK_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
              placeholder="Enter task title..."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              placeholder="Enter task description..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Due Time</label>
              <input
                type="time"
                value={task.dueTime}
                onChange={(e) => setTask({ ...task, dueTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              {Object.entries(TASK_PRIORITIES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {initialData ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
