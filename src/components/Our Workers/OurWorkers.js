import React, { useEffect, useState, useContext } from "react";
import "./OurWorkers.css";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";

const OurWorkers = () => {
  const [allWorkers, setAllWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const { userId } = auth;

  const categories = ["Show All", "Plumber", "Electrician", "Inspection", "QI", "Locksmith"];

  const fetchMesteri = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/workers`);
      setAllWorkers(response.data);
      setFilteredWorkers(response.data);
      const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/${userId}`);
      setFavorites(userResponse.data.favorites.map((f) => f._id));
    } catch (error) {
      console.error("Error fetching workers:", error);
      setError("Failed to fetch workers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMesteri();
  }, []);

  const handleCategoryClick = (category) => {
    if (category === "Show All") {
      setFilteredWorkers(allWorkers);
    } else {
      const filtered = allWorkers.filter((worker) =>
        worker.services.some((s) =>
          s.service.toLowerCase().includes(category.toLowerCase()) ||
          (s.description && s.description.toLowerCase().includes(category.toLowerCase()))
        )
      );
      setFilteredWorkers(filtered);
    }
  };

  const toggleFavorite = async (workerId) => {
    try {
      if (favorites.includes(workerId)) {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/user/favorites/${userId}`, {
          data: { workerId },
        });
        setFavorites(favorites.filter((id) => id !== workerId));
      } else {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/favorites/${userId}`, { workerId });
        setFavorites([...favorites, workerId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const getProfileImage = (name) => {
    const maleImage = "/person.jpg";
    const femaleImage = "/person.jpg";
    const firstName = name.split(" ")[0].toLowerCase();
    return ["jane", "emily", "sophia", "alice"].includes(firstName) ? femaleImage : maleImage;
  };

  if (loading) return <p>Loading workers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <p className="title">Discover the Best Specialists for Your Needs!</p>
      <div className="container">
        <div className="sidebar">
          {categories.map((category) => (
            <p
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="sidebar-item"
            >
              {category}
            </p>
          ))}
        </div>

        <div className="grid">
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <div key={worker._id} className="card2">
                <button
                  className={`favorite-btn ${favorites.includes(worker._id) ? "favorited" : ""}`}
                  onClick={() => toggleFavorite(worker._id)}
                >
                  <span className="heart">{favorites.includes(worker._id) ? "❤️" : "🤍"}</span>
                </button>
                <img
                  className="image"
                  src={getProfileImage(worker.fullName)}
                  alt={worker.fullName}
                />
                <div className="card2-content">
                  <p className="name">{worker.fullName || "Unknown Name"}</p>
                  <p className="rating">Rating: {worker.rating || "N/A"}</p>
                  <p className="services">
                  {worker.services.length > 0 ? (
                    <ul>
                      {worker.services.map((service) => (
                        <li key={service._id} className="service">
                          {service.service}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="no-services">No services listed</span>
                  )}
                </p>
                  <p className="contact">Contact: +{worker.contact || "No contact available"}</p>
                </div>
              </div>
            ))
          ) : (
            <span className="no-services">No workers found for this category.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurWorkers;
