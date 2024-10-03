import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from './navbar'
import Footer from './footer'
import { List, Card } from 'antd';

function CheckoutPage() {
    const location = useLocation();
    const { order, info } = location.state || {};
    
    return (
        <div>
            <Navbar />
            <div className="checkout-container">
                <h1>Checkout</h1>
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <List
                        dataSource={order.fishList}
                        renderItem={(fish, index) => (
                            <List.Item key={index}>
                                <Card title={`${fish.fishName} - ${fish.weight}`}>
                                    {fish.images && fish.images.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {fish.images.map((image, imgIndex) => (
                                                <img 
                                                    key={imgIndex}
                                                    src={image}  // Now directly using the Base64 string
                                                    alt={`Fish ${index + 1} Image ${imgIndex + 1}`} 
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'cover',
                                                        margin: '5px' 
                                                    }} 
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
                {/* ... other checkout information */}
            </div>
            <Footer />
        </div>
    );
}

export default CheckoutPage