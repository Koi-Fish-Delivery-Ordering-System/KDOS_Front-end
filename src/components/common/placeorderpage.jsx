import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Form, Card, Row, Col, Select, Radio, AutoComplete, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../css/placeorderpage.css';
import Footer from './footer';
import Navbar2 from './navbar2';
import axios from 'axios';
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

    const handleContinue = async () => {
        try {
            // Get the form values
            const formData = form.getFieldsValue();

            console.log(formData); // Check the data being sent

            // Proceed to the sender info page
            navigate('/order-confirmation', {
                state: {
                    pickUpLocation: {
                        lat: pickUpLocation.lat,
                        lng: pickUpLocation.lng,
                    },
                    dropOffLocation: {
                        lat: dropOffLocation.lat,
                        lng: dropOffLocation.lng,
                    },
                    vehicleType: vehicleType
                }
            });
        } catch (error) {
            console.error('Error during submission:', error);



        }
    };
    const handleSubmit = async (values) => {
        try {
            // Prepare the data to be sent
            const orderData = {
                fromAddress: values.pickUpLocation,
                toAddress: values.dropOffLocation,
                transportServiceId: values.vehicleType,
                totalPrice: values.price,
            };
            console.log(orderData);

            // Get the token from localStorage
            const token = localStorage.getItem("token");

            // Send the data to the API with the token in the headers
            const response = await axios.post('http://26.61.210.173:3001/api/orders/create-order', orderData, {
                headers: {
                    // 'Authorization': `Bearer ${token}`
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiIxODIzN2FmOC1hYzY5LTQzNWUtOGJmZS05OGVhYjczODEyMzYiLCJhY2NvdW50Um9sZXMiOltdLCJ0eXBlIjoiQWNjZXNzIiwiaWF0IjoxNzI5NzAxNDg3fQ.blWkdUp14-vy22oZ5h-FPIcO0fogTkVyY0QjGTKteB8`
                }
            });

            // Check if the request was successful
            if (response.status === 200 || response.status === 201) {
                message.success('Order placed successfully!');
            } else {
                message.error('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            message.error('An error occurred while placing the order. Please try again.');
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



   

    
    // const handleVehicleChange = (e) => {
    //     const selectedType = vehicleTypes.find(type => type.transportName === e.target.value); // Lấy đối tượng loại xe đã chọn
    //     setVehicleType(selectedType); // Cập nhật loại xe đã chọn
    // };


    // const isAirAvailable = () => {
    //     const pickUpLocation = form.getFieldValue('pickUpLocation');
    //     const dropOffLocation = form.getFieldValue('dropOffLocation');

    //     const pickUp = provinces.find(province => province.provinceName === pickUpLocation);
    //     const dropOff = provinces.find(province => province.provinceName === dropOffLocation);

    //     // Kiểm tra xem cả hai địa điểm có isPlane = true và không trùng nhau
    //     return pickUp?.isPlane && dropOff?.isPlane && pickUpLocation !== dropOffLocation;
    // };

    useEffect(() => {
        if (selectedService && distance !== null) {
            const price = Math.round(distance * selectedService.pricePerKm); // Calculate price
            form.setFieldsValue({ price: price }); // Set the hidden price
        }
    }, [vehicleType, distance, form]); // Thêm selectedService vào dependencies

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
    const [pickUpProvince, setPickUpProvince] = useState('');
    const [dropOffProvince, setDropOffProvince] = useState('');
    const [fetchedServices, setFetchedServices] = useState(null);
    const [selectedService, setSelectedService] = useState(() => null);
    const [price, setPrice] = useState(null);

    const calculatePrice = useCallback(() => {
        if (selectedService && distance !== null) {
            const calculatedPrice = Math.round(distance * selectedService.pricePerKm);
            setPrice(calculatedPrice);
            form.setFieldsValue({ price: calculatedPrice });
        }
    }, [selectedService, distance, form]);

    useEffect(() => {
        calculatePrice();
    }, [calculatePrice]);

    const fetchTransportServices = async () => {
        if (!pickUpProvince || !dropOffProvince) return;

        const query = `
            query FindManySuitableTransportService($data: FindManySuitableTransportServiceInputData!) {
                findManySuitableTransportService(data: $data) {
                    name
                    transportServiceId
                    pricePerKm
                }
            }
        `;

        const variables = {
            data: {
                fromProvince: pickUpProvince,
                toProvince: dropOffProvince
            }
        };

        try {
            const response = await axios.post('http://26.61.210.173:3001/graphql', {
                query,
                variables
            });

            if (response.data && response.data.data && response.data.data.findManySuitableTransportService) {
                const services = response.data.data.findManySuitableTransportService;
                setVehicleTypes(services);
                setFetchedServices(services);
                console.log('Fetched transport services:', services);
                message.success(`Found ${services.length} suitable transport services`);
            } else {
                console.log('No transport services found or unexpected response structure');
                message.info('No suitable transport services found for the selected provinces');
                setFetchedServices(null);
            }
        } catch (error) {
            console.error('Error fetching transport services:', error);
            message.error('Failed to fetch transport services. Please try again.');
            setFetchedServices(null);
        }
    };

    useEffect(() => {
        if (pickUpProvince && dropOffProvince) {
            fetchTransportServices();
        }
    }, [pickUpProvince, dropOffProvince]);

    const handleProvinceChange = (field, value) => {
        if (field === 'pickUpProvince') {
            setPickUpProvince(value);
            form.setFieldsValue({ pickUpProvince: value });
        } else {
            setDropOffProvince(value);
            form.setFieldsValue({ dropOffProvince: value });
        }
    };

    const handleServiceSelect = useCallback((e) => {
        const selectedServiceId = e.target.value;
        const service = fetchedServices.find(s => s.transportServiceId === selectedServiceId);
        if (service) {
            setSelectedService(service);
            form.setFieldsValue({ vehicleType: selectedServiceId });
        }
    }, [fetchedServices, form]);

    return (
        <div>
            <Row className="placeorder-page">
                {/* Left Section: Route and Vehicle Selection */}
                <Navbar2 />
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
                        <Form.Item label="Pick-up Province" name="pickUpProvince">
                            <Input type="text" onChange={(e) => handleProvinceChange('pickUpProvince', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Drop-off Province" name="dropOffProvince">
                            <Input type="text" onChange={(e) => handleProvinceChange('dropOffProvince', e.target.value)} />
                        </Form.Item>
                        <h2 className="section-title">Transport Services</h2>

                       

                        {fetchedServices && (
                            <Form.Item name="vehicleType" rules={[{ required: true, message: 'Please select a transport service' }]}>
                                <div className="vehicle-scroll-container" style={{border: 'none'}}>
                                    <Radio.Group className="vehicle-radio-group" onChange={handleServiceSelect}>
                                        {fetchedServices.map(service => (
                                            <Radio key={service.transportServiceId} value={service.transportServiceId}>
                                            {service.name === "Road" && <img src='src/images/truck.png' alt="Road" />}
                                            {service.name === "Air" && <img src='src/images/plane.png' alt="Air" />}
                                            <div>{service.name}</div>
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        )}
                        <Form.Item
                            name="price"
                            style={{ display: 'none' }}
                        >
                            <Input />
                        </Form.Item>


                       

                       
                        {price !== null && (

                            <div className="distance-display">
                                Provisional Price: {price.toLocaleString()} VNĐ
                            </div>
                        )}
                        <Form.Item>

                       

                            <Button 
                                className="submit-btn" 
                                type="primary" 
                                htmlType="submit"
                                onClick={handleSubmit}
                                disabled={!selectedService}
                            >
                                Continue
                            </Button>
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
            <Footer />
        </div>
    );
};

export default PlaceOrderPage;
