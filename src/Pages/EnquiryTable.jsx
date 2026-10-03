import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Base_Url, getEnquiryAPI } from '../common/Apis';
import Swal from 'sweetalert2';

const EnquiryTable = () => {
  const [enquiryData, setEnquiryData] = useState([]);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);
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
    const fetchEnquiryData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = `${Base_Url}${getEnquiryAPI}`;
  
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `${token}`,
          },
        });
  
        setEnquiryData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
  
    fetchEnquiryData();
  }, [handleTokenError]);
  

  return (
    <div className="container table-responsive">
      <h2>All Sell with us requests</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Shop Seller Name</th>
            <th>Do You Have GST</th>
            <th>GST Number</th>
            <th>Do You Have Shop</th>
            <th>Shop Name</th>
            <th>Product Details</th>
            <th>Mobile Number</th>
            <th>Which product do you want to sell</th>
            <th>Created At</th> {/* New Table Header for Created At */}
          </tr>
        </thead>
        <tbody>
          {enquiryData.map(enquiry => (
            <tr key={enquiry._id}>
              <td>{enquiry.shopSellerName}</td>
              <td>{enquiry.doYouHaveGST ? 'Yes' : 'No'}</td>
              <td>{enquiry.GST ? enquiry.GST : '-'}</td>
              <td>{enquiry.doYouHaveShop ? 'Yes' : 'No'}</td>
              <td>{enquiry.shopName}</td>
              <td>{enquiry.productDetails}</td>
              <td>{enquiry.mobileNumber}</td>
              <td>{enquiry.whichProductYouHaveToSell}</td>
              <td>
                {new Date(enquiry.createdAt).toLocaleDateString()}{' '}
                {new Date(enquiry.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </td> {/* Display the Created At with Date and Time */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnquiryTable;
