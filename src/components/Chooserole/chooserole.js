import React from "react";
import "./chooserole.css";
import LoginForm from "../Log In Form/loginform";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState } from "react";


const ChooseRole = () =>{

    const [role, setRole] = useState(""); // State to store selected role

    // Function to handle radio button change
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return(
    <div className="cover-2 container main-font">
    <h1 className="titlu">Choose your role:</h1>

    <div className="option-cards">
        <label className ="card" for="client">
        <div>
            <input 
                type="radio" 
                id="client" 
                name="user-type" 
                value="client" 
                onChange={handleRoleChange}
                />

                <div className="card-content">
                    <span class="icon"></span> 
                    <p>I am a client</p>
                </div>
        </div>
        </label>
        <label for="worker" className="card">
        <div>
            <input 
                type="radio" 
                id="worker" 
                name="user-type" 
                value="worker" 
                onChange={handleRoleChange}/>
                <div className="card-content">
                    <span className="icon"></span> 
                    <p>I am a worker</p>
                </div>
            
        </div>
        </label>
    </div>

    <Link to={role === "client" ? "/signupclient" : role === "worker" ? "/signupworker" : "#"}>
                <button className="create-account-btn" disabled={!role}>
                    Sign Up
                </button>
            </Link>

    <p className="login-text">
        Already have an account? 
        <Link to="/chooselogin">
        <button className="lgn-btn">Login</button>
      </Link>
    </p>
</div>
);
}
export default ChooseRole;