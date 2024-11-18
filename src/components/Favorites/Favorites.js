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
        setResponseMessage(`Error fetching worker profile: ${err.message}`);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

    const handleViewProfile = (id) => {
        localStorage.setItem('selectedWorkerId', id);
        navigate(`/worker/profile/management`);
  };

  const handleDeleteFavorite = async (workerId) => {
  try {
    await axios.delete(`http://localhost:3001/user/delete-favorites/${userId}`, {
      data: {
        workerId: workerId,
      },
    });
    setFavorites(favorites.filter(favorite => favorite.id !== workerId));
    setResponseMessage('Favorite removed successfully');
  } catch (err) {
    setResponseMessage(`Error removing favorite: ${err.message}`);
  }
};



  return (
    <div className="profile-container">
      <div className="profile-column services-info">
        <h3 style={{ color: `rgb(105,127,249)` }}>Favorite Workers</h3>
        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map(favorite => (
              <div key={favorite.id} className="favorite-card">
                <h4>{favorite.fullName}</h4>
                <div className="card-buttons">
                  <button onClick={() => handleViewProfile(favorite.id)}>View Profile</button>
                  <button onClick={() => handleDeleteFavorite(favorite.id)}>Remove</button>
                </div>
              </div>
            ))
          ) : (
            <p>No favorites available</p>
          )}
        </div> 
      </div>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default Favorites;
