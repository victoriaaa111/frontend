
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthProvider"; // Adjust the import path as needed
import "./Header.css";

const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    setAuth({}); // Clear auth state
    localStorage.removeItem("auth"); // Remove auth data from localStorage
  };

  return (
    <section className="header-wrapper">
      <div className="flexCenter paddings innerWidth header-container">
        <div className="move-logo">
          <div className="logo-name">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h1>fixer.md</h1>
            </Link>
          </div>
        </div>

        {/* Centered Menu */}
        {auth?.accessToken && (
          <div className="header-center-menu">
          <Link to="/client/profile">My Cabinet</Link>
          </div>
        )}

        {/* Right Aligned Buttons */}
        <div className="header-right-buttons">
          {auth?.accessToken ? (
            <button className="button1">
              <Link to="/" style={{ color: "white" }} onClick={handleLogout}>
                Logout
              </Link>
            </button>
          ) : (
            <>
              <button className="button1">
                <Link to="/chooselogin" style={{ color: "white" }}>
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