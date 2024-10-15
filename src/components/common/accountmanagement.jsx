import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../css/accountManagement.css';

const AccountManagement = () => {
  const location = useLocation();

  return (
    <div className="account-management">
      <div className="sidebar">
        <h3>Account Management</h3>
        <ul>
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/records" className={location.pathname === '/records' ? 'active' : ''}>
              Orders
            </Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <h2>Welcome to Your Account</h2>
        <p>Select an option from the sidebar to view details.</p>
      </div>
    </div>
  );
};

export default AccountManagement;
