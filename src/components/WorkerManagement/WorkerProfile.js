import React, { useState, useEffect } from 'react';
import './WorkerProfile.css'; // import the CSS file
import { workerGetDataApi } from '../../api/axios'; // Import your worker API function
import axios from 'axios';

const WorkerProfile = () => {
  const defaultProfilePic = '/images/planet-earth.png'; // Default image
  const [worker, setWorker] = useState({
    fullName: '',
    uniqueId: '',
    email: '',
    contact: '',
    profilePicture: null,
    services: [] // Array to store services
  });

  const [rating, setRating] = useState(null); // State for rating
  const [responseMessage, setResponseMessage] = useState('');
  const [services, setServices] = useState([]); // State for services

  // Retrieve workerId from local storage
  const workerId = localStorage.getItem('selectedWorkerId');

  // Fetch worker data and services
  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const response = await axios.get(`http://3.70.72.246:3001/worker/${workerId}`);
        const workerData = response.data;

        // Set worker data including services
        setWorker(workerData);

        // Set rating if available
        setRating(workerData.rating);

        // Set services
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
            <div className="profile-image" style={{ backgroundImage: `url(${defaultProfilePic})` }}>
              <img
                src="./mester.png" // Placeholder for profile picture
                alt="Profile"
                onError={(e) => e.target.style.display = 'none'} // Hide image if not found
              />
            </div>
          </div>
          <div className="profile-info">
            <h2>{worker.fullName}</h2>
          </div>
        </div>

        {/* Section with personal and service information */}
        <div className="profile-columns">
          {/* Column 1: Personal Information */}
          <div className="profile-column">
            <h3>Personal Information</h3>
            <div className="info-block">
              <div className="info-row">
                <span>Name and Surname:</span>
                <span>{worker.fullName || 'Ion Popescu'}</span>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <span>{worker.email || 'ionpopescu@gmail.com'}</span>
              </div>
              <div className="info-row">
                <span>Phone Number:</span>
                <span>{worker.contact || '073 980 123'}</span>
              </div>
              <div className="info-row">
                <span>Ratings:</span>
                <span>{rating !== null ? rating : 'Loading...'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="profile-column">
            <h3>Services</h3>
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
