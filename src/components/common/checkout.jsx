import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from './navbar'
import Footer from './footer'
import { Form, Input, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

function CheckoutPage() {
    
    return (
        <div>
            <Navbar />
            <div>
            <h1>Order Detail</h1>
            </div>
            <Footer />
        </div>
      )
}

export default CheckoutPage