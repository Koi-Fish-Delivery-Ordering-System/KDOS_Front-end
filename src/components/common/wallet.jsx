import React, { useState, useEffect } from 'react';
import { Button, Table, message, Modal, Input } from 'antd';
import axios from 'axios';
import '../../css/wallet.css';

function Wallet() {
  const [transactions, setTransactions] = useState([]);
  const [openTopUpModal, setOpenTopUpModal] = useState(false);
  const [amount, setAmount] = useState('');

  const fetchTransactions = async () => {
    try {
      const query = `
      query FindManyTransaction {
  findManyTransaction {
    transactionId
    type
    amount
    status
  }
}
      `
      const response = await axios.post('http://26.61.210.173:3001/graphql', { query },
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(response);
      console.log()
      setTransactions(response.data.data.findManyTransaction);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }
  const fetchWalletAmount = async () => {
    const query = `
    query Init {
            init {
            
              walletAmount
            }
          }`
    const initResponse = await axios.post('http://26.61.210.173:3001/graphql', { query },
      {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });
    const walletAmount = initResponse.data.data.init.walletAmount;
    sessionStorage.setItem("walletAmount", walletAmount);
  }
  useEffect(() => {
    fetchTransactions();
    fetchWalletAmount();
  }, []);
  const createTransaction = async (amount) => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        message.error('Please enter a valid amount.');
        return;
      }

      const response = await axios.post('http://26.61.210.173:3001/api/transaction/create-transaction', {
        type: 'topUp',
        amount: numericAmount
      }, {
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
      render: (type) => <span className={`type-transaction ${type.toLowerCase()}`}>{type}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const color = (record.type.toLowerCase() === 'pay' || record.type.toLowerCase() === 'usewallet') ? 'red' : 'green';
        return <span style={{ color, fontWeight: '500' }}>{`${amount.toLocaleString()} VNĐ`}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span className={`status-transaction ${status.toLowerCase()}`}>{status}</span>,
    },
  ]

  return (
    <>
      <div>
        <h1 className="section-title">Wallet</h1>
        <div className="balance-container">
          <div>Balance</div>
          <div className="balance-value">
            <h3>{sessionStorage.getItem("walletAmount").toLocaleString()} VNĐ</h3>
            <Button className="top-up-button" onClick={() => setOpenTopUpModal(true)}>Top up</Button>
          </div>

        </div>
        <div className="transaction-history">
          <h3 style={{ margin: '20px 0' }}>Transaction History</h3>
          <Table columns={columns} dataSource={transactions} />
        </div>
      </div>
      <Modal
        open={openTopUpModal}
        onCancel={() => setOpenTopUpModal(false)}
        footer={null}
      >
        <h3>Top up</h3>
        <Input name="amount" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
        <Button className="continue-vnpay-button" onClick={() => createTransaction(amount)}>Continue with VNPAY</Button>
      </Modal>
    </>
  )
}

export default Wallet;