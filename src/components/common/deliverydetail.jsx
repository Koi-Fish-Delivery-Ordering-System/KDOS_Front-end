import React, { useState, useEffect } from 'react';
import Navbar2 from './navbar2';
import Footer from './footer';
import '../../css/deliverydetail.css';
import { Row, Col, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from '../../config/axios';

const DeliveryDetail = ({ orderId, onBack }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://6703b45dab8a8f8927314be8.mockapi.io/orderEx/Order/${orderId}`);
            setOrder(response.data);
        } catch (err) {
            console.error("Error fetching order:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus) => {
        try {
            setLoading(true);
            const response = await axios.put(`https://6703b45dab8a8f8927314be8.mockapi.io/orderEx/Order/${orderId}`, {
                status: newStatus
            });
            setOrder(response.data);
            setStatus(newStatus);
        } catch (err) {
            console.error("Error updating order status:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-message">Loading...</div>;
    if (!order) return <div className="no-order-message">No order found</div>;

    return (
        <Col span={24}>
            <Row>
                <Col span={24}>
                    <Button onClick={onBack} className="back-btn">
                        <ArrowLeftOutlined /> Back
                    </Button>
                </Col>
            </Row>
            <h1 className="section-title">Delivery Detail</h1>
            <Row className="delivery-info">
                <Col span={24}>
                    <h2>Order ID: {order.id}</h2>
                </Col>
            </Row>
            <Row className="delivery-info">
                <Col span={24}>
                    <h2>Sender Information</h2>
                    <p>Name: {order.senderName}</p>
                    <p>Phone: {order.senderPhone}</p>
                    <p>Address: {order.pickUpAddr}</p>
                </Col>
            </Row>
            <Row className="delivery-info">
                <Col span={24}>
                    <h2>Receiver Information</h2>
                    <p>Name: {order.receiverName}</p>
                    <p>Phone: {order.receiverPhone}</p>
                    <p>Address: {order.dropOffAddr}</p>
                </Col>
            </Row>
            <Row className="delivery-info">
                <Col span={24}>
                    <h2>Fish List</h2>
                    {order.fishList.map((element, index) => (
                        <p key={index}>{element}</p>
                    ))}
                </Col>
            </Row>
            <Row className="delivery-info">
                <Col span={24}>
                    <h2>Status: {order.status}</h2>
                    <Button type="primary" className="status-btn" onClick={() => updateOrderStatus('Pickup')}>
                         Pickup
                    </Button>
                </Col>
            </Row>
        </Col>
    );
};

export default DeliveryDetail;
