import React, { useState, useRef, useEffect } from "react";
import "./signup_worker.css";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const NAME_REGEX = /^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+(\d{1,3})?[-. (]?(\d{1,4})?[). -]?(\d{3})[-. ]?(\d{3,4})$/;

const SIGNUP_WORKER_URL = 'http://localhost:3001/auth/worker/signup';

const SignUpWorker = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [validFullName, setValidFullName] = useState(false);
    const [fullNameFocus, setFullNameFocus] = useState(false);

    const [contact, setContact] = useState('');
    const [validContact, setValidContact] = useState(false);
    const [contactFocus, setContactFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatchPwd, setValidMatchPwd] = useState(false);
    const [matchPwdFocus, setMatchPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => userRef.current.focus(), []);
    useEffect(() => setValidFullName(NAME_REGEX.test(fullName)), [fullName]);
    useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email]);
    useEffect(() => setValidContact(PHONE_REGEX.test(contact)), [contact]);
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatchPwd(password === matchPwd);
    }, [password, matchPwd]);
    useEffect(() => setErrMsg(''), [fullName, contact, email, password, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validFullName || !validContact || !validEmail || !validPwd) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            await axios.post(SIGNUP_WORKER_URL, JSON.stringify({ fullName, contact, email, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            setSuccess(true);
            navigate('/loginworker');
        } catch (err) {
            setErrMsg(err?.response?.data?.message || 'Registration Failed. Please try again later.');
            errRef.current.focus();
        }
    };

    return (
        <>
            {success ? (
                <div className="signup-worker-container">
                    <h1 className="signup-worker-text">Success!!</h1>
                </div>
            ) : (
                <div className="signup-worker-container">
                    <div className="signup-worker-header">
                        <div className="signup-worker-text">Sign Up as Worker</div>
                        <div className="signup-worker-underline"></div>
                    </div>
                    <form className="signup-worker-inputs" onSubmit={handleSubmit}>
                        <p ref={errRef} className={errMsg ? 'errmsg' : "offscreen"} aria-live="assertive">{errMsg}</p>
                        
                        <div className="signup-worker-input-group">
                            <input
                                type="text"
                                id="fullname"
                                placeholder="Full Name"
                                ref={userRef}
                                autoComplete="on"
                                required
                                aria-invalid={validFullName ? "false" : "true"}
                                aria-describedby="fullnamenote"
                                onFocus={() => setFullNameFocus(true)}
                                onBlur={() => setFullNameFocus(false)}
                                onChange={(e) => setFullName(e.target.value)}
                                className="signup-worker-input"
                            />
                            <span className={validFullName ? "valid" : "invalid"}>
                                <FontAwesomeIcon icon={validFullName ? faCheck : faTimes} />
                            </span>
                        </div>
                        <p id="fullnamenote" className={fullNameFocus && fullName && !validFullName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must be 2-24 characters, only letters and spaces.
                        </p>

                        <div className="signup-worker-input-group">
                            <input
                                type="text"
                                id="contact"
                                placeholder="Contact"
                                autoComplete="on"
                                required
                                aria-invalid={validContact ? "false" : "true"}
                                aria-describedby="contactnote"
                                onFocus={() => setContactFocus(true)}
                                onBlur={() => setContactFocus(false)}
                                onChange={(e) => setContact(e.target.value)}
                                className="signup-worker-input"
                            />
                            <span className={validContact ? "valid" : "invalid"}>
                                <FontAwesomeIcon icon={validContact ? faCheck : faTimes} />
                            </span>
                        </div>
                        <p id="contactnote" className={contactFocus && contact && !validContact ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter a valid phone number with country code.
                        </p>

                        <div className="signup-worker-input-group">
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                required
                                autoComplete="on"
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="emailnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                onChange={(e) => setEmail(e.target.value)}
                                className="signup-worker-input"
                            />
                            <span className={validEmail ? "valid" : "invalid"}>
                                <FontAwesomeIcon icon={validEmail ? faCheck : faTimes} />
                            </span>
                        </div>
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter a valid email address.
                        </p>

                        <div className="signup-worker-input-group">
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                onChange={(e) => setPassword(e.target.value)}
                                className="signup-worker-input"
                            />
                            <span className={validPwd ? "valid" : "invalid"}>
                                <FontAwesomeIcon icon={validPwd ? faCheck : faTimes} />
                            </span>
                        </div>
                        <p id="pwdnote" className={pwdFocus && password && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must be 8-24 characters and include uppercase, lowercase, number, and special character.
                        </p>

                        <div className="signup-worker-input-group">
                            <input
                                type="password"
                                id="matchPwd"
                                placeholder="Confirm Password"
                                required
                                aria-invalid={validMatchPwd ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setMatchPwdFocus(true)}
                                onBlur={() => setMatchPwdFocus(false)}
                                onChange={(e) => setMatchPwd(e.target.value)}
                                className="signup-worker-input"
                            />
                            <span className={validMatchPwd ? "valid" : "invalid"}>
                                <FontAwesomeIcon icon={validMatchPwd ? faCheck : faTimes} />
                            </span>
                        </div>
                        <p id="confirmnote" className={matchPwdFocus && matchPwd && !validMatchPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the password.
                        </p>

                        <div className="signup-worker-submit-container">
                            <button
                                disabled={!validFullName || !validContact || !validEmail || !validPwd || !validMatchPwd}
                                className="signup-worker-submit"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <div className="signup-worker-login-link">
                        <div className="login-text">Already have an account? <Link to="/loginworker">Log In</Link></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SignUpWorker;
