// Footer.js
import React from 'react';
import './Footer.css'; // Make sure the path to your CSS file is correct

const Footer = () => {
  return (
    <footer>
      <div className="content">
        <div className="left part">
          <div className="upper">
            <div className="title">About us</div>
            <p>We are the best service providers.</p>
          </div>
          <div className="lower">
            <div className="title">Contacts</div>
            <div className="phone">
              <a href="#"><i className="fas fa-phone-volume"></i>+373 678 902 345</a>
            </div>
            <div className="email">
              <a href="#"><i className="fas fa-envelope"></i>fixer.md@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="middle part">
          <div className="title">Services</div>
          <div><a href="#">Repairs and construction</a></div>
          <div><a href="#">Installation and repair</a></div>
          <div><a href="#">Cleaning and washing</a></div>
          <div><a href="#">Car towing</a></div>
        </div>
        <div className="right part">
          <div className="title">Follow us</div>
          <form action="#">
            <input type="text" placeholder="Enter your email "/>
            <input type="submit" value="Send"/>
            <div className="media-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
