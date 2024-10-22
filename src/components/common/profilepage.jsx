import React, { useState, useEffect, createContext, useContext } from "react";
import { Button, Form, Input, Modal } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import "../../css/profile.css";

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
  const { userId } = useContext(UserContext);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      axios.get(`https://66f3691871c84d8058789db4.mockapi.io/apiorders/${userId}`)
        .then(response => {
          const { firstName, lastName, phone, email } = response.data;
          setProfile({ firstName, lastName, phone, email });
        })
        .catch(error => {
          console.error('API Error:', error);
          toast.error('Failed to load profile data');
        });
    }
  }, [userId]);

  const handleChangeClick = (field) => {
    setEditField(field);
    setTempValue(profile[field]);
  };

  const handleCancel = () => {
    setEditField(null);
  };

  const handleContinue = () => {
    setProfile({ ...profile, [editField]: tempValue });
    setEditField(null);
    toast.success(`${editField} updated successfully`);
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await axios.put(`https://66f3691871c84d8058789db4.mockapi.io/apiorders/${userId}`, { password });
      toast.success('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to update password');
    }
  };

  const showPasswordModal = () => {
    Modal.confirm({
      title: 'Change Password',
      content: 'Are you sure you want to change your password?',
      onOk: () => setIsPasswordModalVisible(true),
    });
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <Form className="profile-form">
        {['firstName', 'lastName', 'phone', 'email'].map(field => (
          <Form.Item key={field} label={field.replace(/^\w/, c => c.toUpperCase())}>
            <div className="field-container">
              {editField === field ? (
                <div className="edit-mode">
                  <Input value={tempValue} onChange={e => setTempValue(e.target.value)} />
                  <Button type="link" onClick={handleCancel}>Cancel</Button>
                  <Button type="link" onClick={handleContinue}>Save</Button>
                </div>
              ) : (
                <div className="view-mode">
                  <span>{profile[field]}</span>
                  <Button type="link" onClick={() => handleChangeClick(field)}>Change</Button>
                </div>
              )}
            </div>
          </Form.Item>
        ))}
        <Form.Item label="Password">
          <Button type="link" onClick={showPasswordModal}>Change Password</Button>
        </Form.Item>
        <Form.Item label="Account">
          <Button type="link" onClick={() => handleChangeClick('Account')}>Delete Account</Button>
        </Form.Item>
      </Form>

      <Modal
        title="Change Password"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handlePasswordChange}>
            Change Password
          </Button>,
        ]}
      >
        <Form>
          <Form.Item label="New Password">
            <Input.Password
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Item>
          <Form.Item
            label="Re-enter Password"
            validateStatus={password !== confirmPassword ? 'error' : ''}
            help={password !== confirmPassword ? 'Passwords do not match' : ''}
          >
            <Input.Password
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </Form.Item>
        </Form>
      </Modal>
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
