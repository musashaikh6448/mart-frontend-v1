import React, { useContext, useEffect } from "react";
import "../Assets/Styles/cart.css";
import { FaMinus, FaPlus, FaTrashAlt, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { Context } from "../common/Context";
import emptyCartImg from "../Assets/Images/emptyCart.jpg";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const {
    cartItems,
    handleRemoveFromCart,
    cartSubTotal,
    handleCartProductQuantity,
    totalSavedAmount,
    cardDeliveryCharge,
    cartGrandTotal,
  } = useContext(Context);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="empty-cart-container">
          <div className="empty-cart-card">
            <div className="empty-cart-icon-wrapper">
              <FaShoppingBag className="empty-cart-icon" />
            </div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet. Explore our top categories and deals!</p>
            <Link to="/" className="start-shopping-btn">
              Explore Products <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-header-row">
        <h1 className="cart-page-title">Shopping Cart</h1>
        <span className="cart-item-count-badge">
          {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="cart-main-grid">
        {/* Left Column: Product Items List */}
        <div className="cart-items-column">
          <div className="cart-items-card">
            {cartItems.map((item, index) => {
              const currentPrice = item?.selectedSize?.offerPrice || item?.offerPrice || 0;
              const originalMrp = item?.selectedSize?.mrp || item?.mrp || 0;
              const itemQty = item?.selectedSize?.quantity || item?.quantity || 1;

              return (
                <div className="cart-item-row" key={item._id || index}>
                  <div className="item-thumbnail-box">
                    <img
                      src={item?.imageURL?.[0] || emptyCartImg}
                      alt={item.productName}
                      className="item-image"
                    />
                  </div>

                  <div className="item-info-box">
                    <span className="item-brand-tag">{item.productBrand || item.productCategory || "Product"}</span>
                    <h3 className="item-title">{item.productName}</h3>
                    
                    <div className="item-price-row">
                      <span className="item-current-price">{formatCurrency(currentPrice)}</span>
                      {originalMrp > currentPrice && (
                        <span className="item-mrp-price">
                          <del>{formatCurrency(originalMrp)}</del>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="item-controls-box">
                    <div className="cart-qty-counter">
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleCartProductQuantity("dec", item)}
                        title="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className="cart-qty-val">{itemQty}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleCartProductQuantity("inc", item)}
                        title="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      className="remove-item-btn"
                      onClick={() => handleRemoveFromCart(item, index)}
                      title="Remove item"
                    >
                      <FaTrashAlt /> <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="cart-summary-column">
          <div className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-lines-group">
              <div className="summary-line">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">{formatCurrency(cartSubTotal)}</span>
              </div>

              {totalSavedAmount > 0 && (
                <div className="summary-line savings-line">
                  <span className="summary-label">Total Savings</span>
                  <span className="summary-value">-{formatCurrency(totalSavedAmount)}</span>
                </div>
              )}

              <div className="summary-line">
                <span className="summary-label">Delivery Fee</span>
                <span className="summary-value">
                  {cardDeliveryCharge === 0 ? (
                    <strong style={{ color: "#16a34a" }}>FREE</strong>
                  ) : (
                    formatCurrency(cardDeliveryCharge)
                  )}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-line total-line">
                <span className="summary-label">Total Amount</span>
                <span className="summary-value grand-price">{formatCurrency(cartGrandTotal)}</span>
              </div>
            </div>

            <button
              disabled={cartSubTotal === 0 || isNaN(cartSubTotal) || cartItems.length <= 0}
              onClick={() => navigate("/payment-step")}
              className="proceed-checkout-btn"
              type="button"
            >
              Proceed to Checkout <FaArrowRight />
            </button>

            <div className="checkout-trust-badges">
              <span>🔒 100% Secure Checkout</span>
              <span>⚡ Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

