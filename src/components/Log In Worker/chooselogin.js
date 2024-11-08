import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState } from "react";


const ChooseLogin = () =>{

    const [role, setRole] = useState(""); // State to store selected role

    // Function to handle radio button change
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return(
    <div className="cover-2 container-role main-font">
    <h1 className="titlu">Choose your role:</h1>

    <div className="option-cards">
        <label className ="card" htmlFor="client">
        <div>
            <input 
                type="radio" 
                id="client" 
                name="user-type" 
                value="client" 
                onChange={handleRoleChange}
                />

                <div className="card-content">
                    <span className="icon"></span> 
                    <p>I am a client</p>
                </div>
        </div>
        </label>
        <label htmlFor="worker" className="card">
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

    <Link to={role === "client" ? "/loginclient" : role === "worker" ? "/loginworker" : "#"}>
                <button className="create-account-btn" disabled={!role}>
                    Log In
                </button>
            </Link>

</div>
);
}
export default ChooseLogin;