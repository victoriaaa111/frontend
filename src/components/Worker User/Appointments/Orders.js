import React, { useState, useEffect } from 'react';
import { workerOrder } from '../../../api/axios';


const Appointments = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const workerId = "66ebcc2ebc30c5937b32527e";
        const response = await workerOrder(workerId).get(`http://3.70.72.246:3001/worker/orders/${workerId}`);
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
    <div className="appointments-list">
          <h3>Appointments</h3>
          {events.length > 0 ? (
              <ul>
                {events.map((event, index) => (
                    <li key={index}>
                      <strong>{event.title}</strong> <br />
                      Start: {new Date(event.start).toLocaleString()} <br />
                      End: {new Date(event.end).toLocaleString()} <br />
                      Status: {event.status} <br />

                    </li>
                ))}
              </ul>
          ) : (
              <p>No appointments available.</p>
          )}
        </div>
}

export default Appointments;