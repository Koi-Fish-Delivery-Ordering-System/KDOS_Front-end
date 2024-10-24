import React from "react";
import AuthenTemplate from "./validationlogin";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const loginResponse = await api.post("http://26.61.210.173:3001/api/auth/sign-in", values);
      console.log("Login response:", loginResponse);

      if (loginResponse && loginResponse.data && loginResponse.data.tokens) {
        const { accessToken } = loginResponse.data.tokens;
        localStorage.setItem("accessToken", accessToken);
        console.log("Đăng nhập thành công. Access Token:", accessToken);

        const query = `
          query Init {
            init {
              accountId
              username
              email
              password
              roles {
                name
              }
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
            const { accountId, roles, username, email, password } = initResponse.data.data.init;
            localStorage.setItem("accountId", accountId);
            localStorage.setItem("username", username);
            localStorage.setItem("email", email);
            // localStorage.setItem("address", address);
            localStorage.setItem("password", password);
            console.log("Email:", email);
            // console.log("Address:", address);
            console.log("Password:", password);
            console.log("Username:", username);
            console.log("Account ID:", accountId);
            console.log("Roles:", roles);
            
            if (roles && Array.isArray(roles) && roles.length > 0) {
              const userRole = roles[0].name.toLowerCase(); // Lấy vai trò đầu tiên
              console.log("User role:", userRole);
              
              // Chuyển hướng dựa trên vai trò
              switch(userRole) {
                case 'user':
                  navigate('/');
                  break;
                case 'shipper':
                  navigate('/delivery');
                  break;
                case 'healchecker':
                  navigate('/healchecker');
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
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthenTemplate>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Log in</h2>
      <Form
        labelCol={{
          span: 24,
        }}
        onFinish={handleLogin}
      >
        <Form.Item
          label="Phone or Email"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your phone or email!",
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
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>

      </Form>
    </AuthenTemplate>
  );
}

export default LoginPage;
