import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./TopBar.css";

const TopBar = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notifications - in a real app, these would come from props or context
  const notifications = [
    {
      id: 1,
      type: "task",
      message: "Task 'Follow up with Client X' is due today",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "contact",
      message: "New contact 'Jane Smith' was added",
      time: "Yesterday",
    },
    {
      id: 3,
      type: "meeting",
      message: "Meeting with ABC Corp scheduled for tomorrow",
      time: "Yesterday",
    },
  ];

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return "Dashboard";
      case "/contacts":
        return "Contacts";
      case "/organizations":
        return "Organizations";
      case "/tasks":
        return "Tasks";
      case "/calendar":
        return "Calendar";
      default:
        return "Basis CRM";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement global search functionality
    console.log("Searching for:", searchQuery);
    // In a real app, you would trigger a search action here
  };

  return (
    <div className="top-bar">
      <div className="page-context">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="top-bar-actions">
        <form className="global-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search across all data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>

        <div className="quick-actions">
          <button className="quick-action-btn" title="Create Task">
            ✓ Task
          </button>
          <button className="quick-action-btn" title="Schedule Meeting">
            📅 Meeting
          </button>
          <button className="quick-action-btn" title="Add Contact">
            👤 Contact
          </button>
        </div>

        <div className="notification-center">
          <button
            className="notification-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Mark all as read</button>
              </div>

              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <div className={`notification-icon ${notification.type}`}>
                        {notification.type === "task" && "✓"}
                        {notification.type === "contact" && "👤"}
                        {notification.type === "meeting" && "📅"}
                      </div>
                      <div className="notification-content">
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
              </div>

              <div className="notifications-footer">
                <button className="view-all">View all notifications</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
