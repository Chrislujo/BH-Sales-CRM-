import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigation items with icons and grouping
  const navItems = [
    {
      group: "Overview",
      items: [{ path: "/", label: "Dashboard", icon: "📊" }],
    },
    {
      group: "Sales CRM",
      items: [
        { path: "/contacts", label: "Contacts", icon: "👤" },
        { path: "/organizations", label: "Organizations", icon: "🏢" },
      ],
    },
    {
      group: "Activities",
      items: [
        { path: "/tasks", label: "Tasks", icon: "✓" },
        { path: "/calendar", label: "Calendar", icon: "📅" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <h1 className="app-name">Basis CRM</h1>
      </div>

      <div className="user-profile-mini">
        <div className="avatar">JD</div>
        <div className="user-info">
          <p className="user-name">John Doe</p>
          <p className="user-role">Sales Manager</p>
        </div>
      </div>

      <nav className="nav-menu">
        {navItems.map((group, index) => (
          <div key={index} className="nav-group">
            <h3 className="group-title">{group.group}</h3>
            <ul className="nav-list">
              {group.items.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      currentPath === item.path ? "active" : ""
                    }`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className="settings-link">
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </Link>
        <button className="help-button">
          <span className="nav-icon">❓</span>
          <span className="nav-label">Help</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
