import React from 'react'
import Navbar from './navbar'
import Footer from './footer'
import '../../css/servicepage.css'
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
function ServicePage() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar />
            <div className="pricing-container">
                <div className="pricing-card popular-plan">
                    <img className="img" src="src/images/truck.png" alt="error" />
                    <div className="title-service">Road Transport</div>
                    <ul className="features">
                        <li>Flexible road transport service, suitable for domestic shipments with low costs and flexible delivery times.</li>
                        <li>Price per kg: 50,000 VND/kg</li>
<li>Price increase for fish:
    <ul>
        <li>5 or more fish: +5% increase</li>
        <li>10 or more fish: +10% increase</li>
    </ul>
</li>
                    </ul>
                    <button onClick={() => {navigate("/orderinformation", { state: { transport: "road" } });}}className="buy-button">Choose Service</button>
                </div>

                <div className="pricing-card ai-plan">
                    <img className="img" src="src/images/plane.png" alt="error" />
                    <div className="title-service">Air Transport</div>
                    <ul className="features">
                        <li>Fast, efficient air freight service for international or urgent shipments, ensuring accurate delivery time.</li>
                        <li>Price per kg: 150,000 VND/kg</li>
<li>Price increase for fish:
    <ul>
        <li>5 or more fish: +15% increase</li>
        <li>10 or more fish: +30% increase</li>
    </ul>
</li>
                    </ul>
                    <button onClick={() => {navigate("/orderinformation", { state: { transport: "air" } });}} className="buy-button">Choose Service</button>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default ServicePage; 
