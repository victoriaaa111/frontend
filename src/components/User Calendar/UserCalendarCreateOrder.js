// WorkerCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserCalendarCreateOrder.css';
import { workerGetOrdersApi } from "../../api/axios";

const localizer = momentLocalizer(moment);

const UserCalendarCreateOrder = () => {
  const [events, setEvents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editEvent, setEditEvent] = useState({ title: '', start: new Date(), end: new Date() });
  const [newEvent, setNewEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workerId = "66e7da37e4c48248a5197c49";
        const response = await workerGetOrdersApi.get(`/worker/orders/${workerId}`);
        const orders = response.data.map(order => ({
          ...order,
          start: new Date(order.startDate),
          end: new Date(order.endDate),
          title: order.description
        }));
        setEvents(orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
  const today = moment().startOf('day');

  const countEventsOnDay = (events, date) => {
    const targetDate = moment(date).format('YYYY-MM-DD');
    return events.filter(
      (event) => moment(event.start).format('YYYY-MM-DD') === targetDate
    ).length;
  };

  const customEventRenderer = ({ event }) => {
    // Count the total number of events on the same day
    const eventCount = countEventsOnDay(events, event.start);
  
    return (
      <div>
        {eventCount} {eventCount === 1 ? 'order' : 'orders'}
      </div>
    );
  };

  const handleSlotSelected = ({ start, end }) => {
    setNewEvent({ title: '', start, end });
  };


  const handleSaveNewEvent = () => {
    if (newEvent.title) {
      setEvents([...events, newEvent]);
      setNewEvent(null);
    }
  };

  const handleInputChange = (e, isNewEvent = false) => {
    const { name, value } = e.target;
    if (isNewEvent) {
      setNewEvent({ ...newEvent, [name]: value });
    } else {
      setEditEvent({ ...editEvent, [name]: value });
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
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (confirmDelete) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
    }
  };

  // Function to generate colors based on event status
  const generateEventColor = (status, index) => {
    switch (status) {
      case 'done':
        return 'green'; // Green for done
      case 'canceled':
        return 'red'; // Red for canceled
      case 'pending':
      default:
        const blueShade = 60 + (index * 10); // Generate varying shades of blue for pending
        return `hsl(210, 100%, ${blueShade}%)`; // Adjust lightness for different shades
    }
  };

  const groupEventsByDay = (events) => {
    const eventsByDay = {};
    
    events.forEach((event) => {
      const dateStr = moment(event.start).format('YYYY-MM-DD');
      
      if (!eventsByDay[dateStr]) {
        eventsByDay[dateStr] = [];
      }
      eventsByDay[dateStr].push(event);
    });
    
    return eventsByDay;
  };

  const EventCount = ({ events }) => {
    const dateStr = moment(events[0].start).format('YYYY-MM-DD');
    const eventCount = events.length;
  
    return (
      <div>
        {eventCount} {eventCount === 1 ? 'order' : 'orders'} on {dateStr}
      </div>
    );
  };
  
  
  return (
    <div className="calendar-container">
      <h3 className='calendar-title'>User Calendar</h3>
      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 300 }}
        selectable
        onSelectSlot={handleSlotSelected}
        views={['month', 'week', 'day']}
        components={{
          month: {
            event: customEventRenderer, // Custom event rendering for month view
          },
          week: {
            event: customEventRenderer, // Custom event rendering for week view
          },
          day: {
            event: customEventRenderer, // Custom event rendering for day view
          },
        }}
        eventPropGetter={(event) => {
          const backgroundColor = generateEventColor(event.status, events.indexOf(event));
          return {
            style: {
              backgroundColor: backgroundColor, // Set the background color based on status
              color: 'white' // Ensure text color is white for visibility
            }
          };
        }}
      />
  
      {/* New Event Form - Now above the orders list */}
      {newEvent && (
        <div className="new-event-form">
          <h3>Create New Order</h3>
          <label>
            Title:
            <input type="text" name="title" value={newEvent.title} onChange={(e) => handleInputChange(e, true)} />
          </label>
          <label>
            Start Time:
            <input type="datetime-local" name="start" value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')} onChange={(e) => handleInputChange(e, true)} />
          </label>
          <label>
            End Time:
            <input type="datetime-local" name="end" value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')} onChange={(e) => handleInputChange(e, true)} />
          </label>
          <div className="button-container">
            <button className="buton" onClick={handleSaveNewEvent}>Save</button>
            <button className="buton" onClick={() => setNewEvent(null)} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </div>
      )}
  
      {/* Orders List */}
      <div className="orders-list">
        <h3>Orders</h3>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li
                key={index}
                style={{ backgroundColor: 'white', borderLeft: `4px solid ${generateEventColor(event.status, index)}` }}
              >
                <strong>{event.title}</strong> <br />
                Start: {new Date(event.start).toLocaleString()} <br />
                End: {new Date(event.end).toLocaleString()} <br />
                Status: {event.status} <br /><br />
                <button className="buton" onClick={() => handleEdit(index)}>Edit</button>
                <br />
                <button className="buton" onClick={() => handleDelete(index)} style={{ marginLeft: '10px' }}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
  
      {/* Edit Form */}
      {editIndex !== null && (
        <div className="edit-form">
          <h3>Edit Order</h3>
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
          <button className="buton" onClick={handleSaveEdit}>Save</button>
          <button className="buton" onClick={() => setEditIndex(null)} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      )}
    </div>
  );
};  

export default UserCalendarCreateOrder;