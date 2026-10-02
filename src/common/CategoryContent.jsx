import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/Styles/CategoryContent.css";
import { Base_Url, getAllProductAPI } from "./Apis";

const ProductList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Base_Url}${getAllProductAPI}`);
        const data = await response.json();
        const productsList = Array.isArray(data?.products) ? data.products : [];
        const uniqueCategories = [
          ...new Set(
            productsList
              .map((product) => product?.productCategory)
              .filter((cat) => cat && cat !== "undefined" && cat !== "null")
          ),
        ];
        setCategories(uniqueCategories);
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <div className="category-product-list-container">
      <h3>Categories</h3>
      <ul className="category-product-list category-has-scrollbar">
        {categories.map((category, index) => {
          const categoryProduct = products.find(
            (product) =>
              product?.productCategory &&
              product.productCategory.trim().toLowerCase() === String(category).trim().toLowerCase()
          );
          const categoryImg = categoryProduct?.imageURL?.[0] || "";

          return (
            <li
              key={index}
              className="category-product-item"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-product-info">
                {categoryImg ? (
                  <img
                    src={categoryImg}
                    alt={category}
                    className="category-product-image"
                  />
                ) : (
                  <div className="category-product-image fallback-category-img">
                    {String(category).charAt(0)}
                  </div>
                )}
                <div className="category-product-category">{category}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductList;
