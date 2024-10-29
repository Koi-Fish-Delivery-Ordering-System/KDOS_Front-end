import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/orderhistory.css";

const OrderHistory = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = sessionStorage.getItem('accessToken');
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const query = `
      query FindManyUserOrder {
        findManyUserOrder {
          fromAddress
          
          notes
          orderId
          orderStatus
          orderedFish {
            ageInMonth
            description
            gender
            
            name
            species
            weight
            
          }
          toAddress
          receiverName
          receiverPhone
          totalPrice
          transportServiceId
          createdAt      
        }
      }
    `;
      const orderResponse = await axios.post('http://26.61.210.173:3001/graphql', { query }, { headers: {
        'Authorization': `Bearer ${accessToken}`
      } });
      setOrder(orderResponse.data.data.findManyUserOrder);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="records">
      <h2 className="title">Order History</h2>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : order.length > 0 ? (
        <div className="orders-container">
          {order.map((orderItem) => (
            <div key={orderItem.orderId} className="order-card">
              <div className="order-detail">
                <span className="label">Order ID:</span> {orderItem.orderId}
              </div>
              <div className="order-detail">
                <span className="label">From:</span> {orderItem.fromAddress}
              </div>
              <div className="order-detail">
                <span className="label">To:</span> {orderItem.toAddress}
              </div>
              <div className="order-detail">
                <span className="label">Date:</span> {new Date(orderItem.createdAt).toLocaleDateString()}
              </div>
              <div className="order-detail">
                <span className="label">Total Price:</span> {orderItem.totalPrice.toLocaleString()} VNĐ
              </div>
              <div className="order-actions">
                <span className={`status ${orderItem.orderStatus}`}>{orderItem.orderStatus}</span>
                <button className="detail-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <img src="empty-state.png" alt="Empty State" className="emptyImage" />
          <p>It looks like you have never placed an order. Maybe it is time to place your first order!</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
