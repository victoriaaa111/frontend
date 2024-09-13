import React from 'react';
import { Link } from "react-router-dom";
import './WorkerProfile.css'; // import the CSS file

const Worker = () => {
  const defaultProfilePic = '/images/planet-earth.png'; // Imaginea prestabilită

  return (
    <div className="profile-container">
      <div className="profile-content white-box">
        <div className="profile-header">
          <div className="profile-pic">
            <div className="profile-image" style={{ backgroundImage: `url(${defaultProfilePic})` }}>
              <img
                src="./mester.png" // Placeholder pentru imaginea de profil
                alt="Profile"
                onError={(e) => e.target.style.display = 'none'} // Ascunde imaginea dacă nu poate fi încărcată
              />
            </div>
          </div>
          <div className="profile-info">
            <h2>Ion Popescu</h2>
            <p>Electric</p>
            <p>Electrician</p>
          </div>
        </div>

        {/* Secțiunea combinată cu două coloane */}
        <div className="profile-columns">
          {/* Coloana 1: Informații personale */}
          <div className="profile-column">
            <h3>Personal Information</h3>
            <div className="info-block">
              <div className="info-row">
                <span>Name and Surname:</span>
                <span>Ion Popescu</span>
              </div>
              <div className="info-row">
                <span>Nickname:</span>
                <span>ionut_pop12</span>
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
                <span>Password:</span>
                <span>*****</span>
              </div>
              <div className="info-row">
                <span>Ratings:</span>
                <span>4.5</span>
              </div>
            </div>
          </div>

          {/* Coloana 2: Informații despre servicii */}
          <div className="profile-column">
            <h3>Service Information</h3>
            <div className="info-block">
              <div className="info-row">
                <span>Service Offered:</span>
                <span>Electric</span>
              </div>
              <div className="info-row">
                <span>Add more service:</span>
                <span>Electrician</span>
              </div>
              <div className="info-row">
                <span>Service Description:</span>
                <span>Cel mai bun electric și electrician</span>
              </div>
              <div className="info-row">
                <span>Hourly Rate:</span>
                <span>20</span>
              </div>
            </div>
          </div>
        </div>

        {/* Container pentru buton */}
        <div className="edit-button-container">
          <Link to="/worker-profile">
            <button className="edit-button1">Edit Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Worker;