import React, { useState } from 'react';
import './Hero.css';
import { HiLocationMarker } from 'react-icons/hi';
import CountUp from 'react-countup';
import { SearchBar } from '../Search/searchbar';// Import SearchBar component

const Hero = () => {
    const [results, setResults] = useState([]); // State to store search results

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

                    {/* Render SearchBar */}
                    <SearchBar setResults={setResults} />

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
                        <img src="./fixer.png" alt="Fixer" />
                    </div>
                </div>
            </div>

            {/* Showcase results as a list */}
            <div className="results-showcase">
                {results.length > 0 ? (
                    <ul className="results-list">
                        {results.map((result, index) => (
                            <li key={index} className="result-item">
                                <h3>{result.serviceName}</h3> {/* Display service name */}
                                <p>{result.description}</p> {/* Display service description */}
                                <p>Price: {result.price}</p> {/* Display service price */}
                                {/* Render clickable worker name */}
                                {result.workerName && (
                                    <p>
                                        Offered by:{" "}
                                        <a href={`mailto:${result.workerContact}`} target="_blank" rel="noopener noreferrer">
                                            {result.workerName}
                                        </a>
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No services found</p> // Show this if there are no results
                )}
            </div>
        </section>
    );
};

export default Hero;
