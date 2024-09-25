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
  const [newEvent, setNewEvent] = useState(null);
  const [error, setError] = useState('');

  const { workerId, serviceId } = location.state;
  const { auth } = useContext(AuthContext);
  const { userId } = auth;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://3.70.72.246:3001/user/orders/${userId}`);
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

  const today = moment().startOf('day');

  const handleSlotSelected = ({ start, end }) => {
    setNewEvent({ title: '', start, end });
  };

  const checkAvailability = async (start) => {
    try {
      const availabilityResponse = await axios.post(
        `http://3.70.72.246:3001/user/worker/availability/${workerId}`,
        { date: new Date(start).toISOString() }
      );
      return availabilityResponse.data.available;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false; // Assume not available if there's an error
    }
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
    return true;
  };

  const handleSaveNewEvent = async () => {
    if (newEvent && validateEvent(newEvent)) {
      try {
        console.log("Creating a new order with event data:", newEvent);

        // Check worker availability for the selected start time
        const isAvailable = await checkAvailability(newEvent.start);
        if (!isAvailable) {
          setError("The worker is not available at the selected time. Please choose another time slot.");
          return;
        }

        // Fetch user data using the /user/:userId API
        const userResponse = await axios.get(`http://3.70.72.246:3001/user/${userId}`);
        const userData = userResponse.data;
        const userContact = userData.contact || "+37368126027"; // Replace with actual contact
        
        // Prepare order data
        const orderData = {
          userId: userId,
          serviceId: serviceId,
          userContact: userContact,
          startDate: new Date(newEvent.start).toISOString(),
          endDate: new Date(newEvent.end).toISOString(),
          description: newEvent.title,
        };

        const response = await axios.post(`http://3.70.72.246:3001/user/create-order`, orderData);
        console.log("Order created successfully:", response.data);

        // Update events state
        setEvents([
          ...events,
          {
            ...newEvent,
            start: new Date(newEvent.start).toISOString(),
            end: new Date(newEvent.end).toISOString(),
            status: 'pending',
          },
        ]);
        setNewEvent(null);
        setError(''); // Clear any previous error messages
      } catch (error) {
        console.error("Error creating new order:", error);
      }
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
    if (validateEvent(editEvent)) {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = editEvent;
      setEvents(updatedEvents);
      setEditIndex(null);
      setError(''); // Clear any previous error messages
    }
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (confirmDelete) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
    }
  };

  const groupEventsByDay = () => {
    const eventCountByDay = {};
    events.forEach(event => {
      const day = moment(event.start).format('YYYY-MM-DD');
      eventCountByDay[day] = (eventCountByDay[day] || 0) + 1;
    });
    return eventCountByDay;
  };

  const generateEventColor = (status, index) => {
    switch (status) {
      case 'Done':
        return 'green';
      case 'Pending':
        return '#FFCB64'
      default:
        const blueShade = 60 + (index * 10);
        return `hsl(210, 100%, ${blueShade}%)`;
    }
  };

  const eventCountByDay = groupEventsByDay();

  // Custom event component to display number of events per day
  const EventComponent = ({ event }) => {
    const day = moment(event.start).format('YYYY-MM-DD');
    const eventCount = eventCountByDay[day];
    return (
      <div>
        {eventCount} {eventCount === 1 ? 'order' : 'orders'}
      </div>
    );
  };


  const handleReview = (userId, orderId) => {
    navigate(`/rating`, { state: {userId, orderId} });
};

  return (
    <div className="calendar-container">
      <h3 className='calendar-title'>User Calendar</h3>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={{
          event: EventComponent, 
        }}
        views={['month', 'week', 'day']}
      />

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
              Status: <span style={{color:`${generateEventColor(event.status, index)}`}}> {event.status}</span>
            </div>

            {/* Butonul apare doar când statusul este 'Done' */}
            {event.status === 'Done' && (
              <button onClick={()=>handleReview(event.userId, event.orderId)}>Leave Review</button>
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
