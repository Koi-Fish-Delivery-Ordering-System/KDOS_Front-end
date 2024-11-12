import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../../css/analytics.css';
import { Card, Col, Row, Statistic, Modal, Button, Table } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

function Analytics() {
  const [revenueData, setRevenueData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0); // State to hold total users
  const [ordersData, setOrdersData] = useState([]); // State to hold orders
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const initReportQuery = ``
  const orderListQuery = `query FindAllOrder {
    findAllOrder {
      accountId
      createdAt
      paymentMethod
      orderStatus
      totalPrice
      transactions {
        transactionId
        status
      }
      fromAddress
      fromProvince
      feedBackStars
      orderId
      reasonToCancel
      receiverName
      receiverPhone
      toAddress
      toProvince
      transportService {
        name
      }
    }
  }`;

  const userListQuery = `query findAllAccount {
    findAllAccount {
      accountId
    }
  }`;
  // Function to calculate estimated revenue based on non-canceled orders
  const calculateEstimatedRevenue = (orders) => {
    return orders
      .filter(order => order.orderStatus !== 'canceled') // Filter out canceled orders
      .reduce((acc, curr) => acc + curr.totalPrice, 0); // Sum up the totalPrice of remaining orders
  };

  const statisticsData = [
    {
      title: 'Total Revenue',
      value: `${revenueData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()} VND`, // Calculate total revenue
      trend: revenueData.length > 0 ? 'up' : 'down', // Determine trend based on data presence
    },
    {
      title: 'Estimated Revenue',
      value: `${calculateEstimatedRevenue(ordersData).toLocaleString()} VND`, // Calculate estimated revenue
      trend: ordersData.filter(order => order.orderStatus !== 'canceled').length > 0 ? 'up' : 'down', // Determine trend based on non-canceled orders
    },
    {
      title: 'Total Orders',
      value: ordersData.length + ' Orders', // Set the value based on the count of orders
      trend: ordersData.length > 0 ? 'up' : 'down', // Determine trend based on count
    },
    {
      title: 'Total Users',
      value: totalUsers + ' Users',
      trend: 'up',
    },
  ];
  const fetchAnalytics = async () => {
    try {
      const response = await axios.post('http://26.61.210.173:3001/graphql', {
        query: orderListQuery,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });

      const orders = response.data?.data?.findAllOrder || [];
      setOrdersData(orders);
      processRevenueData(orders);
      console.log(revenueData);
      const userResponse = await axios.post('http://26.61.210.173:3001/graphql', {
        query: userListQuery,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });

      const users = userResponse.data?.data?.findAllAccount || [];
      setTotalUsers(users.length); // Set total users based on the fetched data
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };
  const processRevenueData = (orders) => {
    const revenueMap = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString(); // Format date

      // Check if orderStatus is 'Completed' or if any transaction status is 'Success'
      const isCancelled = order.orderStatus === 'canceled';
      const isCompleted = order.orderStatus === 'completed';
      const hasSuccessfulTransaction = order.transactions.some(transaction => transaction.status === 'success');

      if (isCompleted || (hasSuccessfulTransaction && !isCancelled)) {
        revenueMap[date] = (revenueMap[date] || 0) + order.totalPrice;
      }
    });

    // Convert revenueMap to an array for the chart
    const revenueArray = Object.keys(revenueMap).map(date => ({
      date,
      revenue: revenueMap[date],
    }));

    setRevenueData(revenueArray);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Receiver Name',
      dataIndex: 'receiverName',
      key: 'receiverName',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => `${text.toLocaleString()} VND`, // Format total price
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(), // Format date
    },
  ];
  return (
    <div>
      <h1 className="section-title">Analytics</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
        </LineChart>
        <Row gutter={16}>
          {statisticsData.map((stat, index) => (
            <Col span={6} key={index}>
              <Card>
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
      </ResponsiveContainer>
      {/* Render statistics data */}
      <div className="statistics">
        {statisticsData.map((stat, index) => (
          <div key={index}>
            <h3>{stat.title}: {stat.value} (Trend: {stat.trend})</h3>
          </div>
        ))}
      </div>

      {/* Render list of orders directly under statistics */}
      <div className="orders-list">
        <h2 style={{ marginTop: '20px', marginBottom: '10px', textAlign: 'center' }}>List of Recent Orders</h2>
        <Table
          dataSource={ordersData}
          columns={columns}
          rowKey="orderId" // Unique key for each row
          pagination={false} // Disable pagination if you want to show all orders
        />
      </div>
    </div>
  );
}

export default Analytics; 