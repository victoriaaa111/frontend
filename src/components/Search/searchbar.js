import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { searchAPI } from "../../api/axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./SearchBar.css";

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // Sorting state
  const [results, setResults] = useState([]); // State for search results
  const navigate = useNavigate(); // Hook for navigation

  // Fetch data function using axios
  const fetchData = async (value) => {
    try {
      const response = await searchAPI.get("http://3.70.72.246:3001/shareable/search", {
        params: { service: value, sortOrder }, // Send the search value and sortOrder as query parameters
      });

      console.log("API Response:", response.data); // Debugging

      const filteredResults = response.data.flatMap((worker) =>
        worker.services
          .filter((service) =>
            !value || service.service.toLowerCase().includes(value.toLowerCase())
          )
          .map((service) => ({
            serviceName: service.service,
            description: service.description,
            price: service.price,
            workerName: worker.fullName,
            workerContact: worker.contact,
            workerRating: worker.rating, // Include the worker's rating in the result
            workerId: worker._id // Include worker ID
          }))
      );

      // Sort results by worker rating
      if (sortOrder === "lowToHigh") {
        filteredResults.sort((a, b) => a.workerRating - b.workerRating);
      } else if (sortOrder === "highToLow") {
        filteredResults.sort((a, b) => b.workerRating - a.workerRating);
      }

      // If no results are found
      if (filteredResults.length === 0 && value) {
        setResults([{ serviceName: "No results found" }]);
      } else {
        setResults(filteredResults);
      }
    } catch (error) {
      console.error("Error fetching data: ", error.response || error.message); // Log error details
      setResults([{ serviceName: "Error fetching data" }]); // Show error message in case of failure
    }
  };

  // Handle input change and fetch data live
  const handleInputChange = (value) => {
    setInput(value);
    fetchData(value); // Trigger live search as user types
  };

  // Handle sort order change
  const handleSortChange = (value) => {
    setSortOrder(value);
    fetchData(input); // Apply sorting when selected
  };

  // Handle search button click
  const handleSearchClick = () => {
    fetchData(input); // Trigger search on button click
  };

  // Handle worker name click
  const handleWorkerNameClick = (workerId) => {
    // Save workerId in local storage and navigate to the profile page
    localStorage.setItem('selectedWorkerId', workerId);
    navigate('/worker/profile/management');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <FaSearch id="search-icon" />
        <input
          type="text"
          placeholder="Indică Serviciul..."
          className="search-input"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)} // Trigger search as user types
        />
        <select
          className="search-select"
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)} // Handle sort order change
        >
          <option value="">Sort by Rating</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
        <button className="search-button" onClick={handleSearchClick}>
          Caută
        </button>
      </div>
      <div className="results">
        {results.length > 0 && results.map((result, index) => (
          <div key={index} className="result-item">
            <div onClick={() => handleWorkerNameClick(result.workerId)} className="worker-name">
              {result.workerName}
            </div>
            <div className="worker-rating">
              Rating: {result.workerRating}
            </div>
            <div className="service-details">
              <div>Service: {result.serviceName}</div>
              <div>Description: {result.description}</div>
              <div>Price: ${result.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
