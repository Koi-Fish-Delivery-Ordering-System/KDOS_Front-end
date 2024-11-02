import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Select } from 'antd';
import '../../../css/deliverypage.css';
import axios from "axios";

function DeliveryProcess() {

    return (
        <div className="delivery-process">
            <h1 className="section-title">Process Route</h1>
            
            <div className="delivery-process__section">
                <h2 className="section-title">Route Information</h2>
                <div className="delivery-process__info">
                    <p className="delivery-process__info-item"><strong>Route ID: </strong> </p>
                    <p className="delivery-process__info-item"><strong>Driver Name: </strong> </p>
                    <p className="delivery-process__info-item"><strong>Driver current location: </strong> </p>
                    <p className="delivery-process__info-item"><strong>Number of stops: </strong> </p>
                </div>
            </div>
            
            <div className="delivery-process__section">
                <h2 className="section-title">Time Line</h2>
                <div className="delivery-process__info">
                    <p className="delivery-process__info-item"><strong>Delivery Date: </strong> </p>
                    <p className="delivery-process__info-item"><strong>Last Updated: </strong> </p>
                </div>
            </div>
            
            <div className="delivery-process__section">
                <h2 className="section-title">Route Stops</h2>
                
            </div>
        </div>
    );
}
export default DeliveryProcess;
