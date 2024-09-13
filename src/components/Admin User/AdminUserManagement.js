import React, { useState, useRef, useEffect } from 'react';
import './AdminUserManagement.css';
import { faCheck, faTimes, faInfoCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Regex pentru validare
const FULLNAME_REGEX = /^[A-Z][a-zA-Z]+\s[A-Z][a-zA-Z]{1,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const CONTACT_REGEX = /^[0-9]{10}$/;

const NewUserForm = ({ onSave }) => {
  const errRef = useRef();
  const [fullName, setFullName] = useState('');
  const [validFullName, setValidFullName] = useState(false);
  const [fullNameFocus, setFullNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [contact, setContact] = useState('');
  const [validContact, setValidContact] = useState(false);
  const [contactFocus, setContactFocus] = useState(false);

  const [role, setRole] = useState('');

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const result = FULLNAME_REGEX.test(fullName);
    setValidFullName(result);
  }, [fullName]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = CONTACT_REGEX.test(contact);
    setValidContact(result);
  }, [contact]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
  }, [password]);

  useEffect(() => {
    setErrMsg('');
  }, [fullName, email, contact, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const v1 = FULLNAME_REGEX.test(fullName);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = CONTACT_REGEX.test(contact);
    const v4 = PWD_REGEX.test(password);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }

    const [firstName, lastName] = fullName.split(' ');
    const newUser = { 
      id: Date.now(), 
      lastName, 
      firstName, 
      email, 
      contact, 
      role, 
      status: 'Active' 
    };
    onSave(newUser);
    setSuccess(true);
    setFullName('');
    setEmail('');
    setContact('');
    setRole('');
    setPassword('');
  };


  return (
    <form className="new-user-form" onSubmit={handleSubmit}>
      <h1>New User</h1>
      {success ? (
        <p>User has been successfully created!</p>
      ) : (
        <>
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
          <div className='form-control'>
            <label htmlFor="fullName">Full Name:
              <span className={validFullName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validFullName || !fullName ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setFullNameFocus(true)}
              onBlur={() => setFullNameFocus(false)}
              aria-invalid={validFullName ? "false" : "true"}
              aria-describedby="fullnamenote"
            />
            <p id="fullnamenote" className={fullNameFocus && fullName && !validFullName ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              First and last name, separated by a space, each starting with an uppercase letter.
            </p>

            <label htmlFor="email">Email:
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

            <label htmlFor="contact">Contact Number:
              <span className={validContact ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validContact || !contact ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="contact"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onFocus={() => setContactFocus(true)}
              onBlur={() => setContactFocus(false)}
              aria-invalid={validContact ? "false" : "true"}
              aria-describedby="contactnote"
            />
            <p id="contactnote" className={contactFocus && contact && !validContact ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Enter a valid phone number consisting of 10 digits.
            </p>

            <label htmlFor="role">Select Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="" disabled selected>Select your role</option>
                <option value="Worker">Worker</option>
                <option value="Client">Client</option>
              </select>


            <label htmlFor="password">Password:
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
                placeholder="Password"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <p id="passwordnote" className={passwordFocus && password && !validPassword ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character.
            </p>

            <button className='btn' type="submit" disabled={!validFullName || !validEmail || !validContact || !validPassword}>Save</button>
          </div>
        </>
      )}
    </form>
  );
};



const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users');
        const response = await axios.get('http://3.70.72.246:3001/admin/users');
        const userData = response.data.map(user => ({
          id: user._id,
          name: user.fullName,
          email: user.email,
          status: user.isActive ? 'Active' : 'Inactive',
          role: 'Client' // Assuming all users are clients, adjust if necessary
        }));
        setUsers(userData); // Update the state with formatted user data
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId) => {
    try {
      // Send request to the API to change the user's status
      const response = await axios.put('http://3.70.72.246:3001/admin/user/change-status', { id: userId });
      console.log(response.data);

      // If the request is successful, update the local state to reflect the new status
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
      ));
    } catch (error) {
      console.error('Error changing user status:', error);
    }
  };

  const navigate = useNavigate(); // Import and use useNavigate
  const handleViewProfile = (userId) => {
    // Navigate to the profile route and pass userId in state
    navigate('/admin/user/view', { state: { userId } });
  };

  const filteredUsers = users
    .filter((user) => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      && (roleFilter === '' || user.role === roleFilter)
      && (statusFilter === '' || user.status === statusFilter)
    )
    .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="user-management container">
      <div className="right-section">
        <NewUserForm onSave={(newUser) => setUsers([...users, newUser])} />
      </div>

      <div className="left-section">
        <h1>User Management</h1>

        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Find users..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <select onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            <option value="Worker">Worker</option>
            <option value="Client">Client</option>
          </select>
          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td className="actions">
                <button onClick={() => handleViewProfile(user.id)}>View it</button>
                  <button 
                    className={user.status === 'Active' ? '' : 'reactivate'} 
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === 'Active' ? 'Disable' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
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

export default UserManagement;

// To do Update la active inactive