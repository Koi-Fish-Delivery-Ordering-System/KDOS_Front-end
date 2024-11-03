import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Select } from 'antd';
import '../../../css/deliverypage.css';
import axios from "axios";

function DeliveryProcess() {
    const [route, setRoute] = useState(null);
    const fetchRoute = async () => {
        try {
            const query = `
            query FindOneDeliveringRoute {
                findOneDeliveringRoute {
                    routeId    
                    driver {
                            account {
                            username
                        }
                    }
                    status    
                    updatedAt
                    notes
                    routeStops {
                        routeStopId
                        address
                        status
                        stopType
                        orderId
                        order {
                            transportService {
                                type
                            }
                        }
                    }
                }
            }

            `;
            const routeResponse = await axios.post('http://26.61.210.173:3001/graphql', {
                query
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });
            setRoute(routeResponse.data.data.findOneDeliveringRoute);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeStatus = async (stop, routeStopId) => {
        try {
            console.log(routeStopId);
            console.log(stop.status);
            const status = stop.status === 'pending' ? 'delivering' : 'completed';
            console.log(status);
            await axios.patch(`http://26.61.210.173:3001/api/transport/update-route-stop-status`, {
                routeStopId: routeStopId,
                status: status
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                }
            });
            fetchRoute();
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        fetchRoute();
    }, []);

    return (
        <div className="delivery-process">
            <h1 className="section-title">Process Route</h1>

            <div className="delivery-process__section">
                <h2 className="section-title">Route Information</h2>
                <div className="info-item">
                    <span className="info-label"><strong>Route ID:</strong></span>
                    <span className="info-value">{route?.routeId}</span>
                </div>
                <div className="info-item">
                    <span className="info-label"><strong>Driver:</strong></span>
                    <span className="info-value">{route?.driver?.account?.username}</span>
                </div>
                <div className="info-item">
                    <span className="info-label"><strong>Status:</strong></span>
                    <span className={`status-route ${route?.status.toLowerCase()}`}>{route?.status}</span>
                </div>

            </div>

            <div className="delivery-process__section">
                <h2 className="section-title">Time Line</h2>
                <div className="delivery-process__info">
                    <div className="info-item">
                        <span className="info-label"><strong>Last Updated: </strong></span>
                        <span className="info-value">{new Date(route?.updatedAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="delivery-process__section">
                <h2 className="section-title">Route Stops</h2>
                <div className="route-stops">
                    {Object.entries((route?.routeStops || []).reduce((groups, stop) => {
                        if (!groups[stop.orderId]) {
                            groups[stop.orderId] = [];
                        }
                        groups[stop.orderId].push(stop);
                        return groups;
                    }, {})).map(([orderId, orderStops]) => (
                        <div key={orderId} className="order-group">
                            <h3  className="info-label" style={{fontSize:'16px'}}>Order ID: {orderId}</h3>
                            <span>Transport type: {route?.routeStops.find(stop => stop.orderId === orderId).order.transportService.type}</span>
                            <div className="stops-container">
                                {orderStops
                                    .sort((a, b) => {
                                        // Sắp xếp để "pickup" lên đầu
                                        if (a.stopType === "pickup") return -1;
                                        if (b.stopType === "pickup") return 1;
                                        return 0;
                                    })
                                    .map((stop, index) => (
                                        <div key={index} className="route-stop-item">
                                            <span className="route-stop-marker"></span>
                                            <p>{stop.address}</p>
                                            
                                            <span>Stops type: {stop.stopType}</span>
                                            <span className={`status-route ${stop.status.toLowerCase()}`}>
                                                {stop.status}
                                            </span>
                                            {stop.status === "pending" && (
                                                <Button  className="delivery-button" type="primary" onClick={() => handleChangeStatus(stop, stop.routeStopId)}>Deliver</Button>
                                            )}
                                            {stop.status === "delivering" && (
                                                <Button  className="delivery-button" type="primary" onClick={() => handleChangeStatus(stop, stop.routeStopId)} >Completed</Button>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default DeliveryProcess;
