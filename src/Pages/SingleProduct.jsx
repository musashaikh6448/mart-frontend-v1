// Import necessary dependencies
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaMinus, FaPlus} from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Assets/Styles/SingleProduct.css"; // Import the CSS file
import { Context } from "../common/Context";
import { IoShareSocial } from "react-icons/io5";
import Swal from "sweetalert2";
import { Base_Url } from "../common/Apis";

// SingleProduct component
const SingleProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);

  const {
    handleAddToCart,
    ToastContainer,
    handleSingleProductQuantity,
    singleItems,
    handleSingleCheckout,
    setSingleItems,
    setSingleSavedAmount,
    setSingleSubTotal,
    setSingleDeliveryCharge,
    setSingleGrandTotal,
  } = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  useEffect(() => {
    setSingleItems((prev) => ({
      ...prev,
      quantity: 1,
    }));
  }, [id, setSingleItems]);

  // Effect to fetch product data based on the product ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${Base_Url}/product/getoneproduct/${id}`
        );
        const fetchedProduct = response?.data?.getOneProduct;
        setProduct(fetchedProduct);
        setSingleItems((prev) => ({
          ...prev,
          product: fetchedProduct,
        }));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, setSingleItems]);

  useEffect(() => {
    if (!product) return;
    const qty = singleItems?.quantity || 1;
    const itemSubTotal = (product.offerPrice || 0) * qty;
    const itemSavedAmount = ((product.mrp || 0) - (product.offerPrice || 0)) * qty;

    const deliveryCharge = itemSubTotal < 500 ? 30 : 0;
    const grandTotal = itemSubTotal + deliveryCharge;

    setSingleGrandTotal(grandTotal);
    setSingleDeliveryCharge(deliveryCharge);
    setSingleSubTotal(itemSubTotal);
    setSingleSavedAmount(itemSavedAmount > 0 ? itemSavedAmount : 0);
  }, [singleItems, product, setSingleGrandTotal, setSingleDeliveryCharge, setSingleSubTotal, setSingleSavedAmount]);

  if (!product) {
    return (
      <div className="product-container loader-product-container">
        <div className="preloader">
          <svg
            className="cart"
            role="img"
            aria-label="Shopping cart line animation"
            viewBox="0 0 128 128"
            width="128px"
            height="128px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            >
              <g className="cart__track" stroke="hsla(0,10%,10%,0.1)">
                <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
                <circle cx="43" cy="111" r="13" />
                <circle cx="102" cy="111" r="13" />
              </g>
              <g className="cart__lines" stroke="currentColor">
                <polyline
                  className="cart__top"
                  points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80"
                  strokeDasharray="338 338"
                  strokeDashoffset="-338"
                />
                <g className="cart__wheel1" transform="rotate(-90,43,111)">
                  <circle
                    className="cart__wheel-stroke"
                    cx="43"
                    cy="111"
                    r="13"
                    strokeDasharray="81.68 81.68"
                    strokeDashoffset="81.68"
                  />
                </g>
                <g className="cart__wheel2" transform="rotate(90,102,111)">
                  <circle
                    className="cart__wheel-stroke"
                    cx="102"
                    cy="111"
                    r="13"
                    strokeDasharray="81.68 81.68"
                    strokeDashoffset="81.68"
                  />
                </g>
              </g>
            </g>
          </svg>
          <div className="preloader__text">
            <p className="preloader__msg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Destructure product data
  const { productName, imageURL = [] } = product;
  const isOutOfStock = product.availableStockQty === null || product.availableStockQty < 1;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.productName,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        Swal.fire({
          icon: "success",
          title: "Link Copied!",
          text: "Product link copied to clipboard.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: "This product is currently out of stock.",
      });
    } else {
      handleAddToCart(product, singleItems?.quantity || 1);
    }
  };

  const handleCheckoutClick = () => {
    if (isOutOfStock) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: "This product is currently out of stock.",
      });
    } else {
      handleSingleCheckout(product);
    }
  };

  return (
    <div className="single-product-page-wrapper">
      <ToastContainer />
      <div className="single-product-container">
        {/* Left Column: Image Gallery */}
        <div className="product-gallery-section">
          <div className="main-image-display">
            <img
              src={imageURL?.[selectedImageIndex] || imageURL?.[0]}
              alt={productName}
              className="featured-product-image"
            />
            {product.dealOfDay && (
              <span className="product-badge deal-badge">Deal of the Day</span>
            )}
          </div>
          {imageURL?.length > 1 && (
            <div className="product-thumbnails-list">
              {imageURL.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className={`thumbnail-item ${
                    selectedImageIndex === index ? "active-thumbnail" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Box */}
        <div className="product-info-section">
          <div className="product-header-row">
            <span className="product-brand-tag">{product.productBrand || product.header}</span>
            <button className="share-btn" onClick={handleShare} title="Share product">
              <IoShareSocial className="share-icon" /> Share
            </button>
          </div>

          <h1 className="single-product-title">{productName}</h1>

          {/* Pricing Section */}
          <div className="pricing-card">
            <div className="price-main-row">
              <span className="offer-price-tag">₹{product.offerPrice?.toLocaleString()}</span>
              {product.mrp && product.mrp > product.offerPrice && (
                <span className="mrp-price-tag">
                  MRP: <del>₹{product.mrp?.toLocaleString()}</del>
                </span>
              )}
              {product.mrp && product.mrp > product.offerPrice && (
                <span className="discount-badge">
                  {Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100)}% OFF
                </span>
              )}
            </div>
            <p className="tax-inclusive-note">Inclusive of all taxes</p>
          </div>

          {/* Stock Alert */}
          {product.availableStockQty === null || product.availableStockQty < 1 ? (
            <div className="stock-status out-of-stock-alert">
              ❌ Currently Out of Stock
            </div>
          ) : product.availableStockQty <= 10 ? (
            <div className="stock-status low-stock-alert">
              ⚡ Only {product.availableStockQty} left in stock - order soon!
            </div>
          ) : (
            <div className="stock-status in-stock-alert">
              ✓ In Stock (Ready to Ship)
            </div>
          )}

          {/* Product Specifications Summary */}
          <div className="product-quick-specs">
            {product.productCategory && (
              <div className="spec-item">
                <span className="spec-label">Category:</span>
                <span className="spec-value">{product.productCategory}</span>
              </div>
            )}
            {product.productType && (
              <div className="spec-item">
                <span className="spec-label">Type:</span>
                <span className="spec-value">{product.productType}</span>
              </div>
            )}
            {product.color && (
              <div className="spec-item">
                <span className="spec-label">Color:</span>
                <span className="spec-value">{product.color}</span>
              </div>
            )}
            {product.size && (
              <div className="spec-item">
                <span className="spec-label">Size:</span>
                <span className="spec-value">{product.size}</span>
              </div>
            )}
            {product.material && (
              <div className="spec-item">
                <span className="spec-label">Material:</span>
                <span className="spec-value">{product.material}</span>
              </div>
            )}
            {product.packetweight && product.unitOfMeasure && (
              <div className="spec-item">
                <span className="spec-label">Weight/Size:</span>
                <span className="spec-value">{product.packetweight} {product.unitOfMeasure}</span>
              </div>
            )}
          </div>

          {/* Purchase Actions */}
          <div className="purchase-controls-box">
            <div className="quantity-selector-row">
              <span className="qty-label">Quantity:</span>
              <div className="qty-counter-group">
                <button
                  className="qty-btn"
                  onClick={() => handleSingleProductQuantity("dec", product)}
                >
                  <FaMinus />
                </button>
                <span className="qty-display">{singleItems?.quantity || 1}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleSingleProductQuantity("inc", product)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="action-buttons-group">
              <button
                className="add-cart-btn-primary"
                onClick={handleAddToCartClick}
              >
                Add to Cart
              </button>
              <button
                className="buy-now-btn-secondary"
                onClick={handleCheckoutClick}
              >
                Buy Now (Checkout)
              </button>
            </div>
          </div>

          {/* Delivery Policy Note */}
          <div className="delivery-info-banner">
            <div className="delivery-icon">🚚</div>
            <div className="delivery-text">
              <strong>Free Delivery</strong> on orders above ₹500
              <br />
              <small>Nominal ₹30 delivery charge for orders under ₹500</small>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detailed Description & Seller Info */}
      <div className="product-full-details-container">
        <div className="details-tab-content">
          <h2 className="section-heading">Product Description</h2>
          <p className="description-text">{product.description || "No additional description available."}</p>

          {product.sellerInformation && (
            <div className="seller-info-block">
              <h3 className="seller-heading">Seller Information</h3>
              <p className="seller-text">{product.sellerInformation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
