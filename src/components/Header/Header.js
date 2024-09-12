import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <section className="header-wrapper">
            <div className="flexCenter paddings innerWidth header-container">
                <div className="move-logo">
                    <img src="./logo3.png" alt="logo" className="logo" width={100} />
                    <div className="logo-name">
                        <h1>fixer.md</h1>
                    </div>
                </div>
                <div className=" flexCenter header-menu">
                    <Link to="/categories">Categorii Meșteri</Link>
                    <Link to="/about">Despre noi</Link>
                    <Link to="/contact">Contacte</Link>
                    <button className="button1">
                        <Link to="/chooselogin" style={{color: "white"}}>Log In</Link>
                    </button>
                    <button className="button2">
                        <Link to="/signupclient" style={{color: "white"}}>Sign Up</Link>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Header;
