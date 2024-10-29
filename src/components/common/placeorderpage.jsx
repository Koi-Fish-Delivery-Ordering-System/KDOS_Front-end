import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Form, Card, Row, Col, Select, Radio, AutoComplete, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/placeorderpage.css';
import Footer from './footer';
import Navbar2 from './navbar2';
import Navbar from './navbar';
import axios from 'axios';
import DeliveryMap from './Map';

// Add this near the top of your file, with other constant declarations
const defaultPosition = [10.8231, 106.6297]; // Default coordinates for Ho Chi Minh City

function PlaceOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state || {};
    const [form] = Form.useForm(); // Thêm dòng này để sử dụng form
    const [vehicleTypes, setVehicleTypes] = useState([]); // Thêm state để lưu trữ loại xe
    const [vehicleType, setVehicleType] = useState(null); // Thêm state để lưu trữ loại xe đã chọn
    const [distance, setDistance] = useState(null); // Thêm state để lưu trữ distance
    const [provinces, setProvinces] = useState([]); // State để lưu trữ danh sách tỉnh
    const [provincesWithAirport, setProvincesWithAirport] = useState([]);
    const mapContainerStyle = {
        height: "100%", // Set the desired height
        width: "100%",   // Set the desired width
    };

    const center = {
        lat: 10.8231,    // Set the latitude for the center of the map
        lng: 106.6297,   // Set the longitude for the center of the map
    };

    const handleContinue = (values) => {
        const formData = form.getFieldsValue();
        console.log(formData.servicePricing);
        console.log(vehicleType);
        navigate('/order-confirmation', {
            state: {
                pricePerAmount: selectedService.pricePerAmount,
                pricePerKg: selectedService.pricePerKg,
                servicePricingType: formData.servicePricing,
                selectedService: selectedService.name,
                pickUpLocationName: formData.pickUpLocation,
                dropOffLocationName: formData.dropOffLocation,
                pickUpLocation: {
                    lat: pickUpLocation?.lat || 0,
                    lng: pickUpLocation?.lng || 0,
                },
                dropOffLocation: {
                    lat: dropOffLocation?.lat || 0,
                    lng: dropOffLocation?.lng || 0,
                },
                vehicleType: vehicleType,
                totalPrice: price || 0,
                distance: distance || 0,
            }
        });
    };
    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
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

    // const normalizeLocationName = (name) => {
    //     return name.toLowerCase()
    //         .replace(/thành phố|tp\.|tỉnh/g, '')
    //         .replace(/\(.*?\)/g, '') // Remove content within parentheses
    //         .replace(/,.*$/, '') // Remove everything after the first comma
    //         .replace(/\s+/g, ' ')
    //         .trim();
    // };

    // const checkAirportAvailability = (location) => {
    //     const normalizedLocation = normalizeLocationName(location);
    //     return provincesWithAirport.some(province => {
    //         const normalizedProvince = normalizeLocationName(province.name);
    //         return normalizedLocation.includes(normalizedProvince) ||
    //             normalizedProvince.includes(normalizedLocation);
    //     });
    // };
    const [pickUpProvince, setPickUpProvince] = useState('');
    const [dropOffProvince, setDropOffProvince] = useState('');
    const [fetchedServices, setFetchedServices] = useState(null);
    const [selectedService, setSelectedService] = useState(() => null);
    const [price, setPrice] = useState(null);
    const [servicePricing, setServicePricing] = useState(null);
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
                    pricePerAmount
                    pricePerKg
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
                
            } else {
                console.log('No transport services found or unexpected response structure');
                
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
            setVehicleType(selectedServiceId);
        }

    }, [fetchedServices, form]);

    const [formIsComplete, setFormIsComplete] = useState(false);

    // Add this useEffect to check form completeness
    useEffect(() => {
        const checkFormCompleteness = () => {
            const values = form.getFieldsValue();
            const isComplete = values.pickUpProvince &&
                values.pickUpLocation &&
                values.dropOffProvince &&
                values.dropOffLocation &&
                values.vehicleType &&
                price !== null &&
                values.servicePricing;
            setFormIsComplete(isComplete);
        };

        form.validateFields({ validateOnly: true }).then(checkFormCompleteness);
    }, [form, price]);

    useEffect(() => {
        if (formData) {
            form.setFieldsValue(formData); // Đặt lại giá trị form
        }
    }, [formData, form]);

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
                        onFinish={handleContinue}
                        form={form}
                        onValuesChange={() => {
                            const values = form.getFieldsValue();
                            const isComplete = values.pickUpProvince &&
                                values.pickUpLocation &&
                                values.dropOffProvince &&
                                values.dropOffLocation &&
                                values.vehicleType &&
                                price !== null &&
                                values.servicePricing;
                            setFormIsComplete(isComplete);
                        }}
                    // Theo dõi sự thay đổi của form
                    >
                        <h3>Pick-up location</h3>
                        <Row gutter={0} style={{ display: 'flex', alignItems: 'center' }}>
                            <Col>
                                <Form.Item name="pickUpProvince" style={{ marginBottom: 0, marginRight: 8 }}>
                                    <Input
                                        style={{ width: '150px' }}
                                        type="text"
                                        onChange={(e) => handleProvinceChange('pickUpProvince', e.target.value)}
                                        placeholder='Pick-up Province'
                                    />
                                </Form.Item>
                            </Col>
                            <Col flex="auto">
                                <Form.Item name="pickUpLocation" style={{ marginBottom: 0 }} rules={[{ required: true, message: 'Please select pick-up location' }]}>
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
                            </Col>
                        </Row>

                                <h3>Drop-off location</h3>
                                <Row gutter={0} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col>
                                        <Form.Item name="dropOffProvince" style={{ marginBottom: 0, marginRight: 8 }}>
                                            <Input
                                                style={{ width: '150px' }}
                                                type="text"
                                                onChange={(e) => handleProvinceChange('dropOffProvince', e.target.value)}
                                                placeholder='Drop-off Province'
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col flex="auto">
                                        <Form.Item name="dropOffLocation" style={{ marginBottom: 0 }} rules={[{ required: true, message: 'Please select drop-off location' }]}>
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
                                    </Col>
                                </Row>
                                



                        {fetchedServices && (
                            <Form.Item name="vehicleType" rules={[{ required: true, message: 'Please select a transport service' }]}>
                                <h2 className="section-title">Transport Services</h2>
                                <div className="vehicle-scroll-container" style={{ border: 'none' }}>
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

                        {/* Only show Service Pricing after a service is selected */}
                        {selectedService && (
                            <>
                                <h2 className="section-title">Service Pricing</h2>
                                <Form.Item
                                    name="servicePricing"
                                    rules={[{ required: true, message: 'Please choose a service pricing' }]}
                                >
                                    <Select
                                        placeholder="Service Pricing"
                                        style={{ width: '180px' }}
                                        onChange={(value) => {
                                            setServicePricing(value);
                                            form.setFieldsValue({ servicePricing: value });
                                        }}
                                    >
                                        <Option value="volume">Volume (Kilograms)</Option>
                                        <Option value="amount">Quantity (Fish)</Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )}

                        <Form.Item
                            name="price"
                            style={{ display: 'none' }}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                    <div style={{marginTop: '170px'}}>
                    {price !== null && distance !== null && distance > 0 && (

                            <div className="distance-display">
                            Provisional Price: {price?.toLocaleString() || '0'} VNĐ
                        </div>
                    )}
                    <Form.Item>
                        {formIsComplete && (
                    <Button
                         className="submit-btn"
                        type="primary"
                        htmlType="submit"
                        onClick={handleContinue}                                
                    >
                            Continue
                    </Button>
                    )}
                </Form.Item>
                    </div>
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
