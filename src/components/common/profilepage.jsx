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
  const [currentFieldCurrent, setCurrentFieldCurrent] = useState('');
  const username = sessionStorage.getItem("username");
  const fullName = sessionStorage.getItem("fullName");
  const email = sessionStorage.getItem("email");
  const address = sessionStorage.getItem("address");
  const phone = sessionStorage.getItem("phone");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const showModal = (field) => {
    setCurrentField(field);
    setNewValue(sessionStorage.getItem(field));
    setIsModalVisible(true);
  };

  const showModalCurrent = (field) => {
    setCurrentFieldCurrent(field);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (currentField === 'phone' && !/^\d{10}$/.test(newValue)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (currentField === 'password') {
      if (!currentPassword) {
        toast.error("Please enter your current password.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast.error("New passwords do not match.");
        return;
      }
      // Add logic to verify current password and update to new password
      // ...
    }

    try {
      // Gửi dữ liệu đến API
      const accessToken = sessionStorage.getItem("accessToken");
      await axios.patch('http://26.61.210.173:3001/api/accounts/update-profile', { [currentField]: newValue }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      toast.success("Profile updated successfully!");
      sessionStorage.setItem(currentField, newValue);
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
      <h1 className='section-title'>Profile</h1>
      <div className="profile-item">
        <div className="profile-label">Username</div>
        <div className="profile-value">{username}</div>
      </div>
      <div className="profile-item">
        <div className="profile-label">Full Name</div>
        <div className="profile-value">{fullName}</div>
        <a href="#" className="profile-action" onClick={() => showModal('fullName')}>Change</a>
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
        <div className="profile-label">Password</div>
        <a href="#" className="profile-action" onClick={() => showModal('password')}>Change Password</a>
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
          {currentField === 'password' ? (
            <>
              <Form.Item label="Current Password">
                <Input.Password
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="New Password">
                <Input.Password
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Confirm New Password">
                <Input.Password
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </Form.Item>
            </>
          ) : (
            <Form.Item label={currentField}>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </Form.Item>
          )}
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
