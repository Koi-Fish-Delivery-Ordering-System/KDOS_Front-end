import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from './navbar'
import Footer from './footer'
import { Form, Input, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

function OrderDetailPage() {
    const location = useLocation();
    const { values } = location.state || {};
    const [fishList, setFishList] = useState([]);
    const [fishForm] = Form.useForm();
    const handleAddFish = (values) => {
        setFishList([...fishList, values]);
        fishForm.resetFields();
      };
    const navigate = useNavigate(); // Thêm dòng này để sử dụng navigate

    const handleSubmitOrder = () => {
        const order = { fishList }; // Tạo đơn hàng từ danh sách cá
        console.log(order);
        navigate("/checkout", { state: order }); // Chuyển hướng đến trang checkout
    };

    return (
        <div>
            <Navbar />
            <div>
            <h1>Order Detail</h1>
            <div>
                {values.phone}
            </div>
            <h2>Add Fish</h2>
          <Form
            form={fishForm}
            onFinish={handleAddFish}
          >
            <Form.Item
              label="Fish Name"
              name="fishName"
              rules={[{ required: true, message: "Please enter fish name!" }]}
            >
              <Input type="text" placeholder="Fish Name" />
            </Form.Item>
            <Form.Item
              label="Weight"
              name="weight"
              rules={[{ required: true, message: "Please enter fish weight!" }]}
            >
              <Input type="text" placeholder="Weight" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Fish
              </Button>
            </Form.Item>
          </Form>

          <h2>Fish List</h2>
          <List
            bordered
            dataSource={fishList}
            renderItem={(item, index) => (
              <List.Item key={index}>
                {item.fishName} - {item.weight}
              </List.Item>
            )}
          />
          <Button type="primary" onClick={handleSubmitOrder}>
              Submit Order
          </Button>
            </div>
            <Footer />
        </div>
      )
}

export default OrderDetailPage