import React from "react";
import AuthenTemplate from "./validationlogin";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    console.log(values);
    try {
      const response = await api.post("login", values);
      console.log(response);
      const { role, token } = response.data;
      localStorage.setItem("token", token);

      if (role === "ADMIN") {
        navigate("/dashboard");
      }
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
