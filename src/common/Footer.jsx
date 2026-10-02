import React from "react";
import {
  FaFacebookSquare,
  FaLinkedin,
  FaTwitterSquare,
  FaWhatsappSquare,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const MyFooter = () => {
  return (
    <footer>
      <div className="footer-nav">
        <div className="container">
          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <h2 className="nav-title">Popular</h2>
            </li>

            <li className="footer-nav-item">
              <Link to="/saleWithUs" className="footer-nav-link">
                Sell with us
              </Link>
            </li>

            <li className="footer-nav-item">
              <Link to="/pre-order" className="footer-nav-link">Pre-Order</Link>
            </li>

            <li className="footer-nav-item">
              <Link to="/customer-support" className="footer-nav-link">Customer Support</Link>
            </li>
          </ul>

         

          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <h2 className="nav-title">Our Commitment</h2>
            </li>

            <li className="footer-nav-item">
              <Link className="footer-nav-link">Delivery within 24 hours</Link>
            </li>

            <li className="footer-nav-item">
              <Link className="footer-nav-link">Returns without questions</Link>
            </li>

            <li className="footer-nav-item">
              <Link className="footer-nav-link">
                Quality product at best price
              </Link>
            </li>

            <li className="footer-nav-item">
              <Link className="footer-nav-link">
                Low price compare to your retail outlet
              </Link>
            </li>
          </ul>

          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <h2 className="nav-title">Services</h2>
            </li>

            <li className="footer-nav-item">
              <Link className="footer-nav-link">Corporate Training</Link>
            </li>

            <li className="footer-nav-item">
              <Link className="footer-nav-link">Corporate Trainers</Link>
            </li>
            <li className="footer-nav-item">
              <Link className="footer-nav-link">IT Consultancy</Link>
            </li>
            <li className="footer-nav-item">
              <Link className="footer-nav-link">Software Development </Link>
            </li>
            <li className="footer-nav-item">
              <Link className="footer-nav-link">IT Services </Link>
            </li>
            <li className="footer-nav-item">
              <Link className="footer-nav-link">Website Development </Link>
            </li>
          </ul>

          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <h2 className="nav-title">Contact</h2>
            </li>

            <li className="footer-nav-item flex">
              <div className="icon-box">
                <ion-icon name="location-outline"></ion-icon>
              </div>

              <address className="content">
                2nd floor, opposite WaterTank, WorkShop Corner, Nanded,
                Maharashtra 431605 INDIA
              </address>
            </li>

            <li className="footer-nav-item flex">
              <div className="icon-box">
                <ion-icon name="call-outline"></ion-icon>
              </div>

              <a href="tel:+607936-8058" className="footer-nav-link">
                +91 8625817334,
                <br />
                +91 9890796149
              </a>
            </li>

            <li className="footer-nav-item flex">
              <div className="icon-box">
                <ion-icon name="mail-outline"></ion-icon>
              </div>

              <Link className="footer-nav-link">sales@tekisky.com</Link>
            </li>
            <li className="footer-nav-item flex">
              <div className="icon-box">
                <ion-icon name="mail-outline"></ion-icon>
              </div>

              <Link to={"/login"} className="footer-nav-link">
                Login
              </Link>
            </li>
          </ul>

          <ul className="footer-nav-list">
            <li className="footer-nav-item">
              <h2 className="nav-title">Follow Us</h2>
            </li>

            <li>
              <ul className="social-link">
                <li className="footer-nav-item">
                  <Link className="footer-nav-link">
                    <FaFacebookSquare />
                  </Link>
                </li>

                <li className="footer-nav-item">
                  <Link className="footer-nav-link">
                    <FaTwitterSquare />
                  </Link>
                </li>

                <li className="footer-nav-item">
                  <Link className="footer-nav-link">
                    <FaLinkedin />
                  </Link>
                </li>

                <li className="footer-nav-item">
                  <Link className="footer-nav-link">
                    <FaWhatsappSquare />
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            Copyright &copy; <Link to="https://tekisky.com/">Tekisky Pvt Ltd</Link> all rights reserved.
          </p>
          <p className="copyright">
          +91 7387737731 , +91 8625817334 <br />
          sales@tekisky.com
         
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MyFooter;
