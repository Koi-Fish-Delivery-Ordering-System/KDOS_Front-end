import React from 'react';
import { Button } from 'antd';
import '../../css/wallet.css';
function Wallet() {
  return(
    <div>
      <h1 className="section-title">Wallet</h1>
      <div className="balance-container">
        <div>Balance</div>
        <div className="balance-value">
          <h3>1000000đ</h3>
          <Button className="top-up-button">Top up</Button>
        </div>
      </div>
    </div>
  )
}

export default Wallet;