import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import '../../css/paymentstatus.css';

function PaymentStatus() {
    const [vnp_ResponseCode, setVnpResponseCode] = useState(null);
    const [txnRef, setTxnRef] = useState(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const responseCode = params.get('vnp_ResponseCode');
        const responseTxnRef = params.get('vnp_TxnRef');
        setVnpResponseCode(responseCode);
        setTxnRef(responseTxnRef);
        console.log(responseCode);
    }, []);

    const continueToHome = () => {
        navigate('/');
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