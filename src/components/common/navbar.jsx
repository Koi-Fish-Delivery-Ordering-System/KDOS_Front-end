import React from 'react';
import { Link } from 'react-router-dom';
import "../../css/navbar.css"; // Make sure the path is correct
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="header-container">
      <nav className="navbar">
        <div className="nav-left">
          <ul className="nav-list">
            <li className="nav-item">HOME</li>
            <li className="nav-item">ABOUT</li>
            <li className="nav-item">SERVICE</li>
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
          <div><Link to="/login" className="nav-item-login">LOGIN</Link></div>
        </div>
      </nav>

      <div className="header-content">
        <img
          src="src\images\header.png"
          alt="Service"
          className="service-image"
        />
        <h1 className="service-name">Koi <br></br>Delivery</h1>
      </div>
    </header>
  );
}
