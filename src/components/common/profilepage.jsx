import React, { useState } from "react";
import { Button, Form, Input, Modal, Card, Row, Col, Avatar } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import "../../css/profile.css";

const ProfilePage = () => {
  const [newValue, setNewValue] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const username = sessionStorage.getItem("username");
  const fullName = sessionStorage.getItem("fullName");
  const email = sessionStorage.getItem("email");
  const phone = sessionStorage.getItem("phone");
  const accessToken = sessionStorage.getItem("accessToken");

  const handleEditClick = (field) => {
    setEditingField(field);
    setNewValue(sessionStorage.getItem(field));
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setNewValue('');
  };

  const handleChangePassword = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOldPassword('');
    setNewPassword('');
  };

  const handleOk = async () => {
    // Handle password change logic
    handleCancel(); // Close the modal after handling
  };

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
      console.log(error);
      toast.error("Email is already exists.");
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return false;
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

  return (
    <div className="profile-container" style={{ padding: '40px' }}>
      <Card style={{ width: '100%', borderRadius: '10px', fontSize: '18px' }}>
        <Row gutter={32}>
          <Col span={6} style={{ textAlign: 'center' }}>
            <Avatar size={120} src="https://via.placeholder.com/120" />
            <h2 style={{ fontSize: '24px' }}>{fullName}</h2>
            <p style={{ fontSize: '20px' }}>{username}</p>
          </Col>
          <Col span={18}>
            <h1 className='section-title' style={{ fontSize: '28px' }}>Profile</h1>
            <div className="profile-item" style={{ fontSize: '18px' }}>
              <div className="profile-label">Email</div>
              {editingField === 'email' ? (
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  style={{ marginBottom: '10px', fontSize: '18px' }}
                />
              ) : (
                <div className="profile-value">{email}</div>
              )}
              {editingField === 'email' ? (
                <>
                  <Button type="primary" onClick={() => handleSave('email')} style={{ fontSize: '18px' }}>
                    Save
                  </Button>
                  <Button type="link" onClick={handleCancelEdit} style={{ fontSize: '18px' }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="link" onClick={() => handleEditClick('email')} style={{ fontSize: '18px' }}>
                  Change
                </Button>
              )}
            </div>
            <div className="profile-item" style={{ fontSize: '18px' }}>
              <div className="profile-label">Phone</div>
              {editingField === 'phone' ? (
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  style={{ marginBottom: '10px', fontSize: '18px' }}
                />
              ) : (
                <div className="profile-value">{phone}</div>
              )}
              {editingField === 'phone' ? (
                <>
                  <Button type="primary" onClick={() => handleSave('phone')} style={{ fontSize: '18px' }}>
                    Save
                  </Button>
                  <Button type="link" onClick={handleCancelEdit} style={{ fontSize: '18px' }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="link" onClick={() => handleEditClick('phone')} style={{ fontSize: '18px' }}>
                  Change
                </Button>
              )}
            </div>
            <div className="profile-item" style={{ fontSize: '18px' }}>
              <div className="profile-label">Password</div>
              <Button type="link" onClick={handleChangePassword} style={{ fontSize: '18px' }}>
                Change Password
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Modal
        title="Change Password"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        style={{ fontSize: '18px' }}
      >
        <Form>
          <Form.Item label="Current Password">
            <Input.Password
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{ fontSize: '18px' }}
            />
          </Form.Item>
          <Form.Item label="New Password">
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ fontSize: '18px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
