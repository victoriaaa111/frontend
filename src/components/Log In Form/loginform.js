import React from "react";
import "./loginform.css";
import ChooseRole from "../Chooserole/chooserole";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState } from "react";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const updateUsername = (evt) => {
    setUsername(evt.target.value);
    console.log(evt.target.value);
};
    return (

        <div className="cover main-font">
            <h1 className ="title">Login</h1>
        
            <div className="form-group">
                <label htmlFor = "username" className="description-field">Username</label>
                <input id ="username" className="main-font" type="text" value={username} onChange= {updateUsername}/>

                <label htmlFor="password" className="description-field">Password</label>
                <input id = "password" className="main-font" type="password" placeholder="" />
            </div>
            <div className="fgtpass-btn">
            <Link to="/forgotpassword" className="forgot-password">Forgot Password?</Link>
            </div>
            <div>
                <button className="login-btn">LOG IN</button>
            </div>
            <Link to ="/choose">
            <button className="signup-btn">Sign Up</button>
            </Link>
        </div>
    );
}

export default LoginForm;
