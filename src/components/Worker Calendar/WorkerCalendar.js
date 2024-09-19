// WorkerCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './WorkerCalendar.css';
import { workerGetOrdersApi } from "../../api/axios";

const localizer = momentLocalizer(moment);

const WorkerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track which event is being edited
  const [editEvent, setEditEvent] = useState({ title: '', start: new Date(), end: new Date() });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workerId = "66e7da37e4c48248a5197c49";
        const response = await workerGetOrdersApi.get(`/worker/orders/${workerId}`);
        const appointments = response.data.map(appointment => ({
          ...appointment,
          start: new Date(appointment.startDate),
          end: new Date(appointment.endDate),
          title: appointment.description
        }));
        setEvents(appointments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSlotSelected = ({ start, end }) => {
    const title = window.prompt('New Availability Slot: Start and End Time?');
    if (title) {
      setEvents([...events, { title, start, end }]);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditEvent(events[index]);
  };

  const handleSaveEdit = () => {
    const updatedEvents = [...events];
    updatedEvents[editIndex] = editEvent;
    setEvents(updatedEvents);
    setEditIndex(null); // Close the edit form
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
    if (confirmDelete) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditEvent({ ...editEvent, [name]: value });
  };

  const generateBlueShade = (index) => {
    const hue = (index * 40) % 360; // Generates different hues of blue
    return `hsl(${hue}, 100%, 75%)`;
  };

  return (
      <div className="calendar-container">
        {/* Smaller Calendar */}
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 300 }}
            selectable
            onSelectSlot={handleSlotSelected}
            views={['month', 'week', 'day']}
        />

        {/* Appointments List Below Calendar */}
        <div className="appointments-list">
          <h3>Appointments</h3>
          {events.length > 0 ? (
              <ul>
                {events.map((event, index) => (
                    <li key={index} style={{ backgroundColor: generateBlueShade(index) }}>
                      <strong>{event.title}</strong> <br />
                      Start: {new Date(event.start).toLocaleString()} <br />
                      End: {new Date(event.end).toLocaleString()} <br />
                      Status: {event.status} <br />
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)} style={{ marginLeft: '10px' }}>Delete</button>
                    </li>
                ))}
              </ul>
          ) : (
              <p>No appointments available.</p>
          )}
        </div>

        {/* Edit Form */}
        {editIndex !== null && (
            <div className="edit-form">
              <h3>Edit Appointment</h3>
              <label>
                Title:
                <input type="text" name="title" value={editEvent.title} onChange={handleInputChange} />
              </label>
              <label>
                Start Time:
                <input type="datetime-local" name="start" value={moment(editEvent.start).format('YYYY-MM-DDTHH:mm')} onChange={handleInputChange} />
              </label>
              <label>
                End Time:
                <input type="datetime-local" name="end" value={moment(editEvent.end).format('YYYY-MM-DDTHH:mm')} onChange={handleInputChange} />
              </label>
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditIndex(null)} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
        )}
      </div>
  );
};

export default WorkerCalendar;
