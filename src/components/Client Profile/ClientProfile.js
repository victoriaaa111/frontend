import React, { useState, useEffect, useContext } from 'react';
import './ClientProfile.css'; // Ensure to create this CSS
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import {useNavigate} from 'react-router-dom';

const ClientProfile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    contact: '',
    profilePicture: null,
    orders: [] // User-specific orders or activities
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const { auth } = useContext(AuthContext); 
  const { userId } = auth;
  
  // Fetch user profile and their orders
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/`);
        const userData = response.data;

        // Set user data
        setUser(userData);

        // Set user's orders if any
        if (userData.orders) {
          setOrders(userData.orders);
        }
      } catch (err) {
        setResponseMessage(`Error fetching user profile: ${err.message}`);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return (
    <div className="profile-container">
      <div className="profile-content white-box">
        <div className="profile-header">
          <div className="profile-info">
            <h2>User Profile: {user.fullName}</h2>
            <img src={user.profilePicture || '/woman.png'} style={{ width: '200px', height: '200px', borderRadius: '50%' }} alt="User Profile" className="profile-pic" />
          </div>
        </div>

        {/* Section with personal and order information */}
        <div className="profile-columns">
          {/* Personal Information */}
          <div className="profile-column">
            <h3>Personal Information</h3>
            <div className="info-block">
              <div className="info-row">
                <span>Name:</span>
                <span>{user.fullName || 'Name Surname'}</span>
              </div>
              <div className="info-row">
                <span>Email:</span>
                <span>{user.email || 'email@gmail.com'}</span>
              </div>
              <div className="info-row">
                <span>Phone Number:</span>
                <span>{user.contact || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;