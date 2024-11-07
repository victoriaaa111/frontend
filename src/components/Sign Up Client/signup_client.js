import React, { useState, useRef, useEffect, useContext } from "react";
import "./signup_client.css";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const NAME_REGEX = /^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SIGNUP_CLIENT_URL = 'http://localhost:3001/auth/signup';

const SignUpClient = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [validFullName, setValidFullName] = useState(false);
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatchPwd, setValidMatchPwd] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidFullName(NAME_REGEX.test(fullName));
    }, [fullName]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatchPwd(password === matchPwd);
    }, [password, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validFullName || !validEmail || !validPwd || !validMatchPwd) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post(SIGNUP_CLIENT_URL,
                JSON.stringify({ fullName, email, password }),
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            setSuccess(true);
            navigate("/loginclient");
        } catch (err) {
            setErrMsg("Registration Failed. Please try again later.");
            errRef.current.focus();
        }
    };

    return (
        <div className="signup-client-container">
            <div className="signup-client-header">
                <div className="signup-client-text">Sign Up as Client</div>
                <div className="signup-client-underline"></div>
            </div>
            <form onSubmit={handleSubmit} className="signup-client-inputs">
                <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>

                <div className="signup-client-input-group">
                    <input
                        type="text"
                        placeholder="Full Name"
                        ref={userRef}
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        aria-invalid={!validFullName}
                    />
                    {validFullName ? <FontAwesomeIcon icon={faCheck} className="valid" /> : 
                    <FontAwesomeIcon icon={faTimes} className="invalid" />}
                </div>

                <div className="signup-client-input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!validEmail}
                    />
                    {validEmail ? <FontAwesomeIcon icon={faCheck} className="valid" /> : 
                    <FontAwesomeIcon icon={faTimes} className="invalid" />}
                </div>

                <div className="signup-client-input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPwd(e.target.value)}
                        aria-invalid={!validPwd}
                    />
                    {validPwd ? <FontAwesomeIcon icon={faCheck} className="valid" /> : 
                    <FontAwesomeIcon icon={faTimes} className="invalid" />}
                </div>

                <div className="signup-client-input-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={matchPwd}
                        onChange={(e) => setMatchPwd(e.target.value)}
                        aria-invalid={!validMatchPwd}
                    />
                    {validMatchPwd ? <FontAwesomeIcon icon={faCheck} className="valid" /> : 
                    <FontAwesomeIcon icon={faTimes} className="invalid" />}
                </div>

                <div className="signup-client-submit-container">
                    <button type="submit" className="signup-client-submit" disabled={!validFullName || !validEmail || !validPwd || !validMatchPwd}>
                        Sign Up
                    </button>
                </div>
                <div className="login-text">Already have an account? <Link to="/loginclient">Log In</Link></div>
            </form>
        </div>
    );
};

export default SignUpClient;
