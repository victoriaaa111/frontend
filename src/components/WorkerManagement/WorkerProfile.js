import React, { useState, useEffect } from 'react';
import './WorkerProfile.css'; // import the CSS file
import { Rating } from '../../api/axios';

const Worker = () => {
  const defaultProfilePic = '/images/planet-earth.png'; // Default image
  const [rating, setRating] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const workerId = '66e7148e8d2d0146f5b42e24'; // Assuming worker ID is fixed for now

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await Rating(workerId).get(`http://3.70.72.246:3001/worker/${workerId}`);
        const workerData = response.data;
        // Assuming the workerData contains a "rating" field
        setRating(workerData.rating);
      } catch (err) {
        setResponseMessage(`Error fetching worker rating: ${err.message}`);
      }
    };

    if (workerId) {
      fetchRating();
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
            <h2>Ion Popescu</h2>
            <p>Electric</p>
            <p>Electrician</p>
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
                <span>Ion Popescu</span>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <span>ionpopescu@gmail.com</span>
              </div>
              <div className="info-row">
                <span>Phone Number:</span>
                <span>073 980 123</span>
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
                <tr>
                  <td>Electric, Electrician</td>
                  <td>Cel mai bun electric și electrician</td>
                  <td>20</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Worker;
