import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../../css/analytics.css';
import { Card, Col, Row, Statistic, Table, Modal, Button, Select, Input, message } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import "../../../css/orderhistory.css";


function Analytics() {
  const [revenueData, setRevenueData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [ordersData, setOrdersData] = useState([]);
  const [initReport, setInitReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFish, setSelectedFish] = useState(null);
  const [fishImages, setFishImages] = useState({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const accessToken = sessionStorage.getItem('accessToken');

  const initReportQuery = `query InitReport { initReport { averageOrderRating numberOfDrivers numberOfTransportServices } }`;
  const orderListQuery = `query FindAllOrder {
   findAllOrder {  
   fromAddress         
      notes
      orderId
      orderStatus
      orderedFish {
        orderFishId
        ageInMonth
        description
        gender
        fishImageUrl
        name
        species
        weight
        qualifications {
          imageUrl
        }
      }
      reasonToCancel
      paymentMethod
      toAddress
      receiverName
      receiverPhone
      totalPrice
      transportServiceId
      createdAt 
      transportService {     
        type
      }
      feedBackStars
      feedBackContent
       }}`;
  const userListQuery = `query findAllAccount { findAllAccount { accountId } }`;

  const statisticsData = [
    { title: 'Total Revenue', value: `${revenueData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()} VND`, trend: revenueData.length > 0 ? 'up' : 'down' },
    { title: 'Total Orders', value: ordersData.length + ' Orders', trend: ordersData.length > 0 ? 'up' : 'down' },
    { title: 'Total Users', value: totalUsers + ' Users', trend: 'up' },
    { title: 'Average Order Rating', value: initReport?.averageOrderRating + ' Stars', trend: 'up' },
    { title: 'Number of Drivers', value: initReport?.numberOfDrivers + ' Drivers', trend: 'up' },
    { title: 'Number of Transport Services', value: initReport?.numberOfTransportServices + ' Services', trend: 'up' },
  ];

  const fetchAnalytics = async () => {
    try {
      const response = await axios.post('http://26.61.210.173:3001/graphql', { query: orderListQuery }, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, 'Content-Type': 'application/json' } });
      const orders = response.data?.data?.findAllOrder || [];
      setOrdersData(orders);
      processRevenueData(orders);

      const userResponse = await axios.post('http://26.61.210.173:3001/graphql', { query: userListQuery }, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, 'Content-Type': 'application/json' } });
      const users = userResponse.data?.data?.findAllAccount || [];
      setTotalUsers(users.length);

      const initReportResponse = await axios.post('http://26.61.210.173:3001/graphql', { query: initReportQuery }, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, 'Content-Type': 'application/json' } });
      setInitReport(initReportResponse.data?.data?.initReport);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      message.error('Failed to load analytics data. Please try again later.');
    }
  };

  const processRevenueData = (orders) => {
    const revenueData = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const isCancelled = order.orderStatus === 'canceled';
      const isCompleted = order.orderStatus === 'completed';
      const hasSuccessfulTransaction = order.transactions?.some(transaction => transaction.status === 'success');

      if (isCompleted || (hasSuccessfulTransaction && !isCancelled)) {
        acc[date] = (acc[date] || 0) + order.totalPrice;
      }
      return acc;
    }, {});

    setRevenueData(Object.keys(revenueData).map(date => ({ date, revenue: revenueData[date] })));
  };


  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleFishClick = (fish) => {
    setSelectedFish(fish);
    setIsImageModalOpen(true);
  };

  const handleCancelOrder = (order, e) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    const reasonToCancel = selectedReason === 'Others' ? cancelReason : selectedReason;

    try {
      const response = await axios.patch('http://26.61.210.173:3001/api/orders/cancel-order', {
        orderId: selectedOrder.orderId,
        reasonToCancel: reasonToCancel,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        message.success('Order canceled successfully!');
        await fetchAnalytics(); // Refetch the orders after cancellation
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      message.error('Failed to cancel the order. Please try again.');
    } finally {
      // Close the modal and reset the state
      setIsCancelModalOpen(false);
      setCancelReason('');
      setSelectedReason('');
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Receiver Name', dataIndex: 'receiverName', key: 'receiverName' },
    { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice', render: (text) => `${text.toLocaleString()} VND` },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => (
        <span style={{ color: status === 'completed' ? 'green' : status === 'canceled' ? 'red' : 'black' }}>
          {status}
        </span>
      ),
    },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleString() },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={(e) => handleCancelOrder(record, e)}
          disabled={['Delivered', 'delivering', 'canceled'].includes(record.orderStatus)}
        >
          Cancel
        </Button>
      ),
    },
  ];

  return (
    <div className="analytics-container">
      <h1 className="section-title">Analytics</h1>
      <Row gutter={[16, 16]}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card className="statistic-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.trend === 'up' ? '#3f8600' : '#cf1322' }}
                prefix={stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#ff7700" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h2 className="orders-title">List of Recent Orders</h2>
      <Table
        dataSource={ordersData}
        columns={columns}
        rowKey="orderId"
        pagination={{ pageSize: 5 }}
        className="orders-table"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        title={<h2 style={{ margin: 0, color: '#ff7700' }}>Order Details</h2>}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedFish(null);
          setFishImages({});
        }}
        width={1000}
        footer={null}
      >
        {selectedOrder && (
          <div className="modal-content" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="order-info" style={{ flex: 1, marginBottom: '20px' }}>
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Created Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Receiver Name:</strong> {selectedOrder.receiverName}</p>
              <p><strong>Receiver Phone:</strong> {selectedOrder.receiverPhone}</p>
              <p><strong>From:</strong> {selectedOrder.fromAddress}</p>
              <p><strong>To:</strong> {selectedOrder.toAddress}</p>
              <p><strong>Transport Type:</strong> {selectedOrder.transportService.type}</p>
              <p><strong>Notes:</strong> {selectedOrder.notes}</p>
              <p><strong>Total Price:</strong> <span className="price-tag">{selectedOrder.totalPrice.toLocaleString()} VNĐ</span></p>
              <p><strong>Status:</strong> <span className={`status ${selectedOrder.orderStatus.toLowerCase()}`}>{selectedOrder.orderStatus}</span></p>
            </div>
            <div className="fish-details" style={{ flex: 1 }}>
              <h3>Ordered Fish</h3>
              <div className="fish-list" style={{ display: 'flex', flexDirection: 'column' }}>
                {selectedOrder.orderedFish && selectedOrder.orderedFish.map((fish, index) => (
                  <div
                    key={index}
                    className={`fish-item ${selectedFish === fish ? 'selected' : ''}`}
                    onClick={() => handleFishClick(fish)}
                    style={{ cursor: 'pointer', marginBottom: '10px' }}
                  >
                    {fish.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        title={<h2 style={{ margin: 0, color: '#ff7700' }}>Fish Details</h2>}
        open={isImageModalOpen}
        onCancel={() => {
          setIsImageModalOpen(false);
          setSelectedFish(null);
        }}
        width={1000}
        footer={null}
      >
        {selectedFish && (
          <div className="modal-content">
            <div className="fish-info">
              <h3>Fish Information</h3>
              <p><strong>Fish ID:</strong> {selectedFish.orderFishId}</p>
              <p><strong>Age:</strong> {selectedFish.ageInMonth} months</p>
              <p><strong>Description:</strong> {selectedFish.description}</p>
              <p><strong>Gender:</strong> {selectedFish.gender}</p>
              <p><strong>Species:</strong> {selectedFish.species}</p>
              <p><strong>Weight:</strong> {selectedFish.weight} kg</p>
              <p><strong>Qualifications:</strong></p>
              <div className="qualifications">
                {selectedFish.qualifications.map((qualification, index) => (
                  <div key={index}>
                    <FontAwesomeIcon icon={faEye} />
                    <img src={qualification.imageUrl} alt={`Qualification ${index + 1}`} />
                  </div>
                ))}
              </div>
              <p><strong>Image:</strong></p>
              <div className="fish-image">
                <img src={selectedFish.fishImageUrl} alt="Fish" />
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        title={<h2 style={{ margin: 0, color: '#ff7700' }}>Cancel Order</h2>}
        open={isCancelModalOpen}
        onCancel={() => {
          setIsCancelModalOpen(false);
          setSelectedOrder(null);
          setSelectedReason('');
          setCancelReason('');
        }}
        width={1000}
        footer={null}
      >
        {selectedOrder && (
          <div className="modal-content">
            <div className="cancel-order">
              <h3>Cancel Order</h3>
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Receiver Name:</strong> {selectedOrder.receiverName}</p>
              <p><strong>Reason:</strong></p>
              <Select
                value={selectedReason || cancelReason}
                onChange={(value) => setSelectedReason(value)}
                style={{ width: '100%' }}
              >
                <Select.Option value="">Select a reason</Select.Option>
                <Select.Option value="Customer Request">Customer Request</Select.Option>
                <Select.Option value="Driver Request">Driver Request</Select.Option>
                <Select.Option value="Payment Issue">Payment Issue</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
              <Input
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter your reason"
                style={{ marginTop: '10px' }}
              />
              <div className="button-container">
                <Button
                  type="primary"
                  onClick={handleConfirmCancel}
                  disabled={!selectedReason && !cancelReason}
                >
                  Confirm
                </Button>
                <Button
                  type="secondary"
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setSelectedOrder(null);
                    setSelectedReason('');
                    setCancelReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Analytics;
