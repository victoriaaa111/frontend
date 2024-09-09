import React from 'react';
import './Hero.css';
import { HiLocationMarker } from 'react-icons/hi';
import CountUp from 'react-countup';



const Hero = () => {
    return (
        <section className="hero-wrapper">
            <div className="padding innerWidth flexCenter hero-container ">
            

                <div className="flexColStart hero-left">
                <div className="hero-title">
                    <h1>
                        <span>Alegeți meșterul iscusit</span>
                        <span></span><br />
                        <span style={{fontWeight: '700', fontSize: '3.2rem'}}>LA LOCUL POTRIVIT</span><br />
                    </h1>
                </div>
                    
                    {/* <div className="flexColStart secondaryText flexhero-des">
                        <span>Pe această platformă găsești cei mai calificați meșteri</span>
                        <span>pentru diverse lucrări de reparații și amenajări.</span>
                    </div> */}
                    <div className="search-bar">
                        <input type="text" placeholder="Indică meșterul..." className="search-input" />
                        <select className="search-select">
                            <option value="joburi">Alege Serviciul</option>
                            <option value="cv-uri">Reparații și construcții</option>
                            <option value="companii">Curățare și spălare</option>
                        </select>
                        <select className="search-select">
                            <option>Orașul</option>
                            <option value="cv-uri">Chișinău</option>
                            <option value="companii">Bălți</option>
                        </select>
                        <button className="search-button">Caută</button>
                    </div>


        
                    <div className="flexCenter stats">
                        <div className="flexColStart stat">
                            <span>
                                <CountUp start={8800} end={10000} duration={4}/>
                                <span>+</span>
                            </span>
                            <span className='secondaryText'>Meșteri specialiști</span> 
                        </div>

                        <div className="flexColStart stat">
                            <span>
                                <CountUp start={4850} end={5000} duration={4}/>
                                <span>+</span>
                            </span>
                            <span className='secondaryText'>Chemări</span>
                        </div>

                        <div className="flexColStart stat">
                            <span>
                                <CountUp end={6000}/>
                                <span>+</span>
                            </span>
                            <span className='secondaryText'>Recenzii</span>
                        </div>

                    </div>
                </div>

                <div className="hero-right">
                    <div className="image-container">
                        <img src="./fixer.png"/>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;