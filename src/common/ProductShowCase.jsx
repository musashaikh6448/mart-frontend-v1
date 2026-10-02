import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { IoRepeatOutline } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import "../App.css"
const ProductShowcase = ({
  category,
  title,
  imgSrcDefault,
  imgSrcHover,
  badge,
  price,
  originalPrice,
  rating,
}) => {
  return (
    <div className="showcase">
      <div className="showcase-banner">
        <img src={imgSrcDefault} alt={title} className="product-img default" />
        <img src={imgSrcHover} alt={title} className="product-img hover" />


        <div className="showcase-actions">
          <button className="btn-action">
            <CiHeart />
          </button>
          <button className="btn-action">
            <FaRegEye />
          </button>
          <button className="btn-action">
            <IoRepeatOutline />
          </button>
          <button className="btn-action">
            <IoIosAddCircle />
          </button>
        </div>
      </div>

      <div className="showcase-content">
        <Link className="showcase-category">{category}</Link>
        <Link>
          <h3 className="showcase-title">{title}</h3>
        </Link>

        <div className="showcase-rating">
          {rating &&
            Array.from({ length: rating.fullStars }, (_, index) => (
              <ion-icon key={index} name="star"></ion-icon>
            ))}
          {rating &&
            Array.from({ length: rating.emptyStars }, (_, index) => (
              <ion-icon key={index} name="star-outline"></ion-icon>
            ))}
        </div>

        <div className="price-box">
          <p className="price">{`₹${price}`}</p>
          {originalPrice && <del>{`₹${originalPrice}`}</del>}
        </div>
        <div className="buttons">
        <button className="add-cart-btn-cards">add to cart</button>
        <button className="add-cart-btn-cards">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
