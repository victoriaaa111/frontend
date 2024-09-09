import React from "react";
import "./signup_worker.css";
import { useState, useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../api/axios";

const NAME_REGEX = /^[A-Z][a-zA-Z]{1,24}$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUpWorker = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const[validName, setValidName] = useState(false);
    const[userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const[validEmail, setValidEmail] = useState(false);
    const[emailFocus, setEmailFocus] = useState(false);

    const [first, setFirst] = useState('');
    const[validFirst, setValidFirst] = useState(false);
    const[firstFocus, setFirstFocus] = useState(false);

    const [last, setLast] = useState('');
    const[validLast, setValidLast] = useState(false);
    const[lastFocus, setLastFocus] = useState(false);

    const [pwd, setPwd] = useState('');
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
        const result = NAME_REGEX.test(first);
        console.log(result);
        console.log(first);
        setValidFirst(result);
    },[first])

    useEffect(()=>{
        const result = NAME_REGEX.test(last);
        console.log(result);
        console.log(last);
        setValidLast(result);
    },[last])

    useEffect(()=>{
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
    },[email])

    useEffect(()=>{
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    },[user])

    useEffect(()=>{
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatchPwd(match);

    }, [pwd, matchPwd])

    useEffect(()=>{
        setErrMsg('');
    },[user,pwd, matchPwd])

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = NAME_REGEX.test(first);
        const v4 = NAME_REGEX.test(last);
        const v5 = EMAIL_REGEX.test(email);
        if(!v1 || !v2 || !v3 || !v4 || !v5){
            setErrMsg("Invalid Entry");
            return;
        }
        {
            /*
            try{
                const response = await axios.post(REGISTER_URL, JSON.stringify({first, last, user, pwd}),
                {
                headers:{'Content-Type': 'application/json'},
                withCredentials:true            
                })
        };
        console.log(response.data);
        console.log(response.accessToken);
        console.log(JSON.stringify(response))
        setSuccess(true);
            }catch(err){
                if(!err?.response){
                setErrMsg('No Server Response');
        }else if (err.response?.status === 409{
                setErrMsg('Username Taken');
        }else{
                setErrMsg('Registration Failed');
        }
                errRef.current.focus()
            }
            */
        }
        setSuccess(true);
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
            <h1 className ="title">Sign Up</h1>
            <form className="form-container" onSubmit={handleSubmit}>
            <p ref={errRef} className={errMsg ? 'errmsg':"offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="form-group" >
                <label htmlFor = "firstname" className="description-field">First Name
                    <span className={validFirst? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validFirst || !first ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input
                    id ="firstname" 
                    ref={userRef}
                    autoComplete="on"
                    required
                    aria-invalid={validFirst ? "false" : "true"}
                    aria-describedby="firstnote"
                    onFocus = {() => setFirstFocus(true)}
                    onBlur={()=> setFirstFocus(false)}
                    onChange= {(e)=> setFirst(e.target.value)} 
                    className="main-font" 
                    type="text" 
                    placeholder="" />

                <p id="firstnote" className={firstFocus && first && !validFirst ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                     2 to 24 characters. <br />
                    Must contain only letters and begin with a uppercase letter.
                </p>



                <label htmlFor = "lastname" className="description-field">Last Name
                    <span className={validLast? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validLast || !last ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input 
                    id ="lastname" 
                    className="main-font" 
                    type="text" 
                    placeholder="" 
                    autoComplete="on"
                    required
                    aria-invalid={validLast ? "false" : "true"}
                    aria-describedby="lastnote"
                    onFocus = {() => setLastFocus(true)}
                    onBlur={()=> setLastFocus(false)}
                    onChange= {(e)=> setLast(e.target.value)} />
                <p id="lastnote" className={lastFocus && last && !validLast ? "instructions" : "offscreen"}>
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
                    className="main-font"
                    type="text" 
                    placeholder=""
                    ref={userRef}
                    autoComplete="on"
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
                    autoComplete="on"
                    required
                    aria-invalid={validFirst ? "false" : "true"}
                    aria-describedby="emailnote"
                    onFocus = {() => setEmailFocus(true)}
                    onBlur={()=> setEmailFocus(false)}
                    onChange= {(e)=> setEmail(e.target.value)} 
                    className="main-font" 
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
                    <span className={validPwd || !pwd ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input 
                    id="password" 
                    className="main-font" 
                    type="password" 
                    placeholder=""
                    required
                    aria-invalid={validPwd? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    onChange={(e) => setPwd(e.target.value)} 
                    />
                <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
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
                    className="main-font" 
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
                <button disabled = {(!validName || !validFirst || !validLast || !validPwd || !validMatchPwd || !validEmail) ? true: false} className="signup-client-btn">SIGN UP</button>
            </div>

            {/*<p className="text">Or login using</p>
            <div className="alt-login">
                <div className="gmail"></div>
            </div>
            */}
            </form>
            <button className="signupw-btn">Log In</button>
        </div>
        </div>
        )}
    </>
    );
}

export default SignUpWorker;