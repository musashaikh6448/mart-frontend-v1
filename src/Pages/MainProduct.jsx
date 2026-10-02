// Import necessary modules and components
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import "../App.css";
import { Context } from "../common/Context";
import translations from "../common/Languages.json";
import { Base_Url, getAllProductAPI } from "../common/Apis";
import {
  getProductDisplayName,
  getProductImageUrls,
  normalizeProducts,
} from "./mainProductUtils";

const ProductMain = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCategoryProducts = (category, isMobile) => {
    const maxProducts = isMobile ? 4 : 12;
    const normalizedProducts = normalizeProducts(products);
    const filteredProducts = normalizedProducts.filter(
      (product) => product?.productCategory === category
    );
    return [...filteredProducts].reverse().slice(0, maxProducts);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { handleAddToCart, ToastContainer, quantity, handleBuyNow } =
    useContext(Context);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${Base_Url}${getAllProductAPI}`);
        setProducts(normalizeProducts(response?.data?.products));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Render skeleton loading effect
  if (loading) {
    return (
      <div className="product-main notification-toadt">
        <ToastContainer />

        <div className="product-grid">
          {[...Array(12)].map((_, index) => (
            <div className="showcase skeleton" key={index}>
              <div className="showcase-banner">
                <div className="skeleton-img default"></div>
                <div className="skeleton-img hover"></div>
                <div className="showcase-actions">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="product-main">
      <ToastContainer />

      {Array.from(
        new Set(normalizeProducts(products).map((product) => product?.productCategory))
      )
        .filter(Boolean)
        .map((category) => (
          <div key={category}>
            <h5
              className="heading-of-category"
              onClick={() => {
                setSelectedCategory(category);
                navigate(`/category/${category}`);
              }}
            >
              <div>
                {translations.translations[category] &&
                  translations.translations[category]["mr"]}
              </div>
              <div>{category}</div>
              <div>
                {translations.translations[category] &&
                  translations.translations[category]["ur"]}
              </div>
            </h5>

            <div className="product-grid">
              {getCategoryProducts(category, window.innerWidth <= 768).map(
                (product, index) => (
                  <div className="showcase" key={product?._id}>
                    <div
                      className="showcase-banner"
                      onClick={() => handleBuyNow(product)}
                    >
                      {getProductImageUrls(product).length > 0 && (
                        <>
                          <img
                            src={getProductImageUrls(product)[0]}
                            alt={getProductDisplayName(product)}
                            className="product-img default"
                          />
                          <img
                            src={getProductImageUrls(product)[1] || getProductImageUrls(product)[0]}
                            alt={getProductDisplayName(product)}
                            className="product-img hover"
                          />
                        </>
                      )}

                      <div className="showcase-actions">
                        <button
                          className="btn-action"
                          onClick={() => handleBuyNow(product)}
                        >
                          <FaRegEye />
                        </button>

                        <button
                          className="btn-action"
                          onClick={() => {
                            handleAddToCart(product, quantity, index);
                          }}
                        >
                          <IoIosAddCircle />
                        </button>
                      </div>
                    </div>

                    <div className="showcase-content">
                      <Link
                        style={{ color: "black", fontSize: "15px" }}
                        to={`/single-product/${product?._id}`}
                        className="showcase-title"
                      >
                        <h6 className="product-name-short">
                          {getProductDisplayName(product).length > 12
                            ? `${getProductDisplayName(product).substring(0, 13)}...`
                            : getProductDisplayName(product)}
                        </h6>
                      </Link>

                      <div className="price-box" style={{ display: "flex" }}>
                        <p
                          className="price"
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontSize: "18px",
                            marginBottom: "0px",
                          }}
                        >
                          {`₹${product?.offerPrice}`}
                          <del
                            style={{
                              color: "gray",
                              marginLeft: "5px",
                              textDecorationThickness: "1.6px",
                            }}
                          >
                            {`₹${product?.mrp}`}
                          </del>
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                className="viewAll-btn"
                onClick={() => {
                  setSelectedCategory(category);
                  navigate(`/category/${category}`);
                }}
              >
                View More
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductMain;
