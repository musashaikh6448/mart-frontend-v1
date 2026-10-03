import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { Base_Url, saveOrderProductAPI } from "../common/Apis";
import { Context } from "../common/Context";
import parsePhoneNumberFromString from "libphonenumber-js";
import "../Assets/Styles/PaymentSteps.css";
import { IoIosPhonePortrait } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";

const PaymentStep = () => {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const {
    cartItems,
    cartSubTotal,
    ToastContainer,
    toast,
    singleItems,
    setCartItems,
    setSingleItems,
    totalSavedAmount,
    cartGrandTotal,
    cardDeliveryCharge,
    setCustomerDetail,
    customerDetail,
    swal,
    Swal
  } = useContext(Context);

  const [showPopup, setShowPopup] = useState(false);
  const [responseData, setResponseData] = useState([]);

  console.log("responseData", responseData?.order?.orderId);
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   fullName: "",
  //   phoneNumber: "",
  //   AlternateNumber: "",
  //   email: "",
  //   houseNo: "",
  //   area: "",
  //   landMark: "",
  //   pincode: "",
  //   // addressType: "",
  //   additionalAdd: "",
  // });
  const [formData, setFormData] = useState(customerDetail);
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    AlternateNumber: "",
    email: "",
    houseNo: "",
    area: "",
    landMark: "",
    pincode: "",
    addressType: "",
    additionalAdd: "",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        customerName: formData.fullName,
        mobileNumber: formData.phoneNumber,
        alternateNumber: formData.AlternateNumber,
        landmark: formData.landMark,
        pincode: formData.pincode,
        address: formData.additionalAdd,
        products: [],
        totalAmount: cartGrandTotal,
      };

      const selectedProducts = [];

      if (formData.phoneNumber.length !== 10) {
        throw new Error("Please enter a valid 10-digit WhatsApp number");
      }
  

      cartItems.forEach((product, index) => {
        selectedProducts.push({
          product: product._id,
          quantity: product?.quantity[0] || product?.quantity,
        });
      });

      payload.products = selectedProducts;

      const response = await axios.post(
        `
    ${Base_Url}${saveOrderProductAPI}`,
        payload
      );
      const data = response?.data;
      setResponseData(data);
      if (data.success || response.status === 201) {

        const orderId = data?.order?.orderId;

        Swal.fire({
          title: "Order Successful",
          html: `Your order Id: <b>${orderId}</b><br/> Your order has been placed successfully<br/> Our Team will contact you shortly.`,
          icon: "success",
          confirmButtonText: "Okay",
        }).then(() => {
   
            navigate("/");
        
            setCartItems([])
        });

      } else {

        console.error("Error fetching data:", data.error);

      }
    } catch (error) {

      console.error("Network error:", error);
      Swal.fire({
        title: "Network Error",
        text: "There was a network error. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
        onClose: () => {
          setCartItems([]);
        },
      });
    } finally {
      setLoading(false); 
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "phoneNumber" || name === "AlternateNumber") {
      const numericValue = value.replace(/[^0-9-]/g, "");
      const maxLength = 10;
      const truncatedValue = numericValue.slice(0, maxLength);
      const intValue = parseInt(truncatedValue, 10);
      const isValidNumber = !isNaN(intValue) && intValue >= 0;
      setFormData((prevData) => ({
        ...prevData,
        [name]: isValidNumber ? truncatedValue : "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: isValidNumber ? "" : "Please enter a valid 10-digit number",
      }));
    } else if (
      name === "aadharNumber" ||
      name === "pincode" ||
      name === "rationCardNo"
    ) {
      const numericValue = value.replace(/[^0-9]/g, "");
      const maxLength =
        name === "aadharNumber" ? 12 : name === "pincode" ? 6 : 16;
      const truncatedValue = numericValue.slice(0, maxLength);
      setFormData((prevData) => ({ ...prevData, [name]: truncatedValue }));
    } else if (name === "age") {
      const ageValue = parseInt(value, 10);
      const isValidAge = !isNaN(ageValue) && ageValue >= 1 && ageValue <= 120;

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: isValidAge ? "" : "Age must be between 1 and 120",
      }));
      setFormData((prevData) => ({
        ...prevData,
        [name]: isValidAge ? ageValue : "",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setCustomerDetail((prevCustomerDetail) => ({
      ...prevCustomerDetail,
      [name]: value,
    }));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber, "IN");
    return parsedNumber && parsedNumber.isValid();
  };

  const handleNext = (e) => {
    e.preventDefault();
    const { phoneNumber } = formData;

    
    if (!phoneNumber || phoneNumber.length !== 10) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid 10-digit WhatsApp number",
        icon: "error",
      });
      return;
    }

    if (phoneNumber) {
      swal({
        title: "Are you sure?",
        text: `This mobile number ${phoneNumber} is correct?`,
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: "No",
          confirm: "Yes",
        },
      }).then((result) => {
        if (result) {
          // User clicked on confirm button
          var requiredFields = [
            "phoneNumber",
            "fullName",
            "landMark",
            "pincode",
            "additionalAdd",
          ];

          let hasError = false;

          requiredFields.forEach((field) => {
            if (!formData[field]) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: " ",
              }));
              hasError = true;
            }
          });

          if (hasError) {
            Swal.fire({
              title: "Warning!",
              text: "All mandatory fields are required",
              icon: "error"
            });
          } else {
            // Call your openModal function only if there are no errors
            openModal();
          }
        } else {
          // User clicked on cancel button or closed the modal
          // You can add any additional actions or leave it empty
        }
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Mobile number is required",
        icon: "error"
      });
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

      <h2 className="first-container-heading payment-heading">Payment Step</h2>

      <div className="stepContiner">
        <ToastContainer />
        <div style={{ width: "80%", margin: " 30px auto" }}>
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
                      Enter Your WhatsApp Number
                      <FaWhatsapp
                        style={{ fontSize: "30px", color: "green" }}
                      />
                      <span className="error-message">⁕</span>{" "}
                    </div>
                  </Col>

                  <Col xs={12} md={6} xl={6}>
                    <input
                      type="number"
                      className="MyInput"
                      placeholder="Enter Your WhatsApp Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col xs={12} md={4} xl={4}>
                    {" "}
                    <div className="Formlabel">
                      Phone Number
                      <IoIosPhonePortrait
                        style={{ fontSize: "30px", color: "#004AAD" }}
                      />
                      {/* <span className="error-message">⁕</span>{" "} */}
                    </div>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <input
                      type="number"
                      className="MyInput"
                      placeholder="Enter Phone Number"
                      name="AlternateNumber"
                      value={formData.AlternateNumber}
                      onChange={handleInputChange}
                    />
                  </Col>

                  <Col xs={12} md={4} xl={4}>
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
                      Landmark 
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
                  </Col>

                  <Col xs={12} md={6} xl={6}></Col>
                  <Col xs={12} md={12} xl={12}>
                    {" "}
                    <div
                      style={{
                        float: "right",
                        margin: "10px",
                        display: "flex",
                        width:"100%",
                        justifyContent:"center"
                      }}
                    >
                      <button
                        className="NextBtn"
                        onClick={() => {
                          cartSubTotal === 0 ||
                          isNaN(cartSubTotal) ||
                          cartItems.length <= 0
                            ? navigate("/")
                            : navigate("/shopping-cart");
                        }}
                      >
                        Previous
                      </button>
                      <button className="NextBtn" onClick={handleNext}>
                        Next
                      </button>
                    </div>
                  </Col>
                </Row>
              </div>
            </>
          </form>
        </div>
      </div>
      <div className="modalDiv">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Order Preview"
          // className={"payment-model"}
        >
          <div>
            <div style={{ width: "80%", margin: "20px auto" }}></div>
            <div className="cx-car">
              <Row>
                <Col xs={12} md={12} xl={12}>
                  <div className="cx-heading">
                    <h3>Shipping Cart</h3>
                  </div>
                </Col>
                <Col xs={12} md={8} xl={8}>
                  <div className="customerDetail">
                    <div>
                      <span style={{ fontWeight: "bold" }}>Name</span>
                      <span>{formData.fullName}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        WhatsApp Number
                      </span>
                      <span>{formData.phoneNumber}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>Phone Number</span>
                      <span>{formData.AlternateNumber}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>Landmark</span>
                      <span>{formData.landMark}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>Pin Code</span>
                      <span>{formData.pincode}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "bold" }}>
                        Address Details
                      </span>
                      <span>{formData.additionalAdd}</span>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={4} xl={4}>
                  <div className="item-total totalCart">
                    <h4 style={{ marginBottom: "1rem" }}>Cart Total</h4>
                    <div>
                      <h5 className="totalDiv">
                        <span>Subtotal</span>
                        <span>{cartSubTotal} &#8377;</span>
                      </h5>
                      <h5 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                        Shipping
                      </h5>
                      <h6 >
                        <b style={{color:"#004AAD"}}>Delivery charge 30 rupees below 500₹ </b><br/>
                        <b style={{color:"#004AAD"}}>Free delivery for order above 500₹ </b>
                        {/* delivery charge 20 rs */}
                      </h6>
                       <h6 style={{ color: "green", marginBottom: "1rem" , fontSize:"18px",fontWeight:"800"} }  className="totalDiv">
                        <span>saved Amount : </span>
                        <span> {totalSavedAmount}&#8377; </span>
                      </h6>
                     
                      <h6
                        style={{ fontWeight: "600", marginBottom: "1rem" }}
                        className="totalDiv"
                      >
                        <span>Delivery Charge :</span>
                        <span>{cardDeliveryCharge} &#8377;</span>
                      </h6>
                      <h5
                        style={{ fontWeight: "600", marginBottom: "1rem" ,borderTop:"1px solid gray",borderBottom:"1px solid gray",padding:"10px 0px" }}
                        className="totalDiv"
                      >
                        <span>Order Total :</span>
                        <span>{cartGrandTotal} &#8377;</span>
                      </h5>
                      <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                        Pay on Delivery
                      </h6>
                      <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                        As of now we deliver only in Nanded and near by areas
                      </h6>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div
              style={{ textAlign: "center", margin: "20px", display: "flex" }}
            >
              <button onClick={closeModal} className="NextBtn">
                Back
              </button>
              <button onClick={handleSubmit} className="NextBtn">
                Submit
              </button>
            </div>
          </div>
        </Modal>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="card">
                <div className="circle-container">
                  <i className="checkmark">✓</i>
                </div>
                <h1 className="title">Order Successfull</h1>
                <h5>Your order Id : {responseData?.order?.orderId}</h5>
                <p className="message">Your order has been placed successfully<br/> Our Team will contact you shortly.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
