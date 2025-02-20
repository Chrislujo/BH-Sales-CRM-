import React, { useState } from "react";
import "./Contacts.css";
import ContactForm from "../components/ContactForm";
import ConfirmationModal from "../components/ConfirmationModal";
import ActivityLog from "../components/ActivityLog";
import TaskForm from "../components/TaskForm";

const Contacts = ({
  contacts,
  setContacts,
  tasks,
  setTasks,
  activities,
  setActivities,
  onAddContact,
  onAddTask,
  onAddActivity,
}) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);

  const handleCreateContact = (formData) => {
    // For now, we'll just log the data
    console.log("New Contact:", formData);
    // Here you would typically make an API call to save the contact

    // Create a new contact object with an ID
    const newContact = {
      id: contacts.length + 1,
      ...formData,
      lastContact: new Date().toISOString().split("T")[0],
    };

    // Update the contacts list
    setContacts([...contacts, newContact]);
    setIsCreateModalOpen(false);
  };

  const handleEditContact = (updatedContact) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === updatedContact.id ? updatedContact : contact
    );
    setContacts(updatedContacts);
    setSelectedContact(updatedContact);
    setIsEditModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactToDelete.id
    );
    setContacts(updatedContacts);
    setSelectedContact(null);
    setIsDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType ? contact.type === filterType : true;

    return matchesSearch && matchesFilter;
  });

  const handleAddActivity = (newActivity) => {
    setActivities([newActivity, ...activities]);
  };

  const handleCreateTask = (newTask) => {
    const taskWithContact = {
      ...newTask,
      contactId: selectedContact.id,
      contactName: selectedContact.name,
    };
    setTasks([taskWithContact, ...tasks]);
    setIsTaskFormOpen(false);
  };

  const handleLogCall = (contact) => {
    const newActivity = {
      id: Date.now(),
      contactId: contact.id,
      type: "CALL",
      description: "Phone call",
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [...prev, newActivity]);

    // Update contact's lastContact
    const updatedContact = {
      ...contact,
      lastContact: new Date().toISOString(),
    };
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? updatedContact : c))
    );
  };

  const handleScheduleMeeting = (contact) => {
    setIsActivityFormOpen(true);
  };

  const handleSendEmail = (contact) => {
    const newActivity = {
      id: Date.now(),
      contactId: contact.id,
      type: "EMAIL",
      description: "Email sent",
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [...prev, newActivity]);

    // Update contact's lastContact
    const updatedContact = {
      ...contact,
      lastContact: new Date().toISOString(),
    };
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? updatedContact : c))
    );
  };

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <div className="contacts-title">
          <h1>Contacts</h1>
          <span className="contact-count">{contacts.length} contacts</span>
        </div>
        <button
          className="create-contact-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + New Contact
        </button>
      </div>

      <div className="contacts-container">
        <div className="contacts-list">
          <div className="contacts-list-header">
            <div className="search-filter-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="contact-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </div>
              <select
                className="contact-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Wound Care">Wound Care</option>
                <option value="PCP">PCP</option>
                <option value="Pain Management">Pain Management</option>
                <option value="Urgent Care">Urgent Care</option>
              </select>
            </div>
            {(searchTerm || filterType) && (
              <div className="active-filters">
                <span className="results-count">
                  {filteredContacts.length}{" "}
                  {filteredContacts.length === 1 ? "result" : "results"}
                </span>
                {(searchTerm || filterType) && (
                  <button
                    className="clear-filters"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="contacts-list-content">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`contact-list-item ${
                    selectedContact?.id === contact.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-avatar">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="contact-list-info">
                    <h3>{contact.name}</h3>
                    <p>{contact.organization}</p>
                    <span className="contact-type">{contact.type}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No contacts found</p>
                <span>Try adjusting your search or filters</span>
              </div>
            )}
          </div>
        </div>

        <div className="contact-details">
          {selectedContact ? (
            <>
              <div className="contact-details-header">
                <div className="contact-details-avatar">
                  {selectedContact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="contact-details-info">
                  <h2>{selectedContact.name}</h2>
                  <p>{selectedContact.organization}</p>
                  <span className="contact-type">{selectedContact.type}</span>
                </div>
                <button
                  className="edit-contact-btn"
                  onClick={() => {
                    setEditingContact(selectedContact);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-contact-btn"
                  onClick={() => handleDeleteClick(selectedContact)}
                >
                  Delete
                </button>
              </div>

              <div className="contact-details-content">
                <div className="contact-info-section">
                  <h3>Contact Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{selectedContact.phone}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{selectedContact.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Last Contact</label>
                      <p>
                        {new Date(
                          selectedContact.lastContact
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="contact-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleLogCall(selectedContact)}
                  >
                    <span className="icon">📞</span>
                    Log Call
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleScheduleMeeting(selectedContact)}
                  >
                    <span className="icon">📅</span>
                    Schedule Meeting
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleSendEmail(selectedContact)}
                  >
                    <span className="icon">✉️</span>
                    Send Email
                  </button>
                </div>
              </div>

              {selectedContact && (
                <ActivityLog
                  contactId={selectedContact.id}
                  activities={activities.filter(
                    (a) => a.contactId === selectedContact.id
                  )}
                  onAddActivity={handleAddActivity}
                />
              )}

              {selectedContact && (
                <div className="contact-tasks">
                  <div className="section-header">
                    <h3>Tasks</h3>
                    <button
                      className="add-task-btn"
                      onClick={() => setIsTaskFormOpen(true)}
                    >
                      + Add Task
                    </button>
                  </div>

                  <div className="tasks-grid">
                    {tasks
                      .filter((task) => task.contactId === selectedContact.id)
                      .map((task) => (
                        <div key={task.id} className="task-card">
                          <div className="task-header">
                            <span
                              className={`task-type type-${task.type.toLowerCase()}`}
                            >
                              {task.type}
                            </span>
                            <span
                              className={`status-badge status-${task.status.toLowerCase()}`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <h4>{task.title}</h4>
                          {task.description && (
                            <p className="task-description">
                              {task.description}
                            </p>
                          )}
                          <div className="task-footer">
                            <span className="task-due">
                              Due:{" "}
                              {new Date(
                                `${task.dueDate} ${task.dueTime}`
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    {tasks.filter(
                      (task) => task.contactId === selectedContact.id
                    ).length === 0 && (
                      <p className="no-tasks">
                        No tasks assigned to this contact
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-contact-selected">
              <p>Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <ContactForm
          onSubmit={handleCreateContact}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <ContactForm
          mode="edit"
          initialData={editingContact}
          onSubmit={handleEditContact}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingContact(null);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setContactToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact"
        message={`Are you sure you want to delete ${contactToDelete?.name}? This action cannot be undone.`}
      />

      {isTaskFormOpen && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setIsTaskFormOpen(false)}
        />
      )}

      {isActivityFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Schedule Meeting</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newActivity = {
                  id: Date.now(),
                  contactId: selectedContact.id,
                  type: "MEETING",
                  description: formData.get("description"),
                  timestamp: `${formData.get("date")}T${formData.get("time")}`,
                };
                setActivities((prev) => [...prev, newActivity]);
                setIsActivityFormOpen(false);
              }}
            >
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" name="time" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Meeting details..."
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsActivityFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit">Schedule Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
