import React, { useState } from "react";
import "./chooserole.css";
import { Link } from "react-router-dom";

const ChooseRole = () => {
    const [role, setRole] = useState(""); // State pentru rolul selectat

    // Funcție pentru schimbarea rolului selectat
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <div className="container-role main-font">
            <h1 className="titlu">Choose your role:</h1>
            <div className="option-cards">
                <label className="card" htmlFor="client">
                    <input
                        type="radio"
                        id="client"
                        name="user-type"
                        value="client"
                        onChange={handleRoleChange}
                    />
                    <div className="card-content">
                        <p>I am a client</p>
                    </div>
                </label>
                <label className="card" htmlFor="worker">
                    <input
                        type="radio"
                        id="worker"
                        name="user-type"
                        value="worker"
                        onChange={handleRoleChange}
                    />
                    <div className="card-content">
                        <p>I am a worker</p>
                    </div>
                </label>
            </div>
            <Link to={role === "client" ? "/signupclient" : role === "worker" ? "/signupworker" : "#"}>
                <button className="create-account-btn" disabled={!role}>
                    Sign Up
                </button>
            </Link>
            <p className="login-text">
                Already have an account? <Link to="/chooselogin"><button className="lgn-btn">Login</button></Link>
            </p>
        </div>
    );
};

export default ChooseRole;
