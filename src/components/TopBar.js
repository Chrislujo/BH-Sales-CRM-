import React from "react";
import "./TopBar.css";

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="top-nav">
        <button className="create-button">+ Create</button>
        <div className="user-profile">
          <img src="/avatar.png" alt="User Profile" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
