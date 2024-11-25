import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './WorkerCalendar.css';
import axios from 'axios';
import AuthContext from '../../../context/AuthProvider';

const localizer = momentLocalizer(moment);

const WorkerCalendar = () => {
  const { auth } = useContext(AuthContext);
  const { workerId } = auth;
  const [events, setEvents] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/worker/orders/${workerId}`);
        const orders = response.data.map(order => ({
          ...order,
          start: new Date(order.startDate),
          end: new Date(order.endDate),
          title: order.description,
          status: order.status,  // Using status directly as received
        }));
        setEvents(orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [workerId]);

  const today = moment().startOf('day');

  const countEventsOnDay = (events, date) => {
    const targetDate = moment(date).format('YYYY-MM-DD');
    return events.filter(
      (event) => moment(event.start).format('YYYY-MM-DD') === targetDate
    ).length;
  };

  const customEventRenderer = ({ event }) => {
    const eventCount = countEventsOnDay(events, event.start);
    return (
      <div>
        {eventCount} {eventCount === 1 ? 'order' : 'orders'}
      </div>
    );
  };

  const handleStatusChange = async (index, newStatus) => {
    try {
      const updatedEvent = { status: newStatus };  // Body format for the request
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/worker/executed-status-change/${events[index]._id}`, updatedEvent);

      const updatedEvents = [...events];
      if (newStatus === 'Declined') {
        updatedEvents.splice(index, 1); // Remove event if declined
      } else {
        updatedEvents[index] = { ...events[index], status: newStatus }; // Update status in the events array
      }
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const generateEventColor = (status, index) => {
    switch (status) {
      case 'Done':
        return 'green';
      case 'Declined':
        return 'red';
      case 'Pending':
        return '#FFCB64';
      default:
        const blueShade = 60 + (index * 10);
        return `hsl(210, 100%, ${blueShade}%)`;
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredEvents = filterStatus === 'all'
    ? events
    : events.filter(event => event.status === filterStatus);

  return (
    <div className="calendar-container">
      <h3 className='calendar-title'>Worker Calendar</h3>
      
      <div className="filter-container">
        <label htmlFor="statusFilter">Filter by status: </label>
        <select id="statusFilter" onChange={handleFilterChange} value={filterStatus}>
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 300 }}
        selectable={false} // Disable event editing
        views={['month', 'week', 'day']}
        components={{
          month: { event: customEventRenderer },
          week: { event: customEventRenderer },
          day: { event: customEventRenderer },
        }}
        eventPropGetter={(event) => {
          const backgroundColor = generateEventColor(event.status, events.indexOf(event));
          return {
            style: {
              backgroundColor,
              color: 'white'
            }
          };
        }}
      />

       <div className="orders-list">
  <h3>Orders</h3>
  {filteredEvents.length > 0 ? (
    <ul>
      {filteredEvents.map((event, index) => (
        <li
          key={index}
          style={{ backgroundColor: 'white', borderLeft: `4px solid ${generateEventColor(event.status, index)}` }}
        >
          <div className="left-part">
            <div style={{marginBottom:`15px`}}><strong>{event.title}</strong> <br /></div> 
            <div style={{color:`#555`, paddingBottom:`5px`}}>Start: {new Date(event.start).toLocaleString()} <br /></div>
            <div style={{color:`#555`,paddingBottom:`5px`}}>End: {new Date(event.end).toLocaleString()} <br /></div>
            <div style={{color:`#555`,paddingBottom:`5px`}}>Status: {event.status}</div>
          </div>
          <div className="button-section">
            {event.status === 'Pending' && (
              <>
                <button style={{ backgroundColor: 'green', width:`170px` }} onClick={() => handleStatusChange(index, 'In Progress')}>Accept</button>
                <button onClick={() => handleStatusChange(index, 'Declined')} style={{ marginLeft: '10px', backgroundColor: 'red', width:`170px`}}>Decline</button>
              </>
            )}
            {event.status === 'In Progress' && (
              <button style={{ backgroundColor: 'green', width:`170px`}} onClick={() => handleStatusChange(index, 'Done')}>Mark as Done</button>
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

export default WorkerCalendar;
