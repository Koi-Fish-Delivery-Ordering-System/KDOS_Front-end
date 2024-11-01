import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Select } from 'antd';
import '../../../css/deliverypage.css';
import axios from "axios";

function DeliveryProcess() {

    return (
        <div className="delivery-process">
            <h1 className="delivery-process__title">Process Route</h1>
            
            <div className="delivery-process__section">
                <h2 className="delivery-process__section-title">Route Information</h2>
                <div className="delivery-process__info">
                    <p className="delivery-process__info-item"><strong>Route ID: </strong> </p>
                    <p className="delivery-process__info-item"><strong>Driver Name: </strong> </p>
                    <p className="delivery-process__info-item"><strong>Driver current location: </strong> </p>
                </div>
            </div>
            
            <div className="delivery-process__section">
                <h2 className="delivery-process__section-title">Time Line</h2>
                <div className="delivery-process__info">
                    <p className="delivery-process__info-item"><strong>Delivery Date: </strong> </p>
                    <p className="delivery-process__info-item"><strong>Last Updated: </strong> </p>
                </div>
            </div>
            
            <div className="delivery-process__section">
                <h2 className="delivery-process__section-title">Route Stops</h2>
                <table className="delivery-process__table">
                    <thead>
                        <tr>
                            <th className="delivery-process__th">No</th>
                            <th className="delivery-process__th">Address</th>
                            <th className="delivery-process__th">Status</th>
                            <th className="delivery-process__th">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="delivery-process__tr">
                            <td className="delivery-process__td">1</td>
                            <td className="delivery-process__td">Address 1</td>
                            <td className="delivery-process__td">
                                <span className="delivery-process__status">Status 1</span>
                            </td>
                            <td className="delivery-process__td">
                                <button className="delivery-process__action-btn">Action 1</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default DeliveryProcess;
