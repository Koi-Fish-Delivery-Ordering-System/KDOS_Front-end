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
                    <div className="">Road Transport</div>
                    <ul className="features">
                        <li>Dịch vụ vận tải đường bộ linh hoạt, phù hợp cho các lô hàng trong nước với chi phí thấp và thời gian giao hàng linh hoạt.</li>
                        <li>giá theo kg</li>
                        <li>giá theo con</li>
                    </ul>
                    <button onClick={() => {navigate("/orderinformation", { state: { transport: "road" } });}}className="buy-button">Chọn dịch vụ</button>
                </div>

                <div className="pricing-card ai-plan">
                    <img className="img" src="src/images/plane.png" alt="error" />
                    <div className="">Air Transport</div>
                    <ul className="features">
                        <li>Dịch vụ vận tải hàng không nhanh chóng, hiệu quả cho các lô hàng quốc tế hoặc cần giao gấp, đảm bảo thời gian giao hàng chính xác.</li>
                        <li>giá theo kg</li>
                        <li>giá theo con</li>
                    </ul>
                    <button onClick={() => {navigate("/orderinformation", { state: { transport: "air" } });}} className="buy-button">Chọn dịch vụ</button>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default ServicePage; 
