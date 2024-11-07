import React, { useContext, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserCalendarCreateOrder.css';
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';

const UserCalendarCreateOrder = () => {
  const localizer = momentLocalizer(moment);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editEvent, setEditEvent] = useState({ title: '', start: new Date(), end: new Date() });
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', contact: '' });
  const [error, setError] = useState('');
  const { workerId, serviceId } = location.state;
  const { auth } = useContext(AuthContext);
  const { userId } = auth;
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/orders/${userId}`);
        const orders = response.data
          .filter(order => order.status !== 'Declined') 
          .map(order => ({
            ...order,
            orderId: order._id,
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
  }, [userId]);

  const handleSlotSelected = ({ start, end }) => {
    setNewEvent({ title: '', start, end, contact: '' }); 
  };

  const validateEvent = (event) => {
    if (!event.title) {
      setError("Title is required for the order.");
      return false;
    }
    if (!event.start || !event.end) {
      setError("Start and end times are required.");
      return false;
    }
    if (!event.contact) {
      setError("Contact is required.");
      return false;
    }
    return true;
  };

  const handleSaveNewEvent = async () => {
    setApiError('');
    setError('');
    if (newEvent && validateEvent(newEvent)) {
      try {
        const orderData = {
          userId: userId,
          serviceId: serviceId,
          userContact: newEvent.contact,
          startDate: (newEvent.start).toISOString(),
          endDate: (newEvent.end).toISOString(), 
          description: newEvent.title,
        };

        const response = await axios.post(`http://localhost:3001/user/create-order`, orderData);

        setEvents([
          ...events,
          {
            ...newEvent,
            start: newEvent.start, 
            end: newEvent.end,
            status: 'Pending',
          },
        ]);

        setNewEvent({ title: '', start: '', end: '', contact: '' });
        setError(''); 
      } 
        catch (error) {

    setApiError(error.response?.data?.message || "An error occurred while creating the order.");
}
    }
  };

  const handleInputChange = (e, isNewEvent = false) => {
    const { name, value } = e.target;
    if (name === 'start' || name === 'end') {
      const dateValue = new Date(value);
      if (isNewEvent) {
        setNewEvent({ ...newEvent, [name]: dateValue });
      } else {
        setEditEvent({ ...editEvent, [name]: dateValue });
      }
    } else {
      if (isNewEvent) {
        setNewEvent({ ...newEvent, [name]: value });
      } else {
        setEditEvent({ ...editEvent, [name]: value });
      }
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditEvent(events[index]);
  };

  const handleSaveEdit = () => {
    if (validateEvent(editEvent)) {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = editEvent;
      setEvents(updatedEvents);
      setEditIndex(null);
      setError(''); 
    }
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (confirmDelete) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
    }
  };

  const groupEventsByDay = (events) => {
    const groupedEvents = events.reduce((acc, event) => {
      const day = moment(event.start).format('YYYY-MM-DD');
      if (!acc[day]) {
        acc[day] = { count: 0, start: event.start, end: event.end };
      }
      acc[day].count += 1;
      return acc;
    }, {});
  
    return Object.keys(groupedEvents).map(day => ({
      ...groupedEvents[day],
      title: `${groupedEvents[day].count} ${groupedEvents[day].count === 1 ? 'order' : 'orders'}`,
    }));
  };

  const groupedEvents = groupEventsByDay(events);

  const EventComponent = ({ event }) => {
    return (
      <div>
        {event.title}
      </div>
    );
  };

  const handleReview = (userId, orderId) => {
    navigate(`/rating`, { state: { userId, orderId } });
  };

  const generateEventColor = (status, index) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Declined':
        return 'red';
      case 'In Progress':
            return 'blue';
      case 'Done':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="calendar-container">
      <h3 className='calendar-title'>User Calendar</h3>

      <Calendar
        localizer={localizer}
        events={groupedEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={true}
        onSelectSlot={handleSlotSelected}
        components={{
          event: EventComponent,
        }}
        views={['month', 'week', 'day']}
      />

      {/* New event form */}
      {newEvent.start && (
        <div className="new-event-form">
          {apiError && <p className="error" style={{ color: 'red', marginBottom:`10px`}}>{apiError}</p>}
          <h3>Create New Order</h3>
          <label>
            Title:
            <input 
              type="text" 
              name="title" 
              value={newEvent.title} 
              onChange={(e) => handleInputChange(e, true)} 
            />
          </label>
          <label>
            Start Date:
            <input 
              type="datetime-local" 
              name="start" 
              value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")} 
              onChange={(e) => handleInputChange(e, true)} 
            />
          </label>
          <label>
            End Date:
            <input 
              type="datetime-local" 
              name="end" 
              value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")} 
              onChange={(e) => handleInputChange(e, true)} 
            />
          </label>
          <label>
            Contact:
            <input 
              type="text" 
              name="contact" 
              value={newEvent.contact} 
              onChange={(e) => handleInputChange(e, true)} 
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button onClick={handleSaveNewEvent}>Save Order</button>
        </div>
      )}

      {/* Orders list */}
      <div className="orders-list">
        <h3>Orders</h3>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index} style={{ borderLeft: `4px solid ${generateEventColor(event.status, index)}` }}>
                <div className="left">
                  <strong>{event.title}</strong>
                </div>
                <div className="right">
                  <div className="info">
                    Start: {new Date(event.start).toLocaleString()}
                  </div>
                  <div className="info">
                    End: {new Date(event.end).toLocaleString()}
                  </div>
                  <div className="info">
                    Status: <span style={{ color: `${generateEventColor(event.status, index)}` }}> {event.status}</span>
                  </div>

                  {event.status === 'Done' && (
                    <button onClick={() => handleReview(event.userId, event.orderId)}>Leave Review</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default UserCalendarCreateOrder;
