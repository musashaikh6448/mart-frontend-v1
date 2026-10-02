import React, { useEffect } from "react";
// import "leaflet/dist/leaflet.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
// import { Map, TileLayer } from 'react-leaflet';
import "../Assets/Styles/Enquiry.css";
import { useLocation, useParams } from "react-router-dom";
const Enquiry = () => {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);
  return (
    <>
      <div className="first-image-container">
        <h2 className="first-container-heading">Customer Support</h2>
        <h5 style={{textAlign:"center"}}>Feel free to contact us if you need any assistance, any help or questions.</h5>
      </div>
      <div className="about-card-container container">
        <div className="about-card">
          <FaLocationDot className="location-icon" />
          <h3>Address</h3>

          <span>
            2nd floor, opposite WaterTank,
            <br /> WorkShop Corner, Nanded,
            <br /> Maharashtra 431605 INDIA
          </span>
        </div>
        <div className="about-card">
          <FaPhoneAlt className="phone-icon" />
          <h3>Phone</h3>

          <span> +91 8625817334</span> <br />
          <span> +91 9890796149</span> <br />
          <span> +91 7387737731</span>
        </div>
        <div className="about-card">
          <MdOutlineAlternateEmail className="email-icon" />
          <h3>Email</h3>

          <span>hr@tekisky.com</span> <br />
          <span>Sales@Tekisky.Com</span>
        </div>
      </div>
      <div className="second-about-container container">
        <div className="map-container">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.352579279839!2d77.3026939742545!3d19.179796748707673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd1d7502795a5c1%3A0x15ded39c097470bd!2sTekisky%20pvt.%20ltd.!5e0!3m2!1sen!2sin!4v1704563916892!5m2!1sen!2sin"
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        {/* <form action="#" className="contact-form">
          <h5 className="title">Customer Support</h5>
          <p className="description">
            Feel free to contact us if you need any assistance, any help or
            another question.
          </p>
          <div>
            <input
              type="text"
              className="form-control rounded border-white mb-3 form-input"
              id="name"
              placeholder="Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              className="form-control rounded border-white mb-3 form-input"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <textarea
              id="message"
              className="form-control rounded border-white mb-3 form-text-area"
              rows="5"
              cols="30"
              placeholder="Message"
              required
            ></textarea>
          </div>
          <div className="submit-button-wrapper">
            <input type="submit" value="Send" />
          </div>
        </form> */}
      </div>
    </>
  );
};

export default Enquiry;
