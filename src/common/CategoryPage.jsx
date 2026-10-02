import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../App.css";
import { useParams, Link, useLocation } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { Context } from "../common/Context";
import { Base_Url, getAllProductAPI } from "./Apis";
import translations from "../common/Languages.json";

const CategoryPage = () => {
  const location = useLocation();
  const { category } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleAddToCart, ToastContainer, quantity, handleBuyNow } =
    useContext(Context);

  const decodedCategory = decodeURIComponent(category || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(`${Base_Url}${getAllProductAPI}`);
        const productsList = response?.data?.products || [];
        const filteredProducts = productsList.filter(
          (product) =>
            product?.productCategory &&
            product.productCategory.trim().toLowerCase() === decodedCategory.trim().toLowerCase()
        );
        setCategoryProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category, decodedCategory]);

  if (loading) {
    return (
      <div className="product-main">
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
      <h5 className="heading-of-category">
        <div>
          {translations.translations[decodedCategory] &&
            translations.translations[decodedCategory]["mr"]}
        </div>
        <div>{decodedCategory !== "undefined" ? decodedCategory : ""}</div>
        <div>
          {translations.translations[decodedCategory] &&
            translations.translations[decodedCategory]["ur"]}
        </div>
      </h5>

      <div className="product-grid">
        {categoryProducts.map((product, index) => (
          <div className="showcase" key={product?._id}>
            <div className="showcase-banner">
              <Link
                to={`/single-product/${product?._id}`}
                className="showcase-title"
              >
                {product?.imageURL && (
                  <>
                    <img
                      src={product.imageURL[0]}
                      alt={product.productName}
                      className="product-img default"
                    />
                    <img
                      src={product.imageURL[1] || product.imageURL[0]}
                      alt={product.productName}
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
              </Link>
            </div>

            <div className="showcase-content">
              <Link
                style={{ color: "black", fontSize: "15px" }}
                to={`/single-product/${product?._id}`}
                className="showcase-title"
              >
                <h6 className="product-name-short">
                  {product?.productName && product.productName.length > 12
                    ? `${product.productName.substring(0, 13)}...`
                    : product?.productName}
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
                    {" "}
                    {`₹${product?.mrp}`}
                  </del>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
