import React, { useState, useRef, useEffect } from 'react';
import './Admin.css';
import { faCheck, faTimes, faInfoCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAME_REGEX = /^[A-Z][a-zA-Z]{1,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const NewUserForm = ({ onSave }) => {
  const errRef = useRef();

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [role, setRole] = useState('');

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const result = NAME_REGEX.test(lastName);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = NAME_REGEX.test(firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
  }, [password]);

  useEffect(() => {
    setErrMsg('');
  }, [lastName, firstName, email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const v1 = NAME_REGEX.test(lastName);
    const v2 = NAME_REGEX.test(firstName);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = PWD_REGEX.test(password);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }

    const newUser = { 
      id: Date.now(), 
      lastName, 
      firstName, 
      email, 
      role, 
      status: 'Activ' 
    };
    onSave(newUser);
    setSuccess(true);
    setLastName('');
    setFirstName('');
    setEmail('');
    setRole('');
    setPassword('');
  };

  return (
    <form className="new-user-form" onSubmit={handleSubmit}>
      <h1>Utilizator Nou</h1>
      {success ? (
        <p>Utilizatorul a fost creat cu succes!</p>
      ) : (
        <>
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
        <div className='form-control'>
        <label htmlFor="firstName">Prenume
            <span className={validFirstName ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validFirstName || !firstName ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Prenume"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onFocus={() => setFirstNameFocus(true)}
            onBlur={() => setFirstNameFocus(false)}
            aria-invalid={validFirstName ? "false" : "true"}
            aria-describedby="firstnamenote"
          />
          <p id="firstnamenote" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            2 to 24 characters. Must begin with an uppercase letter.
          </p>
          

          <label htmlFor="lastName">Nume
            <span className={validLastName ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validLastName || !lastName ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Nume"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onFocus={() => setLastNameFocus(true)}
            onBlur={() => setLastNameFocus(false)}
            aria-invalid={validLastName ? "false" : "true"}
            aria-describedby="lastnamenote"
          />
          <p id="lastnamenote" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            2 to 24 characters. Must begin with an uppercase letter.
          </p>

          <label htmlFor="email">Email
            <span className={validEmail ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validEmail || !email ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="emailnote"
          />
          <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            Please enter a valid email address (e.g., example@domain.com).
          </p>

          <label htmlFor="role">Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Selectează rol</option>
            <option value="Angajat">Angajat</option>
            <option value="Client">Client</option>
          </select>

          <label htmlFor="password">Parolă
            <span className={validPassword ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validPassword || !password ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="passwordnote"
              className='password-input'
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="password-toggle"
              aria-label={showPassword ? "Ascunde parola" : "Afișează parola"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <p id="passwordnote" className={passwordFocus && password && !validPassword ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character.
          </p>

          <button className='btn' type="submit" disabled={!validLastName || !validFirstName || !validEmail || !validPassword}>Salvează</button>
        </div>
          
        </>
      )}
    </form>
  );
};

export default NewUserForm;
