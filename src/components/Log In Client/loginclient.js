import React, { useState, useRef, useEffect, useContext } from "react";
import "./loginclient.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LOGIN_CLIENT_URL = 'http://localhost:3001/auth/login';

const LoginExample = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [visible, setVisible] = useState(false); 
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_CLIENT_URL,
                JSON.stringify({ email, password }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
            }

            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }

            const userId = response?.data?.userId;
            setAuth({ email, accessToken, userId });
            localStorage.setItem('auth', JSON.stringify({ email, accessToken, userId }));
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            {success ? (
                navigate("/")
            ) : (
                <div className="login-example-container">
                    <div className="login-example-header">
                        <div className="login-example-text">Login Client</div>
                        <div className="login-example-underline"></div>
                    </div>
                    <form onSubmit={handleSubmit} className="login-example-inputs">
                        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                        <div className="login-example-input1">
                            <img src="./email.png" alt="email icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                ref={userRef}
                                required
                                autoComplete="on"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="login-example-input1">
                            <img src="./password.png" alt="password icon" />
                            <input
                                type={visible ? "text" : "password"}
                                placeholder="Password"
                                required
                                value={password}
                                autoComplete="off"
                                onChange={(e) => setPwd(e.target.value)}
                            />
                            <span onClick={() => setVisible(!visible)} className="eye-icon">
                                <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <div className="login-example-forgot-password">
                            Forgot Password? <span>Click Here!</span>
                        </div>
                        <div className="login-example-submit-container">
                            <button type="submit" className="login-example-submit">Login</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default LoginExample;
