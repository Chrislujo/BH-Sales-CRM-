import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ contacts, tasks, activities }) => {
  const getUpcomingTasks = () => {
    const today = new Date();
    return tasks
      .filter((task) => {
        const dueDate = new Date(`${task.dueDate} ${task.dueTime}`);
        return dueDate >= today && task.status !== "COMPLETED";
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.dueDate} ${a.dueTime}`);
        const dateB = new Date(`${b.dueDate} ${b.dueTime}`);
        return dateA - dateB;
      })
      .slice(0, 5);
  };

  const getRecentActivities = () => {
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  };

  const getContactStats = () => {
    const totalContacts = contacts.length;
    const recentContacts = contacts.filter((contact) => {
      const lastContact = new Date(contact.lastContact);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastContact >= thirtyDaysAgo;
    }).length;

    return { totalContacts, recentContacts };
  };

  const stats = getContactStats();
  const upcomingTasks = getUpcomingTasks();
  const recentActivities = getRecentActivities();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Contacts</h3>
          <div className="stat-value">{stats.totalContacts}</div>
        </div>
        <div className="stat-card">
          <h3>Recent Contacts</h3>
          <div className="stat-value">{stats.recentContacts}</div>
          <div className="stat-subtitle">Last 30 days</div>
        </div>
        <div className="stat-card">
          <h3>Pending Tasks</h3>
          <div className="stat-value">
            {tasks.filter((task) => task.status === "PENDING").length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Activities</h3>
          <div className="stat-value">{activities.length}</div>
          <div className="stat-subtitle">Total logged</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Tasks</h2>
            <Link to="/tasks" className="view-all">
              View All
            </Link>
          </div>
          <div className="task-list">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="dashboard-task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
                <div className="task-meta">
                  <span
                    className={`status-badge status-${task.status.toLowerCase()}`}
                  >
                    {task.status}
                  </span>
                  <span className="due-date">
                    Due:{" "}
                    {new Date(
                      `${task.dueDate} ${task.dueTime}`
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="no-data">No upcoming tasks</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Activities</h2>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="dashboard-activity-item">
                <span className="activity-icon">
                  {activity.type === "CALL"
                    ? "📞"
                    : activity.type === "EMAIL"
                    ? "✉️"
                    : activity.type === "MEETING"
                    ? "📅"
                    : "📝"}
                </span>
                <div className="activity-info">
                  <p>{activity.description}</p>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="no-data">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
