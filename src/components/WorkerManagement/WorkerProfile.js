import React, { useState, useEffect } from 'react';
import './WorkerProfile.css'; // Import the CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthProvider";

const WorkerProfile = () => {
  const [worker, setWorker] = useState({
    fullName: '',
    uniqueId: '',
    email: '',
    contact: '',
    profilePicture: null,
    services: []
  });

  const [rating, setRating] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const workerId = localStorage.getItem('selectedWorkerId');
  const serviceId = localStorage.getItem('selectedServiceId');

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const response = await axios.get(`http://3.70.72.246:3001/worker/${workerId}`);
        const workerData = response.data;

        setWorker(workerData);
        setRating(workerData.rating);

        const serviceData = workerData.services.map(service => ({
          id: service._id,
          service: service.service,
          description: service.description,
          price: service.price
        }));
        setServices(serviceData);
      } catch (err) {
        setResponseMessage(`Error fetching worker profile: ${err.message}`);
      }
    };

    if (workerId) {
      fetchWorkerProfile();
    }
  }, [workerId]);

  return (
    <div className="profile-container">
      <div className="profile-content white-box">
        <div className="profile-header">
          <div className="profile-pic">
            <div className="profile-image">
              <img
                src="/farmer.png"
                onError={(e) => e.target.style.display = 'none'}
                alt="Profile"
              />
            </div>
          </div>
          <div className="profile-info">
            <h2 style={{color:`rgb(105,127,249)`}}>{worker.fullName}</h2>
          </div>
        </div>

        <div className="profile-columns">
          {/* Column 1: Personal Information */}
          <div className="profile-column personal-info">
            <h3 style={{color:`rgb(105,127,249)`}}>Personal Information</h3>
            <div className="info-block">
              <div className="info-row">
                <span className="info-label">Name and Surname:</span>
                <span className="info-value">{worker.fullName || 'Ion Popescu'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{worker.email || 'ionpopescu@gmail.com'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone Number:</span>
                <span className="info-value">{worker.contact || '073 980 123'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ratings:</span>
                <span className="info-value">{rating !== null ? rating : 'Loading...'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="profile-column services-info">
            <h3 style={{color:`rgb(105,127,249)`}}>Services</h3>
            <table className="info-table">
              <thead>
                <tr>
                  <th>Service Offered</th>
                  <th>Service Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map(service => (
                    <tr key={service.id}>
                      <td>{service.service}</td>
                      <td>{service.description}</td>
                      <td>${service.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No services available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
