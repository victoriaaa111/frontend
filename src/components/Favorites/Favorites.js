import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthProvider";
import './Favorites.css';
import axios from 'axios';

const Favorites = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    contact: '',
    favorites: []
  });
  const [favorites, setFavorites] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { userId } = auth;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}`);
        const userData = response.data;

        setUser(userData);

        const favoritesData = userData.favorites.map(favorite => ({
          id: favorite._id,
          fullName: favorite.fullName,
        }));
        setFavorites(favoritesData);
      } catch (err) {
        setResponseMessage(`Error fetching favorites: ${err.message}`);
      } finally {
        setLoading(false); // set loading to false when data fetch is complete
      }
    };

    if (userId) {
      fetchFavorites();
    } else {
      setLoading(false); 
    }
  }, [userId]);

  const handleViewProfile = (id) => {
    localStorage.setItem('selectedWorkerId', id);
    navigate(`/worker/profile/management`);
  };

  const handleDeleteFavorite = async (workerId) => {
    try {
      await axios.delete(`http://localhost:3001/user/favorites/${userId}`, {
        data: {
          workerId: workerId,
        },
      });
      setFavorites(favorites.filter(favorite => favorite.id !== workerId));
      setResponseMessage('Favorite removed successfully');
      setTimeout(() => {
        setResponseMessage('');
      }, 5000);
    } catch (err) {
      setResponseMessage(`Error removing favorite: ${err.message}`);
    }
  };

  return (
    <div className="favorites-container">
      <div className="favorite-column services-info">
        <h3 className="calendar-title" style={{ fontSize: `1.5rem` }}>Favorite Workers</h3>
        <div className="favorites-grid">
          {loading ? (
            <p>Loading favorites...</p> // display loading message while data is being fetched
          ) : (
            favorites.length > 0 ? (
              favorites.map(favorite => (
                <div key={favorite.id} className="favorite-card">
                  <h4>{favorite.fullName}</h4>
                  <div className="card-buttons">
                    <button className="view-btn" onClick={() => handleViewProfile(favorite.id)}>View Profile</button>
                    <button className="remove-btn" onClick={() => handleDeleteFavorite(favorite.id)}>Remove</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No favorites available</p>
            )
          )}
        </div>
      </div>
      <div>
        {responseMessage && (
        <p 
          className={`response-message ${responseMessage.includes('Error') ? 'error' : 'success'}`}
        >
          {responseMessage}
        </p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
