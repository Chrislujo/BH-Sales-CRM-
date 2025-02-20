import React, { useState } from "react";
import "./ActivityLog.css";

const ACTIVITY_TYPES = {
  CALL: { label: "Call", icon: "📞" },
  EMAIL: { label: "Email", icon: "✉️" },
  MEETING: { label: "Meeting", icon: "📅" },
  NOTE: { label: "Note", icon: "📝" },
  TASK: { label: "Task", icon: "✓" },
};

const ActivityLog = ({ contactId, activities, onAddActivity }) => {
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: "CALL",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddActivity({
      ...newActivity,
      id: Date.now(),
      contactId,
      timestamp: new Date(
        `${newActivity.date} ${newActivity.time}`
      ).toISOString(),
    });
    setNewActivity({
      type: "CALL",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setShowForm(false);
  };

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h3>Activity Log</h3>
        <button className="add-activity-btn" onClick={() => setShowForm(true)}>
          + Add Activity
        </button>
      </div>

      {showForm && (
        <div className="activity-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <select
                value={newActivity.type}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    type: e.target.value,
                  })
                }
              >
                {Object.entries(ACTIVITY_TYPES).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newActivity.date}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    date: e.target.value,
                  })
                }
              />
              <input
                type="time"
                value={newActivity.time}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    time: e.target.value,
                  })
                }
              />
            </div>
            <textarea
              placeholder="Activity description..."
              value={newActivity.description}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  description: e.target.value,
                })
              }
              required
            />
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit">Save Activity</button>
            </div>
          </form>
        </div>
      )}

      <div className="activity-list">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {ACTIVITY_TYPES[activity.type].icon}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-type">
                    {ACTIVITY_TYPES[activity.type].label}
                  </span>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="activity-description">{activity.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-activities">
            <p>No activities logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
