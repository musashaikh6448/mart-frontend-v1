import React, { useEffect } from "react";
import Banner from "../common/Banner";
import ProductMain from "../Pages/MainProduct";
import "../App.css";
import DealOfTheDay from "../common/DealOfTheDay";
import { useLocation, useParams } from "react-router-dom";
import CategoryContent from "../common/CategoryContent";
import { FaPlus } from "react-icons/fa";

const Home = () => {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);
 
  return (
    <>
      <div className="heading-of-category home-marquee">
        <div className="scrolling-text">
          <span>Delivery within 24 hours</span>
          <span>
            <FaPlus />
          </span>
          <span>Returns without questions</span>
          <span>
            <FaPlus />
          </span>
          <span>Quality product at best price</span>
          <span>
            <FaPlus />
          </span>
          <span>Low price compare to your retail outlet</span>
          <span>
            <FaPlus />
          </span>
          <span>Cheaper than Amazon and Flipkart</span>
          <span>
            <FaPlus />
          </span>
        </div>
      </div>
      <CategoryContent />
      <Banner/>
      <DealOfTheDay />
      <ProductMain />
    </>
  );
};

export default Home;
