import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpClient from './components/Sign Up Client/signup_client';
import ChooseRole from './components/Chooserole/chooserole';
import SignUpWorker from './components/Sign Up Worker/signup_worker';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Contact from "./components/Contact/Contact";
import LogInAdmin from './components/AdminLogin/adminlogin';
import LogInClient from './components/Log In Form/loginform';
import UserManagement from './components/Admin User/AdminManagement';
import ProtectedRoute from './components/AdminLogin/ProtectedRoute';
import LogInWorker from './components/Log In Worker/loginworker';
import ChooseLogin from './components/Log In Worker/chooselogin';

function App() {
  return (
    <Router>
      <div className="Mesteri">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/choose" element={<ChooseRole />} />
            <Route path="/chooselogin" element={<ChooseLogin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={<Hero />} />
            <Route path="/loginclient" element={<LogInClient />} />
            <Route path="/loginworker" element={<LogInWorker />} />
            <Route path="/signupclient" element={<SignUpClient />} />
            <Route path="/signupworker" element={<SignUpWorker />} />
            <Route path="/loginadmin" element={<LogInAdmin />} />
            <Route path="/usermanagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;