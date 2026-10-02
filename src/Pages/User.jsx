import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Table, Button, FormControl } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../Assets/Styles/AddProductForm.css";

import {
  AllUserAPI,
  Base_Url,
  deleteUserAPI,
  updateUserAPI,
} from "../common/Apis"; 
import { Context } from "../common/Context";
import { CiSearch } from "react-icons/ci";

const Users = () => {
  const { Swal } = useContext(Context);
  const navigate = useNavigate();
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    role: "",
    shopCategory: "",
  });

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

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
  }, [Swal, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${Base_Url}${AllUserAPI}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setUserData(response?.data?.users?.users);
      } catch (error) {
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

    fetchProducts();
  }, [handleTokenError]);



  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(userData[index]);
  };

  const showChangePasswordAlert = (userId) => {

    Swal.fire({
      title: "Change Password",
      html:
        '<label for="password">New Password:</label>' +
        '<input type="password" id="password" class="swal2-input custom-input" required style="width: 80%;">' +
        '<label for="confirmPassword">Confirm Password:</label>' +
        '<input type="password" id="confirmPassword" class="swal2-input custom-input" required style="width: 80%;">',
      focusConfirm: false,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        const password = Swal.getPopup().querySelector("#password").value;
        const confirmPassword =
          Swal.getPopup().querySelector("#confirmPassword").value;

        if (!password || !confirmPassword) {
          Swal.showValidationMessage("Please fill in both password fields");
          return false;
        }

        // Strong password validation
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(password)) {
          Swal.showValidationMessage(
            "Password must be strong with at least 1 uppercase, 1 lowercase, 1 special character, 1 number, and a minimum length of 8 characters"
          );
          return false;
        }

        if (password !== confirmPassword) {
          Swal.showValidationMessage("Passwords do not match");
          return false;
        }

        const token = localStorage.getItem("token");
        return axios
          .post(`${Base_Url}${updateUserAPI}${userId}`, { password },
            {
              headers: {
                Authorization: ` ${token}`,
              },
            })
          .then(() => {
            return "Password updated successfully!";
          })
          .catch((error) => {
            console.error("Error updating password:", error);
            throw new Error("An error occurred while updating the password");
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const successMessage = result.value;
        Swal.fire(successMessage, "", "success");
      } else if (result.isDismissed) {
        console.log("Modal was dismissed");
      }
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        role: formData.role,
        shopCategory: formData.shopCategory,
      };

      // Make API call to update user
      await axios.post(`${Base_Url}${updateUserAPI}${id}`, payload, {
        headers: {
          Authorization: `${token}`,
        },
      });

      // Update state after successful update
      const updatedData = userData.map((user, index) => {
        if (index === editIndex) {
          return {
            ...user,
            ...payload,
          };
        }
        return user;
      });

      setUserData(updatedData);
      setEditIndex(null);
      setFormData({});
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };



  const handleCancelEdit = () => {
    setEditIndex(null);
    setFormData({});
  };

  //   const handleDelete = (index) => {
  //     const confirmDelete = window.confirm('Are you sure you want to delete this row?');

  //     if (confirmDelete) {
  //       const updatedData = [...userData];
  //       updatedData.splice(index, 1);
  //       setUserData(updatedData);

  //     }
  //   };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "you want to delete this User!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "User deletion has been cancelled.",
          icon: "info",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  };
  const confirmDelete = async (id) => {
    try {
      const updatedData = [...userData];

      // Make API call to delete user
      const token = localStorage.getItem("token");
      await axios.get(`${Base_Url}${deleteUserAPI}${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      updatedData.splice(deleteIndex, 1);
      setUserData(updatedData);
      setDeleteIndex(null);

      // Fetch data again after successful deletion
      const response = await axios.get(`${Base_Url}${AllUserAPI}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setUserData(response?.data?.users?.users);
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = userData.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobileNumber.includes(searchQuery) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div style={{ width: "90%", margin: "auto", overflowX: "auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <button className="formButton" onClick={() => navigate("/create-user")}>
          Create user
        </button>
        <div className="custom-search-bar">
          <input
            type="text"
            placeholder="Search by First Name, Mobile Number, or Role"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginRight: "10px" }}
          />
          <div className="search-icon">
            <CiSearch />
          </div>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Role</th>
            <th>Shop Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userData.map(
            (row, index) =>
              filteredUsers.includes(row) && (
                <tr key={index}>
                  <td>
                    {editIndex === index ? (
                      <FormControl
                        type="text"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    ) : (
                      row.firstName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <FormControl
                        type="text"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    ) : (
                      row.lastName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <FormControl
                        type="text"
                        value={formData.mobileNumber || ""}
                        onChange={(e) =>
                          handleInputChange("mobileNumber", e.target.value)
                        }
                      />
                    ) : (
                      row.mobileNumber
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <FormControl
                        type="text"
                        value={formData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      row.email
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <FormControl
                        type="text"
                        value={formData.role || ""}
                        onChange={(e) =>
                          handleInputChange("role", e.target.value)
                        }
                      />
                    ) : (
                      row.role
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <select
                        name="shopCategory"
                        value={formData.shopCategory}
                        onChange={(e) =>
                          handleInputChange("shopCategory", e.target.value)
                        }
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
                    ) : (
                      row.shopCategory
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleSaveEdit(row?._id)}
                        >
                          <MdFileDownloadDone />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleCancelEdit(row?._id)}
                        >
                          <MdCancel />
                        </Button>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Button
                          variant="primary"
                          onClick={() => handleEdit(index)}
                        >
                          <FaUserEdit />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(row._id)}
                        >
                          <MdDeleteForever />
                        </Button>
                        <Button
                          style={{ color: "#fff" }}
                          variant="info"
                          onClick={() => showChangePasswordAlert(row._id)}
                        >
                          Change Password
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </Table>

      {/* <Modal
        className="changePasswordModal"
        show={showChangePasswordModal}
        onHide={closeChangePasswordModal}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>New Password:</label>
          <FormControl
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeChangePasswordModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleChangePassword}>
            Save
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default Users;
