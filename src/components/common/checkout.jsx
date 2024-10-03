import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import { List, Card } from 'antd';
import '../../css/checkout.css';
function CheckoutPage() {
    const location = useLocation();
    const { order, info } = location.state || {};

    // Calculate total number of fish and total weight
    const totalFishCount = order.fishList.length;
    const totalWeight = order.fishList.reduce((total, fish) => total + fish.weight, 0);

    return (
        <div>
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
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CheckoutPage;
