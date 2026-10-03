import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../Assets/Styles/AddProductForm.css";
import { MdCancel } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Button as BootstrapButton } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { HiOutlineClock } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";
import * as XLSX from "xlsx";
import { Base_Url } from "../common/Apis";
import { matchesProductSearch } from "./productListUtils";

Modal.setAppElement("#root"); 

const ProductList = () => {
  const [loading, setLoading] = useState(true);
  console.log(loading);

  const userRole = localStorage.getItem("userRole");

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // New state for search input
  const [filterByApproved, setFilterByApproved] = useState("");
  const [filterByDealOfDay, setFilterByDealOfDay] = useState("");
  const [fileInputVisible, setFileInputVisible] = useState(false);

  const mobileNumber = localStorage.getItem("mobileNumber");

  const [updatedProduct, setUpdatedProduct] = useState({
    productBrand: "",
    availableStockQty: 0,
    mrp: 0,
    tekiskyPrice: "",
    offerPrice: 0,
    packetweight: 0,
    unitOfMeasure: "",
    description: "",
    createdBy: "",
    productName: "",
    productType: "",
    productCategory: "",
    manufactureDate: "",
    expiryDate: "",
    sellerInformation: "",
    dealOfDay: false, 
    approved: false, 
    imageURL: [], 
    size: "",
    color: "",
    material: "",
  });

  useEffect(() => {
    if (!showModal) {
      setEditing(false); 
    }
  }, [showModal]);

  const handleTokenError = () => {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = {};
        const token = localStorage.getItem("token");
        if (userRole === "superadmin") {
          response = await axios.get(
            `${Base_Url}/product/getproduct`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
        } else {
          response = await axios.get(
            `${Base_Url}/product/mobile/${mobileNumber}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
        }
        console.log("response", response);
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
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

    fetchData();
  }, []);

  const handleMoreInfo = (product) => {
    setSelectedProduct(product);

    setShowModal(true);
  };

  useEffect(() => {
    if (selectedProduct) {
      setUpdatedProduct({
        productBrand: selectedProduct.productBrand,
        availableStockQty: selectedProduct.availableStockQty,
        tekiskyPrice: selectedProduct.tekiskyPrice,
        mrp: selectedProduct.mrp,
        offerPrice: selectedProduct.offerPrice,
        packetweight: selectedProduct.packetweight,
        unitOfMeasure: selectedProduct.unitOfMeasure,
        size: selectedProduct.size,
        color: selectedProduct.color,
        material: selectedProduct.material,
        description: selectedProduct.description,
        createdBy: selectedProduct.createdBy,
        productName: selectedProduct.productName,
        productType: selectedProduct.productType,
        productCategory: selectedProduct.productCategory,
        manufactureDate: selectedProduct.manufactureDate,
        expiryDate: selectedProduct.expiryDate,
        sellerInformation: selectedProduct.sellerInformation,
        dealOfDay: selectedProduct.dealOfDay,
        approved: selectedProduct.approved,
        imageURL: selectedProduct.imageURL,
      });
    }
  }, [selectedProduct]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setUpdatedProduct({
      ...updatedProduct,
      imageURL: [...updatedProduct.imageURL, ...imageUrls],
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    const filteredImages = updatedProduct.imageURL.filter(
      (url, index) => index !== indexToRemove
    );
    setUpdatedProduct({ ...updatedProduct, imageURL: filteredImages });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setFileInputVisible(true);
      // Validate fields before submitting
      const requiredFields = [
        // "productType",
        // "productCategory",
        "tekiskyPrice",
        "productBrand",
        "availableStockQty",
        "mrp",
        "offerPrice",
        // "packetweight",
        // "unitOfMeasure",
        "description",
        // "createdBy",
        "productName",
        "manufactureDate",
        "expiryDate",
        "sellerInformation",
        "imageURL",
      ];

      // Check if any required field is empty
      // if (requiredFields.some((field) => !updatedProduct[field])) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Validation Error",
      //     text: "Please fill in all required fields.",
      //   });
      //   return;
      // }

      // Send a request to update the product by ID
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${Base_Url}/product/update/${selectedProduct?._id}`,
          updatedProduct,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        // Handle success
      } catch (error) {
        console.error("Error updating product:", error);
        // Handle error
      }

      // Display SweetAlert on successful update
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${selectedProduct?.productName} has been updated successfully.`,
      });

      // Close the modal and refresh the product list
      setShowModal(false);

      setProducts(
        products.map((product) =>
          product._id === selectedProduct?._id
            ? { ...product, ...updatedProduct }
            : product
        )
      );

      // Set isEditing to false after successful update
      setEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
      // toast.error("Failed to update the product");
    } finally {
      setLoading(false); // Set loading to false after the update process, whether successful or not
    }
  };

  const handleDelete = async () => {
    try {
      // Display SweetAlert confirmation dialog
      const result = await Swal.fire({
        title: `Are you sure you want to delete ${selectedProduct?.productName}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      // Check if the user confirmed deletion
      if (result.isConfirmed) {
        // Send a request to delete the product by ID
        try {
          const token = localStorage.getItem("token");
          await axios.get(
            `${Base_Url}/product/delete/${selectedProduct?._id}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          // Handle success
        } catch (error) {
          console.error("Error deleting product:", error);
          // Handle error
        }

        // Display a success toast

        // Close the modal and refresh the product list
        setShowModal(false);
        setProducts(
          products.filter((product) => product._id !== selectedProduct?._id)
        );

        // Display SweetAlert to indicate successful deletion
        Swal.fire({
          title: "Product Deleted!",
          text: `${selectedProduct?.productName} has been deleted successfully.`,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      // Display an error toast if the deletion fails
      // toast.error("Failed to delete the product");
    }
  };

  const filteredProducts = products.filter((product) =>
    matchesProductSearch(product, searchInput, filterByApproved, filterByDealOfDay)
  );

  const exportToExcel = () => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Filter out the 'productId', '_id', and 'imageURL' fields from the products data
      const filteredProducts = products.map(
        ({ productId, _id, imageURL, header, ...rest }) => rest
      );

      // Convert the filtered products data to a worksheet
      const ws = XLSX.utils.json_to_sheet(filteredProducts);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      // Save the workbook as an Excel file
      XLSX.writeFile(wb, "products.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      // Handle any errors during export
    }
  };

  return (
    <div className="table-responsive container mt-4">
      <div>
        <BootstrapButton
          variant="primary"
          onClick={() => navigate("/add-Product")}
          style={{ marginRight: "10px" }}
        >
          Add product
        </BootstrapButton>

        <BootstrapButton
          variant="primary"
          onClick={exportToExcel}
          style={{ marginRight: "10px" }}
        >
          Export Products
        </BootstrapButton>
      </div>
      <div className="product-sub-headings">
        <div className="custom-search-bar">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by Product Name or Product Category"
          />
          <div className="search-icon">
            <CiSearch />
          </div>
        </div>

        <div className="custom-filter-container">
          <div className="custom-filter">
            <label htmlFor="approved">Approved Products:</label>
            <select
              id="approved"
              value={filterByApproved}
              onChange={(e) => setFilterByApproved(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="custom-filter">
            <label htmlFor="dealOfDay">Deals of the Day:</label>
            <select
              id="dealOfDay"
              value={filterByDealOfDay}
              onChange={(e) => setFilterByDealOfDay(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Product ID</th>
            <th>Product Category</th>
            <th>Product Name</th>
            <th>Product Type</th>
            <th>Avalable Stock quantity</th>
            <th>Offer Price </th>
            <th>Tekisky Price</th>
            <th>Approved</th>
            <th>Deal's Of The Day</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.reverse().map((product) => (
            <tr key={product._id}>
              {/* <td>{product._id}</td> */}
              <td> {product.productId}</td>
              <td>{product.productCategory}</td>
              <td>{product.productName}</td>
              <td>{product.productType}</td>
              <td
                style={{
                  color: product.availableStockQty <= 10 ? "red" : "black",
                }}
              >
                {product.availableStockQty}
              </td>
              <td>{product.offerPrice}</td>
              <td>{product.tekiskyPrice}</td>

              <td className="approved-or-not">
                {product.approved ? (
                  <FaCheckCircle className="approved-icon" />
                ) : (
                  <HiOutlineClock className="pending-icon" />
                )}
              </td>
              <td className="approved-or-not">
                {product.dealOfDay ? (
                  <FaCheckCircle className="approved-icon" />
                ) : (
                  <HiOutlineClock className="pending-icon" />
                )}
              </td>

              <td width={"110px"}>
                <BootstrapButton
                  className="more-info-btn"
                  onClick={() => handleMoreInfo(product)}
                >
                  More Info
                </BootstrapButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "80%", // Adjust the width as needed
            maxWidth: "800px", // Adjust the max-width as needed
            margin: "auto",
          },
        }}
      >
        <div className="table-data-inputs">
          <h4>Product Name : {selectedProduct?.productName}</h4>
          <table className="table table-striped  table-bordered">
            <tbody>
              {userRole === "superadmin" ? (
                <>
                  <tr>
                    <th>Product Name </th>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={updatedProduct.productName}
                          onChange={(e) =>
                            setUpdatedProduct({
                              ...updatedProduct,
                              productName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        // selectedProduct?.productName
                        selectedProduct?.productName
                      )}
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <th>Product Name </th>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={updatedProduct.productName}
                          onChange={(e) =>
                            setUpdatedProduct({
                              ...updatedProduct,
                              productName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedProduct?.productName
                      )}
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <th>Product Type</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedProduct.productType}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          productType: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.productType
                  )}
                </td>
              </tr>

              <tr>
                <th>Category</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedProduct.productCategory}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          productCategory: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.productCategory
                  )}
                </td>
              </tr>
              {userRole === "superadmin" ? (
                <tr>
                  <th>Brand</th>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={updatedProduct.productBrand}
                        onChange={(e) =>
                          setUpdatedProduct({
                            ...updatedProduct,
                            productBrand: e.target.value,
                          })
                        }
                      />
                    ) : (
                      selectedProduct?.productBrand
                    )}
                  </td>
                </tr>
              ) : (
                <tr>
                  <th>Brand</th>
                  <td>{selectedProduct?.productBrand}</td>
                </tr>
              )}

              <tr>
                <th>Stock Quantity</th>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={updatedProduct.availableStockQty}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          availableStockQty: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.availableStockQty
                  )}
                </td>
              </tr>
              <tr>
                <th>MRP</th>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={updatedProduct.mrp}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          mrp: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.mrp
                  )}
                </td>
              </tr>
              <tr>
                <th>Offer Price</th>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={updatedProduct.offerPrice}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          offerPrice: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.offerPrice
                  )}
                </td>
              </tr>
              <tr>
                <th>Tekisky Price</th>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={updatedProduct.tekiskyPrice}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          tekiskyPrice: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.tekiskyPrice
                  )}
                </td>
              </tr>
              {selectedProduct?.productCategory !== "CLOTHES" && isEditing ? (
                <tr>
                  <th>Weight / Size</th>
                  <td>
                    <input
                      type="number"
                      value={updatedProduct.packetweight}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          packetweight: e.target.value,
                        })
                      }
                    />
                    <select
                      value={updatedProduct.unitOfMeasure}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          unitOfMeasure: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Unit</option>
                      <option value="gram">Gram (g)</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="ml">Milliliter (ml)</option>
                      <option value="l">Liter (l)</option>
                      <option value="s">S (36)</option>
                      <option value="m">M (38)</option>
                      <option value="L">L (40)</option>
                      <option value="xl">XL (42)</option>
                      <option value="xxl">XXL (44)</option>
                      <option value="Inch">Inch</option>
                      <option value="cm">cm</option>
                      <option value="Each">Each</option>
                      <option value="Piece">Piece</option>
                      <option value="Nos">Nos</option>
                    </select>
                  </td>
                </tr>
              ) : null}

              {selectedProduct?.color && ( // Check if color exists in the product
                <tr>
                  <th>Color</th>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={updatedProduct.color}
                        onChange={(e) =>
                          setUpdatedProduct({
                            ...updatedProduct,
                            color: e.target.value,
                          })
                        }
                      />
                    ) : (
                      selectedProduct.color
                    )}
                  </td>
                </tr>
              )}

              {selectedProduct?.material && ( // Check if material exists in the product
                <tr>
                  <th>Material</th>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={updatedProduct.material}
                        onChange={(e) =>
                          setUpdatedProduct({
                            ...updatedProduct,
                            material: e.target.value,
                          })
                        }
                      />
                    ) : (
                      selectedProduct.material
                    )}
                  </td>
                </tr>
              )}

              {selectedProduct?.size && ( // Check if size exists in the product
                <tr>
                  <th>Size</th>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={updatedProduct.size}
                        onChange={(e) =>
                          setUpdatedProduct({
                            ...updatedProduct,
                            size: e.target.value,
                          })
                        }
                      />
                    ) : (
                      selectedProduct.size
                    )}
                  </td>
                </tr>
              )}

              <tr>
                <th>Description</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedProduct.description}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.description
                  )}
                </td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>
                  <b>
                    {" "}
                    {new Date(selectedProduct?.createdAt).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </b>
                </td>
              </tr>

              <tr>
                <th>Header</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedProduct.header}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          header: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.header
                  )}
                </td>
              </tr>
              {/* <tr>
                <th>Created By</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedProduct.createdBy}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          createdBy: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.createdBy
                  )}
                </td>
              </tr> */}
              {[
                "DATES",
                "HOMEMADE SNACKS",
                "KIRANA DUKAAN",
                "COSMETIC",
              ].includes(selectedProduct?.productCategory) && (
                <>
                  <tr>
                    <th>Manufacture Date</th>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={updatedProduct.manufactureDate}
                          onChange={(e) =>
                            setUpdatedProduct({
                              ...updatedProduct,
                              manufactureDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedProduct?.manufactureDate
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Expiry Date</th>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={updatedProduct.expiryDate}
                          onChange={(e) =>
                            setUpdatedProduct({
                              ...updatedProduct,
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        selectedProduct?.expiryDate
                      )}
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <th>Seller Information</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedProduct.sellerInformation}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          sellerInformation: e.target.value,
                        })
                      }
                    />
                  ) : (
                    selectedProduct?.sellerInformation
                  )}
                </td>
              </tr>
              {userRole === "superadmin" && (
                <>
                  <tr>
                    <th>Deal of the Day</th>
                    <td>
                      {isEditing ? (
                        <select
                          value={updatedProduct.dealOfDay}
                          onChange={(e) =>
                            setUpdatedProduct({
                              ...updatedProduct,
                              dealOfDay: e.target.value === "true",
                            })
                          }
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : selectedProduct?.dealOfDay ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Approved</th>
                    <td>
                      {isEditing ? (
                        <select
                          value={updatedProduct.approved}
                          onChange={(e) =>
                            setUpdatedProduct({
                              ...updatedProduct,
                              approved: e.target.value === "true",
                            })
                          }
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : selectedProduct?.approved ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <th>Images</th>
                <td>
                  <div className="image-container">
                    {updatedProduct.imageURL.map((url, index) => (
                      <div key={index} className="image-wrapper">
                        {isEditing && (
                          <button className="cancel-img-btn" onClick={() => handleRemoveImage(index)}>
                            <MdCancel />
                          </button>
                        )}
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="modal-image"
                        />
                      </div>
                    ))}
                    {isEditing && (
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                      />
                    )}
                  </div>
                </td>
              </tr>

              <th>Actions</th>
              <th>
                <div className="option-buttons menu-buttons">
                  {isEditing ? (
                    <button
                      className="btn btn-success product-list-btn"
                      onClick={() => {
                        handleUpdate();
                        // alert("Are You Sure You Want To Save Changes");
                      }}
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning  product-list-btn"
                      onClick={() => {
                        setEditing(true);
                        setUpdatedProduct({ ...selectedProduct });
                      }}
                    >
                      Update Product
                    </button>
                  )}
                  <button
                    className="btn btn-danger   product-list-btn"
                    onClick={() => handleDelete()}
                  >
                    Delete Product
                  </button>
                </div>
              </th>
            </tbody>
          </table>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
