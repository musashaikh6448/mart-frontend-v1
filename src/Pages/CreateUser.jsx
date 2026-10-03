import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../Assets/Styles/AddProductForm.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Base_Url, createUserAPI } from "../common/Apis";

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // New state for loader
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    role: "",
    shopName: "",
    shopAddress: "",
    gstNumber: "",
    shopCategory: "",
  });

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const handleChange = (e) => {
    if (e.target.name === "mobileNumber") {
      const numericValue = e.target.value.replace(/\D/g, "");
      const limitedValue = numericValue.slice(0, 10);
      setFormData({
        ...formData,
        [e.target.name]: limitedValue,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const isValidEmail = (email) => {
    // You can use a regular expression for a basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to check if a string is a valid phone number
  const isValidPhoneNumber = (phoneNumber) => {
    // Check if it contains only digits and has exactly 10 characters
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Function to check if a string is a strong password
  const isValidPassword = (password) => {
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations for required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      // Display an error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // Additional validations for email and phone number
    if (!isValidEmail(formData.email)) {
      // Display an error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!isValidPhoneNumber(formData.mobileNumber)) {
      // Display an error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid phone number.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // Check if the entered password is strong
    if (!isValidPassword(formData.password)) {
      // Display a message indicating the password requirements
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = `${Base_Url}${createUserAPI}`;
  
      await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User created successfully.",
        confirmButtonColor: "#28a745",
      });
      setLoading(false);
      navigate("/users");
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "User already exists"
      ) {
        // Show sweet alert for duplicate user
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "User already exists",
          confirmButtonColor: "#d33",
        });
      } else {
        // Show generic error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error creating user.",
          confirmButtonColor: "#d33",
        });
        console.error("Error creating user:", error.message);
      }
    }
  };
  return (
    <div>
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
      <h2 className="title">Add User</h2>

      {/* {message && (
        <div style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.content}
        </div>
      )} */}

      <form onSubmit={handleSubmit} className="addProductForm">
        <div>
          <label className="formLabel">First Name:</label>
          <input
            className="formInput"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="formLabel">Last Name:</label>
          <input
            className="formInput"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="formLabel">Mobile Number:</label>
          <input
            className="formInput"
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="formLabel">Email:</label>
          <input
            className="formInput"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="formLabel">Password:</label>
          <input
            className="formInput"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="formLabel">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="formInput"
          >
            <option value="">Select Role</option>
            <option value="seller">Seller</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        {/* Additional fields specific to shop users */}

        {/* Additional fields specific to seller role */}
        {formData.role === "seller" && (
          <>
            <div>
              <label className="formLabel">Shop Name:</label>
              <input
                className="formInput"
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="formLabel">Shop Address:</label>
              <textarea
                className="formInput"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleChange}
                required
                rows={4} // Specify the number of visible rows
              />
            </div>

            <div>
              <label className="formLabel">G.S.T. Number:</label>
              <input
                className="formInput"
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div>
          <label className="formLabel">Shop Category:</label>
          <select
            name="shopCategory"
            value={formData.shopCategory}
            onChange={handleChange}
            className="formInput"
          >
            <option value="">Select Category</option>
            <option value="DATES">DATES</option>
            <option value="DRY FRUITS">DRY FRUITS</option>

            <option value="HOMEMADE SNACKS">HOMEMADE SNACKS</option>
            <option value="CLOTHES">CLOTHES</option>
            <option value="PERFUMES">PERFUMES</option>
            <option value="KIRANA DUKAAN">KIRANA DUKAAN</option>
            <option value="GIFT-ITEMS">GIFT-ITEMS</option>
            <option value="TOY'S">TOY'S</option>
            <option value="FURNITURE">FURNITURE</option>
            <option value="BOOKS">BOOKS</option>
            <option value="MOBILES">MOBILES</option>
            <option value="JEWELLERY">JEWELLERY</option>
            <option value="LAPTOPS">LAPTOPS</option>
            <option value="CROCKERY">CROCKERY </option>
            <option value="COSMETIC">COSMETIC </option>
            <option value="FOOTWERE">FOOTWERE </option>
            <option value="PLANTS">PLANTS </option>
            <option value="WATCHES">WATCHES </option>
            <option value="SPORTS">SPORTS </option>
            <option value="HOME DECORE">HOME DECORE </option>
            <option value="DISPOSABLE ITEM'S">DISPOSABLE ITEM'S </option>
            <option value="OTHERS">OTHERS</option>
          </select>
        </div>

        <div>
          <button className="formButton" type="submit">
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
