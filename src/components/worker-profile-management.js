import React from 'react';
import './worker-profile-management.css';

const Worker = () => {
  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-pic">
            <img
              src="./mester.png" // Placeholder for the profile picture
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <h2>Ion Popescu</h2>
            <p>Electric</p>
            <p>Chișinău, Moldova</p>
          </div>
        </div>

        <div className="section">
          <h3>Informații Personale</h3>
          <div className="info-block">
            <div className="info-row">
              <span>Prenume</span>
              <span>Ion</span>
            </div>
            <div className="info-row">
              <span>Nume</span>
              <span>Popescu</span>
            </div>
            <div className="info-row">
              <span>Adresa Poștală</span>
              <span>ionpopescu@gmail.com</span>
            </div>
            <div className="info-row">
              <span>Telefon</span>
              <span>+373 980 123 456</span>
            </div>
            <div className="info-row">
              <span>Specialitatea</span>
              <span>Electrician</span>
            </div>
            <div className="info-row">
              <span>Studii</span>
              <span>Licență</span>
            </div>
            <button className="edit-button1">Edit</button>
          </div>
        </div>

        <div className="section">
          <h3>Detalii adresă</h3>
          <div className="info-block">
            <div className="info-row">
              <span>Țara</span>
              <span>Moldova</span>
            </div>
            <div className="info-row">
              <span>Orașul</span>
              <span>Chișinău</span>
            </div>
            <div className="info-row">
              <span>Sectorul</span>
              <span>Botanica</span>
            </div>
            
            <button className="edit-button2">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worker;
