import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./Calendar.css";
import EventForm from "../components/EventForm";
import EventDetails from "../components/EventDetails";
import CalendarEvent from "../components/CalendarEvent";
import TimeSlot from "../components/TimeSlot";

const HOURS = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = [];

  // Add days from previous month to start on Sunday
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    daysInMonth.push({ date: prevDate, isCurrentMonth: false });
  }

  // Add days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    daysInMonth.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  // Add days from next month to complete the grid
  const remainingDays = 42 - daysInMonth.length; // 6 rows * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    daysInMonth.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    });
  }

  return daysInMonth;
};

const formatWeekRange = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End of week (Saturday)

  return `Week of ${start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const formatMonthYear = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const Calendar = ({ tasks = [], activities = [], contacts = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week"); // 'day', 'week', 'month'
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];

    // Custom events
    const customEvents = events
      .filter((event) => event.date === dateStr)
      .map((event) => ({
        ...event,
        type: event.type || "EVENT",
      }));

    // Convert tasks to events
    const taskEvents = tasks
      .filter((task) => task.dueDate === dateStr)
      .map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        description: task.description,
        date: task.dueDate,
        startTime: task.dueTime,
        endTime: task.dueTime, // You might want to add duration to tasks
        type: "TASK",
        status: task.status,
        contactId: task.contactId,
      }));

    // Convert activities to events
    const activityEvents = activities
      .filter(
        (activity) =>
          activity.type === "MEETING" &&
          activity.timestamp.split("T")[0] === dateStr
      )
      .map((activity) => ({
        id: `activity-${activity.id}`,
        title: `Meeting with ${
          contacts.find((c) => c.id === activity.contactId)?.name || "Contact"
        }`,
        description: activity.description,
        date: activity.timestamp.split("T")[0],
        startTime: activity.timestamp.split("T")[1].substring(0, 5),
        endTime: activity.timestamp.split("T")[1].substring(0, 5), // Add duration if available
        type: "MEETING",
        contactId: activity.contactId,
      }));

    return [...customEvents, ...taskEvents, ...activityEvents].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + direction);
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + direction * 7);
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const handleCreateEvent = (newEvent) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        ...newEvent,
        id: Date.now(), // Generate a unique ID
        createdAt: new Date().toISOString(),
      },
    ]);
    setIsEventFormOpen(false);
  };

  const handleEditEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
    setSelectedEvent(null);
  };

  const moveEvent = (event, date, time) => {
    setEvents((prevEvents) => {
      return prevEvents.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            date: date.toISOString().split("T")[0],
            startTime: time,
          };
        }
        return e;
      });
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-page">
        <div className="calendar-header">
          <div className="calendar-navigation">
            <button onClick={() => navigateCalendar(-1)}>←</button>
            <h2>
              {view === "month" && formatMonthYear(currentDate)}
              {view === "week" && formatWeekRange(currentDate)}
              {view === "day" && formatDate(currentDate)}
            </h2>
            <button onClick={() => navigateCalendar(1)}>→</button>
          </div>

          <div className="calendar-controls">
            <div className="view-controls">
              <button
                className={view === "day" ? "active" : ""}
                onClick={() => setView("day")}
              >
                Day
              </button>
              <button
                className={view === "week" ? "active" : ""}
                onClick={() => setView("week")}
              >
                Week
              </button>
              <button
                className={view === "month" ? "active" : ""}
                onClick={() => setView("month")}
              >
                Month
              </button>
            </div>

            <button
              className="new-event-btn"
              onClick={() => setIsEventFormOpen(true)}
            >
              + New Event
            </button>
          </div>
        </div>

        {view === "month" ? (
          <div className="month-view">
            <div className="day-headers">
              <div className="day-header">Sun</div>
              <div className="day-header">Mon</div>
              <div className="day-header">Tue</div>
              <div className="day-header">Wed</div>
              <div className="day-header">Thu</div>
              <div className="day-header">Fri</div>
              <div className="day-header">Sat</div>
            </div>

            <div className="month-grid">
              {getDaysInMonth(currentDate).map(({ date, isCurrentMonth }) => {
                const dayEvents = getEventsForDate(date);
                return (
                  <div
                    key={date.toISOString()}
                    className={`month-day ${
                      !isCurrentMonth ? "other-month" : ""
                    }`}
                  >
                    <div className="day-number">{date.getDate()}</div>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`month-event-item ${event.type.toLowerCase()}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <span className="event-time">{event.startTime}</span>
                          <span className="event-title">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="more-events">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className={`calendar-grid ${
              view === "day" ? "day-view" : "week-view"
            }`}
          >
            <div className="time-column">
              {HOURS.map((hour) => (
                <TimeSlot key={hour} time={hour} isHeader>
                  <span>{hour}</span>
                </TimeSlot>
              ))}
            </div>

            {view === "day" ? (
              <div className="day-column">
                <div className="day-header">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="day-events">
                  {HOURS.map((hour) => (
                    <TimeSlot
                      key={hour}
                      date={currentDate}
                      time={hour}
                      onDrop={(event) => moveEvent(event, currentDate, hour)}
                    >
                      {getEventsForDate(currentDate)
                        .filter((event) =>
                          event.startTime.startsWith(hour.split(":")[0])
                        )
                        .map((event) => (
                          <CalendarEvent
                            key={event.id}
                            event={event}
                            onClick={() => setSelectedEvent(event)}
                          />
                        ))}
                    </TimeSlot>
                  ))}
                </div>
              </div>
            ) : view === "week" ? (
              getWeekDates().map((date) => (
                <div key={date.toISOString()} className="day-column">
                  <div className="day-header">{formatDate(date)}</div>
                  <div className="day-events">
                    {HOURS.map((hour) => (
                      <TimeSlot
                        key={hour}
                        date={date}
                        time={hour}
                        onDrop={(event) => moveEvent(event, date, hour)}
                      >
                        {getEventsForDate(date)
                          .filter((event) =>
                            event.startTime.startsWith(hour.split(":")[0])
                          )
                          .map((event) => (
                            <CalendarEvent
                              key={event.id}
                              event={event}
                              onClick={() => setSelectedEvent(event)}
                            />
                          ))}
                      </TimeSlot>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="day-column">
                <div className="day-header">{formatDate(currentDate)}</div>
                <div className="day-events">
                  {HOURS.map((hour) => (
                    <TimeSlot
                      key={hour}
                      date={currentDate}
                      time={hour}
                      onDrop={(event) => moveEvent(event, currentDate, hour)}
                    >
                      {getEventsForDate(currentDate)
                        .filter((event) =>
                          event.startTime.startsWith(hour.split(":")[0])
                        )
                        .map((event) => (
                          <CalendarEvent
                            key={event.id}
                            event={event}
                            onClick={() => setSelectedEvent(event)}
                          />
                        ))}
                    </TimeSlot>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isEventFormOpen && (
          <EventForm
            onSubmit={handleCreateEvent}
            onClose={() => setIsEventFormOpen(false)}
          />
        )}

        {editingEvent && (
          <EventForm
            initialData={editingEvent}
            onSubmit={handleEditEvent}
            onClose={() => setEditingEvent(null)}
          />
        )}

        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={(event) => {
              setEditingEvent(event);
              setSelectedEvent(null);
            }}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Calendar;
