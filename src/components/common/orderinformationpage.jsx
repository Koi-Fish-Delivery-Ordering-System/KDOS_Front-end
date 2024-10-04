import React from 'react';
import '../../css/orderinformationpage.css';
import Navbar from './navbar';
import Footer from './footer';
import { useLocation } from 'react-router-dom';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function OrderPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { transport } = location.state || {};

    const handleSubmit = (info) => {
        console.log(info);
        navigate("/orderdetail", { state: { info } });
    };

    // List of provinces in Vietnam
    const provinces = [
        'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Yên Bái', 'Thái Nguyên', 
        'Lạng Sơn', 'Quảng Ninh', 'Phú Thọ', 'Vĩnh Phúc', 'Bắc Giang', 'Bắc Ninh', 'Hà Nội', 
        'Hải Dương', 'Hưng Yên', 'Hà Nam', 'Nam Định', 'Thái Bình', 'Ninh Bình', 'Hải Phòng', 
        'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên-Huế', 
        'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 
        'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng', 'Bình Phước', 
        'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa–Vũng Tàu', 'Ho Chi Minh City', 
        'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang', 
        'Kiên Giang', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau', 'Sơn La', 
        'Hòa Bình', 'Điện Biên', 'Lai Châu'
    ];

    return (
        <div>
            <Navbar />
            <div className="order-page-container">
                <h1>Order Information</h1>
                <Form
                    className="form"
                    labelCol={{ span: 24 }}
                    onFinish={handleSubmit}
                >
                    <h2>Sender</h2>
                    {/* Sender */}
                    <Form.Item
                        label="Sender"
                        name="sender"
                        rules={[{ required: true, message: "Please enter sender information!" }]}
                    >
                        <Input type="text" placeholder="Sender" />
                    </Form.Item>
                    {/* Pick up location */}
                    <Form.Item
                        label="Pick up Province/City"
                        name="pickUpProvince"
                        rules={[{ required: true, message: "Please select pick up province!" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select pick up province"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {provinces.map((province) => (
                                <Option key={province} value={province}>
                                    {province}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Pick up detailed address */}
                    <Form.Item
                        label="Pick up Detailed Address"
                        name="pickUpAddress"
                        rules={[{ required: true, message: "Please enter detailed pick up address!" }]}
                    >
                        <Input type="text" placeholder="Pick up detailed address" />
                    </Form.Item>

                    {/* Sender's Phone */}
                    <Form.Item
                        label="Sender's Phone"
                        name="senderPhone"
                        rules={[{ required: true, message: "Please enter phone number!" }]}
                    >
                        <Input type="text" placeholder="Sender's Phone" />
                    </Form.Item>    
                    <h2>Recipient</h2>
                    {/* Recipient */}
                    <Form.Item
                        label="Recipient"
                        name="recipient"
                        rules={[{ required: true, message: "Please enter recipient information!" }]}
                    >
                        <Input type="text" placeholder="Recipient" />
                    </Form.Item>

                    

                    {/* Destination */}
                    <Form.Item
                        label="Destination Province/City"
                        name="destinationProvince"
                        rules={[{ required: true, message: "Please select destination province!" }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select destination province"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {provinces.map((province) => (
                                <Option key={province} value={province}>
                                    {province}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Destination Detailed Address"
                        name="destinationAddress"
                        rules={[{ required: true, message: "Please enter detailed destination address!" }]}
                    >
                        <Input type="text" placeholder="Destination detailed address" />
                    </Form.Item>

                    {/* Recipient's Phone */}
                    <Form.Item
                        label="Recipient's Phone"
                        name="recipientPhone"
                        rules={[{ required: true, message: "Please enter phone number!" }]}
                    >
                        <Input type="text" placeholder="Recipient's Phone" />
                    </Form.Item>

                    {/* Hidden transport field */}
                    <Form.Item name="transport" initialValue={transport}>
                        <Input type="hidden" />
                    </Form.Item>

                    {/* Submit button */}
                    <Form.Item>
                        <Button className='continue-button' type="primary" htmlType="submit">
                            Continue
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Footer />
        </div>
    );
}

export default OrderPage;
