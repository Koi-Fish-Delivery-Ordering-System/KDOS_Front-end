import React from 'react';
import { Button, Table } from 'antd';
import '../../css/wallet.css';
function Wallet() {

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]
  const dataSource = [
    {
      transactionId: '1234567890',
      type: 'Top up',
      amount: '1000000đ',
      status: 'Success',
    },
  ];
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
      <div className="transaction-history">
        <h3 style={{margin: '20px 0'}}>Transaction History</h3>
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </div>
  )
}

export default Wallet;