import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../../css/analytics.css';
import { Card, Col, Row, Statistic, Table } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

function Analytics() {
  const [revenueData, setRevenueData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [ordersData, setOrdersData] = useState([]);
  const [initReport, setInitReport] = useState(null);

  const initReportQuery = `query InitReport { initReport { averageOrderRating numberOfDrivers numberOfTransportServices } }`;
  const orderListQuery = `query FindAllOrder { findAllOrder { accountId createdAt paymentMethod orderStatus totalPrice transactions { transactionId status } fromAddress fromProvince feedBackStars orderId reasonToCancel receiverName receiverPhone toAddress toProvince transportService { name } } }`;
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
    }
  };

  const processRevenueData = (orders) => {
    const revenueMap = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const isCancelled = order.orderStatus === 'canceled';
      const isCompleted = order.orderStatus === 'completed';
      const hasSuccessfulTransaction = order.transactions.some(transaction => transaction.status === 'success');
      if (isCompleted || (hasSuccessfulTransaction && !isCancelled)) {
        revenueMap[date] = (revenueMap[date] || 0) + order.totalPrice;
      }
    });

    const revenueArray = Object.keys(revenueMap).map(date => ({ date, revenue: revenueMap[date] }));
    setRevenueData(revenueArray);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Receiver Name', dataIndex: 'receiverName', key: 'receiverName' },
    { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice', render: (text) => `${text.toLocaleString()} VND` },
    { title: 'Order Status', dataIndex: 'orderStatus', key: 'orderStatus' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleString() },
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
      />
    </div>
  );
}

export default Analytics;
