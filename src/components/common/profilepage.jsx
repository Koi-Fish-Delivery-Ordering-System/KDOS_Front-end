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

  const [newValue, setNewValue] = useState('');
  const username = sessionStorage.getItem("username");
  const fullName = sessionStorage.getItem("fullName");
  const email = sessionStorage.getItem("email");
  const phone = sessionStorage.getItem("phone");

  const [editingField, setEditingField] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEditClick = (field) => {
    setEditingField(field);
    setNewValue(sessionStorage.getItem(field));
  };
  const accessToken = sessionStorage.getItem("accessToken");

  const handleSave = async (field) => {
    if (field === 'phone' && !/^\d{10}$/.test(newValue)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      await axios.patch('http://26.61.210.173:3001/api/accounts/update-profile', { [field]: newValue }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      toast.success("Profile updated successfully!");
      sessionStorage.setItem(field, newValue);
      setEditingField(null);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    // Validate new password (you can add more validation rules as needed)
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return false; // Indicate failure
    }

    try {
      const response = await axios.patch('http://26.61.210.173:3001/api/accounts/change-password', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        return true;
      } else {
        toast.error("Your current password is incorrect");
        return false;
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  const handleChangePassword = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const isSuccess = await changePassword(oldPassword, newPassword);
    if (isSuccess) {
      setIsModalVisible(false);
      setOldPassword('');
      setNewPassword('');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOldPassword('');
    setNewPassword('');
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
        {editingField === 'fullName' ? (
          <div className="edit-container">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <a href="#" className="cancel-button" onClick={handleCancel}>Cancel</a>
            <Button type="primary" className="continue-button" onClick={() => handleSave('fullName')}>Save</Button>
          </div>
        ) : (
          <>
            <div className="profile-value">{fullName}</div>
            <a href="#" className="profile-action" onClick={() => handleEditClick('fullName')}>Change</a>
          </>
        )}

      </div>
      <div className="profile-item">
        <div className="profile-label">Phone</div>
        {editingField === 'phone' ? (
          <div className="edit-container">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <a href="#" className="cancel-button" onClick={handleCancel}>Cancel</a>
            <Button type="primary" className="continue-button" onClick={() => handleSave('phone')}>Save</Button>
          </div>
        ) : (
          <>
            <div className="profile-value">{phone}</div>
            <a href="#" className="profile-action" onClick={() => handleEditClick('phone')}>Change</a>
          </>
        )}

      </div>
      <div className="profile-item">
        <div className="profile-label">Email</div>
        {editingField === 'email' ? (
          <div className="edit-container">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <a href="#" className="cancel-button" onClick={handleCancel}>Cancel</a>
            <Button type="primary" className="continue-button" onClick={() => handleSave('email')}>Save</Button>
          </div>
        ) : (
          <>
            <div className="profile-value">{email}</div>
            <a href="#" className="profile-action" onClick={() => handleEditClick('email')}>Change</a>
          </>
        )}

      </div>


      <div className="profile-item">
        <div className="profile-label">Password</div>
        <a href="#" className="profile-action" onClick={handleChangePassword}>Change Password</a>
      </div>
      <div className="profile-item">
        <div className="profile-label">Account</div>
        <a href="#" className="profile-action">Disable Account</a>
      </div>

      <Modal
        title="Change Password"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form>
          <Form.Item label="Current Password">
            <Input.Password
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="New Password">
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
