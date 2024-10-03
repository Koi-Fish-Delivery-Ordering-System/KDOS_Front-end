import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "../../config/axios";
import "../../css/orderhistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://66f3691871c84d8058789db4.mockapi.io/apiorders');
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setError('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="orderHistory">
        <h2 className="title">Lịch sử đơn hàng</h2>
        <p className="noOrders">Không có đơn hàng nào. Hãy mua sắm và quay lại sau!</p>
        <Link to="/products" className="noOrdersLink">Xem sản phẩm</Link>
      </div>
    );
  }

  return (
    <div className="orderHistory">
      <h2 className="title">Lịch sử đơn hàng</h2>
      {orders.map((order) => (
        <div key={order.id} className="orderItem">
          <div className="orderHeader">
            <h3 className="orderId">Mã đơn hàng: {order.id}</h3>
            <p className="orderDate">Ngày đặt hàng: {order.date}</p>
          </div>
          <div className="orderDetails">
            <p className="detailItem">
              <span>Tổng giá trị:</span>
              <span>{order.totalAmount ? order.totalAmount.toLocaleString() : 'N/A'} VNĐ</span>
            </p>
            <p className="detailItem">
              <span>Phương thức thanh toán:</span>
              <span>{order.paymentMethod || 'N/A'}</span>
            </p>
            <p className="detailItem">
              <span>Trạng thái:</span>
              <span>{order.status || 'N/A'}</span>
            </p>
            <p className="detailItem">
              <span>Phí vận chuyển:</span>
              <span>{order.shippingFee ? order.shippingFee.toLocaleString() : 'N/A'} VNĐ</span>
            </p>
          </div>
          <Link to={`/order/${order.id}`} className="viewDetailsLink">Xem chi tiết đơn hàng</Link>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
