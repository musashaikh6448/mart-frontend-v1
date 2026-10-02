import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Assets/Styles/OrderBill.css";
import logo from "../Assets/Images/TekiskyMartNewLogo-removebg-preview.png";
import { useParams } from "react-router-dom";
import "../Assets/Styles/AddProductForm.css";
import { Base_Url } from "../common/Apis";
import ProductList from "../common/CategoryContent";

const OrderBill = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true); // Initially set loading to true

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true); // Set loading to true before making the API call

      try {
        const response = await axios.get(
          `${Base_Url}/order/getOrderById/${id}`
        );
        setOrderData(response.data.order);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setOrderData(null);
      } finally {
        setLoading(false); // Set loading back to false after the API call is complete
      }
    };

    fetchOrderData();
  }, [id]);

  return (
    <>
    <ProductList/>
       {loading && (
        <div className="loader-container">
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    <div className="order-bill-container">
      {orderData && (
        <div className="order-bill-invoice">
          <div className="order-bill-header">
            <img src={logo} alt="" className="company-logo" />
            <div className="company-details">
              <h1>TekiskyMart.com</h1>
            </div>
          </div>
          <div className="order-details">
            <div className="customer-details">
              <h2>Your Order Details</h2>
              <p>Order ID: {orderData.orderId}</p>
              <p>Customer Name: {orderData.customerName}</p>
              <p>Mobile Number: {orderData.mobileNumber}</p>
              <p>Address: {orderData.address}</p>
              <p>Landmark: {orderData.landmark}</p>
              <p>Pincode: {orderData.pincode}</p>
            </div>
            <div className="order-items">
              <h2>Order Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Offer Price</th>
                    {/* <th>Total Price</th> */}
                  </tr>
                </thead>
                <tbody>
                  {orderData.productDetails.map((productDetail, index) => (
                    <tr key={index}>
                      <td>{productDetail.productName}</td>
                      <td>{productDetail.quantity}</td>
                      <td>₹{productDetail.offerPrice}</td>
                      {/* <td>₹{productDetail.offerPrice}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="total-amount">Total Amount: ₹{orderData.totalAmount}</p>
              <p className="total-amount">Order Status: {orderData.orderStatus}</p>
            </div>
          </div>
          <div className="order-bill-footer">
            <p>Order Date: {new Date(orderData.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default OrderBill;
