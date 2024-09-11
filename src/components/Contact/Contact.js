import React from "react";
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="form-container">
        <h1 className="title3">Contact</h1>
        <div className="devide">
            <div className="part">
                <div className="contact-section">
                            <h2 className="title2">Contact Us!</h2>
                            <form>
                                <input type="text" name="name" placeholder="Name" />
                                <input type="text" name="company" placeholder="Company" />
                                <input type="text" name="telephone" placeholder="Telephone" />
                                <input type="email" name="email" placeholder="Email" />
                                <textarea name="message" placeholder="Message"></textarea>
                                <button type="submit">Send Message</button>
                            </form>
                        </div>
                        <div className="subscribe-section">
                            <h2 className="title2">Subscribe</h2>
                            <div className="subs-form">
                                <input type="email" name="subscribe-email" placeholder="Email Address" />
                                <button type="submit">Subscribe</button>
                            </div>
                            
                        </div>
                    </div>
                    <div className="part">
                        <div className="location-section">
                            <h2 className="title2">Our Location</h2>
                                <iframe
                                    title="location-map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5438.3091080431805!2d28.81319317619661!3d47.03719797114321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d925542597d%3A0x5d013ae48f5e9286!2sPentalog%20CHI!5e0!3m2!1sen!2sus!4v1725716140995!5m2!1sen!2sus"
                                    frameBorder="0"
                                ></iframe>
                        </div>
                        <div className="stay-in-touch">
                            <h2 className="title2">Stay In Touch</h2>
                            <div className="media-icons">
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-twitter"></i></a>
                                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                     </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default Contact;
