import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Card, Row, Col, Select, Radio, Checkbox } from 'antd';
// import { LoadScript, GoogleMap } from '@react-google-maps/api';
import '../../css/placeorderpage.css';
import Navbar from './navbar';
import Footer from './footer';
import Navbar2 from './navbar2';

function PlaceOrderPage() {
    const [form] = Form.useForm(); // Thêm dòng này để sử dụng form
    const [airAvailable, setAirAvailable] = useState(false);

    const handleSubmit = (info) => {
        console.log(info);
        // navigate("/orderdetail", { state: { info } });
    };

    const handleValuesChange = () => {
        const pickUpLocation = form.getFieldValue('pickUpLocation');
        const dropOffLocation = form.getFieldValue('dropOffLocation');
        setAirAvailable(
            pickUpLocation &&
            dropOffLocation &&
            provincesHasPlane.includes(pickUpLocation) &&
            provincesHasPlane.includes(dropOffLocation) &&
            pickUpLocation !== dropOffLocation
        );
    };

    useEffect(() => {
        const pickUpLocation = form.getFieldValue('pickUpLocation');
        const dropOffLocation = form.getFieldValue('dropOffLocation');
        setAirAvailable(
            pickUpLocation &&
            dropOffLocation &&
            provincesHasPlane.includes(pickUpLocation) &&
            provincesHasPlane.includes(dropOffLocation) &&
            pickUpLocation !== dropOffLocation
        );
    }, [form]);

    // Hàm kiểm tra xem địa điểm có trong provincesHasPlane không
    const isAirAvailable = () => {
        const pickUpLocation = form.getFieldValue('pickUpLocation');
        const dropOffLocation = form.getFieldValue('dropOffLocation');
        // Kiểm tra xem cả hai địa điểm có trong provincesHasPlane không và không trùng nhau
        return (
            pickUpLocation &&
            dropOffLocation &&
            provincesHasPlane.includes(pickUpLocation) &&
            provincesHasPlane.includes(dropOffLocation) &&
            pickUpLocation !== dropOffLocation
        );
    };

    const mapContainerStyle = {
        height: '100vh',
        width: '100%',
    };
  
    const provinces = [
        'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Yên Bái', 'Thái Nguyên', 
        'Lạng Sơn', 'Quảng Ninh', 'Phú Thọ', 'Vĩnh Phúc', 'Bắc Giang', 'Bắc Ninh', 'Hà Nội', 
        'Hải Dương', 'Hưng Yên', 'Hà Nam', 'Nam Định', 'Thái Bình', 'Ninh Bình', 'Hải Phòng', 
        'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên-Huế', 
        'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 
        'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng', 'Bình Phước', 
        'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa–Vũng Tàu', 'TP Hồ Chí Minh', 
        'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp', 'An Giang', 
        'Kiên Giang', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau', 'Sơn La', 
        'Hòa Bình', 'Điện Biên', 'Lai Châu','Nha Trang'
    ];
    const provincesHasPlane = [
        "Hà Nội","TP Hồ Chí Minh","Đà Nẵng","Nha Trang","Phú Quốc","Thừa Thiên-Huế","Vinh","Cần Thơ","Hải Phòng","Buôn Ma Thuột"
    ];
    const center = {
        lat: 10.8231, // Ho Chi Minh City
        lng: 106.6297,
    };

    return (
        <div>
            <Row className="placeorder-page">
                {/* Left Section: Route and Vehicle Selection */}
                <Navbar2/>
                <Col span={8} className="left-section">
                    <h2 className="section-title">Location</h2>
                    <Form
                        layout="vertical"
                        className="route-form"
                        onFinish={handleSubmit}
                        form={form}
                        onValuesChange={handleValuesChange} // Theo dõi sự thay đổi của form
                    >
                        <Form.Item label="Pick-up location" name="pickUpLocation" rules={[{ required: true, message: 'Please select pick-up location' }]}>
                            <Select
                                showSearch
                                placeholder="Select pick-up location"
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
                        <Form.Item label="Drop-off location" name="dropOffLocation" rules={[{ required: true, message: 'Please select drop-off location' }]}>
                            <Select
                                showSearch
                                placeholder="Select Drop-off location"
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
                        <h2 className="section-title">Vehicle Type</h2>
                        <Form.Item
                            name="vehicleType"
                            rules={[{ required: true, message: 'Please select a vehicle type' }]}
                        >
                            <Radio.Group className="vehicle-radio-group">
                                <Radio value="road">
                                    <img src="src/images/truck.png" alt="Road" />
                                    <div>Road</div>
                                </Radio>
                                {airAvailable && ( // Kiểm tra điều kiện trước khi render
                                    <Radio value="air">
                                        <img src="src/images/plane.png" alt="Air" />
                                        <div>Air</div>
                                    </Radio>
                                )}
                            </Radio.Group>
                        </Form.Item>
                        <h2 className="section-title">Additional Services</h2>
                        <Form.Item name="additionalServices" valuePropName="checked" className="additional-services">
                            <Checkbox.Group>
                                <Checkbox value="specialCare">Special Care +100.000VND  </Checkbox>
                                <Checkbox value="insurance">Insurance +100.00VND</Checkbox>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button className="submit-btn" type="primary" htmlType="submit">
                                Continue
                            </Button>
                        </Form.Item>
                    </Form>

                </Col>

                {/* Right Section: Google Map */}
                {/* <Col span={16} className="map-section">
                    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={10}
                            center={center}
                        />
                    </LoadScript>
                </Col> */}
                {/* <Col span={16} className="map-section">
                    <img src="src/images/background.jpg" alt="Map" />
                </Col> */}
            </Row>
            <Footer/>
        </div>
    );
};

export default PlaceOrderPage;
