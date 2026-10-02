import React, { useState, useEffect } from "react";
import axios from "axios";
import { Base_Url, allCustomersAPI } from "../common/Apis";
import Swal from "sweetalert2";
import "../Assets/Styles/AddProductForm.css";
import { Button as BootstrapButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

const Customers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem("token");

    // Fetch data from the API with token in headers
    axios
      .get(`${Base_Url}${allCustomersAPI}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setData(response.data.customeDetails); // Access customeDetails array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleEdit = (index) => {
    // Set editing state for the specific row
    setData((prevData) => {
      const newData = [...prevData];
      newData[index].editing = true;
      return newData;
    });
  };

  const handleDelete = (id) => {
    setLoading(true);
    // Display confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this contact!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with deletion
        const token = localStorage.getItem("token");
        axios
          .delete(`${Base_Url}/customer/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((response) => {
            console.log("Data successfully deleted:", response.data);
            // Refresh data after deleting
            fetchData();
            // Display success message
            Swal.fire("Deleted!", "Contact has been deleted.", "success");
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
            setLoading(false);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If cancelled, show cancel message
        Swal.fire("Cancelled", "Your contact is safe :)", "error");
        setLoading(false);
      }
    });
  };

  const handleSave = (index) => {
    setLoading(true);
    // Save edited data to the API
    const editedCustomer = data[index];
    const token = localStorage.getItem("token");
    axios
      .put(
        `${Base_Url}/customer/update/${editedCustomer._id}`,
        editedCustomer,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Data successfully updated:", response.data);
        // Refresh data after saving changes
        fetchData();
        // Display success message
        Swal.fire("Updated!", "Contact has been updated.", "success");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setLoading(false);
      });
  };

  const handleInputChange = (e, index, key) => {
    // Update input value in the state
    const { value } = e.target;
    setData((prevData) => {
      const newData = [...prevData];
      newData[index][key] = value;
      return newData;
    });
  };

  useEffect(() => {
    const filteredResults = data.filter((customer) => {
      const { mobileNumber, category, customerName } = customer;
      return (
        (mobileNumber && mobileNumber.includes(searchQuery)) ||
        (category &&
          category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (customerName &&
          customerName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    setSearchResults(filteredResults);
  }, [searchQuery, data]);

  const renderTable = () => {
    const renderData = searchQuery ? searchResults : data;
    return (
      <>
        <BootstrapButton
          variant="primary"
          onClick={() => navigate("/excel-uploader")}
          style={{ margin: "10px" }}
        >
          Add Contacts
        </BootstrapButton>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Mobile Number</th>
              <th>Category</th>
              <th>Known Field</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {renderData.map((customer, index) => (
              <tr key={index}>
                <td>
                  {customer.editing ? (
                    <input
                      type="text"
                      value={customer.customerName}
                      onChange={(e) =>
                        handleInputChange(e, index, "customerName")
                      }
                      className="form-control"
                    />
                  ) : (
                    customer.customerName
                  )}
                </td>
                <td>
                  {customer.editing ? (
                    <input
                      type="text"
                      value={customer.mobileNumber}
                      onChange={(e) =>
                        handleInputChange(e, index, "mobileNumber")
                      }
                      className="form-control"
                    />
                  ) : (
                    customer.mobileNumber
                  )}
                </td>
                <td>
                  {customer.editing ? (
                    <input
                      type="text"
                      value={customer.category}
                      onChange={(e) => handleInputChange(e, index, "category")}
                      className="form-control"
                    />
                  ) : (
                    customer.category
                  )}
                </td>
                <td>
                  {customer.editing ? (
                    <input
                      type="text"
                      value={customer.knownField}
                      onChange={(e) =>
                        handleInputChange(e, index, "knownField")
                      }
                      className="form-control"
                    />
                  ) : (
                    customer.knownField
                  )}
                </td>
                <td>
                  {customer.editing ? (
                    <button
                      className="btn btn-success"
                      onClick={() => handleSave(index)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDelete(customer._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="container mt-4">
      <h2>All Customer Details</h2>
      <div className="custom-search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=""
          placeholder="Search by mobile number, category, or customer name"
        />
         <div className="search-icon">
            <CiSearch />
          </div>
      </div>
      {loading ? (
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
        </>
      ) : (
        renderTable()
      )}
      {searchQuery && searchResults.length === 0 && <p>No results found.</p>}
    </div>
  );
};

export default Customers;
