import React from "react";
import AuthenTemplate from "./validationlogin";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await api.post("https://66f3691871c84d8058789db4.mockapi.io/Login", values);
      const { token, avatar, username } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("username", username);

      navigate("/"); // Redirect to homepage after login
    } catch (err) {
      toast.error(err.response.data);
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
