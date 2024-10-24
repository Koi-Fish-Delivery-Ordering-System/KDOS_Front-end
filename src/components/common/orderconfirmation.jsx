import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import DeliveryMap from './Map';
import Navbar2 from './navbar2';
import '../../css/placeorderpage.css';
import '../../css/addfishorder.css';
import Footer from './footer';




const OrderConfirmation = () => {
  const defaultPosition = [10.8231, 106.6297]; // Default coordinates for Ho Chi Minh City

  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const { pickUpLocation, dropOffLocation, vehicleType } = location.state || {};

  const handleSubmit = async (values) => {
    console.log(values); // Handle the sender information submission
    // Proceed with the next steps (e.g., API call to submit the order)
    navigate('a'); // Redirect to a confirmation page
  };
  // Fish orders state
  const [fishOrders, setFishOrders] = useState([
    { name: '', weight: 0, price: 0 } // Default fish order
  ]);

  // Function to add a new row
  const addRow = () => {
    setFishOrders([...fishOrders, { name: '', weight: 0, price: 0 }]);
  };

  // Function to update a row
  const updateRow = (index, field, value) => {
    const updatedOrders = [...fishOrders];
    updatedOrders[index][field] = value;
    setFishOrders(updatedOrders);
  };

  // Function to delete a row
  const deleteRow = (index) => {
    const updatedOrders = fishOrders.filter((_, i) => i !== index);
    setFishOrders(updatedOrders);
  };

  return (
    <div>
      <Row className="placeorder-page">
        <Navbar2 />
        <Col span={8} className="left-section">
          <h2 className="section-title">Order Confirmation</h2>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <h2 className="fish-orders-title">Sender Information</h2>
            <Form.Item label="Sender Name" name="senderName" rules={[{ required: true, message: 'Please enter your sender name' }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item label="Sender Phone" name="senderPhone" rules={[{ required: true, message: 'Please enter your sender phone number' }]}>
              <Input placeholder="Enter your phone number" />
            </Form.Item>
            <Form.Item label="Sender Address" name="senderAddress" rules={[{ required: true, message: 'Please enter your sender address' }]}>
              <Input placeholder="Enter your address" />
            </Form.Item>
            {/* <Form.Item label="Sender Notes" name="senderNote" >
              <Input placeholder="Enter your notes" />
            </Form.Item> */}
            <h2 className="fish-orders-title">Recipient Information</h2>
            <Form.Item label="Recipient Name" name="recipientName" rules={[{ required: true, message: 'Please enter your recipient name' }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item label="Recipient Phone" name="recipientPhone" rules={[{ required: true, message: 'Please enter your recipient phone' }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item label="Recipient Address" name="recipientAddress" rules={[{ required: true, message: 'Please enter your recipient address' }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            {/* Fish Orders Table */}
            <h2 className="fish-orders-title">Fish Orders</h2>
            <div className="fish-orders-scroll-container">
              <table className="fixed-table">
                <thead>
                  <tr>
                    <th className="label-table">Index</th>
                    <th className="label-table">Fish Type</th>
                    <th className="label-table">Weight (kg)</th>
                    <th className="label-table">Price (VND/Kg)</th>
                    <th className="label-table">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fishOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={order.name}
                          onChange={(e) => updateRow(index, "name", e.target.value)}
                          placeholder="Enter fish type"
                          className="custom-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={order.weight}
                          onChange={(e) => updateRow(index, "weight", e.target.value)}
                          placeholder="Weight"
                          className="custom-input"

                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={order.price}
                          onChange={(e) => updateRow(index, "price", e.target.value)}
                          placeholder="Price"
                          className="custom-input"

                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => deleteRow(index)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={addRow} className="add-button">
              Add Fish
            </button>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>

        </Col>
        <Col span={16}>
          <DeliveryMap
            suggestion={{
              form: pickUpLocation ? [pickUpLocation.lat, pickUpLocation.lng] : defaultPosition,
              to: dropOffLocation ? [dropOffLocation.lat, dropOffLocation.lng] : defaultPosition
            }}
          />
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;