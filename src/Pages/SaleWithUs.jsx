import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Context } from "../common/Context";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Base_Url } from "../common/Apis";

const SaleWithUs = () => {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);
  const { ToastContainer, Swal } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    saleProduct: "",
    hasShop: "no",
    shopName: "",
    hasGSTNumber: "no",
    GSTNumber: "",
    phoneNumber: "",
    productDetails: "",
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

      // Update form data and errors accordingly
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

  const handleSaleWithUs = async (e) => {
    e.preventDefault();

    var requiredFields = [
      "fullName",
      "saleProduct",
      "hasShop",
      "hasGSTNumber",
      "phoneNumber",
      "productDetails",
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
      const payload = {
        shopSellerName: formData.fullName,
        doYouHaveGST: formData.hasGSTNumber === "yes" ? true : false,
        doYouHaveShop: formData.hasShop === "yes" ? true : false,
        GST: formData.GSTNumber,
        shopName: formData.shopName,
        productDetails: formData.productDetails,
        mobileNumber: formData.phoneNumber,
        whichProductYouHaveToSell: formData.saleProduct,
      };
      console.log("payload",payload)
      try {
        // Make a POST request to your backend API endpoint
        const response = await axios.post(
          `${Base_Url}/client/enquiry`,
          payload
        );

        if (response.data.status === 200 || response.data.success === true) {
          Swal.fire({
            title: "Submitted",
            text: "Tekisky Mart team will contact you soon!",
            icon: "success",
          });
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        console.error("Error creating user:", error.message);

        Swal.fire({
          title: "Oops!",
          text: `${error.message}`,
          icon: "error",
        });
      }
    }
  };


  return (
    <div>
      <ToastContainer />
      <div style={{ width: "80%", margin: " 20px auto" }}>
        <Row className="Row">
          <Col xs={12}>
            <h1 style={{ textAlign: "center" }}>Sell With Us</h1>
            <h3>Terms & Conditions</h3>
            <ol>
              <li>1. Authentic and reliable genuine products</li>
              <li>2. No illegal materials</li>
              <li>3. All government norms should be followed</li>
              <li>
                4. 1000₹ subscription for 6 Months with a maximum of 10 product
                sales
              </li>
              <li>5. Deals only for premium customers</li>
            </ol>
          </Col>
        </Row>
        <form action="">
          <>
            <div>
              <Row className="Row">
                <Col xs={12} md={4} xl={4}>
                  <div className="Formlabel">
                    Name
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
                    Mobile Number
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
                    Which product do you want to sell
                    <span className="error-message">⁕</span>{" "}
                  </div>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  {/* <select
                    className="MyInput"
                    name="saleProduct"
                    value={formData.saleProduct}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Product</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                    <option value="option5">Option 5</option>
                  </select> */}

                  <input
                    type="text"
                    className="MyInput"
                    placeholder="Enter Product Name"
                    name="saleProduct"
                    value={formData.saleProduct}
                    onChange={handleInputChange}
                  />
                </Col>

                <Col xs={12} md={4} xl={4}>
                  {" "}
                  <div className="Formlabel">
                    Product Details
                    <span className="error-message">⁕</span>{" "}
                  </div>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <textarea
                    style={{ height: "auto" }}
                    type="textarea"
                    rows="4"
                    className="MyInput"
                    placeholder="Enter product details"
                    name="productDetails"
                    value={formData.productDetails}
                    onChange={handleInputChange}
                  />
                </Col>

                <Col xs={12} md={4} xl={4}>
                  {" "}
                  <div className="Formlabel">
                    Do You have shop ?
                    {/* <span className="error-message">⁕</span>{" "} */}
                  </div>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      width: "50%",
                      marginBottom:"15px"
                    }}
                  >
                    <label>Yes</label>
                    <input
                      style={{ width: "auto" }}
                      type="radio"
                      name="hasShop"
                      value="yes"
                      checked={formData.hasShop === "yes"}
                      onChange={handleInputChange}
                    />
                    <label> No</label>
                    <input
                      style={{ width: "auto" }}
                      type="radio"
                      name="hasShop"
                      value="no"
                      checked={formData.hasShop === "no"}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formData.hasShop === "yes" && (
                    <input
                      type="text"
                      className="MyInput"
                      placeholder="Shop Name"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                    />
                  )}
                </Col>

                <Col xs={12} md={4} xl={4}>
                  {" "}
                  <div className="Formlabel">
                    Do You have G.S.T. Number ?
                    {/* <span className="error-message">⁕</span>{" "} */}
                  </div>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      width: "50%",
                      marginBottom:"15px"
                    }}
                  >
                    <label>Yes</label>
                    <input
                      style={{ width: "auto" }}
                      type="radio"
                      name="hasGSTNumber"
                      value="yes"
                      checked={formData.hasGSTNumber === "yes"}
                      onChange={handleInputChange}
                    />
                    <label> No</label>
                    <input
                      style={{ width: "auto" }}
                      type="radio"
                      name="hasGSTNumber"
                      value="no"
                      checked={formData.hasGSTNumber === "no"}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formData.hasGSTNumber === "yes" && (
                    <input
                      type="text"
                      className="MyInput"
                      placeholder="GST Number"
                      name="GSTNumber"
                      value={formData.GSTNumber}
                      onChange={handleInputChange}
                    />
                  )}
                </Col>

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
                    <button className="NextBtn" onClick={handleSaleWithUs}>
                      Submit Enquiry
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        </form>
      </div>
    </div>
  );
};

export default SaleWithUs;
