import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Select, Table, message } from 'antd';
import '../../../css/deliverypage.css';
import axios from "axios";

function DeliveryPage({ onDetailClick }) {
    const [loading, setLoading] = useState(false);
    const [routes, setRoutes] = useState([]);
    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const query = `
            query FindManyAssignedRoutes {
  findManyAssignedRoutes {
    routeId
    status
    deliveryStartDate
    updatedAt
    notes
  }
}
        `;
            console.log(sessionStorage.getItem('accessToken'));
            const routesResponse = await axios.post('http://26.61.210.173:3001/graphql', {
                query,
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (routesResponse.data?.data?.findManyAssignedRoutes) {
                setRoutes(routesResponse.data.data.findManyAssignedRoutes);
            } else {
                console.error("Invalid response structure:", routesResponse.data);

            }
        } catch (err) {
            console.error("Error fetching routes:", err);

        } finally {
            setLoading(false);
        }
    };
    const handlePickup = async (routeId) => {
        try {
            await axios.patch(`http://26.61.210.173:3001/api/transport/pick-up-delivery-route`, {
                routeId: routeId
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                }
            })
            message.success('Pickup successful');
        } catch (err) {
            console.error("Error picking up order:", err);
            message.error('Pickup failed');
        }
    }
    useEffect(() => {
        fetchRoutes();

        console.log(routes);
    }, []);
    // if (loading) return <div className="loading-message">Loading...</div>;
    // if (routes.length === 0) return <div className="no-order-message">No routes found</div>;

    const columns = [
        {
            title: 'No',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Route ID',
            dataIndex: 'routeId',
            key: 'routeId',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryStartDate',
            key: 'deliveryStartDate',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    className="detail-delivery-btn"
                    onClick={() => handlePickup(record.routeId)}
                >
                    Pickup
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1 className='section-title'>Delivery Route</h1>
            <Table
                columns={columns}
                dataSource={routes}
                rowKey="routeId"
                loading={loading}
            />
        </div>
    );
}

export default DeliveryPage;
