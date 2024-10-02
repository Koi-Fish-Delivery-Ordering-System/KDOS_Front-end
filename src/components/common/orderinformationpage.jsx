import React from 'react'
// import '../../css/orderpage.css'
import Navbar from './navbar'
import Footer from './footer'
import { useLocation } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
function OrderPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { transport} = location.state || {};
    const handleSubmit = (info) => {
      console.log(info);
      navigate("/orderdetail",{state: {info}});
    };
    return (
        <div>
            <Navbar />
            <div>
                <h1>Order Information</h1>
                <div>transport: {transport}</div>
                <Form
              className="form"
              labelCol={{
                span: 24,
              }}
               onFinish={handleSubmit}// event => chạy khi mà form đc submit thành công
            >
              <Form.Item
                label="Recipient"
                name="recipient"
                rules={[
                  {
                    required: true,
                    message: "Please enter recipient information!",
                  },
                ]}
              >
                <Input type="text" placeholder="Recipient" />
              </Form.Item>
              <Form.Item
                label="Pick up location"
                name="pickuplocation"
                rules={[
                  {
                    required: true,
                    message: "Please enter pick up location information!",
                  },
                ]}
              >
                <Input type="text" placeholder="Pick up location" />
              </Form.Item>
              <Form.Item
                label="Destination"
                name="destination"
                rules={[
                  {
                    required: true,
                    message: "Please enter destination information!",
                  },
                ]}
              >
                    <Input type="text" placeholder="Destination" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter phone number!",
                  },
                ]}
              >
                    <Input type="text" placeholder="Phone" />
              </Form.Item>
              <Form.Item
                name="transport"
                initialValue={transport} // Thiết lập giá trị cố định cho transport
              >
                <Input type='hidden' />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Continue
                </Button>
              </Form.Item>
            </Form>
            </div>
            <Footer />
        </div>
    )
}
export default OrderPage;