import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import { List, Card, Button } from 'antd';
import '../../css/checkout.css';

function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState('cash'); // Trạng thái cho phương thức thanh toán

    const location = useLocation();
    const { order, info } = location.state || {};

    // Calculate total number of fish and total weight
    const totalFishCount = order.fishList.length;
    const totalWeight = order.fishList.reduce((total, fish) => total + (Number(fish.weight) || 0), 0);
    const totalPrice = totalWeight * (info.transport === 'road' ? 50000 : info.transport === 'air' ? 150000 : 0) *(info.transport === 'road' ? (totalFishCount >= 10 ? 1.1 : totalFishCount >= 5 ? 1.05 : 1) : info.transport === 'air' ? (totalFishCount >= 10 ? 1.3 : totalFishCount >= 5 ? 1.15 : 1) : 0);

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = () => {
        // Gửi thông tin vào cơ sở dữ liệu
        const orderData = {
            // Thêm thông tin đơn hàng cần thiết
            sender: info.sender,
            senderPhone: info.senderPhone,
            recipient: info.recipient,
            recipientPhone: info.recipientPhone,
            pickUpProvince: info.pickUpProvince,
            pickUpAddress: info.pickUpAddress,
            destinationProvince: info.destinationProvince,
            destinationAddress: info.destinationAddress,
            transport: info.transport,
            totalWeight,
            totalFishCount,
            totalPrice,
            paymentMethod,
            // ... các thông tin khác ...
        };
        console.log(orderData);
        // Gọi API để gửi orderData vào cơ sở dữ liệu
    };

    return (
        <div className="checkout-page">
            <Navbar />
            <div className="checkout-container">
                <h1 className="checkout-title">Checkout</h1>
                
                {/* Display sender and recipient information */}
                <div className="recipient-info">
                    <h2 className="info-title">Sender Information</h2>
                    <p><strong>Name:</strong> {info.sender}</p>
                    <p><strong>Pick Up Location:</strong> {info.pickUpProvince}, {info.pickUpAddress}</p>
                    <p><strong>Phone:</strong> {info.senderPhone}</p>
                    <h2 className="info-title">Recipient Information</h2>
                    <p><strong>Name:</strong> {info.recipient}</p>
                    <p><strong>Phone:</strong> {info.recipientPhone}</p>
                    <p><strong>Destination:</strong> {info.destinationProvince}, {info.destinationAddress}</p>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h2 className="info-title">Order Summary</h2>
                    <List
                        dataSource={order.fishList}
                        renderItem={(fish, index) => (
                            <List.Item key={index}>
                                <Card title={`${fish.fishName} - ${fish.weight} kg`}>
                                    {fish.images && fish.images.length > 0 ? (
                                        <div className="fish-images-container">
                                            {fish.images.map((image, imgIndex) => (
                                                <img 
                                                    key={imgIndex}
                                                    src={image}  // Now directly using the Base64 string
                                                    alt={`Fish ${index + 1} Image ${imgIndex + 1}`} 
                                                    className="fish-image"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No images available</p>
                                    )}
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>

                {/* Display total number of fish and total weight */}
                <div className="total-info">
                    <h2 className="info-title">Total Information</h2>
                    <p><strong>Total Fish Count:</strong> {totalFishCount}</p>
                    <p><strong>Total Weight:</strong> {totalWeight} kg</p>
                    <p><strong>Transport Service: {info.transport}</strong></p>
                </div>
                <div className='total-price-container'>
                    <h2 className="info-title-price">Total Price</h2>
                    <h3 className="total-price">{totalPrice.toLocaleString()} VND</h3>
                </div>
                
                
                <div className="payment-methods">
                    <h2 className="info-title">Payment Method</h2>
                    <label className="payment-option">
                        <input 
                            type="radio" 
                            value="cash" 
                            checked={paymentMethod === 'cash'} 
                            onChange={handlePaymentChange} 
                        />
                        Cash
                    </label>
                    <label className="payment-option">
                        <input 
                            type="radio" 
                            value="credit" 
                            checked={paymentMethod === 'credit'} 
                            onChange={handlePaymentChange} 
                        />
                        Credit
                    </label>
                    {paymentMethod === 'credit' && (
                    <div className="credit-image-container">
                        <img src="path/to/your/image.jpg" alt="Credit Payment" className="credit-image" />
                    </div>
                )}

                </div>

                
                <Button type="primary" onClick={handlePlaceOrder}>Place Order</Button>
            </div>
            <Footer />
        </div>
    );
}

export default CheckoutPage;
