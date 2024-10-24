import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import "../../css/navbar.css"; // Ensure the path is correct

export default function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (  storedUsername ) {
      setUserInfo({
        username: storedUsername,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accountId");
    localStorage.removeItem("username");
    setUserInfo({});
    navigate('/login');
  };

  const handleAccountManagement = () => {
    const role = localStorage.getItem("role");
    const rolePathMap = {
      // shipper: '/shipper-account-management',
      customer: '/account-management',
      // manager: '/manager-account-management',
    };

    navigate(rolePathMap[role] || '/account-management'); // Default or error page
  };

  const menu_user = (
    <Menu>
      <Menu.Item>
        <a href="#" onClick={handleAccountManagement}>Account Management</a>
      </Menu.Item>
      <Menu.Item>
        <a href="#" onClick={handleLogout}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header-container">
      <nav className="navbar">
        <div className="nav-left">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/">HOME</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          {userInfo?.username ? (
            <div className="dropdown">
              <Dropdown overlay={menu_user} trigger={["hover"]}>
                <a className="dropdown-link">
                  <img 
                    src="src/images/avatar.jpg" 
                    alt="AVT"
                    className="avatar-image" 
                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
                  />
                  {userInfo.username}
                </a>
              </Dropdown>
            </div>
          ) : (
            <div onClick={() => navigate("/login")}>
              <Link to="/login" className="nav-item-login">LOGIN</Link>
            </div>
          )}
        </div>
      </nav>

      <div className="header-content">
        <img
          src="src/images/header.png"
          alt="Service"
          className="service-image"
        />
        <h1 className="service-name">Swift, Safe, and Stress-Free Koi Delivery<br></br> Order Today, Enjoy Tomorrow!</h1>
        
            <button className="create-order-button" onClick={() => navigate('/placeorder')}>
              CREATE ORDER NOW
            </button>
        
      </div>
    </header>
  );
}
