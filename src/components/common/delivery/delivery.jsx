import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProfilePage from '../profilepage';
import Navbar2 from '../navbar2';
import DeliveryPage from './deliverypickup';
import DeliveryProcess from './deliveryprocess';
import DeliveryDelivered from './deliveredroute';
import '../../../css/accountmanagement.css';

function Delivery() {
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState(location.state?.activeComponent || 'profile');

 

  const renderContent = () => {
    switch (activeComponent) {
      case 'profile':
        return <ProfilePage />;
      case 'pending':
        return <DeliveryPage  />;
      case 'process':
        return <DeliveryProcess  />;
      case 'delivered':
        return <DeliveryDelivered  />;
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
      <Navbar2/>
      <div className="account-management">
        <div className="sidebar">
          <h3>Delivery</h3>
          <ul>
            <li>
              <button onClick={() => setActiveComponent('profile')} className={activeComponent === 'profile' ? 'active' : ''}>
                Profile
              </button>
            </li>
            <li>
              <button onClick={() => setActiveComponent('pending')} className={activeComponent === 'pending' ? 'active' : ''}>
                Delivery Route 
              </button>
            </li>
            <li>
              <button onClick={() => setActiveComponent('process')} className={activeComponent === 'process' ? 'active' : ''}>
                Processing Route
              </button>
            </li>
            <li>
              <button onClick={() => setActiveComponent('delivered')} className={activeComponent === 'delivered' ? 'active' : ''}>
                Delivered Route
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

export default Delivery;
