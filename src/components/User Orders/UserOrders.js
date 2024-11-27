import React, { useContext, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserOrders.css';
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
  const localizer = momentLocalizer(moment);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const { auth } = useContext(AuthContext);
  const { userId } = auth;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/orders`);
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

  const generateEventColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'In Progress':
            return 'blue';
    case 'Declined':
        return 'red';
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
        selectable={false}
        components={{
          event: EventComponent,
        }}
        views={['month', 'week', 'day']}
      />

      {/* Orders list */}
      <div className="orders-list">
        <h3>Orders</h3>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index} style={{ borderLeft: `4px solid ${generateEventColor(event.status)}` }}>
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
                    Status: <span style={{ color: `${generateEventColor(event.status)}` }}> {event.status}</span>
                  </div>

                  {event.status === 'Done' && (
                    <button className='search-button' onClick={() => handleReview(event.userId, event.orderId)}>Leave Review</button>
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

export default UserOrders;