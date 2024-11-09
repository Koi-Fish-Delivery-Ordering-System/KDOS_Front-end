import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import '../../css/paymentstatus.css';

function PaymentStatus({ vnp_RepsonseCode }) {
  return (
    <div className="payment-status">
      {/* {vnp_RepsonseCode === "00" && ( */}
        <div className="success-message">
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#00c853' }} />
          <h2>Payment Successful!</h2>
        </div>
      {/* )} */}
    </div>
  );
}

export default PaymentStatus;