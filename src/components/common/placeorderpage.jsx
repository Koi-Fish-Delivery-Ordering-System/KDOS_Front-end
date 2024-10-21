import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Card, Row, Col, Select, Radio, AutoComplete } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { LoadScript, GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import '../../css/placeorderpage.css';
import Footer from './footer';
import Navbar2 from './navbar2';
import axios from 'axios'; // Thêm import axios
import DeliveryMap from './Map';

// Add this near the top of your file, with other constant declarations
const defaultPosition = [10.8231, 106.6297]; // Default coordinates for Ho Chi Minh City

function PlaceOrderPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Thêm dòng này để sử dụng form
    const [vehicleTypes, setVehicleTypes] = useState([]); // Thêm state để lưu trữ loại xe
    const [vehicleType, setVehicleType] = useState(null); // Thêm state để lưu trữ loại xe đã chọn
    const [distance, setDistance] = useState(null); // Thêm state để lưu trữ distance
    const [provinces, setProvinces] = useState([]); // State để lưu trữ danh sách tỉnh
    const [provincesWithAirport, setProvincesWithAirport] = useState([]);
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
        const fetchProvincesWithAirport = async () => {
            try {
                const response = await axios.get('https://670e78b03e7151861654ae2d.mockapi.io/provinceHasPlane');
                setProvincesWithAirport(response.data);
            } catch (error) {
                console.error('Error fetching provinces with airport:', error);
            }
        };
        fetchProvincesWithAirport();
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
            const price = Math.round(distance * vehicleType.pricePerKm); // Calculate price
            form.setFieldsValue({ price: price }); // Set the hidden price
        }
    }, [distance, vehicleType]); // Dependencies: distance and vehicleType

    const [pickUpLocation, setPickUpLocation] = useState(null);
    const [dropOffLocation, setDropOffLocation] = useState(null);
    const [pickUpSuggestions, setPickUpSuggestions] = useState([]);
    const [dropOffSuggestions, setDropOffSuggestions] = useState([]);

    const handlePickUpSearch = async (value) => {
        if (!value) {
            setPickUpSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(`https://us1.locationiq.com/v1/autocomplete.php?key=pk.9a971e44ed5d6f06d7c3ffef3501b8ce&q=${encodeURIComponent(value)}&countrycodes=VN&format=json`);
            setPickUpSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching pick-up suggestions:', error);
        }
    };

    const handleDropOffSearch = async (value) => {
        if (!value) {
            setDropOffSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(`https://us1.locationiq.com/v1/autocomplete.php?key=pk.9a971e44ed5d6f06d7c3ffef3501b8ce&q=${encodeURIComponent(value)}&countrycodes=VN&format=json`);
            setDropOffSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching drop-off suggestions:', error);
        }
    };

    const handlePickUpSelect = (value, option) => {
        setPickUpLocation({
            lat: parseFloat(option.lat),
            lng: parseFloat(option.lon),
        });
        setPickUpSuggestions([]);
    };

    const handleDropOffSelect = (value, option) => {
        const lat = parseFloat(option.lat);
        const lng = parseFloat(option.lon);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            setDropOffLocation({
                lat: lat,
                lng: lng,
            });
        } else {
            console.error('Invalid coordinates:', option);
            // Có thể thêm xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng
        }
        setDropOffSuggestions([]);
    };

    const normalizeLocationName = (name) => {
        return name.toLowerCase()
            .replace(/thành phố|tp\.|tỉnh/g, '')
            .replace(/\(.*?\)/g, '') // Remove content within parentheses
            .replace(/,.*$/, '') // Remove everything after the first comma
            .replace(/\s+/g, ' ')
            .trim();
    };

    const checkAirportAvailability = (location) => {
        const normalizedLocation = normalizeLocationName(location);
        return provincesWithAirport.some(province => {
            const normalizedProvince = normalizeLocationName(province.name);
            return normalizedLocation.includes(normalizedProvince) ||
                   normalizedProvince.includes(normalizedLocation);
        });
    };

    const [showVehicleTypes, setShowVehicleTypes] = useState(false);

    useEffect(() => {
        const pickUpLocation = form.getFieldValue('pickUpLocation');
        const dropOffLocation = form.getFieldValue('dropOffLocation');

        setShowVehicleTypes(!!pickUpLocation && !!dropOffLocation);

        // Existing logic for isAirVisible
        if (pickUpLocation && dropOffLocation) {
            const pickUpHasAirport = checkAirportAvailability(pickUpLocation);
            const dropOffHasAirport = checkAirportAvailability(dropOffLocation);

            console.log('Pick-up location:', pickUpLocation, 'Has airport:', pickUpHasAirport);
            console.log('Drop-off location:', dropOffLocation, 'Has airport:', dropOffHasAirport);

            setIsAirVisible(pickUpHasAirport && dropOffHasAirport && pickUpLocation !== dropOffLocation);
        } else {
            setIsAirVisible(false);
        }
    }, [form.getFieldValue('pickUpLocation'), form.getFieldValue('dropOffLocation'), provincesWithAirport]);

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
                        // Theo dõi sự thay đổi của form
                    >
                        <Form.Item label="Pick-up location" name="pickUpLocation" rules={[{ required: true, message: 'Please select pick-up location' }]}>
                            <AutoComplete
                                options={pickUpSuggestions.map(suggestion => ({
                                    value: suggestion.display_name,
                                    lat: suggestion.lat,
                                    lon: suggestion.lon,
                                }))}
                                onSearch={handlePickUpSearch}
                                onSelect={handlePickUpSelect}
                                placeholder="Select pick-up location"
                            />
                        </Form.Item>
                        <Form.Item label="Drop-off location" name="dropOffLocation" rules={[{ required: true, message: 'Please select drop-off location' }]}>
                            <AutoComplete
                                options={dropOffSuggestions.map(suggestion => ({
                                    value: suggestion.display_name,
                                    lat: suggestion.lat,
                                    lon: suggestion.lon,
                                }))}
                                onSearch={handleDropOffSearch}
                                onSelect={handleDropOffSelect}
                                placeholder="Select Drop-off location"
                            />
                        </Form.Item>
                        <h2 className="section-title">Transport Services</h2>
                        {showVehicleTypes && (
                            <>                               
                                <Form.Item
                                    name="vehicleType"
                                    rules={[{ required: true, message: 'Please select a vehicle type' }]}
                                >
                                    <div className="vehicle-scroll-container" style={{ border: 'none' }}>
                                        <Radio.Group className="vehicle-radio-group" onChange={handleVehicleChange}>
                                            {vehicleTypes.map((type) => {
                                                if (type.transportName === "Air" && !isAirVisible) {
                                                    return null; // Không hiển thị "Air"
                                                }
                                                return (
                                                    <Radio key={type.id} value={type.transportName}>
                                                        <img src={type.image} />
                                                        <div>{type.transportName}</div>
                                                    </Radio>
                                                );
                                            })}
                                        </Radio.Group>
                                    </div>
                                </Form.Item>
                            </>
                        )}
                        <Form.Item
                            name="price"
                            style={{ display: 'none' }}
                        >
                            <Input />
                        </Form.Item>
                       
                        {distance !== null && distance > 0 && vehicleType && ( 
                            <div className="distance-display">
                                Provisional Price: {Math.round(distance * vehicleType.pricePerKm).toLocaleString()} VNĐ
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
                <Col span={16}>
                <DeliveryMap 
                   suggestion={{
                       form: pickUpLocation ? [pickUpLocation.lat, pickUpLocation.lng] : defaultPosition,
                       to: dropOffLocation ? [dropOffLocation.lat, dropOffLocation.lng] : defaultPosition
                   }}
                   autoSetDistance={setDistance}
                />
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
