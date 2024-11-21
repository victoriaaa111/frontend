import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import "./Favorites.css";
import axios from "axios";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { userId } = auth;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}`);
        setFavorites(response.data.favorites);
      } catch (err) {
        setResponseMessage(`Error fetching favorites: ${err.message}`);
      } finally {
        setLoading(false);
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
      await axios.delete(`http://localhost:3001/user/favorites/${userId}`, {
        data: { workerId },
      });
      setFavorites(favorites.filter((favorite) => favorite._id !== workerId));
      setResponseMessage("Favorite removed successfully");
      setTimeout(() => {
        setResponseMessage("");
      }, 3000);
    } catch (err) {
      setResponseMessage(`Error removing favorite: ${err.message}`);
    }
  };

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div className="favorites-container">
      <h3 className="title">Your Favorite Workers</h3>
      <div className="favorites-grid">
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <div key={favorite._id} className="favorite-card">
              <button
                className={`favorite-btn ${
                  favorites.find((f) => f._id === favorite._id) ? "favorited" : ""
                }`}
                onClick={() => handleDeleteFavorite(favorite._id)}
              >
                <span className="heart">❤️</span>
              </button>
              <img
                className="image"
                src="/person.jpg"
                alt={favorite.fullName}
              />
              <div className="favorite-card-content">
                <h4 className="name">{favorite.fullName || "Unknown Name"}</h4>
                <p className="services">
                  {favorite.services && favorite.services.length > 0 ? (
                    <ul>
                      {favorite.services.map((service) => (
                        <li key={service._id} className="service">
                          {service.service}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="no-services">No services listed</span>
                  )}
                </p>
                <br />
                <div className="card-buttons">
                  <button
                    className="view-btn"
                    onClick={() => handleViewProfile(favorite._id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No favorites available</p>
        )}
      </div>
      {responseMessage && (
        <p
          className={`response-message ${
            responseMessage.includes("Error") ? "error" : "success"
          }`}
        >
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default Favorites;
