/*import './App.css';
import LoginForm from './components/loginform';


function App() {
  return (
    <div className="page">
      <LoginForm />
    </div>
  );
}

export default App;
*/
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import LoginForm from './components/loginform';
import SignUpClient from './components/signup_client';
import ChooseRole from './components/chooserole';
import SignUpWorker from './components/signup_worker';

function App() {
  return (
    <Router>
      <div className="page">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signupclient" element={<SignUpClient />} />
          <Route path="/signupworker" element={<SignUpWorker />} />
          <Route path="/choose" element={<ChooseRole />} />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login">
        <button className="login-access-btn">Login</button>
      </Link>
      <Link to ="/choose">
      <button className="login-access-btn">Sign Up</button>
      </Link>
    </div>
  );
}

export default App;
