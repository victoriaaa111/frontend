import React, { useState, useRef, useEffect } from 'react';
import './AdminUserManagement.css';
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { workerSignUpApi } from "../../api/axios";

// Regex for validation
const NAME_REGEX = /^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SIGNUP_WORKER_URL = 'http://3.70.72.246:3001/auth/worker/signup';
const GET_USERS_URL = 'http://3.70.72.246:3001/admin/workers';
const CHANGE_STATUS_URL = 'http://3.70.72.246:3001/admin/worker/change-status';

const AdminSignUpWorker = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [validFullName, setValidFullName] = useState(false);
  const [fullNameFocus, setFullNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatchPwd, setValidMatchPwd] = useState(false);
  const [matchPwdFocus, setMatchPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;


  const fetchUsers = async () => {
    try {
      const response = await axios.get(GET_USERS_URL);
      const userData = response.data.map(user => ({
        id: user._id,
        name: user.fullName,
        email: user.email,
        status: user.isActive ? 'Active' : 'Inactive',
        role: 'Worker'
      }));
      setUsers(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };
  // Fetch all users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Form validation
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

  // Clear error message when inputs change
  useEffect(() => {
    setErrMsg('');
  }, [fullName, email, password, matchPwd]);

  // Handle user sign-up form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validPwd || !validFullName || !validEmail) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post(SIGNUP_WORKER_URL,
          JSON.stringify({ fullName, email, password }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
      );

      setSuccess(true);
      setEmail('');
      setFullName('');
      setPwd('');
      setMatchPwd('');

      fetchUsers();

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err?.response?.data?.message === "Email already exists") {
        setErrMsg('Email already exists.');
      } else if (err.response?.status === 400) {
        setErrMsg('Invalid Data. Check your inputs.');
      } else if (err.response?.status === 500) {
        setErrMsg('Server error. Please try again later.');
      } else {
        setErrMsg('Registration Failed. Please try again later.');
      }
    }
    errRef.current.focus();
  };

  // Toggle user status (active/inactive)
  const toggleUserStatus = async (userId) => {
    try {
      const response = await axios.put(CHANGE_STATUS_URL, { id: userId });
      fetchUsers();
      setUsers(users.map(user =>
          user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
      ));
    } catch (err) {
      console.error('Error changing user status:', err);
    }
  };

  // Filter and paginate users
  const filteredUsers = users
      .filter(user => user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
      <div className="signup-container">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
        <h1>Create new Worker</h1>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name:
              <span className={validFullName ? "valid" : "hide"}><FontAwesomeIcon icon={faCheck}/></span>
              <span className={validFullName || !fullName ? "hide" : "invalid"}><FontAwesomeIcon
                  icon={faTimes}/></span>
            </label>
            <input
                type="text"
                id="fullName"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                onFocus={() => setFullNameFocus(true)}
                onBlur={() => setFullNameFocus(false)}
            />
            <p className={fullNameFocus && fullName && !validFullName ? "instructions" : "offscreen"}>
              Must be a valid name.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email:
              <span className={validEmail ? "valid" : "hide"}><FontAwesomeIcon icon={faCheck}/></span>
              <span className={validEmail || !email ? "hide" : "invalid"}><FontAwesomeIcon
                  icon={faTimes}/></span>
            </label>
            <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="email-note"
            />
            <p id="email-note" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
              Must be a valid email address.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password:
              <span className={validPwd ? "valid" : "hide"}><FontAwesomeIcon icon={faCheck}/></span>
              <span className={validPwd || !password ? "hide" : "invalid"}><FontAwesomeIcon
                  icon={faTimes}/></span>
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={password}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="password-note"
            />
            <p id="password-note" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
              Must be 8-24 characters long, include uppercase and lowercase letters, a number, and a special
              character.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">
              Confirm Password:
              <span className={validMatchPwd && matchPwd ? "valid" : "hide"}><FontAwesomeIcon icon={faCheck}/></span>
              <span className={validMatchPwd || !matchPwd ? "hide" : "invalid"}><FontAwesomeIcon
                  icon={faTimes}/></span>
            </label>
            <input
                type="password"
                id="confirm-password"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                onFocus={() => setMatchPwdFocus(true)}
                onBlur={() => setMatchPwdFocus(false)}
                aria-invalid={validMatchPwd ? "false" : "true"}
                aria-describedby="confirm-password-note"
            />
            <p id="confirm-password-note"
               className={matchPwdFocus && !validMatchPwd ? "instructions" : "offscreen"}>
              Must match the first password.
            </p>
          </div>


          <button className='button1' type="submit" disabled={!validFullName || !validEmail || !validPwd || !validMatchPwd}>
          Create Worker
          </button>
        </form>

        {success && <p className="success-msg">Sign Up Successful!</p>}
        <br/><br/>
        {/* User List Section */}
        <div className="user-list">
          <h1>Worker Management</h1>

          <input
              type="text"
              placeholder="Search users..."
              onChange={(e) => setSearchTerm(e.target.value)}
          />

          <table>
            <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Ratings</th>
            </tr>
            </thead>
            <tbody>
            {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className='button1' onClick={() => toggleUserStatus(user.id)}>
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
                <td>
                  <button className='button1' onClick={() => navigate(`/admin/dashboard/worker/reviews`, { state: { workerId: user.id } })}>View Ratings</button>
                </td>
                </tr>
            ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {Array.from({length: totalPages}, (_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={i + 1 === currentPage ? 'active' : ''}
                >
                  {i + 1}
                </button>
            ))}
          </div>
        </div>
      </div>
  );
};

export default AdminSignUpWorker;
