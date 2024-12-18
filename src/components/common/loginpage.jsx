import React from "react";
import AuthenTemplate from "./validationlogin";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const loginResponse = await api.post("http://26.61.210.173:3001/api/auth/sign-in", values);
      console.log("Login response:", loginResponse);

      if (loginResponse && loginResponse.data && loginResponse.data.tokens) {
        const { accessToken } = loginResponse.data.tokens;
        sessionStorage.setItem("accessToken", accessToken);
        console.log("Đăng nhập thành công. Access Token:", accessToken);
        message.success("Login successful", 1);
        const query = `
          query Init {
            init {
              accountId
              username
              email
              password
              fullName
              phone
              address
              role
              walletAmount
            }
          }
        `;

        try {
          const initResponse = await axios.post('http://26.61.210.173:3001/graphql',
            { query },
            {
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
              }
            }
          );
          console.log("Full Init response:", initResponse);

          if (initResponse.data && initResponse.data.data && initResponse.data.data.init) {
            const { accountId, username, email, password, phone, address, fullName, role, walletAmount } = initResponse.data.data.init;
            sessionStorage.setItem("accountId", accountId);
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("fullName", fullName);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("phone", phone);
            sessionStorage.setItem("address", address);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("role", role);
            sessionStorage.setItem("walletAmount", walletAmount);
            console.log("Email:", email);
            console.log("Address:", address);
            console.log("Phone:", phone);
            console.log("Password:", password);
            console.log("Username:", username);
            console.log("Account ID:", accountId);
            console.log("Roles:", role);

            if (role) {
              const userRole = role.toLowerCase();
              console.log("User role:", userRole);
              // Chuyển hướng dựa trên vai trò
              switch (userRole) {
                case 'user':
                  navigate('/');
                  break;
                case 'delivery':
                  navigate('/delivery');
                  break;
                case 'healchecker':
                  navigate('/healchecker');
                  break;
                case 'manager':
                  navigate('/manager');
                  break;
                default:
                  console.error("Unknown role:", userRole);
                  toast.error("Unknown user role");
                  navigate('/');
              }
            } else {
              console.error("No roles found for user");
              toast.error("No roles assigned to user");
              navigate('/');
            }
          } else {
            console.error("Unexpected init response structure:", initResponse.data);
            toast.error("Unexpected response from server");
          }
        } catch (initError) {
          console.error("Init query error:", initError);
          toast.error("Error initializing user data");
        }
      } else {
        console.error("Unexpected login response structure:", loginResponse);
        toast.error("Login failed: Unexpected response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed: Please check your username and password");
    }
  };

  return (
    <div>
      <ToastContainer />
      <AuthenTemplate>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Log in</h2>
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleLogin}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div style={{ marginBottom: '24px' }}>
            <Link to="/register">Don't have account? Register new account</Link>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} >
              Login
            </Button>
          </Form.Item>

        </Form>
      </AuthenTemplate>
    </div>
  );
}

export default LoginPage;
