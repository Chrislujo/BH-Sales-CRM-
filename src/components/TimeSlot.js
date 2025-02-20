import React from "react";
import { useDrop } from "react-dnd";
import "./TimeSlot.css";

const TimeSlot = ({ children, date, time, isHeader, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "EVENT",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={!isHeader ? drop : null}
      className={`time-slot ${isOver ? "drop-target" : ""} ${
        isHeader ? "header" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default TimeSlot;
