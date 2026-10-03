// Install axios if not already installed: npm install axios
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../Assets/Styles/Login.css";
import "../Assets/Styles/AddProductForm.css";
import { Context } from "../common/Context";
import logo from "../Assets/Images/TekiskyMartNewLogo-removebg-preview.png";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { Base_Url, loginAPI } from "../common/Apis";

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { Swal } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!mobileNumber || !password) {
        // toast.error('Mobile number and password are required');
        Swal.fire({
          title: "Oops!",
          text: "Please enter a mobile number and password",
          icon: "error",
        });
        return;
      }
      // Check if mobile number is exactly 10 digits
      if (mobileNumber.length !== 10) {
        Swal.fire({
          title: "Oops!",
          text: "Mobile number must be 10 digits long",
          icon: "error",
        });
        return;
      }

      const response = await axios.post(
        `${Base_Url}${loginAPI}`,
        {
          mobileNumber,
          password,
        }
      );

      if (response?.status !== 200) {
        Swal.fire({
          title: "Oops!",
          text: "Mobile number and password are required",
          icon: "error",
        });
        return;
      }

      // Check the response for successful login
      if (response?.status === 200 || response?.data?.success) {
        // toast.success(response.data.message)
        Swal.fire({
          title: "Congratulation!",
          text: "Login Successful",
          icon: "success",
        });
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("mobileNumber", response.data.user.mobileNumber);
        localStorage.setItem("token", response.data.token);

        navigate("/welcome");
      } else {
        Swal.fire({
          title: "Oops!",
          text: "Invalid mobile number or password",
          icon: "error",
        });
        setLoading(false); 
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: "Oops!",
        text: "Invalid mobile number or password",
        icon: "error",
      });
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
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
      <div className="login-center">
        <div className="login-page-container" id="container">
          <div className="form-container sign-in">
            <form>
              <Link to="/">
                <img src={logo} alt="Tekisky Mart LOGO" />
              </Link>
              <h1>Sign In</h1>
              <div className="social-icons"></div>

              {/* <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" /> */}
              <label htmlFor="mobileNumber" className="lable">
                Mobile Number:
              </label>
              <input
                className="input"
                type="text"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => {
                  // Restrict input to numbers only
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                  // Limit input length to 10 characters
                  const truncatedInput = onlyNumbers.slice(0, 10);
                  setMobileNumber(truncatedInput);
                }}
                pattern="[0-9]*" // Only accept numeric characters
                maxLength={10} // Limit input length to 10 characters
              />
              <label className="lable" htmlFor="password">
        Password:
      </label>
      <div className="password-input-container">
        <input
          className="input"
          type={showPassword ? "text" : "password"} // Toggle between text and password type
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Show eye icons based on password visibility */}
        <div className="password-icon" onClick={togglePasswordVisibility}>
          {showPassword ? <GoEyeClosed /> : <GoEye />}
        </div>
        </div>

              <button type="button" onClick={handleLogin}>
                Sign In
              </button>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-right">
                <h1>Welcome To Tekisky Mart!</h1>
                {/* <p>Enter your personal details to use all of site features</p> */}
                <p>Admin / Seller Dashboard</p>
                {/* No need for the button with ID "login" in React */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
