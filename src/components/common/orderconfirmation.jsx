import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message, Select, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import DeliveryMap from './Map';
import Navbar2 from './navbar2';
import '../../css/addfishorder.css';
import Footer from './footer';
import axios from 'axios';




const { Option } = Select; // Destructure Option from Select
const OrderConfirmation = () => {
  const defaultPosition = [10.8231, 106.6297]; // Default coordinates for Ho Chi Minh City

  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const { pickUpLocation, dropOffLocation, vehicleType, totalPrice } = location.state || {};
  const [qualificationsImage, setQualificationsImage] = useState([]);

  const handleUploadChange = ({ fileList }) => {
    setQualificationsImage(fileList); // Store the file list in state
    console.log(fileList); // Log for debugging
  };
  const handleSubmit = async (values) => {
    try {
      // Map fishOrders to the format required by the API
      const fishes = fishOrders.map(order => ({
        name: order.name,
        gender: order.gender,
        species: order.species,
        ageInMonth: order.age, // Assuming age is in months
        weight: order.weight,
        length: order.length,
        description: order.descriptions,
        qualifications: qualificationsImage.length > 0 ? [{ mediaIndex: 0 }] : [] // Ensure qualifications is an array
      }));

      // Prepare the data to be sent
      const orderData = {
        notes: '',
        totalPrice: values.totalPrice,
        fishes: fishes,
        transportServiceId: vehicleType,
        fromAddress: pickUpLocation,
        toAddress: dropOffLocation,
        receiverName: values.recipientName,
        receiverPhone: values.recipientPhone,
      };

      console.log(orderData); // Log to check the data structure

      // Get the token from localStorage
      const token = localStorage.getItem("token");

      // Send the data to the API with the token in the headers
      const response = await axios.post('http://26.61.210.173:3001/api/orders/create-order', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Check if the request was successful
      if (response.status === 200 || response.status === 201) {
        message.success('Order placed successfully!');
        // Optionally navigate to another page or reset the form
      } else {
        message.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      message.error('An error occurred while placing the order. Please try again.');
    }
  };

  // State for fish orders and modal visibility
  const [fishOrders, setFishOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFish, setNewFish] = useState({ name: '', gender: '', species: '', age: 0, weight: 0, length: 0, descriptions: '', qualifications: null });
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the fish being edited

  // Function to show modal for adding fish
  // Function to show modal for adding fish
  const showModal = () => {
    setNewFish({ name: '', gender: '', species: '', age: 0, weight: 0, length: 0, descriptions: '', qualifications: null });
    setEditingIndex(null); // Reset editing index for adding new fish
    setModalVisible(true);
  };

  // Function to show modal for editing fish
  const editFish = (index) => {
    setNewFish(fishOrders[index]); // Set the new fish data to the selected fish order
    setEditingIndex(index); // Store the index of the fish being edited
    setModalVisible(true);
  };

  // Function to handle modal cancel button
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFish((prev) => ({ ...prev, [name]: value }));
  };


  // Function to delete a row
  const deleteRow = (index) => {
    const updatedOrders = fishOrders.filter((_, i) => i !== index);
    setFishOrders(updatedOrders);
  };

  //HandleOK
  const handleModalOk = async (event) => {
    // Prevent default form submission if this is triggered from a submit button
    event.preventDefault();

    try {

      // Update fish orders
      if (editingIndex !== null) {
        const updatedOrders = fishOrders.map((order, index) => (index === editingIndex ? newFish : order));
        setFishOrders(updatedOrders);
        message.success('Fish information updated!');
      } else {
        setFishOrders([...fishOrders, newFish]);
        message.success('Fish added successfully!');
      }

      // Reset state and close modal
      setNewFish({ name: '', gender: '', species: '', age: 0, weight: 0, length: 0, descriptions: '', qualifications: null });
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Failed to save fish information. Please try again.');
    }
  };
  return (
    <div>
      <Row className="placeorder-page">
        <Navbar2 />
        <Col span={8} className="left-section">
          <h2 className="section-title">Order Confirmation</h2>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                    <th className="label-table">No</th>
                    <th className="label-table">Fish Type</th>
                    <th className="label-table">Gender</th>
                    <th className="label-table">Species</th>
                    <th className="label-table">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fishOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>
                        There is no fish, need to add more
                      </td>
                    </tr>
                  ) : (
                    fishOrders.map((order, index) => (
                      <tr key={index} onClick={() => editFish(index)} style={{ cursor: 'pointer' }}>
                        <td>{index + 1}</td>
                        <td>{order.name}</td>
                        <td>{order.gender}</td>
                        <td>{order.species}</td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from triggering edit
                              deleteRow(index);
                            }}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={showModal} className="add-button">
              Add Fish
            </button>

            {/* Modal for Adding Fish */}
            <Modal
              title={editingIndex !== null ? "Edit Fish Information" : "Add Fish Information"}
              open={modalVisible}
              onOk={handleModalOk}
              onCancel={handleCancel}
            >
              <h2>General Information</h2>
              <Form
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please enter fish name' }]} // Required validation
                >
                  <Input
                    name="name"
                    value={newFish.name}
                    onChange={handleInputChange}
                    placeholder="Enter fish name"
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  rules={[{ required: true, message: 'Please enter fish gender' }]} // Required validation
                >
                  <Select
                    placeholder="Choose a fish gender"
                    value={newFish.gender}
                    onChange={(value) => setNewFish({ ...newFish, gender: value })}
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="species"
                  rules={[{ required: true, message: 'Please enter fish species' }]} // Required validation
                >
                  <Input
                    name="species"
                    value={newFish.species}
                    onChange={handleInputChange}
                    placeholder="Enter fish species"
                  />
                </Form.Item>
                {/* css lai mot hang cho weight va length */}
                <Form.Item
                  name="age"
                  rules={[{ required: true, message: 'Please enter fish age' }]} // Required validation
                >
                  <Input
                    name="age"
                    type="number"
                    value={newFish.age}
                    onChange={handleInputChange}
                    placeholder="Enter fish age"
                  />
                </Form.Item>
                <h2 >Appearance</h2>
                <Form.Item
                  name="weight"
                  rules={[{ required: true, message: 'Please enter fish weight(kg)' }]} // Required validation
                >
                  <Input
                    name="weight"
                    type="number"
                    value={newFish.weight}
                    onChange={handleInputChange}
                    placeholder="Enter weight(kg)"
                  />
                </Form.Item>
                <Form.Item
                  name="length"
                  rules={[{ required: true, message: 'Please enter fish length(cm)' }]} // Required validation
                >
                  <Input
                    name="length"
                    type="number"
                    value={newFish.length}
                    onChange={handleInputChange}
                    placeholder="Enter length(cm)"
                  />
                </Form.Item>
                <h2>Additional Information</h2>
                <Form.Item
                  name="descriptions"
                  rules={[{ required: true, message: 'Please enter fish description' }]} // Required validation
                >
                  <Input
                    name="descriptions"
                    value={newFish.descriptions}
                    onChange={handleInputChange}
                    placeholder="Enter fish description"
                  />
                </Form.Item>
                <Form.Item
                  label="Qualifications"
                  name="qualifications"
                  rules={[{ required: true, message: 'Please enter fish qualifications' }]} // Required validation
                >
                  <Upload
                    beforeUpload={(file) => {
                      const isAcceptedFormat = file.type === 'image/jpeg' || file.type === 'image/png';
                      if (!isAcceptedFormat) {
                        message.error('You can only upload JPG/PNG files!');
                      }
                      return isAcceptedFormat; // Return false to prevent upload
                    }}
                    onChange={({ fileList }) => {
                      handleUploadChange(fileList); // Call your existing upload handler
                      if (fileList.length > 0) {
                        const imageUrl = URL.createObjectURL(fileList[0].originFileObj); // Create a URL for the uploaded image
                        // You can store or use the imageUrl as needed, but don't display it in the UI
                        console.log('Uploaded Image URL:', imageUrl); // Log the URL for debugging
                      }
                    }}
                    showUploadList={{ showRemoveIcon: true }} // Show upload list with remove icon
                    onPreview={(file) => {
                      // Logic to handle preview if needed
                      const imageUrl = URL.createObjectURL(file.originFileObj);
                      const imgWindow = window.open(imageUrl);
                      imgWindow.onload = () => URL.revokeObjectURL(imageUrl); // Clean up
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload Qualifications Image</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <h2 className="fish-orders-title">Payment Method</h2>
            <Form.Item
              label="Select Payment Method"
              name="paymentMethod"
              rules={[{ required: true, message: 'Please select a payment method' }]}
            >
              <Select placeholder="Choose a payment method">
                <Option value="credit_card">Credit Card</Option>
                <Option value="paypal">PayPal</Option>
                <Option value="bank_transfer">Bank Transfer</Option>
                <Option value="cash_on_delivery">Cash on Delivery</Option>
              </Select>
            </Form.Item>
            <div className="distance-display">
              Provisional Price: {totalPrice} VNĐ
            </div>
            <div className="distance-display">
              Transport By: {vehicleType === "536e4ccd-7442-450b-815c-3144c4bd41a5" ? "Air" : "Road"}
            </div>
            <Form.Item className="center-button">
              <Button type="primary" htmlType="submit" className="add-button">
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