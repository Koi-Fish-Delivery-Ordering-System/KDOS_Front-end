import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Select, message } from 'antd';
import '../../../css/deliverypage.css';
import axios from "axios";

function DeliveryPage({ onDetailClick }) {
    const [loading, setLoading] = useState(false);
    const [routes, setRoutes] = useState([]);
    const fetchRoutes = async () => {
        
        try {
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
            // setLoading(true);
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
            // setLoading(false);
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

    return (
        <div>
            <table className="delivery-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Route ID</th>
                        <th>Status</th>
                        <th>Delivery Date</th>
                        <th>Last Updated</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route, index) => (
                        <tr key={route.routeId}>
                            <td>{index + 1}</td>
                            <td>{route.routeId}</td>
                            <td>{route.status}</td>
                            <td>{new Date(route.deliveryStartDate).toLocaleString()}</td>
                            <td>{new Date(route.updatedAt).toLocaleString()}</td>
                            <td>
                                {/* <button 
                                    onClick={() => onDetailClick(route.routeId)} 
                                    className="detail-delivery-btn"
                                >
                                    Detail
                                </button> */}
                                <button className="detail-delivery-btn" onClick={() => handlePickup(route.routeId)}>Pickup</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeliveryPage;
