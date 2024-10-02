import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from './navbar'
import Footer from './footer'
import { Form, Input, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

function CheckoutPage() {
    const location = useLocation();
    const { order } = location.state || {};
    const { info } = location.state || {};
    
    return (
        <div>
            <Navbar />
            <div>
                <h1>Checkout</h1>
                <div>
                   
                    {info.phone}
                </div>
            </div>
            <Footer />
        </div>
      )
}

export default CheckoutPage