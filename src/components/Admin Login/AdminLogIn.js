import React, { useState, useRef, useEffect } from "react";
import "./AdminLogIn.css";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAME_REGEX = /^[A-Z][a-zA-Z]{1,24}$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LogInAdmin = () => {
   const userRef = useRef();
   const errRef = useRef();

   const [user, setUser] = useState('');
   const [validName, setValidName] = useState(false);
   const [userFocus, setUserFocus] = useState(false);

   const [first, setFirst] = useState('');
   const [validFirst, setValidFirst] = useState(false);
   const [firstFocus, setFirstFocus] = useState(false);

   const [last, setLast] = useState('');
   const [validLast, setValidLast] = useState(false);
   const [lastFocus, setLastFocus] = useState(false);

   const [email, setEmail] = useState('');
   const [validEmail, setValidEmail] = useState(false);
   const [emailFocus, setEmailFocus] = useState(false);

   const [pwd, setPwd] = useState('');
   const [validPwd, setValidPwd] = useState(false);
   const [pwdFocus, setPwdFocus] = useState(false);

   const [matchPwd, setMatchPwd] = useState('');
   const [validMatchPwd, setValidMatchPwd] = useState(false);
   const [matchPwdFocus, setMatchPwdFocus] = useState(false);

   const [errMsg, setErrMsg] = useState('');
   const [success, setSuccess] = useState(false);

   useEffect(() => {
       userRef.current.focus();
   }, []);

   useEffect(() => {
       const result = NAME_REGEX.test(first);
       setValidFirst(result);
   }, [first]);

   useEffect(() => {
       const result = EMAIL_REGEX.test(email);
       setValidEmail(result);
   }, [email]);

   useEffect(() => {
       const result = NAME_REGEX.test(last);
       setValidLast(result);
   }, [last]);

   useEffect(() => {
       const result = USER_REGEX.test(user);
       setValidName(result);
   }, [user]);

   useEffect(() => {
       const result = PWD_REGEX.test(pwd);
       setValidPwd(result);
       const match = pwd === matchPwd;
       setValidMatchPwd(match);
   }, [pwd, matchPwd]);

   useEffect(() => {
       setErrMsg('');
   }, [user, pwd, matchPwd]);

   const handleSubmit = async (e) => {
       e.preventDefault();
       const v1 = USER_REGEX.test(user);
       const v2 = PWD_REGEX.test(pwd);
       const v3 = NAME_REGEX.test(first);
       const v4 = NAME_REGEX.test(last);
       if (!v1 || !v2 || !v3 || !v4) {
           setErrMsg("Invalid Entry");
           return;
       }

       setSuccess(true);
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
                       <form className="form-container" onSubmit={handleSubmit}>
                           <p ref={errRef} className={errMsg ? 'errmsg' : "offscreen"} aria-live="assertive">{errMsg}</p>
                           <div className="form-group">
                               <label htmlFor="email" className="description-field-admin">Email
                                   <span className={validEmail ? "valid" : "hide"}>
                                       <FontAwesomeIcon icon={faCheck} />
                                   </span>
                                   <span className={validEmail || !email ? "hide" : "invalid"}>
                                       <FontAwesomeIcon icon={faTimes} />
                                   </span>
                               </label>
                               <input
                                   id="email"
                                   ref={userRef}
                                   required
                                   autoComplete="on"
                                   aria-invalid={validFirst ? "false" : "true"}
                                   aria-describedby="emailnote"
                                   onFocus={() => setEmailFocus(true)}
                                   onBlur={() => setEmailFocus(false)}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="main-font input-admin"
                                   type="text"
                                   placeholder=""
                               />
                               <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                   <FontAwesomeIcon icon={faInfoCircle} />
                                   Please enter a valid email address (e.g., example@domain.com).
                               </p>

                               <label htmlFor="password" className="description-field-admin">Password
                                   <span className={validPwd ? "valid" : "hide"}>
                                       <FontAwesomeIcon icon={faCheck} />
                                   </span>
                                   <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                       <FontAwesomeIcon icon={faTimes} />
                                   </span>
                               </label>
                               <input
                                   id="password"
                                   className="main-font input-admin"
                                   type="password"
                                   required
                                   aria-invalid={validPwd ? "false" : "true"}
                                   aria-describedby="pwdnote"
                                   onFocus={() => setPwdFocus(true)}
                                   onBlur={() => setPwdFocus(false)}
                                   onChange={(e) => setPwd(e.target.value)}
                               />
                               <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                                   <FontAwesomeIcon icon={faInfoCircle} />
                                   8 to 24 characters. <br />
                                   Must include uppercase and lowercase letters, a number, and a special character. <br />
                                   Allowed special characters: <span>!</span> <span>@</span> <span>#</span> <span>$</span> <span>%</span>
                               </p>
                           </div>
                           <div>
                               <button disabled={(!validName || !validFirst || !validLast || !validPwd || !validMatchPwd || !validEmail) ? true : false} className="login-btn-admin">
                                   LOG IN
                               </button>
                           </div>
                       </form>
                   </div>
               </div>
           )}
       </>
   );
};

export default LogInAdmin;
