import React from 'react';
import './Header.css'; // create a CSS file for the styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="your-logo-url" alt="Ezbuy logo" />
      </div>
      <nav>
        <ul>
          <li><a href="#services">Dịch vụ</a></li>
          <li><a href="#order-tracking">Theo dõi đơn hàng</a></li>
          <li><a href="#catalog">B2B Catalog</a></li>
          <li><a href="#resources">Tài nguyên</a></li>
          <li><a href="#support">Hỗ trợ</a></li>
        </ul>
      </nav>
      <div className="actions">
        <button>Đăng nhập</button>
        <button className="contact-button">Liên hệ</button>
      </div>
    </header>
  );
};

export default Header;
