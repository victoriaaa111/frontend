import React from "react";
import "./Header.css";

const HeaderElem = () => {
    return (
        <section className="header-wrapper">
            <div className="flexCenter paddings innerWidth header-container">
                <div className="move-logo">
                       
                    <img src="logo3.png" alt="logo" className="logo" width={100} />
                
                
                    <div className="logo-name">
                        <h1>fixer.md</h1>
                    </div>
                </div>
                <div className=" flexCenter header-menu">
                    <a href="">Categorii Meșteri</a>
                    <a href="">Despre noi</a>
                    <a href="">Contacte</a>
                    <button className="button1">
                        <a href="">Log In</a>
                    </button>
                    <button className="button2">
                        <a href="">Sign Up</a>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default HeaderElem;