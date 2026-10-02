import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Base_Url, excelUploadAPI } from "../common/Apis";
import "../Assets/Styles/AddProductForm.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ExcelUploader = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log("File data:", fileData); // Add this console log to check the parsed data
      setData(fileData);
    };
    reader.readAsBinaryString(selectedFile);
  };
  

  const handleSubmit = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    // Check if data contains mobileNumber and customerName fields
    const hasMobileNumber = data[0]?.includes("mobileNumber");
    const hasCustomerName = data[0]?.includes("customerName");

    if (!hasMobileNumber || !hasCustomerName) {
      setLoading(false);
      // Display error message if mobileNumber or customerName is missing
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please upload a file containing mobileNumber and customerName columns",
      });
      return;
    }

    // Create FormData object to send the file and additional data
    const formData = new FormData();
    formData.append("file", file);

    // Extract mobileNumber and customerName from the second row of data
    const mobileNumberIndex = data[0].indexOf("mobileNumber");
    const customerNameIndex = data[0].indexOf("customerName");
    const customerCategoryIndex = data[0].indexOf("category");

    const mobileNumber = data[1][mobileNumberIndex];
    let customerName = data[1][customerNameIndex];
    let category = data[1][customerCategoryIndex];

    // Check if customerName is undefined or empty, if so, set it to "Unknown"
    if (typeof customerName !== "string" || !customerName.trim()) {
      customerName = "Unknown";
    }

    formData.append("mobileNumber", mobileNumber);
    formData.append("customerName", customerName);
    formData.append("category", category);


    // Append all fields data
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.length; j++) {
        const fieldName = data[0][j];
        let fieldValue = row[j];
        // Check if fieldValue is undefined, if so, set it to "Undefined"
        if (typeof fieldValue === "undefined") {
          fieldValue = "Undefined";
        }
        formData.append(fieldName, fieldValue);
      }
      console.log(formData);
    }

    try {
      // Upload Excel file and additional data to the server
      const response = await axios.post(
        `${Base_Url}${excelUploadAPI}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`, // Include token in Authorization header
          },
        }
      );

      console.log("Excel file uploaded successfully:", response.data);

      // Stop loader
      setLoading(false);

      // Display success message and navigate to /customers
      Swal.fire({
        icon: "success",
        title: "Excel file uploaded successfully!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/customers");
        }
      });
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      // Stop loader
      setLoading(false);
      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error uploading Excel file",
        text: "Please try again later",
      });
    }
  };

  return (
    <div className="container mt-4">
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="mb-3">
            <label htmlFor="file-upload" className="form-label">
              Upload Excel File:
            </label>
            <input
              type="file"
              className="form-control"
              id="file-upload"
              onChange={handleFileUpload}
            />
          </div>
          {file && (
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead></thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploader;
