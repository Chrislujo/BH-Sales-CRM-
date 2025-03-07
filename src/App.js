import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Organizations from "./pages/Organizations";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";

const App = () => {
  // Shared state
  const [contacts, setContacts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  // Handlers for updating shared state
  const handleAddContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleAddActivity = (newActivity) => {
    setActivities([...activities, newActivity]);
  };

  const handleAddOrganization = (newOrganization) => {
    setOrganizations([...organizations, newOrganization]);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <TopBar />
          <div className="page-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    contacts={contacts}
                    tasks={tasks}
                    activities={activities}
                    organizations={organizations}
                  />
                }
              />
              <Route
                path="/contacts"
                element={
                  <Contacts
                    contacts={contacts}
                    setContacts={setContacts}
                    tasks={tasks}
                    setTasks={setTasks}
                    activities={activities}
                    setActivities={setActivities}
                    onAddContact={handleAddContact}
                    onAddTask={handleAddTask}
                    onAddActivity={handleAddActivity}
                    organizations={organizations}
                  />
                }
              />
              <Route
                path="/tasks"
                element={
                  <Tasks
                    tasks={tasks}
                    setTasks={setTasks}
                    contacts={contacts}
                  />
                }
              />
              <Route
                path="/organizations"
                element={
                  <Organizations
                    organizations={organizations}
                    setOrganizations={setOrganizations}
                    contacts={contacts}
                    onAddOrganization={handleAddOrganization}
                  />
                }
              />
              <Route
                path="/calendar"
                element={<Calendar tasks={tasks} activities={activities} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
