import React from 'react'
import Navbar from './navbar'
import Footer from './footer'
import './index.css'
import { useNavigate } from 'react-router-dom';
function ServicePage() {
    const handleClick = () => {
        const navigate = useNavigate();
    }
    return (
        <div>
            <Navbar />
            <div className="pricing-container">
                <div className="pricing-card popular-plan">
                    <img className="img" src="src/images/truck.png" alt="error" />
                    <ul className="features">
                        <li>giá theo kg</li>
                        <li>giá theo con</li>
                    </ul>
                    <button className="buy-button">Chọn dịch vụ</button>
                </div>

                <div className="pricing-card ai-plan">
                    <img className="img" src="src/images/plane.png" alt="error" />
                    <ul className="features">
                        <li>giá theo kg</li>
                        <li>giá theo con</li>
                    </ul>
                    <button onClick={handleClick} className="buy-button">Chọn dịch vụ</button>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default ServicePage; 
