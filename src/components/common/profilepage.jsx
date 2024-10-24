import React, { useState, useEffect, createContext, useContext } from "react";
import { Button, Form, Input, Modal } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import "../../css/profile.css";
import 'react-toastify/dist/ReactToastify.css';

// Create UserContext
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(1); // Default user ID for demonstration

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

function ProfilePage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [newValue, setNewValue] = useState('');
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const address = localStorage.getItem("address");
  const phone = localStorage.getItem("phone");

  const showModal = (field) => {
    setCurrentField(field);
    setNewValue(localStorage.getItem(field));
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (currentField === 'phone' && !/^\d{10}$/.test(newValue)) {
      toast.error("Please enter a phone number.");
      return;
    }

    try {
      // Gửi dữ liệu đến API
      const accessToken = localStorage.getItem("accessToken");
      await axios.patch('http://26.61.210.173:3001/api/accounts/update-profile', { [currentField]: newValue }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      toast.success("Profile updated successfully!");
      localStorage.setItem(currentField, newValue);
      setIsModalVisible(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">Profile</div>
      <div className="profile-item">
        <div className="profile-label">Username</div>
        <div className="profile-value">{username}</div>
        {/* <a href="#" className="profile-action" onClick={() => showModal('username')}>Change</a> */}
      </div>
  
      <div className="profile-item">
        <div className="profile-label">Phone</div>
        <div className="profile-value">{phone}</div>
        <a href="#" className="profile-action" onClick={() => showModal('phone')}>Change</a>
      </div>
      <div className="profile-item">
        <div className="profile-label"> Email</div>
        <div className="profile-value">{email}</div>
        <a href="#" className="profile-action" onClick={() => showModal('email')}>Change</a>
      </div>
      <div className="profile-item">
        <div className="profile-label">Address</div>
        <div className="profile-value">{address === "null" ? "Chưa cập nhật" : address}</div>
        <a href="#" className="profile-action" onClick={() => showModal('address')}>Change</a>
      </div>
      <div className="profile-item">
        <div className="profile-label">Password</div>
        <a href="#" className="profile-action">Change Password</a>
      </div>
      <div className="profile-item">
        <div className="profile-label">Account</div>
        <a href="#" className="profile-action">Disable Account</a>
      </div>

      <Modal
        title={`Edit ${currentField}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{ style: { backgroundColor: '#ff7700' } }}
      >
        <Form>
          <Form.Item label={currentField}>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <ProfilePage />
    </UserProvider>
  );
}

export default App;
