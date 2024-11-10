// src/components/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import '../../css/unauthorized.css'; // Import the CSS file for styling

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Navigate back to the homepage
  };

  return (
    <div className="unauthorized-container">
      <h1>Page Not Found</h1>
      <p>You Are Entered Wrong URL</p>
      <button className="back-button" onClick={handleBackToHome}>
        Back to Homepage
      </button>
    </div>
  );
};

export default Unauthorized;