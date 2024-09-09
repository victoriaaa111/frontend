// Footer.js
import React from 'react';
import './Footer.css'; // Make sure the path to your CSS file is correct

const Footer = () => {
  return (
    <footer>
      <div className="content">
        <div className="left part">
          <div className="upper">
            <div className="title">Despre noi</div>
            <p>Suntem cea mai bună platformă.</p>
          </div>
          <div className="lower">
            <div className="title">Contacte</div>
            <div className="phone">
              <a href="#"><i className="fas fa-phone-volume"></i>+123 45 67 89</a>
            </div>
            <div className="email">
              <a href="#"><i className="fas fa-envelope"></i>someone@gmail.com</a>
            </div>
          </div>
        </div>
        <div className="middle part">
          <div className="title">Servicii</div>
          <div><a href="#">Reparații și construcții</a></div>
          <div><a href="#">Instalarea și reparare</a></div>
          <div><a href="#">Curățare și spălare</a></div>
          <div><a href="#">Tractări Auto</a></div>
        </div>
        <div className="right part">
          <div className="title">Abonațivă</div>
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
