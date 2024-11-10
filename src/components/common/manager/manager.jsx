import React, { useState } from 'react';
import ProfilePage from '../profilepage';
import Navbar2 from '../navbar2';
import TransportService from './transportservice';
import AccountManagement from './accountmanager.jsx';
import AdditionalserviceManagement from './manageaddtionalservice.jsx';
import ManageRoute from './manageroute';
import Analytics from './analytics';
import '../../../css/accountmanagement.css';
import { Modal } from 'antd'; // Import Modal from antd
function Manager() {
  const [activeComponent, setActiveComponent] = useState('profile');
  const [selectedTransportId, setSelectedTransportId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null); // New state for selected account
  const [selectedAdditionalServiceId, setSelectedAdditionalServiceId] = useState(null); // New state for selected account
  const [selectedRouteId, setSelectedRouteId] = useState(null); // New state for selected route 

  // Retrieve roles from sessionStorage
  const roles = JSON.parse(sessionStorage.getItem("roles")); // Parse the JSON string back into an array

  // Check if roles is not null and contains the role "manager"
  if (!roles || !roles.includes("manager")) {
    // Redirect to the appropriate page if the role is not present
    window.location.href = '/unauthorized'; // Change '/unauthorized' to your desired redirect URL
  } else {
    // Proceed with the logic for users with the "manager" role
    console.log("User has the manager role.");
  }
  const handleDetailClick = (transportId) => {
    setSelectedTransportId(transportId);
    setActiveComponent('detail');
  };
  const handleAccountClick = (accountId) => { // Updated function for account management
    if (accountId === 'additionalserviceManagement') {
      setSelectedAdditionalServiceId(accountId); // Set the selected additional service ID
    }
    setSelectedAccountId(accountId);
    setActiveComponent(accountId);
  };



  const renderContent = () => {
    switch (activeComponent) {
      case 'profile':
        return <ProfilePage />;
      case 'transportService':
        return <TransportService onDetailClick={handleDetailClick} />;
      case 'accountManagement': // New case for account management
        return <AccountManagement selectedAccountId={selectedAccountId} />;
      case 'additionalserviceManagement': // Updated case for additional service management
        return <AdditionalserviceManagement selectedAdditionalServiceId={selectedAdditionalServiceId} />; // Pass the selected ID to the component
      case 'manageRoute':
        return <ManageRoute />;
      case 'analytics':
        return <Analytics />;
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
          <h3>Manager</h3>
          <ul>
            <li>
              <button onClick={() => setActiveComponent('analytics')} className={activeComponent === 'analytics' ? 'active' : ''}>
                Analytics
              </button>
            </li>
            <li>
              <button onClick={() => setActiveComponent('profile')} className={activeComponent === 'profile' ? 'active' : ''}>
                Profile
              </button>
            </li>
            <li>
              <button onClick={() => setActiveComponent('transportService')} className={activeComponent === 'transportService' ? 'active' : ''}>
                Manage Transport Service
              </button>
            </li>
            <li>
              <button onClick={() => handleAccountClick('accountManagement')} className={activeComponent === 'accountManagement' ? 'active' : ''}>
                Manage Accounts
              </button>
            </li>
            <li>
              <button onClick={() => handleAccountClick('additionalserviceManagement')} className={activeComponent === 'additionalserviceManagement' ? 'active' : ''}>
                Manage Additional Service
              </button>
            </li>
            <li>
              <button onClick={() => setActiveComponent('manageRoute')} className={activeComponent === 'manageRoute' ? 'active' : ''}>
                Manage Route
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

export default Manager;