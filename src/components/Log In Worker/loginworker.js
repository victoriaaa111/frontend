import React from "react";
import "./loginworker.css"
import { useState, useRef, useEffect, useContext} from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthProvider";
import workerSignInApi from "axios";
const LOGIN_WORKER_URL='http://localhost:3001/auth/worker/login'


const LogInWorker = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [visible, setVisible] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(()=>{
        userRef.current.focus();
    },[])



    useEffect(()=>{
        setErrMsg('');
    },[email, password])


    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const response = await workerSignInApi.post(LOGIN_WORKER_URL,
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

            const workerId = response?.data?.workerId;
            console.log(response);

            localStorage.setItem('auth', JSON.stringify({email, accessToken, workerId}))
            setAuth({email, accessToken, workerId})
            setEmail('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if(err.response?.status ===400){
                setErrMsg('Invalid Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }


    return (
        <>
        {success?(
            navigate("/worker")
        ):(
        <div className="page-s">
        <div className="cover-login main-font">
            <h1 className ="title-login">Log In Worker</h1>
            <form className="form-container-sign" onSubmit={handleSubmit}>
            <p ref={errRef} className={errMsg ? 'errmsg':"offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="form-group" >
                <label htmlFor = "email" className="description-field-admin">Email
                    {/* <span className={validEmail? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validEmail || !email ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                    </span> */}
                </label>
                <input
                    id ="email"
                    ref={userRef}
                    required
                    autoComplete="on"
                    // aria-invalid={validFirst ? "false" : "true"}
                    // aria-describedby="emailnote"
                    // onFocus = {() => setEmailFocus(true)}
                    // onBlur={()=> setEmailFocus(false)}
                    onChange= {(e)=> setEmail(e.target.value)}
                    className="main-font input-login"
                    value={email}
                    type="text"
                    placeholder="" />


                                    <label htmlFor="password" className="description-field-admin">Password
                                        <span onClick={() => setVisible(!visible)} className="eye-icon">
                                            <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
                                            </span>
                </label>
                <input
                    id="password"
                    className="main-font input-login"
                    type={visible ? "text": "password"}
                    placeholder=""
                    required
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                                    />
            
            </div>
            <div>
                <button type="submit" className="login-btn-worker">LOG IN</button>
            </div>
        
            </form>    
            <button className="fgtpass-btn">Forgot Password?</button>                
        </div>
        </div>
        )}
    </>
    );
}


export default LogInWorker;