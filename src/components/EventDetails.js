import React from "react";
import "./EventDetails.css";

const EventDetails = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{event.title}</h2>

        <div className="event-info">
          <div className="info-row">
            <span className="info-label">Type</span>
            <span className="info-value">{event.type}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Date & Time</span>
            <span className="info-value">
              {new Date(event.date).toLocaleDateString()} {event.startTime} -{" "}
              {event.endTime}
            </span>
          </div>

          {event.description && (
            <div className="info-row">
              <span className="info-label">Description</span>
              <span className="info-value">{event.description}</span>
            </div>
          )}
        </div>

        <div className="event-actions">
          <button onClick={() => onDelete(event.id)}>Delete</button>
          <button onClick={() => onEdit(event)}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
