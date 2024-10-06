import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../css/navbar.css"; // Make sure the path is correct

export default function Navbar2() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Start with user not logged in

  const handleLogin = () => {
    // Perform login logic here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Perform logout logic here
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="header-container" style={{ height: '0vh' }}>
      <nav className="navbar">
        <div className="nav-left">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/">HOME</Link></li>
            <li className="nav-item">ABOUT</li>
            <li className="nav-item"><Link to="/placeorder">PLACE ORDER</Link></li>
            <li className="nav-item">
              <Link to="/feedback">FEEDBACK</Link>
            </li>
            <li className="nav-item">
              <Link to="/ordertracking">ORDERTRACKING</Link>
            </li>
            <li className="nav-item">CONTACT</li>
          </ul>
        </div>
        <div className="nav-right">
          {!isLoggedIn ? (
            <div><Link to="/login" className="nav-item-login" onClick={handleLogin}>LOGIN</Link></div>
          ) : (
            <div className="avatar-dropdown">
              <img src="path/to/avatar.png" alt="User Avatar" className="avatar" />
              <ul className="dropdown-menu">
                <li><Link to="/profile">Thông Tin</Link></li>
                <li><Link to="/orderhistory">Lịch Sử Đơn Hàng</Link></li>
                <li><Link to="/trackorder">Theo Dõi Đơn Hàng</Link></li>
                <li><a href="#" onClick={handleLogout}>Đăng Xuất</a></li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* <div className="header-content">
        <img
          src="src\images\header.png"
          alt="Service"
          className="service-image"
        />
        <h1 className="service-name">Koi <br></br>Delivery</h1>
      </div> */}
    </header>
  );
}
