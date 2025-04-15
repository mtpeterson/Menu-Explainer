import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import the CSS file for styling

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/upload"); // Navigate to the image upload page
  };

  return (
    <div className="splash-container">
      <div className="splash-content">
        <h1 className="splash-title">Welcome to MenuX</h1>
        <p className="splash-description">
          Discover the power of MenuX! Upload an image of a menu, and we'll help you extract and analyze its content effortlessly.
        </p>
        <button className="splash-button" onClick={handleButtonClick}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;