import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Card, Row, Col, Select, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { LoadScript, GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import '../../css/placeorderpage.css';
import Footer from './footer';
import Navbar2 from './navbar2';
import axios from 'axios'; // Thêm import axios

function PlaceOrderPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Thêm dòng này để sử dụng form
    const [vehicleTypes, setVehicleTypes] = useState([]); // Thêm state để lưu trữ loại xe
    const [vehicleType, setVehicleType] = useState(null); // Thêm state để lưu trữ loại xe đã chọn
    const [distance, setDistance] = useState(null); // Thêm state để lưu trữ distance
    const [provinces, setProvinces] = useState([]); // State để lưu trữ danh sách tỉnh
    const [isAirVisible, setIsAirVisible] = useState(false); // State để kiểm soát hiển thị "Air"
    const mapContainerStyle = {
        height: "100%", // Set the desired height
        width: "100%",   // Set the desired width
    };
    
    const center = {
        lat: 10.8231,    // Set the latitude for the center of the map
        lng: 106.6297,   // Set the longitude for the center of the map
    };
    const handleSubmit = async (info) => {
    
        
        console.log(info); // Kiểm tra dữ liệu gửi đi

        // Tiến hành gửi dữ liệu đến server hoặc xử lý tiếp
        // ...
    };
    
    const handleValuesChange = async () => {
        const pickUpLocation = form.getFieldValue('pickUpLocation');
        const dropOffLocation = form.getFieldValue('dropOffLocation');

        // Kiểm tra nếu cả hai địa điểm đều đã được chọn
        if (pickUpLocation && dropOffLocation) {
            try {
                const response = await axios.get('https://6703b45dab8a8f8927314be8.mockapi.io/orderEx/Provinces'); // Thay thế 'YourCorrectEndpoint' bằng endpoint chính xác
                const distances = response.data;

                const matchedDistance = distances.find(distance => 
                    distance.pickUp.toLowerCase() === pickUpLocation.toLowerCase() && 
                    distance.Dropoff.toLowerCase() === dropOffLocation.toLowerCase()
                );

                if (matchedDistance) {
                    setDistance(matchedDistance.distance); // Cập nhật distance
                } else {
                    setDistance(null); // Không tìm thấy distance
                }
                console.log(distance);
            } catch (error) {
                console.error('Error fetching distances:', error);
            }

            // Cập nhật trạng thái hiển thị "Air"
            setIsAirVisible(isAirAvailable());
        } else {
            setDistance(null); // Reset distance if no location
            setIsAirVisible(false); // Hide "Air" if no location
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
        }
        const fetchVehicleTypes = async () => {
            try {
                const response = await axios.get('https://670e78b03e7151861654ae2d.mockapi.io/transport'); // Thay thế 'API_URL_HERE' bằng URL của API
                setVehicleTypes(response.data); // Lưu trữ dữ liệu loại xe vào state
            } catch (error) {
                console.error('Error fetching vehicle types:', error);
            }
        };
        fetchVehicleTypes(); // Gọi hàm fetchVehicleTypes
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://670e78b03e7151861654ae2d.mockapi.io/Province'); // Thay thế bằng URL API của bạn
                setProvinces(response.data); // Lưu trữ danh sách tỉnh vào state
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, [form], [navigate]);

    
    const handleVehicleChange = (e) => {
        const selectedType = vehicleTypes.find(type => type.transportName === e.target.value); // Lấy đối tượng loại xe đã chọn
        setVehicleType(selectedType); // Cập nhật loại xe đã chọn
    };

    const isAirAvailable = () => {
        const pickUpLocation = form.getFieldValue('pickUpLocation');
        const dropOffLocation = form.getFieldValue('dropOffLocation');

        const pickUp = provinces.find(province => province.provinceName === pickUpLocation);
        const dropOff = provinces.find(province => province.provinceName === dropOffLocation);

        // Kiểm tra xem cả hai địa điểm có isPlane = true và không trùng nhau
        return pickUp?.isPlane && dropOff?.isPlane && pickUpLocation !== dropOffLocation;
    };

    useEffect(() => {
        // Update the hidden price whenever distance or vehicleType changes
        if (vehicleType && distance !== null) {
            const price = distance * vehicleType.pricePerKm; // Calculate price
            form.setFieldsValue({ price: price }); // Set the hidden price
        }
    }, [distance, vehicleType]); // Dependencies: distance and vehicleType

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
                                allowClear
                                showSearch
                                placeholder="Select pick-up location"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {provinces.map((province) => (
                                    <Select.Option key={province.id} value={province.provinceName}>
                                        {province.provinceName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Drop-off location" name="dropOffLocation" rules={[{ required: true, message: 'Please select drop-off location' }]}>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select Drop-off location"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {provinces.map((province) => (
                                    <Select.Option key={province.id} value={province.provinceName}>
                                        {province.provinceName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <h2 className="section-title">Transport Services</h2>
                        <Form.Item
                            name="vehicleType"
                            rules={[{ required: true, message: 'Please select a vehicle type' }]}
                        >
                            <div className="vehicle-scroll-container"> {/* Thêm container cho thanh trượt */}
                                <Radio.Group className="vehicle-radio-group" onChange={handleVehicleChange}>
                                    {vehicleTypes.map((type) => {
                                        // Chỉ hiển thị "Air" nếu cả hai địa điểm đều có isPlane = true
                                        if (type.transportName === "Air" && !isAirVisible) {
                                            return null; // Không hiển thị "Air"
                                        }
                                        return (
                                            <Radio key={type.id} value={type.transportName}>
                                                <img src={type.image}  />
                                                <div>{type.transportName}</div>
                                               
                                            </Radio>
                                        );
                                    })}
                                </Radio.Group>
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="price" // Name of the hidden field
                            style={{ display: 'none' }} // Hide the item
                        >
                            <Input /> {/* Hidden input for price, no need to set value here */}
                        </Form.Item>
                        {/* <h2 className="section-title">Additional Services</h2>
                        <Form.Item name="additionalServices" valuePropName="checked" className="additional-services">
                            <Checkbox.Group>
                                <Checkbox value="specialCare">Special Care +100.000VND  </Checkbox>
                                <Checkbox value="insurance">Insurance +100.00VND</Checkbox>
                            </Checkbox.Group>
                        </Form.Item> */}
                        {distance !== null && vehicleType && ( 
                            <div className="distance-display">
                                Provisional Price: {distance*vehicleType.pricePerKm} VNĐ
                            </div>
                        )}
                        <Form.Item>
                            {form.getFieldValue('pickUpLocation') && form.getFieldValue('dropOffLocation') && vehicleType && (
                                <Button 
                                    className="submit-btn" 
                                    type="primary" 
                                    htmlType="submit"
                                >
                                    Continue
                                </Button>
                            )}
                        </Form.Item>
                        
                    </Form>

                </Col>

                {/* Right Section: Google Map */}
                 {/* <Col span={16} className="map-section">
                    <LoadScriptNext googleMapsApiKey="AIzaSyDJO2B-_FLwk1R1pje5gKEAB9h2qUDb-FU">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={10}
                            center={center}
                        />
                    </LoadScriptNext>
                </Col>  */}
                 
            </Row>
            <Footer/>
        </div>
    );
};

export default PlaceOrderPage;
