import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../Assets/Styles/AddProductForm.css";
import { Base_Url, AddProduct } from "../common/Apis";
import Swal from "sweetalert2";

const AddProductForm = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);
  const [showClothingFields, setShowClothingFields] = useState(false); // Add this line

  const [formData, setFormData] = useState({
    productCategory: "",
    otherCategory: "",
    productName: "",
    productType: "",
    productBrand: "",
    availableStockQty: "",
    mrp: "",
    offerPrice: "",
    tekiskyPrice: "",
    packetweight: "",
    unitOfMeasure: "",
    description: "",
    header: "",
    createdBy: mobileNumber,
    files: [],
    manufactureDate: "",
    expiryDate: "",
    sellerInformation: "",
    dealOfDay: false,
    approved: false,
    size: "",
    color: "",
    material: "",
  });
  // console.log("approved", formData.approved);
  const [filePreviews, setFilePreviews] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);

  const handleFilesChange = useCallback((e) => {
    const { name, files } = e.target;

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));

    setFormData((prevData) => ({
      ...prevData,
      [name]: Array.from(files),
    }));
    setFilePreviews(previews);
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      productCategory: selectedCategory,
    }));

    // Show additional input when "CLOTHES" is selected
    if (selectedCategory === "CLOTHES") {
      setShowClothingFields(true); // Assuming you have a state variable to track whether clothing fields should be displayed
    } else {
      setShowClothingFields(false);
    }

    // Show additional input when "OTHERS" is selected
    setShowOtherCategoryInput(selectedCategory === "OTHERS");
  };

  const handleRemoveFile = useCallback((index) => {
    setFormData((prevData) => {
      const updatedFiles = [...prevData.files];
      updatedFiles.splice(index, 1);

      setFilePreviews((prevPreviews) => {
        const updatedPreviews = [...prevPreviews];
        updatedPreviews.splice(index, 1);
        return updatedPreviews;
      });

      return {
        ...prevData,
        files: updatedFiles,
      };
    });
  }, []);

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "productCategory",
      "productName",
      "productType",
      "productBrand",
      "header",
      "availableStockQty",
      "mrp",
      "offerPrice",
    ];
  
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required`;
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields.",
      });
      return; // Exit the function early if validation fails
    }
  
    // Check if at least 3 images are selected
    if (formData.files.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least 3 images,(min-3 max-5).",
      });
      return; // Exit the function early if validation fails
    }
  
    if (formData.header.length > 80) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        header: "Header must be 80 characters or less",
      }));
      return;
    }
    setLoading(true);
  
    const token = localStorage.getItem("token");
  
    const apiUrl = `${Base_Url}${AddProduct}`;
  
    const formDataToSend = new FormData();
  
    for (const key in formData) {
      if (key === "files") {
        formData[key].forEach((file) => {
          formDataToSend.append("files", file);
        });
      } else if (key === "unitOfMeasure" || key === "otherCategory") {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
    // formDataToSend.append("approved", formData.approved);
    try {
      await axios.post(apiUrl, formDataToSend, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("Data successfully posted");
      // Display sweet alert on successful addition
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your Product Is Added Successfully",
      });
      navigate("/products-list");
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="addProductForm">
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
      <form onSubmit={handleSubmit} className="addProductForm">
        <label className="formLabel">
          Product Category:
          <select
            value={formData.productCategory}
            onChange={handleCategoryChange}
            className={`formInput ${errors.productCategory ? "error" : ""}`}
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
          {errors.productCategory && (
            <span className="errorMessage">{errors.productCategory}</span>
          )}
        </label>

        {showOtherCategoryInput && (
          <label className="formLabel">
            Other Category:
            <input
              type="text"
              value={formData.otherCategory}
              onChange={(e) =>
                setFormData({ ...formData, otherCategory: e.target.value })
              }
              className="formInput"
            />
          </label>
        )}

        {showClothingFields && (
          <>
            <label className="formLabel">
              Size:
              <input
                type="text"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="formInput"
              />
            </label>

            <label className="formLabel">
              Color:
              <input
                type="text"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="formInput"
              />
            </label>

            <label className="formLabel">
              Material:
              <input
                type="text"
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
                className="formInput"
              />
            </label>
          </>
        )}

        <label className="formLabel">
          Product Name: (It will appeare at the top of card)
          <input
            type="text"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            className={`formInput ${errors.productName ? "error" : ""}`}
          />
          {errors.productName && (
            <span className="errorMessage">{errors.productName}</span>
          )}
        </label>

        <label className="formLabel">
          Product Type:
          <input
            type="text"
            value={formData.productType}
            onChange={(e) =>
              setFormData({ ...formData, productType: e.target.value })
            }
            className={`formInput ${errors.productType ? "error" : ""}`}
          />
          {errors.productType && (
            <span className="errorMessage">{errors.productType}</span>
          )}
        </label>

        <label className="formLabel">
          Product Brand:
          <input
            type="text"
            value={formData.productBrand}
            onChange={(e) =>
              setFormData({ ...formData, productBrand: e.target.value })
            }
            className={`formInput ${errors.productBrand ? "error" : ""}`}
          />
          {errors.productBrand && (
            <span className="errorMessage">{errors.productBrand}</span>
          )}
        </label>
        <label className="formLabel">
          Bold Header: (It will appeare below product name)
          <input
            type="text"
            value={formData.header}
            onChange={(e) =>
              setFormData({ ...formData, header: e.target.value })
            }
            className={`formInput ${errors.header ? "error" : ""}`}
          />
          {errors.header && (
            <span className="errorMessage">{errors.header}</span>
          )}
        </label>

        <label className="formLabel">
          Available Stock Qty:
          <input
            type="number"
            value={formData.availableStockQty}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^\d{0,10}$/.test(value); // Validate if it's a positive number with a maximum of 10 digits

              if (isValid) {
                setFormData({
                  ...formData,
                  availableStockQty: value === "" ? "" : parseInt(value, 10),
                });
              }
            }}
            className={`formInput ${errors.availableStockQty ? "error" : ""}`}
          />
          {errors.availableStockQty && (
            <span className="errorMessage">{errors.availableStockQty}</span>
          )}
        </label>

        <label className="formLabel">
          MRP:
          <input
            type="number"
            value={formData.mrp}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^\d{0,10}$/.test(value); // Validate if it's a positive number with a maximum of 10 digits

              if (isValid) {
                setFormData({
                  ...formData,
                  mrp: value === "" ? "" : parseInt(value, 10),
                });
              }
            }}
            className={`formInput ${errors.mrp ? "error" : ""}`}
          />
          {errors.mrp && <span className="errorMessage">{errors.mrp}</span>}
        </label>

        <label className="formLabel">
          Offer Price:
          <input
            type="number"
            value={formData.offerPrice}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^\d{0,10}$/.test(value); // Validate if it's a positive number with a maximum of 10 digits

              if (isValid) {
                setFormData({
                  ...formData,
                  offerPrice: value === "" ? "" : parseInt(value, 10),
                });
              }
            }}
            className={`formInput ${errors.offerPrice ? "error" : ""}`}
          />
          {errors.offerPrice && (
            <span className="errorMessage">{errors.offerPrice}</span>
          )}
        </label>
        <label className="formLabel">
          Tekisky price: (price at which you selling to tekisky)
          <input
            type="number"
            value={formData.tekiskyPrice}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^\d{0,10}$/.test(value); // Validate if it's a positive number with a maximum of 10 digits

              if (isValid) {
                setFormData({
                  ...formData,
                  tekiskyPrice: value === "" ? "" : parseInt(value, 10),
                });
              }
            }}
            className={`formInput ${errors.tekiskyPrice ? "error" : ""}`}
          />
          {errors.tekiskyPrice && (
            <span className="errorMessage">{errors.tekiskyPrice}</span>
          )}
        </label>

        {formData.productCategory !== "CLOTHES" && (
          <>
            <label className="formLabel">
              Packet Weight:
              <input
                type="number"
                value={formData.packetweight}
                onChange={(e) =>
                  setFormData({ ...formData, packetweight: e.target.value })
                }
                className={`formInput ${errors.packetweight ? "error" : ""}`}
              />
              {/* {errors.packetweight && (
                <span className="errorMessage">{errors.packetweight}</span>
              )} */}
            </label>

            <label className="formLabel">
              Unit of Measure:
              <select
                value={formData.unitOfMeasure}
                onChange={(e) =>
                  setFormData({ ...formData, unitOfMeasure: e.target.value })
                }
                className={`formInput ${errors.unitOfMeasure ? "error" : ""}`}
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
              {/* {errors.unitOfMeasure && (
                <span className="errorMessage">{errors.unitOfMeasure}</span>
              )} */}
            </label>
          </>
        )}

        <label className="formLabel">
          Description:
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`formInput ${errors.description ? "error" : ""}`}
          />
          {errors.description && (
            <span className="errorMessage">{errors.description}</span>
          )}
        </label>

        <div className="upload__box">
          <div className="upload__btn-box">
            <label className="upload__btn">
              <p>Upload images</p>
              <input
                type="file"
                name="files"
                accept="image/*"
                multiple
                data-max_length="5"
                className="upload__inputfile"
                onChange={handleFilesChange}
              />
            </label>
          </div>
          <div className="upload__img-wrap">
            {filePreviews.map((preview, index) => (
              <div key={index} className="upload__img-box">
                <div
                  style={{
                    backgroundImage: `url(${preview})`,
                  }}
                  data-number={index}
                  className="img-bg"
                >
                  <div
                    className="upload__img-close"
                    onClick={() => handleRemoveFile(index)}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {["DATES", "HOMEMADE SNACKS", "KIRANA DUKAAN", "COSMETIC"].includes(
          formData.productCategory
        ) && (
          <>
            <label className="formLabel">
              Manufacture Date:
              <input
                type="date"
                value={formData.manufactureDate}
                onChange={(e) =>
                  setFormData({ ...formData, manufactureDate: e.target.value })
                }
                className={`formInput ${errors.manufactureDate ? "error" : ""}`}
              />
              {errors.manufactureDate && (
                <span className="errorMessage">{errors.manufactureDate}</span>
              )}
            </label>

            <label className="formLabel">
              Expiry Date:
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className={`formInput ${errors.expiryDate ? "error" : ""}`}
              />
              {errors.expiryDate && (
                <span className="errorMessage">{errors.expiryDate}</span>
              )}
            </label>
          </>
        )}

        <label className="formLabel">
          Seller Information:
          <input
            type="text"
            value={formData.sellerInformation}
            onChange={(e) =>
              setFormData({ ...formData, sellerInformation: e.target.value })
            }
            className="formInput"
          />
        </label>

        {userRole == "superadmin" && (
          <>
            <div className="cl-toggle-switch">
              <label className="formLabel">
                Deal of the Day:
                <label className="cl-switch">
                  <input
                    type="checkbox"
                    checked={formData.dealOfDay}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        dealOfDay: !formData.dealOfDay,
                      })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </label>
            </div>
            <div className="cl-toggle-switch">
              <label
                style={{
                  width: "250px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignContent: "center",
                }}
                className="formLabel"
              >
                Approved:
                <label>Yes</label>
                <input
                  style={{ width: "auto" }}
                  type="radio"
                  name="approved"
                  checked={formData.approved === true}
                  onChange={() => setFormData({ ...formData, approved: true })}
                />
                <label>No</label>
                <input
                  style={{ width: "auto" }}
                  type="radio"
                  name="approved"
                  checked={formData.approved === false}
                  onChange={() => setFormData({ ...formData, approved: false })}
                />
              </label>
            </div>
          </>
        )}

        <div style={{ marginBottom: "40px", display: "flex", gap: "20px" }}>
          <button
            className="formButton"
            onClick={() => navigate("/products-list")}
          >
            Cancel
          </button>
          <button type="submit" className="formButton">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
