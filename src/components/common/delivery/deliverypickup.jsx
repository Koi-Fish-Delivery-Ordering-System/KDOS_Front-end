import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Select } from 'antd';
import '../../../css/deliverypage.css';
import axios from "../../../config/axios";

function DeliveryPage({ onDetailClick }) {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTransportsAndOrders();
    }, []);

    const fetchTransportsAndOrders = async () => {
        try {
            setLoading(true);
            // Fetch all transports
            const transportResponse = await axios.get('https://6703b45dab8a8f8927314be8.mockapi.io/orderEx/Transport');
            const transportsData = transportResponse.data;

            // Fetch all orders
            const orderResponse = await axios.get('https://6703b45dab8a8f8927314be8.mockapi.io/orderEx/Order');
            const ordersData = orderResponse.data;

            // Create a map of orders for quick lookup
            const orderMap = new Map(ordersData.map(order => [order.id, order]));

            // Combine transport data with corresponding order data
            const combinedData = transportsData.map(transport => {
                const order = orderMap.get(transport.OrderId);
                return {
                    ...transport,
                    pickUpLocation: order ? order.pickUpLocation : 'N/A',
                    dropOffLocation: order ? order.dropOffLocation : 'N/A',
                };
            });

            setTransports(combinedData);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-message">Loading...</div>;
    if (transports.length === 0) return <div className="no-order-message">No transports found</div>;

    return (
        <div>
            <table className="delivery-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Transport ID</th>
                        <th>Pickup Location</th>
                        <th>Dropoff Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transports.map((transport, index) => (
                        <tr key={transport.id}>
                            <td>{index + 1}</td>
                            <td>{transport.id}</td>
                            <td>{transport.pickUpLocation}</td>
                            <td>{transport.dropOffLocation}</td>
                            <td>
                                <button 
                                    onClick={() => onDetailClick(transport.id)} 
                                    className="detail-delivery-btn"
                                >
                                    Detail
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeliveryPage;
