import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/analytics.css'; // Import the CSS file

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const query = `
        query InitReport {
          initReport {
            averageOrderRating
            numberOfDrivers
            numberOfOrders
            numberOfTransportServices
            totalRevenue
          }
        }
      `;
      const analyticsResponse = await axios.post('http://26.61.210.173:3001/graphql', {
        query,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });

      const initReport = analyticsResponse.data?.data?.initReport;
      if (initReport) {
        setAnalytics(initReport);
      } else {
        console.error('initReport is not available in the response:', analyticsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div >
      <h1 className="section-title">Analytics</h1>
      <div className="analytics-cards">
        <div className="analytics-card">
          <h2>Average Order Rating</h2>
          <p>{analytics?.averageOrderRating.toFixed(2)}</p>
        </div>
        <div className="analytics-card">
          <h2>Number of Drivers</h2>
          <p>{analytics?.numberOfDrivers}</p>
        </div>
        <div className="analytics-card">
          <h2>Number of Orders</h2>
          <p>{analytics?.numberOfOrders}</p>
        </div>
        <div className="analytics-card">
          <h2>Number of Transport Services</h2>
          <p>{analytics?.numberOfTransportServices}</p>
        </div>
        <div className="analytics-card">
          <h2>Total Revenue</h2>
          <p>{analytics?.totalRevenue}</p>
        </div>
      </div>
    </div>
  )
};

export default Analytics; 