import React from "react";
import "./signup_client.css";
import { useState, useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { clientSignUpApi } from "../../api/axios";

const NAME_REGEX = /^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SIGNUP_CLIENT_URL = 'http://3.70.72.246:3001/auth/signup';


const SignUpClient = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const[validName, setValidName] = useState(false);
    const[userFocus, setUserFocus] = useState(false);

    const [fullName, setFullName] = useState('');
    const[validFullName, setValidFullName] = useState(false);
    const[fullNameFocus, setFullNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const[validEmail, setValidEmail] = useState(false);
    const[emailFocus, setEmailFocus] = useState(false);

    const [password, setPwd] = useState('');
    const[validPwd, setValidPwd] = useState(false);
    const[pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const[validMatchPwd, setValidMatchPwd] = useState(false);
    const[matchPwdFocus, setMatchPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const[success,setSuccess] = useState(false);

    useEffect(()=>{
        userRef.current.focus();
    },[])

    useEffect(()=>{
        const result = NAME_REGEX.test(fullName);
        setValidFullName(result);
    },[fullName])

    useEffect(()=>{
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    },[email])

    useEffect(()=>{
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    },[user])

    useEffect(()=>{
        const result = PWD_REGEX.test(password);
        console.log(result);
        console.log(password);
        setValidPwd(result);
        const match = password === matchPwd;
        setValidMatchPwd(match);

    }, [password, matchPwd])

    useEffect(()=>{
        setErrMsg('');
    },[user, fullName, email, password, matchPwd])

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(password);
        const v3 = NAME_REGEX.test(fullName);
        if(!v1 || !v2 || !v3){
            setErrMsg("Invalid Entry");
            return;
        }
        try{
            const response = await clientSignUpApi.post(SIGNUP_CLIENT_URL,
                JSON.stringify({ fullName, username: user, email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
        console.log(response?.data);
        console.log(response?.accessToken);
        console.log(JSON.stringify(response))
            setSuccess(true);
            setUser('');
            setEmail('');
            setFullName('');
            setPwd('');
            setMatchPwd('');
            }catch(err){
                if(!err?.response){
                setErrMsg('No Server Response');
        }else if (err.response?.status === 409){
                setErrMsg('Username Taken');
        }else{
                setErrMsg('Registration Failed');
        }
                errRef.current.focus()
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
        <div className="cover-signup main-font">
            <h1 className ="title-signup">Sign Up</h1>
            <form className="form-container-signup" onSubmit={handleSubmit}>
            <p ref={errRef} className={errMsg ? 'errmsg':"offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="form-group" >
                <label htmlFor = "firstname" className="description-field">Full Name
                    <span className={validFullName? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validFullName || !fullName ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    id ="fullname" 
                    ref={userRef}
                    autoComplete="on"
                    required
                    aria-invalid={validFullName ? "false" : "true"}
                    aria-describedby="firstnote"
                    onFocus = {() => setFullNameFocus(true)}
                    onBlur={()=> setFullNameFocus(false)}
                    onChange= {(e)=> setFullName(e.target.value)} 
                    className="main-font input-admin" 
                    type="text" 
                    placeholder="" />

                <p id="firstnote" className={fullNameFocus && fullName && !validFullName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                     2 to 24 characters. <br />
                    Must contain only letters and begin with a uppercase letter.
                </p>


                <label htmlFor="username" className="description-field">Username
                    <span className={validName? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validName || !user ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input 
                    id="username" 
                    autoComplete="on"
                    className="main-font input-admin"
                    type="text" 
                    placeholder=""
                    ref={userRef}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    onChange={(e) => setUser(e.target.value)} 
/>
                <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters. <br />
                    Must begin with a letter.<br />
                    Letters, numbers, underscores, hyphens allowed.
                </p>

                <label htmlFor = "email" className="description-field">Email
                    <span className={validEmail? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validEmail || !email ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    id ="email" 
                    ref={userRef}
                    required
                    autoComplete="on"
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="emailnote"
                    onFocus = {() => setEmailFocus(true)}
                    onBlur={()=> setEmailFocus(false)}
                    onChange= {(e)=> setEmail(e.target.value)} 
                    className="main-font input-admin" 
                    type="text" 
                    placeholder="" />

                <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter a valid email address (e.g., example@domain.com).
                </p>

                <label htmlFor="password" className="description-field">Password
                    <span className={validPwd? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validPwd || !password ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input 
                    id="password" 
                    className="main-font input-admin" 
                    type="password" 
                    placeholder=""
                    required
                    aria-invalid={validPwd? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    onChange={(e) => setPwd(e.target.value)} 
                    />
                <p id="pwdnote" className={pwdFocus && password && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters. <br />
                    Must include uppercase and lowercase letters, a number and a special character <br />
                    Allowed special characters: <span>!</span>
                    <span>@</span> <span>#</span> <span>$</span> <span>%</span>
                </p>


                <label htmlFor="matchpassword" className="description-field">Confirm Password
                    <span className={validMatchPwd && matchPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validMatchPwd || !matchPwd ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input 
                    id="matchpassword" 
                    className="main-font input-admin" 
                    type="password" 
                    placeholder="" 
                    required
                    aria-invalid={validMatchPwd? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchPwdFocus(true)}
                    onBlur={() => setMatchPwdFocus(false)}
                    onChange={(e) => setMatchPwd(e.target.value)} 
                    />
                <p id="confirmnote" className={matchPwdFocus && !validMatchPwd ? "instructions " : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match previously entered password.
                </p>
            </div>
            <div>
                <button disabled = {(!validName || !validFullName || !validPwd || !validMatchPwd || !validEmail) ? true: false} className="signup-client-btn">SIGN UP</button>
            </div>

            {/*<p className="text">Or login using</p>
            <div className="alt-login">
                <div className="gmail"></div>
            </div>
            */}
            </form>
            <button className="signup-btn">Log In</button>
        </div>
        </div>
        )}
    </>
    );
}

export default SignUpClient;