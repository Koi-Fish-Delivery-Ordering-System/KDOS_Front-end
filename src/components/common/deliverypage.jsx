import React, { useState, useEffect } from "react";
import Navbar2 from "./navbar2";
import Footer from "./footer";
import { Row, Col, Card, Button, Select } from 'antd';
import '../../css/deliverypage.css';    
import axios from "../../config/axios";

function DeliveryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState(''); // State for filter input
    const itemsPerPage = 4; // Maximum number of cards per page
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
        'Hòa Bình', 'Điện Biên', 'Lai Châu','Nha Trang',
    ];
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://6703b45dab8a8f8927314be8.mockapi.io/orderEx/Order');
            setOrders(response.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter orders based on pickUpLocation
    const filteredOrders = orders.filter(order => 
        order.pickUpLocation.toLowerCase().includes((filter || '').toLowerCase())
    );

    // Calculate the orders to display on the current page
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredOrders.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    if (loading) return <div>Loading...</div>;
    if (!orders) return <div>No order found</div>;
    return (
        <div>
            <Row className="delivery-page">
                <Navbar2 />
                <Col span={12} className="main-section">
                    <h1 className="section-title">Delivery Page</h1>
                    <Select
                        allowClear
                        showSearch
                        placeholder="Select Pickup Location"
                        value={filter || undefined} // Set to undefined if filter is empty
                        onChange={(value) => setFilter(value)}
                        className="filter-input"
                        
                    >
                        {provinces.map((province) => (
                            <Select.Option key={province} value={province}>
                                {province}
                            </Select.Option>
                        ))}
                    </Select>
                    <div className="delivery-info-list">
                        {currentOrders.map((order) => (
                            <Card
                                key={order.id}
                                className="delivery-card"
                                title={order.id}
                                extra={<a href={`/deliverydetail/${order.id}`} className="detail-delivery-btn">Detail</a>}
                            >
                                <Row>
                                    <Col span={7}>
                                        <div className="delivery-location">
                                            <p style={{ fontWeight: 'bold' }}>{order.pickUpLocation}</p>
                                            <p>{order.pickUpAddr}</p>
                                        </div>
                                    </Col>
                                    <Col span={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ textAlign: 'center' }}><i className="fa fa-arrow-right" aria-hidden="true"></i></div>
                                    </Col>
                                    <Col span={7}>
                                        <div className="delivery-location">
                                            <p style={{ fontWeight: 'bold' }}>{order.dropOffLocation}</p>
                                            <p>{order.dropOffAddr}</p>
                                        </div>
                                    </Col>
                                    <Col span={8} className="total-cost-and-status">
                                        <div style={{ fontWeight: 'bold' }}>Status: {order.status}</div>
                                        <div style={{ fontWeight: 'bold', color: 'red' }}>Total Cost: {order.cost} VND</div>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                    <div className="pagination-controls">
                        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                        <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}>Next</Button>
                    </div>
                </Col>
            </Row>
            <Footer />
        </div>
    );
}

export default DeliveryPage;