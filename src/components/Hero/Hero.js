import React, { useState } from 'react';
import './Hero.css';
import { FaSearch } from 'react-icons/fa';
import { searchAPI } from '../../api/axios'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import CountUp from 'react-countup';
import axios from 'axios';

const Hero = () => {
    const [input, setInput] = useState("");
    const [sortOrder, setSortOrder] = useState(""); // Sorting state
    const [results, setResults] = useState([]); // State for search results
    const navigate = useNavigate(); // Hook for navigation

    // Fetch data function using axios
    const fetchData = async (value) => {
        try {
            const response = await axios.get("http://3.70.72.246:3001/shareable/search", {
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
            console.error("Error fetching data: ", error.response || error.message);
            setResults([{ serviceName: "Error fetching data" }]); 
        }
    };


    const handleInputChange = (value) => {
        setInput(value);
        fetchData(value); 
    };

    const handleSortChange = (value) => {
        setSortOrder(value);
        fetchData(input); 
    };


    const handleSearchClick = () => {
        fetchData(input); 
    };


    const handleWorkerNameClick = (workerId) => {
        localStorage.setItem('selectedWorkerId', workerId);
        navigate('/worker/profile/management');
    };

    return (
        <section className="hero-wrapper">
            <div className="padding innerWidth flexCenter hero-container">
                <div className="flexColStart hero-left">
                    <div className="hero-title">
                        <h1>
                            <span>Alegeți meșterul iscusit</span>
                            <span></span><br />
                            <span style={{ fontWeight: '700', fontSize: '3.2rem' }}>LA LOCUL POTRIVIT</span><br />
                        </h1>
                    </div>

                    <div className="search-bar">
                        <FaSearch id="search-icon" />
                        <input
                            type="text"
                            placeholder="Indică Serviciul..."
                            className="search-input"
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)} 
                        />
                        <select
                            className="search-select"
                            value={sortOrder}
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="">Sort by Rating</option>
                            <option value="lowToHigh">Low to High</option>
                            <option value="highToLow">High to Low</option>
                        </select>
                        <button className="search-button" onClick={handleSearchClick}>
                            Caută
                        </button>
                    </div>


                    <div className="results-showcase">
                        {results.length > 0 && results[0].serviceName !== "No results found" ? (
                            results.map((result, index) => (
                                <div key={index} className="result-ticket">
                                    <h3>{result.serviceName}</h3> 
                                    <p>Description: <span className='black-text'>{result.description}</span> </p> 
                                    <p>Price: <span className='black-text'>${result.price}/hour</span></p> 
                                    <div className="worker-info">
                                        <p>
                                            Offered by:{" "}
                                            <a onClick={() => handleWorkerNameClick(result.workerId)}>
                                                {result.workerName}
                                            </a>
                                        </p>
                                        <p>Rating: {result.workerRating}</p> 
                                    </div>
                                    <button onClick={() => handleWorkerNameClick(result.workerId)}>
                                        View Profile
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No services found</p> 
                        )}
                    </div>

                    <div className="flexCenter stats">
                        <div className="flexColStart stat">
                            <span>
                                <CountUp start={8800} end={10000} duration={4} />
                                <span>+</span>
                            </span>
                            <span className='secondaryText'>Meșteri specialiști</span>
                        </div>

                        <div className="flexColStart stat">
                            <span>
                                <CountUp start={4850} end={5000} duration={4} />
                                <span>+</span>
                            </span>
                            <span className='secondaryText'>Chemări</span>
                        </div>

                        <div className="flexColStart stat">
                            <span>
                                <CountUp end={6000} />
                                <span>+</span>
                            </span>
                            <span className='secondaryText'>Recenzii</span>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="image-container">
                        <img src="./w7.png" alt="Fixer" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
