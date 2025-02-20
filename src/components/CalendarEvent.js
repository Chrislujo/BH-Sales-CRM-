import React from "react";
import { useDrag } from "react-dnd";
import "./CalendarEvent.css";

const CalendarEvent = ({ event, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "EVENT",
    item: event,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`calendar-event ${event.type.toLowerCase()} ${
        isDragging ? "dragging" : ""
      }`}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="event-time">{event.startTime}</span>
      <span className="event-title">{event.title}</span>
    </div>
  );
};

export default CalendarEvent;
