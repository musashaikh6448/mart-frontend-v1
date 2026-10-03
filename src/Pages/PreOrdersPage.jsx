import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Base_Url, getpreOrderAPI } from "../common/Apis";
import Swal from "sweetalert2";

const PreOrderPage = () => {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()

  const handleTokenError = useCallback(() => {
    Swal.fire({
      icon: "warning",
      title: "Your session has expired.",
      text: "Please log in again to continue.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login",
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to login page
        navigate("/login");
      }
    });
  }, [navigate]);

  useEffect(() => {
    const fetchPreOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = `${Base_Url}${getpreOrderAPI}`;
  
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `${token}`,
          },
        });
  
        setOrders(response.data.order);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error === "Access denied. Invalid token."
        ) {
          // Handle expired or invalid token error
          handleTokenError();
        }
      }
    };
  
    fetchPreOrders();
  }, [handleTokenError]);
  
  return (
    <div className="container table-responsive">
      <h2>Orders Table</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Mobile Number</th>
            <th>Created At</th> {/* New Table Header for Created At */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>{order.whichProductWantToPurchase}</td>
              <td>{order.quantity}</td>
              <td>{order.mobileNumber}</td>
              <td>
                {new Date(order.createdAt).toLocaleDateString()}{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </td> {/* Display the Created At with Date and Time */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PreOrderPage;
