import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <section className="header-wrapper">
      <div className="flexCenter paddings innerWidth header-container">
        <div className="move-logo">
        <img src="/logo3.png" alt="logo" className="logo" width={100} />
          <div className="logo-name">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h1>fixer.md</h1>
            </Link>
          </div>
        </div>

        {/* Centered Menu */}
        <div className="header-center-menu">
          <Link to="/workers">Our workers</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Right Aligned Buttons */}
        <div className="header-right-buttons">
          {isAuthenticated ? (
            <button className="button1"> 
              <Link to="/" style={{ color: "white" }} onClick={handleLogout}>
                Logout
              </Link>
            </button>
          ) : (
            <>
              <button className="button1">
                <Link to="/chooselogin" style={{ color: "white" }} onClick={handleLogin}>
                  Log In
                </Link>
              </button>
              <button className="button2">
                <Link to="/choose" style={{ color: "white" }}>
                  Sign Up
                </Link>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
