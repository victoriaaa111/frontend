import "./adminlogin.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";  
import AuthContext from "../../context/AuthProvider"; 
import adminApi from "axios";

const LOGIN_ADMIN_URL = 'http://localhost:3001/auth/admin/login';

const LogInAdmin = () => {
    const { setAuth } = useContext(AuthContext);  
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/admin');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e)
        try {
            const response = await adminApi.post(
                LOGIN_ADMIN_URL,
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            // Store token in localStorage to persist across sessions
            localStorage.setItem('accessToken', accessToken);

            // Set auth context
            setAuth({ email, roles, accessToken });
            setEmail('');
            setPwd('');
            setSuccess(true);
            setErrMsg('');

            // Redirect to dashboard on successful login
            navigate('/admin/dashboard');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Username or Password');
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
                <div>
                    <h1 className="title">Success!!</h1>
                </div>
            ) : (
                <div className="page-s">
                    <div className="cover-admin main-font">
                        <h1 className="title-admin">Admin Log In</h1>
                        <form className="form-container-sign" onSubmit={handleSubmit}>
                            <p ref={errRef} className={errMsg ? 'errmsg' : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <div className="form-group">
                                <label htmlFor="email" className="description-field-admin">Email</label>
                                <input
                                    id="email"
                                    ref={userRef}
                                    required
                                    autoComplete="on"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="main-font input-admin"
                                    value={email}
                                    type="text"
                                    placeholder=""
                                />
                                <label htmlFor="password" className="description-field-admin">Password</label>
                                <input
                                    id="password"
                                    className="main-font input-admin"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPwd(e.target.value)}
                                />
                            </div>
                            <div>
                                <button type="submit" className="btn-submit login-btn-admin">LOG IN</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogInAdmin;