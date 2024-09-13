import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import './AdminUserView.css'; // import the CSS file
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Worker = () => {
  const { id } = useParams(); // Get user ID from route params
  const [user, setUser] = useState(null); // State to store user data
  const defaultProfilePic = '/images/planet-earth.png'; // Default profile picture
  const location = useLocation(); // Hook to get location object
  const { userId } = location.state || {}; // Destructure userId from location state
  console.log(userId); //

  const navigate = useNavigate();
  const handleEditProfile = (userId) => {
    // Navigate to the profile route and pass userId in state
    navigate('/admin/user/update', { state: { userId } });
  };

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://3.70.72.246:3001/user/${userId}`);
        setUser(response.data); // Set the user data in state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  // Render a loading state until the user data is fetched
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content white-box">
        <div className="profile-header">
          <div className="profile-pic">
            <div className="profile-image" style={{ backgroundImage: `url(${defaultProfilePic})` }}>
              <img
                src="./mester.png" // Placeholder for the profile image
                alt="Profile"
                onError={(e) => e.target.style.display = 'none'} // Hide image if not found
              />
            </div>
          </div>
          <div className="profile-info">
            <h2>{user.fullName || 'No Name'}</h2>
            <p>Client</p>

          </div>
        </div>

        {/* Two-column section */}
        <div className="profile-columns">
          {/* Column 1: Personal Information */}
          <div className="profile-column">
            <h3>Personal Information</h3>
            <div className="info-block">
              <div className="info-row">
                <span>Name and Surname:</span>
                <span>{user.fullName}</span>
              </div>
              <div className="info-row">
                <span>Nickname:</span>
                <span>{user.username}</span>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Service Information */}
          
        </div>

        {/* Edit Button */}
        <div className="edit-button-container">
          <Link to={`/worker-profile/${id}`}>
          <button onClick={() => handleEditProfile(user.id)}>Edit Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Worker;
