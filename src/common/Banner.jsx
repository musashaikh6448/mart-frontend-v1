import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Assets/Styles/Banner.css";
import dates from "../Assets/Images/Black and Green Minimalist Premium Dates Ramadhan Special Offer Banner.png";
import datesMobile from "../Assets/Images/Our premium dates are super tasty and top-notch quality..png";
import perfume from "../Assets/Images/Discover our Lattafa perfumes..png";
import perfumeMobile from "../Assets/Images/Brown Elegant Eau de Parfum Instagram Post .png";
import clothes from "../Assets/Images/Beige Aesthetic New Arrival Fashion Banner Landscape.png";
import clothesMobile from "../Assets/Images/New fashion collection promotion Instagram Post.png";
import watch from "../Assets/Images/festive_season_banner.png";
import watchMobile from "../Assets/Images/WhatsApp Image 2024-02-28 at 12.14.45_589a89d9.jpg";
import { Link } from "react-router-dom";

const Banner = () => {
  const isMobile = window.innerWidth <= 768;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="banner-container">
      <Slider {...settings}>
        <Link to="/category/DATES">
          <div className="banner-slide-mobile">
            <img
              src={isMobile ? datesMobile : dates}
              alt="Slide 1"
              className="banner-slide-image-mobile"
            />
          </div>
        </Link>
        <Link to="/category/PERFUMES">
          <div className="banner-slide-mobile">
            <img
              src={isMobile ? perfumeMobile : perfume}
              alt="Slide 2"
              className="banner-slide-image-mobile"
            />
          </div>
        </Link>
        <Link to="/category/CLOTHES">
          <div className="banner-slide-mobile">
            <img
              src={isMobile ? clothesMobile : clothes}
              alt="Slide 3"
              className="banner-slide-image-mobile"
            />
          </div>
        </Link>
        <Link to="/category/WATCHES">
          <div className="banner-slide-mobile">
            <img
              src={isMobile ? watchMobile : watch}
              alt="Slide 4"
              className="banner-slide-image-mobile"
            />
          </div>
        </Link>
        {/* {isMobile && (
          <Link to="/category/KIRANA%20DUKAAN">
            <div className="banner-slide-mobile">
              <img
                src={kiranaMobile}
                alt="Slide 5"
                className="banner-slide-image-mobile"
              />
            </div>
          </Link>
        )} */}
      </Slider>
    </div>
  );
};

export default Banner;
