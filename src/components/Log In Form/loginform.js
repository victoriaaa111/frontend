import React from "react";
import "./loginform.css";
import { useState, useRef, useEffect, useContext} from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthProvider";
import clientApi from "axios";
const LOGIN_CLIENT_URL='http://3.70.72.246:3001/auth/login'


const LogInClient = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [visible, setVisible] = useState(true);
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
            const response = await clientApi.post(LOGIN_CLIENT_URL,
                JSON.stringify({ email, password }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                    
                }
            );
            console.log(response);
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({email, password, roles, accessToken})
            setEmail('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if(err.response?.status ===400){
                setErrMsg('Missing Username or Password')
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
            <div>
                <h1 className ="title">Success!!</h1>
            </div>
        ):(
        <div className="page-s">
        <div className="cover-admin main-font">
            <h1 className ="title-admin">Log In</h1>
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
                    className="main-font input-admin"
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
                    className="main-font input-admin"
                    type={visible ? "text": "password"}
                    placeholder=""
                    required
                    value={password}
                    onChange={(e) => setPwd(e.target.value)}
                                    />
            
            </div>
            <div>
                <button type="submit"className="login-btn-admin">LOG IN</button>
            </div>
        
            </form>
            <button className="forgot-password fgtpass-btn">Forgot Password?</button>                 
        </div>
        </div>
        )}
    </>
    );
}


export default LogInClient;