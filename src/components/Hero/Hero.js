import React, { useState, useContext } from 'react';
import './Hero.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import axios from 'axios';
import AuthContext from "../../context/AuthProvider";

const Hero = () => {
    const [input, setInput] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { userId } = auth;

    const fetchData = async (value) => {
    try {
        const response = await axios.get("http://localhost:3001/shareable/search", {
            params: { service: value, sortOrder },
        });
        console.log(response);

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
                    workerRating: worker.rating,
                    workerId: worker._id,
                    serviceId: service._id, // Extracting serviceId
                }))
        );

        // Sorting based on workerRating
        if (sortOrder === "lowToHigh") {
            filteredResults.sort((a, b) => a.workerRating - b.workerRating);
        } else if (sortOrder === "highToLow") {
            filteredResults.sort((a, b) => b.workerRating - a.workerRating);
        }

        // Handling no results found
        if (filteredResults.length === 0 && value) {
            setResults([{ serviceName: "No results found" }]);
        } else {
            setResults(filteredResults);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        setResults([{ serviceName: "Error fetching data" }]);
    }
};


    // Updated handleMakeOrder to accept serviceId
    const handleMakeOrder = (workerId, serviceId) => {
        navigate(`/user/calendar`, { state: {workerId, serviceId } });
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

    const handleWorkerNameClick = (workerId, serviceId) => {
        localStorage.setItem('selectedWorkerId', workerId);
        localStorage.setItem('selectedServiceId', serviceId);
        navigate('/worker/profile/management');
    };

    return (
        <section className="hero-wrapper">
            <div className="padding innerWidth flexCenter hero-container">
                <div className="flexColStart hero-left">
                    <div className="hero-title">
                        <h1>
                            <span style={{ fontWeight: '700', fontSize: '2.5rem', color: 'var(--blue2)' }}>Choose the best worker</span>
                            <span></span><br />
                            <span style={{ fontWeight: '700', fontSize: '1.5rem', color: 'var(--blue2)' }}>At the perfect time and site!</span><br />
                        </h1>
                    </div>

                    <div className="search-bar">
                        <FaSearch id="search-icon" />
                        <input
                            type="text"
                            placeholder="Indicate service..."
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
                            Search
                        </button>
                    </div>

                    <div className="results-showcase">
                        {results.length > 0 && results[0].serviceName !== "No results found" ? (
    results.map((result, index) => (
        <div key={index} className="result-ticket">
            <h3 className="service-title">{result.serviceName}</h3>
            <p className="description">Description: <span className='black-text'>{result.description}</span></p>
            <p className="price">Price: <span className='black-text'>${result.price}/hour</span></p>
            <div className="worker-info">
                <p className="offered-by">
                    Offered by:{" "}
                    <a onClick={() => handleWorkerNameClick(result.workerId, result.serviceId)}>
                        {result.workerName}
                    </a>
                </p>
                <p className="rating">Rating: {result.workerRating}</p>
            </div>
            <div className="button-container">
                <button className="button-service profile-button search-button" onClick={() => handleWorkerNameClick(result.workerId, result.serviceId)}>
                    View Profile
                </button>
                <button className="button-service order-button search-button" onClick={() => handleMakeOrder(result.workerId, result.serviceId)}>
                    Make an order
                </button>
            </div>
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
                            <span className='secondaryText'> Specialist workers</span>
                        </div>

                        <div className="flexColStart stat">
                            <span>
                                <CountUp start={4850} end={5000} duration={4} />
                                <span>+</span>
                            </span>
                            <span className='secondaryText'> Requests</span>
                        </div>

                        <div className="flexColStart stat">
                            <span>
                                <CountUp end={6000} />
                                <span>+</span>
                            </span>
                            <span className='secondaryText'> Reviews</span>
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
