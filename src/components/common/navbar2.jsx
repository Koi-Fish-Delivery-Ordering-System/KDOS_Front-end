import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import "../../css/navbar.css"; // Ensure the path is correct

export default function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    const storedUsername = localStorage.getItem("username");
    if (storedAvatar && storedUsername) {
      setUserInfo({ avatar: storedAvatar, username: storedUsername });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    localStorage.removeItem("username");
    setUserInfo({}); // Clear user info
    navigate('/login');
  };

  const menu_user = (
    <Menu>
      <Menu.Item>
        <Link to="/profile">Thông Tin</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/records">Xem đơn hàng</Link>
      </Menu.Item>
      <Menu.Item>
        <a href="#" onClick={handleLogout}>Đăng Xuất</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header-container" style={{height: '0vh'}}>
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
                    src={userInfo.avatar} 
                    alt={userInfo.username} 
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

      {/* <div className="header-content">
        <img
          src="src/images/header.png"
          alt="Service"
          className="service-image"
        />
        <h1 className="service-name">Koi <br></br>Delivery</h1>
      </div> */}
    </header>
  );
}
