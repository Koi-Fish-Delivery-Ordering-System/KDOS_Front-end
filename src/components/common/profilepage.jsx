import React, { useState, useEffect, createContext, useContext } from "react";
import { Button, Form, Input } from "antd";
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

  useEffect(() => {
    if (userId) {
      axios.get('https://66f3691871c84d8058789db4.mockapi.io/apiorders/1')
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

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <Form className="profile-form">
        {['firstName', 'lastName', 'phone', 'email'].map(field => (
          <Form.Item key={field} label={field.replace(/^\w/, c => c.toUpperCase())}>
            <div className="field-container">
              {editField === field ? (
                <div className="edit-mode">
                  <Input value={tempValue} onChange={e => setTempValue(e.target.value)} />
                  <Button type="link" onClick={handleCancel}>Cancel</Button>
                  <Button type="link" onClick={handleContinue}>Continue</Button>
                </div>
              ) : (
                <div className="view-mode">
                  <Input value={profile[field]} readOnly />
                  <Button type="link" onClick={() => handleChangeClick(field)}>Change</Button>
                </div>
              )}
            </div>
          </Form.Item>
        ))}
        <Form.Item label="Password">
          <Button type="link" onClick={() => handleChangeClick('Password')}>Change Password</Button>
        </Form.Item>
        <Form.Item label="Account">
          <Button type="link" onClick={() => handleChangeClick('Account')}>Delete Account</Button>
        </Form.Item>
      </Form>
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
