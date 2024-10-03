import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import "../../css/profile.css";

 function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    dob: '',
    contactPhone: '',
    creditCardInfo: '',
    bankAccount: ''
  });

  const handleChangeClick = (field) => {
    // Logic to handle change action for each field
    toast.info(`Change ${field}`);
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(profile, currentPassword, newPassword, confirmPassword);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <Form onSubmit={handleSubmit} className="profile-form">
        <Form.Item label="Full Name">
          <Input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Phone">
          <Input value={profile.phone} readOnly />
          <Button type="link" onClick={() => handleChangeClick('Phone')}>Thay Đổi</Button>
        </Form.Item>
        <Form.Item label="Email">
          <Input value={profile.email} readOnly />
          <Button type="link" onClick={() => handleChangeClick('Email')}>Thay Đổi</Button>
        </Form.Item>
        <Form.Item label="Password">
          <Input type="password" name="password" value={profile.password} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Date of Birth">
          <Input type="date" name="dob" value={profile.dob} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Contact Phone">
          <Input type="tel" name="contactPhone" value={profile.contactPhone} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Credit Card Info">
          <Input type="text" name="creditCardInfo" value={profile.creditCardInfo} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Bank Account">
          <Input type="text" name="bankAccount" value={profile.bankAccount} onChange={handleChange} />
        </Form.Item>
        <div className="change-password-section">
          <h3>Change Password</h3>
          <Form.Item label="Current Password">
            <Input type="password" name="currentPassword" value={currentPassword} onChange={handlePasswordChange} />
          </Form.Item>
          <Form.Item label="Enter New Password">
            <Input type="password" name="newPassword" value={newPassword} onChange={handlePasswordChange} />
          </Form.Item>
          <Form.Item label="Re-type New Password">
            <Input type="password" name="confirmPassword" value={confirmPassword} onChange={handlePasswordChange} />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit">Save</Button>
      </Form>
    </div>
  );
}

export default ProfilePage;