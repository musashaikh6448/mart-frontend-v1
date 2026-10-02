import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Assets/Styles/DealsOfDay.css";
import "../App.css";
import { Base_Url, getAllProductAPI } from "./Apis";
 
const DealOfTheDay = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch(`${Base_Url}${getAllProductAPI}`)
      .then((response) => response.json())
      .then((data) => {
        // Filter products with "dealOfDay" set to true
        const dealOfDayProducts = data.products.filter(
          (product) => product.dealOfDay
        );

        // Set the filtered products to the state
        setProducts(dealOfDayProducts);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // If there are no products, hide the container
  if (products.length === 0) {
    return null; // or return an empty component
  }

  const truncateProductName = (name) => {
    const words = name.split(" ");
    if (words.length > 1) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return name;
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    className: "deals-of-the-day-setting",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Display 2 cards on mobile screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Display 3 cards on tablets
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4, // Display 4 cards on small desktops
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1920, // Large desktops and beyond
        settings: {
          slidesToShow: 6, // Display 6 cards on larger screens
          slidesToScroll: 1,
        },
      },
    ],
  };
  

  return (
    <div className="deal-of-the-day-container">
      <h2 className="deal-of-the-day-heading">Today's Special Deals</h2>
      <div className="deal-of-the-day-slider-container">
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product._id} className="deal-of-the-day-card">
             
              <Link to={`/single-product/${product._id}`}>
                <div className="card-image-wrapper">
                  <img
                    src={product.imageURL[0]}
                    alt={product.productName}
                    className="card-image"
                  />
                </div>
              </Link>
              <div className="card-details">
                <Link to={`/single-product/${product._id}`}>
                  <h4>{truncateProductName(product.productName)}</h4>
                </Link>
                <p>
                  MRP: <del>₹{product.mrp}</del>
                </p>
                <p>
                  Offer Price:{" "}
                  <span className="real-price">₹{product.offerPrice}</span>
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default DealOfTheDay;
