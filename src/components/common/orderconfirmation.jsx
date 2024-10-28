import React, { useState } from 'react';

import { Form, Input, Button, Row, Col, message, Select, Modal, Upload, Checkbox } from 'antd';

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
  const [modalForm] = Form.useForm(); // Thêm form instance cho modal


  const { pickUpLocation, dropOffLocation, vehicleType, totalPrice, pickUpLocationName, dropOffLocationName } = location.state || {};
  const [qualificationsImage, setQualificationsImage] = useState([]);

  // Thêm hàm compress image
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(newFile);
          }, 'image/jpeg', 0.7); // Compress with 70% quality
        };
      };
    });
  };

  // Sửa lại hàm handleUploadChange
  const handleUploadChange = async ({ fileList }) => {
    // Check file size before compression
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    for (let file of fileList) {
      if (file.originFileObj && file.originFileObj.size > MAX_FILE_SIZE) {
        message.error('File size should not exceed 5MB');
        return;
      }
    }

    // Compress images
    const compressedFileList = await Promise.all(
      fileList.map(async (file) => {
        if (file.originFileObj) {
          const compressedFile = await compressImage(file.originFileObj);
          return {
            ...file,
            originFileObj: compressedFile
          };
        }
        return file;
      })
    );

    setQualificationsImage(compressedFileList);
    setNewFish(prev => ({
      ...prev,
      qualifications: compressedFileList
    }));
  };


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

        ageInMonth: order.age,
        weight: order.weight,
        length: order.length,
        description: order.descriptions,
        qualifications: order.qualifications // Ensure qualifications is an array
      }));

      // Tạo FormData để gửi cả data và files
      const formData = new FormData();
      
      // Thêm data vào FormData
      const orderData = {
        notes: '',
        totalPrice: totalPrice,
        fishes: fishes,
        transportServiceId: vehicleType,
        fromAddress: pickUpLocationName,
        toAddress: dropOffLocationName,
        receiverName: values.recipientName,
        receiverPhone: values.recipientPhone,
        paymentMethod: values.paymentMethod,
        additionalServiceIds: [],
      };

      formData.append('data', JSON.stringify(orderData));

      // Thêm files vào FormData
      fishOrders.forEach((fish, fishIndex) => {
        if (fish.qualifications) {
          fish.qualifications.forEach((file, fileIndex) => {
            if (file.originFileObj) {
              formData.append(
                `files`, 
                file.originFileObj,
                `fish_${fishIndex}_image_${fileIndex}.jpg`
              );
            }
          });
        }
      });

      // Get the token from localStorage
      const accessToken = sessionStorage.getItem("accessToken");

      // Send the data to the API with the token in the headers
      const response = await axios.post(
        'http://26.61.210.173:3001/api/orders/create-order', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );


      // Check if the request was successful
      if (response.status === 200 || response.status === 201) {
        message.success('Order placed successfully!');

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

  // Thêm state cho additional services
  const [selectedServices, setSelectedServices] = useState([]);

  // Thêm data mẫu cho services (có thể chuyển thành API call sau)
  const additionalServices = [
    { id: 1, name: 'Express Delivery', price: 50000 },
    { id: 2, name: 'Insurance', price: 100000 },
    { id: 3, name: 'Temperature Control', price: 75000 },
    { id: 4, name: 'Special Packaging', price: 60000 },
  ];

  // Thêm handler cho việc thay đổi services
  const handleServiceChange = (checkedValues) => {
    setSelectedServices(checkedValues);
  };

  // Function to show modal for adding fish
  // Function to show modal for adding fish
  const showModal = () => {
    modalForm.resetFields(); // Reset form fields
    setNewFish({
      name: '',
      gender: '',
      species: '',
      age: 0,
      weight: 0,
      length: 0,
      descriptions: '',
      qualifications: []
    });
    setQualificationsImage([]);
    setEditingIndex(null);

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

    // Reset form khi đóng modal
    setNewFish({
      name: '',
      gender: '',
      species: '',
      age: 0,
      weight: 0,
      length: 0,
      descriptions: '',
      qualifications: []
    });
    setQualificationsImage([]);
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFish((prev) => ({ ...prev, [name]: value }));

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

  const handleModalOk = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!newFish.name || !newFish.gender || !newFish.species ||
        !newFish.age || !newFish.weight || !newFish.length ||
        !newFish.descriptions) {
        message.error('Please fill in all required fields');
        return;
      }

      // Validate số liệu
      if (newFish.age <= 0 || newFish.weight <= 0 || newFish.length <= 0) {
        message.error('Age, weight, and length must be greater than 0');
        return;
      }

      const fishData = {
        ...newFish,
        age: Number(newFish.age),
        weight: Number(newFish.weight),
        length: Number(newFish.length)
      };

      if (editingIndex !== null) {
        const updatedOrders = [...fishOrders];
        updatedOrders[editingIndex] = fishData;
        setFishOrders(updatedOrders);
      } else {
        setFishOrders([...fishOrders, fishData]);
      }

      // Reset form và đóng modal
      setNewFish({ name: '', gender: '', species: '', age: 0, weight: 0, length: 0, descriptions: '', qualifications: null });
      setEditingIndex(null);
      setModalVisible(false);
      message.success(editingIndex !== null ? 'Fish updated successfully!' : 'Fish added successfully!');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save fish information');

    }
  };
  return (
    <div>
      <Row className="placeorder-page">
        <Navbar2 />
        <Col span={8} className="left-section">
          
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* <Form.Item label="Sender Notes" name="senderNote" >
              <Input placeholder="Enter your notes" />
            </Form.Item> */}
            <h2 className="section-title">Recipient Information</h2>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Recipient Name" name="recipientName" rules={[{ required: true, message: 'Please enter recipient name' }]}>
                  <Input placeholder="Enter recipient name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Recipient Phone" name="recipientPhone" rules={[{ required: true, message: 'Please enter recipient phone' }]}>
                  <Input placeholder="Enter recipient phone" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Recipient Address" name="recipientAddress" rules={[{ required: true, message: 'Please enter recipient address' }]}>
              <Input placeholder="Enter recipient address" />
            </Form.Item>
            {/* Fish Orders Table */}
            <h2 className="section-title">Fish Orders</h2>
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


            {/* Additional Services Section */}
            <h2 className="section-title">Additional Services</h2>
            {/* <Form.Item name="additionalServices">
              <Checkbox.Group 
                style={{ width: '100%' }} 
                onChange={handleServiceChange}
              >
                <Row>
                  {additionalServices.map(service => (
                    <Col span={12} key={service.id} style={{ marginBottom: '8px' }}>
                      <Checkbox value={service.id}>
                        <span>{service.name}</span>
                        <span style={{ marginLeft: '8px', color: '#1890ff' }}>
                          (+{service.price.toLocaleString()} VNĐ)
                        </span>
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item> */}


            {/* Modal for Adding Fish */}
            <Modal
              title={editingIndex !== null ? "Edit Fish Information" : "Add Fish Information"}
              open={modalVisible}
              onOk={handleModalOk}
              onCancel={handleCancel}

              okText={editingIndex !== null ? "Update" : "Add"}
            >
              <Form
                form={modalForm}
                layout="vertical"
                initialValues={{
                  name: '',
                  gender: '',
                  species: '',
                  age: '',
                  weight: '',
                  length: '',
                  descriptions: '',
                  qualifications: []
                }}
              >
                <Form.Item
                  label="Fish Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter fish name' }]}
                >
                  <Input
                    onChange={(e) => handleInputChange({ target: { name: 'name', value: e.target.value } })}

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

                <h2 className="section-title">Additional Information</h2>

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

                >
                  <Upload
                    listType="picture-card"
                    fileList={newFish.qualifications || []}
                    onChange={handleUploadChange}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('You can only upload image files!');
                        return false;
                      }
                      const isLt5M = file.size / 1024 / 1024 < 5;
                      if (!isLt5M) {
                        message.error('Image must be smaller than 5MB!');
                        return false;
                      }
                      return false; // Prevent automatic upload
                    }}
                  >
                    {(!newFish.qualifications || newFish.qualifications.length < 5) && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>

            <h2 className="section-title">Payment Method</h2>

            <Form.Item
              label="Select Payment Method"
              name="paymentMethod"
              rules={[{ required: true, message: 'Please select a payment method' }]}
            >
              <Select placeholder="Choose a payment method">

                <Option value="banking">Bank Transfer</Option>
                <Option value="cash">Cash</Option>
              </Select>
            </Form.Item>
            <div className="distance-display">
              Provisional Price: {totalPrice.toLocaleString()} VNĐ
            </div>
            <Form.Item >
              <Button type="primary" htmlType="submit" className="submit-btn">

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
