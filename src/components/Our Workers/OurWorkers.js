import React, { useEffect, useState } from "react";
import "./OurWorkers.css";
import axios from "axios";

const OurWorkers = () => {
  const [allWorkers, setAllWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["Show All", "Plumber", "Electrician", "Inspection", "QI", "Locksmith"];

  const fetchMesteri = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3001/user/workers");
      setAllWorkers(response.data);
      setFilteredWorkers(response.data)
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

  const getProfileImage = (name) => {
    const maleImage = "/person.jpg";
    const femaleImage = "/person.jpg";
    const firstName = name.split(" ")[0].toLowerCase();
    return ["jane", "emily", "sophia", "alice"].includes(firstName) ? femaleImage : maleImage;
  };

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

  if (loading) return <p>Loading workers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <p className="title">Discover the Best Specialists for Your Needs!</p>
      <div className="container">
        {/* Sidebar */}
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

        {/* Worker Grid */}
        <div className="grid">
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => (
              <div key={worker._id} className="card2">
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
                      worker.services.map((s) => (
                        <span key={s._id} className="service">{s.service}</span>
                      ))
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
