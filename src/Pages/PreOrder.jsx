import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { Context } from "../common/Context";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Base_Url, getCategiesAPI, preOrderAPI } from "../common/Apis";

const PreOrder = () => {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const { ToastContainer,  Swal } = useContext(Context);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    preOrderProduct: "",
    quantity: "",
    phoneNumber: "",
    additionalAdd: "",
    description: "",
    pincode: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "phoneNumber" || name === "AlternateNumber") {
      // Remove any non-digit characters (except '-')
      const numericValue = value.replace(/[^0-9-]/g, "");

      // Ensure the length does not exceed 10 digits
      const maxLength = 10;
      const truncatedValue = numericValue.slice(0, maxLength);

      // Parse the numeric value as an integer
      const intValue = parseInt(truncatedValue, 10);

      // Check if the parsed value is a positive number
      const isValidNumber = !isNaN(intValue) && intValue >= 0;

      // Update form data accordingly
      setFormData((prevData) => ({
        ...prevData,
        [name]: isValidNumber ? truncatedValue : "",
      }));
    } else if (
      name === "aadharNumber" ||
      name === "pincode" ||
      name === "rationCardNo"
    ) {
      // Remove any non-digit characters
      const numericValue = value.replace(/[^0-9]/g, "");

      // Check if the length does not exceed the specified limit
      const maxLength =
        name === "aadharNumber" ? 12 : name === "pincode" ? 6 : 16;
      const truncatedValue = numericValue.slice(0, maxLength);

      // Update form data with the truncated value
      setFormData((prevData) => ({ ...prevData, [name]: truncatedValue }));
    } else if (name === "age") {
      const ageValue = parseInt(value, 10);

      // Check if the value is within the desired range (1 to 120)
      const isValidAge = !isNaN(ageValue) && ageValue >= 1 && ageValue <= 120;

      // Update form data with the validated value
      setFormData((prevData) => ({
        ...prevData,
        [name]: isValidAge ? ageValue : "",
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${Base_Url}${getCategiesAPI}`
        );
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handlePreOrder = (e) => {
    e.preventDefault();
  
    var requiredFields = [
      "preOrderProduct",
      "fullName",
      "quantity",
      "phoneNumber",
      // "pincode",
      // "additionalAdd",
    ];
  
    let hasError = false;
  
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        hasError = true;
      }
    });
  
    if (hasError) {
      Swal.fire({
        title: "Warning!",
        text: "All mandatory fields are required",
        icon: "error",
      });
    }
    if (!hasError) {
      handleConfirmation();
    }
  };
  
  const handleConfirmation = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this pre-order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit();
      }
    });
  };
  
  const handleSubmit = async () => {
    const payload = {
      customerName: formData.fullName,
      whichProductWantToPurchase: formData.preOrderProduct,
      quantity: formData.quantity,
      mobileNumber: formData.phoneNumber,
    };
  
    try {
      // Make a POST request to your backend API endpoint
      const response = await axios.post(
        `${Base_Url}${preOrderAPI}`,
        payload
      );
  
      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Your pre-order has been booked successfully",
          icon: "success",
        }).then(() => {
          navigate("/");
        });
      } else {
        // Handle other cases if needed
        console.error("Error: ", response.data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };
  
  return (
    <div style={{ width: "80%", margin: "20px auto" }}>
      <ToastContainer />
      <h1 style={{ textAlign: "center" }}>Pre Order</h1>
      <div
        className="home-marquee"
        style={{ color: "#004AAD", fontWeight: "bold", height: "40px" }}
      >
        <div className="scrolling-text">
          <span style={{ marginRight: "100px", marginBottom: "50px" }}>
            {" "}
            Get 15% off on pre-orders!{" "}
          </span>
          <span>Pre order means order us 5 to 10 days before</span>
        </div>
      </div>

      <form action="">
        <>
          <div>
            <Row className="Row">
              <Col xs={12} md={4} xl={4}>
                <div className="Formlabel">
                  Your Name
                  <span className="error-message">⁕</span>{" "}
                </div>
              </Col>
              <Col xs={12} md={6} xl={6}>
                <input
                  type="text"
                  className="MyInput"
                  placeholder="Enter Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={12} md={4} xl={4}>
                {" "}
                <div className="Formlabel">
                  Your Mobile Number
                  {/* <FaWhatsapp style={{fontSize:"30px",color:"green"}}/> */}
                  <span className="error-message">⁕</span>{" "}
                </div>
              </Col>
              <Col xs={12} md={6} xl={6}>
                <input
                  type="number"
                  className="MyInput"
                  placeholder="Mobile Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={12} md={4} xl={4}>
                <div className="Formlabel">
                  Which product you want to purchase
                  <span className="error-message">⁕</span>{" "}
                </div>
              </Col>
              <Col xs={12} md={6} xl={6}>
                <select
                  className="MyInput"
                  name="preOrderProduct"
                  value={formData.preOrderProduct}
                  onChange={handleInputChange}
                >
                  <option value="">Select Product</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Col>
              <Col xs={12} md={4} xl={4}>
                {" "}
                <div className="Formlabel">
                  How much quantity
                  {/* <FaWhatsapp style={{fontSize:"30px",color:"green"}}/> */}
                  <span className="error-message">⁕</span>{" "}
                </div>
              </Col>
              <Col xs={12} md={6} xl={6}>
                <input
                  type="number"
                  className="MyInput"
                  placeholder="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </Col>

              <Col xs={12} md={4} xl={4}>
                {" "}
                <div className="Formlabel">
                  Description
                  {/* <span className="error-message">⁕</span>{" "} */}
                </div>
              </Col>
              <Col xs={12} md={6} xl={6}>
                <textarea
                  style={{ height: "auto" }}
                  type="textarea"
                  rows="4"
                  className="MyInput"
                  placeholder="Enter Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Col>
              {/* <Col xs={12} md={4} xl={4}>
                    {" "}
                    <div className="Formlabel">
                      Address Details
                      <span className="error-message">⁕</span>{" "}
                    </div>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <textarea
                      style={{ height: "auto" }}
                      type="textarea"
                      rows="4"
                      className="MyInput"
                      placeholder="Enter House No, Bulding ,Company ,Appartment ,Area Colony , Street , Sector , Village"
                      name="additionalAdd"
                      value={formData.additionalAdd}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col xs={12} md={4} xl={4}>
                    {" "}
                    <div className="Formlabel">
                      Landmark e.g. near IT park
                      <span className="error-message">⁕</span>{" "}
                    </div>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <input
                      type="text"
                      className="MyInput"
                      placeholder="Enter Landmark e.g. near IT park"
                      name="landMark"
                      value={formData.landMark}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col xs={12} md={4} xl={4}>
                    {" "}
                    <div className="Formlabel">
                    Pin Code 
                      <span className="error-message">⁕</span>{" "}
                    </div>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <input
                      type="text"
                      className="MyInput"
                      placeholder="Enter pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </Col> */}

              <Col xs={12} md={6} xl={6}></Col>
              <Col xs={12} md={6} xl={6}>
                {" "}
                <div
                  style={{
                    float: "right",
                    margin: "10px",
                    display: "flex",
                  }}
                >
                  <button className="NextBtn" onClick={handlePreOrder}>
                    Submit Pre Order
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </>
      </form>
    </div>
  );
};

export default PreOrder;
