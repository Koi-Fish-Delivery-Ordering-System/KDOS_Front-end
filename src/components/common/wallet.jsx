import React, { useState, useEffect } from 'react';
import { Button, Table, message, Modal, Input } from 'antd';
import axios from 'axios';
import '../../css/wallet.css';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

function Wallet() {
  const [transactions, setTransactions] = useState([]);
  const [openTopUpModal, setOpenTopUpModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const fetchTransactions = async () => {
    try {
      const query = `
      query FindManyTransaction {
  findManyTransaction {
    transactionId
    type
    amount
    status
    createdAt
    orderId
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
  const handleContinue = () => {
    setIsConfirmModalVisible(true);
  };
  const formatAmount = (amount) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Format the amount with dots
  };
  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: '20%'
    },
    {
      title: <div style={{ textAlign: 'center' }}>Date</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (createdAt) => {
        const date = new Date(createdAt);
        return (
          <div style={{ textAlign: 'center' }}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      title: <div style={{ textAlign: 'center' }}>Type</div>,
      dataIndex: 'type',
      key: 'type',
      render: (type) => <div style={{ textAlign: 'center' }}><span className={`type-transaction ${type.toLowerCase()}`}>{type}</span></div>,
    },
    {
      title: <div style={{ textAlign: 'center' }}>Amount</div>,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const color = (record.type.toLowerCase() === 'pay' || record.type.toLowerCase() === 'usewallet') ? 'red' : 'green';
        return <span style={{ color, fontWeight: '500' }}>{`${amount.toLocaleString()} VNĐ`}</span>;
      },
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>,
      dataIndex: 'status',
      key: 'status',
      render: (status) => <div style={{ textAlign: 'center' }}><span className={`status-transaction ${status.toLowerCase()}`}>{status}</span></div>,
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId) => {
        return orderId ? orderId : <span style={{ color: 'red' }}>X</span>;
      },
    }
  ]

  return (
    <>
      <div>
        <h1 className="section-title">Wallet</h1>
        <div className="balance-container">
          <div>Balance</div>
          <div className="balance-value">
            <h3>{(sessionStorage.getItem("walletAmount") ? parseFloat(sessionStorage.getItem("walletAmount")) : 0).toLocaleString()} VNĐ</h3>
            <Button
              className="top-up-button"
              onClick={() => setOpenTopUpModal(true)}
              style={{
                backgroundColor: '#ff7700',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '20px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e66a00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff7700';
              }}
            >
              Top up
            </Button>
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
        centered
      >
        <h2 style={{ textAlign: 'center', color: '#ff7700', fontSize: '24px', fontWeight: 'bold' }}>Top Up</h2>
        <div
          className="top-up-container"
          style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        >
          <div style={{ margin: '10px 0', fontSize: '16px', textAlign: 'center' }}>Input the amount you want to top up</div>
          <Input
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;

              // Allow only numeric input
              if (/^\d*$/.test(value)) {
                setAmount(value);  // Set the value even if it doesn’t pass the validation

                // Validate amount only if it’s not empty and greater than or equal to 10,000
                if (value === '' || parseInt(value) >= 10000) {
                  setError('');
                } else {
                  setError('You must top up more than 10,000 VNĐ');
                }
              } else {
                setError('You must type a valid number');
              }
            }}
            style={{
              borderRadius: '5px',
              padding: '10px',
              border: '1px solid #ccc',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#ff7700')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          {error && <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>{error}</div>}
          <Button
            className="continue-vnpay-button"
            onClick={handleContinue}
            disabled={!amount || parseFloat(amount) < 10000}
            style={{
              cursor: !amount || parseFloat(amount) < 10000 ? 'not-allowed' : 'pointer',
              opacity: !amount || parseFloat(amount) < 10000 ? 0.5 : 1,
              background: 'linear-gradient(90deg, #ff7700, #ffcc00)',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '10px',
              width: '100%',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => {
              if (amount && parseFloat(amount) >= 10000) {
                e.currentTarget.style.background = '#e66a00';
              }
            }}
            onMouseLeave={(e) => {
              if (amount && parseFloat(amount) >= 10000) {
                e.currentTarget.style.background = 'linear-gradient(90deg, #ff7700, #ffcc00)';
              }
            }}
          >
            Continue with VNPAY
          </Button>
        </div>
      </Modal>

      <Modal
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={null}
        centered
      >
        <h2 style={{ textAlign: 'center', color: '#ff7700' }}>Confirm Top Up</h2>
        <div className="top-up-container" style={{ padding: '20px 0', textAlign: 'center' }}>
          <div style={{ margin: '10px 0', fontSize: '16px' }}>You are about to top up: {formatAmount(amount)} VNĐ</div>
          <Button className="confirm-button" style={{ width: '100%', marginTop: '20px', height: '40px' }} onClick={() => createTransaction(amount)}>Confirm</Button>
        </div>
      </Modal>
    </>
  )
}

export default Wallet;