import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/Log In Form/loginform';
import SignUpClient from './components/Sign Up Client/signup_client';
import ChooseRole from './components/Chooserole/chooserole';
import SignUpWorker from './components/Sign Up Worker/signup_worker';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Contact from "./components/Contact/Contact";
import ProfileEditPage from "./components/Worker Profile Management/ProfileEditPage";
import AdminLogIn from './components/Admin Login/AdminLogIn';
import AdminManagement from "./components/Admin User/AdminManagement";

function App() {
  return (
    <Router>
      <div className="Mesteri">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/admin-log-in" element={<AdminLogIn />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signupclient" element={<SignUpClient />} />
            <Route path="/signupworker" element={<SignUpWorker />} />
            <Route path="/choose" element={<ChooseRole />} />
            <Route path="/admin-management" element={<AdminManagement />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/worker-profile" element={<ProfileEditPage />} />
            {/* Add more routes for other components as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
