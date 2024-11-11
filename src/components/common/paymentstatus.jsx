import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import '../../css/paymentstatus.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function PaymentStatus() {
    const [vnp_ResponseCode, setVnpResponseCode] = useState(null);
    const [txnRef, setTxnRef] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const responseCode = params.get('vnp_ResponseCode');
        const responseTxnRef = params.get('vnp_TxnRef');
        setVnpResponseCode(responseCode);
        setTxnRef(responseTxnRef);
        console.log(responseCode);
    }, []);

    const continueToHome = () => {
      try {
        axios.patch('http://26.61.210.173:3001/api/transaction/update-transaction', {
          transactionId: txnRef,
          vnp_ResponseCode: vnp_ResponseCode,
        
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });
        
      } finally {
        navigate('/');
      }
    };

    return (
        <div className="payment-status">
          {vnp_ResponseCode === '00' ? (
            <div className="success-message">
                <div className="check-icon">
                    <CheckCircleFilled  style={{ fontSize: '150px', color: '#00c853' }} />
                </div>
                <h2>Payment Successful!</h2>               
                <Button className="back-button" onClick={continueToHome}>Continue</Button>
            </div>
          ) : (
            <div className="success-message">
            <div className="check-icon">
                <CloseCircleFilled  style={{ fontSize: '150px', color: 'red' }} />
            </div>
            <h2>Payment Failed!</h2>
            
                
            </div>
          )}
        </div>
    );
}

export default PaymentStatus;