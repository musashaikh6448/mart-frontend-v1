import React, { useState, useEffect } from 'react';
import '../Assets/Styles/ScrollToTopButton.css';
import { Link } from 'react-router-dom';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      // Function to show/hide scroll-to-top button based on scroll position
      const toggleVisibility = () => {
        if (window.scrollY > 100) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener('scroll', toggleVisibility);
  
      return () => {
        window.removeEventListener('scroll', toggleVisibility);
      };
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
  

  return (
    <div className={`scroll-to-top ${isVisible ? 'show' : ''}`} onClick={scrollToTop}>
      <div className="scroll scroll--active">
  <Link type="button" class="top-btn">
    <span class="sr-only">Scroll to Top</span>
  </Link>
</div>
    </div>
  );
};

export default ScrollToTopButton;
