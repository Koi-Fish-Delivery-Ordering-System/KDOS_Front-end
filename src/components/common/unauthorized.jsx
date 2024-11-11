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
      <h1>Unauthorized User</h1>
      <p>You have to login to access this page</p>
      <button className="back-button" onClick={handleBackToHome}>
        Back to Homepage
      </button>
    </div>
  );
};

export default Unauthorized;