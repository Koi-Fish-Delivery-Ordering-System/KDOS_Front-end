import React, { useState } from 'react';
import ProfilePage from '../profilepage';
import Navbar2 from '../navbar2';
import HealDetail from './healdetail';
import HealOrder from './healorder';
import '../../../css/accountmanagement.css';
import { Modal } from 'antd';

function HealChecker() {
  // Retrieve roles from sessionStorage
  const roles = JSON.parse(sessionStorage.getItem("roles")); // Parse the JSON string back into an array

  // Check if roles is not null and contains the role "manager"
  if (!roles || !roles.includes("healthchecker")) {
    // Redirect to the appropriate page if the role is not present
    window.location.href = '/unauthorized'; // Change '/unauthorized' to your desired redirect URL
  } else {
    // Proceed with the logic for users with the "manager" role
    console.log("User has the healthchecker role.");
  }
  const [activeComponent, setActiveComponent] = useState('profile');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleDetailClick = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveComponent('detail');
  };

  const handleBackToOrders = () => {
    setActiveComponent('orders');
  };

  const renderContent = () => {
    switch (activeComponent) {
      case 'profile':
        return <ProfilePage />;
      case 'orders':
        return <HealOrder onDetailClick={handleDetailClick} />;
      case 'detail':
        return <HealDetail orderId={selectedOrderId} onBack={handleBackToOrders} />;
      default:
        return (
          <div>
            <h2>Welcome to Your Account</h2>
            <p>Select an option from the sidebar to view details.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="account-management">
        <div className="sidebar">
          <h3>Heal Checker</h3>
          <ul>
            <li>
              <button onClick={() => setActiveComponent('profile')} className={activeComponent === 'profile' ? 'active' : ''}>
                Profile
              </button>
            </li>
            <li>
              <button onClick={() => setActiveComponent('orders')} className={activeComponent === 'orders' ? 'active' : ''}>
                Orders
              </button>
            </li>
            <li>
              <button onClick={() => {
                Modal.confirm({
                  title: 'Confirm Logout',
                  content: 'Are you sure you want to log out?',
                  onOk() {
                    // Call the logout logic directly
                    sessionStorage.clear(); // Clear session storage
                    window.location.href = '/login'; // Change '/login' to your desired redirect URL
                  },
                });
              }} className={activeComponent === 'logout' ? 'active' : ''}>
                Logout
              </button>
            </li>
          </ul>
        </div>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default HealChecker;
