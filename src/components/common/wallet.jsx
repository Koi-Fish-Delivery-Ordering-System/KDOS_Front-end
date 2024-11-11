import React, { useState } from 'react';
import { Button, Table, message } from 'antd';
import axios from 'axios';
import '../../css/wallet.css';
function Wallet() {
  
  const createTransaction = async () => {
    try {
      const response = await axios.post('http://26.61.210.173:3001/api/transaction/create-transaction', {type: 'topUp', amount: 1000000}, {
        headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      }
    });
    console.log(response);
    const url = response.data.others.paymentUrl;
    console.log(url);
    window.location.href = url;
    message.success('Transaction created successfully');
    } catch (error) {
      message.error('Error creating transaction');
      console.error('Error creating transaction:', error);
    }
  }
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
          <Button className="top-up-button" onClick={createTransaction}>Top up</Button>
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