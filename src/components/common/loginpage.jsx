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
      const response = await api.post("https://66f3691871c84d8058789db4.mockapi.io/Login", values);
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

        <div>
          <Link to="/register">Don't have account? Register new account</Link>
        </div>

        <Button type="primary" htmlType="submit">
          Login
        </Button>

      </Form>
    </AuthenTemplate>
  );
}

export default LoginPage;
