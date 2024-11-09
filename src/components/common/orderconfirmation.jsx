import React, { useState, useEffect, useCallback } from 'react';
import { LoadScriptNext, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { Form, Input, Button, Row, Col, message, Select, Modal, Upload, Checkbox, Tooltip, Spin } from 'antd';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import DeliveryMap from './Map';
import Navbar2 from './navbar2';
import '../../css/addfishorder.css';
import Footer from './footer';
import axios from 'axios';
//firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { app } from "../../config/firebase";
import Avatar from 'antd/es/avatar/avatar';




const { Option } = Select; // Destructure Option from Select
const { TextArea } = Input;
const OrderConfirmation = () => {
  const defaultPosition = [10.8231, 106.6297]; // Default coordinates for Ho Chi Minh City
  const [image, setImage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm(); // Thêm form instance cho modal
  const libraries = ["places"];
  const mapContainerStyle = {
    height: "95vh",
    width: "100%",
  };
  const { pickUpLocation, dropOffLocation, vehicleType, totalPrice, pickUpLocationName, dropOffLocationName, selectedService, servicePricingType, pricePerAmount, pricePerKg, fromProvince, toProvince } = location.state || {};
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

    // Compress images and add mediaIndex
    const compressedFileList = await Promise.all(
      fileList.map(async (file, index) => {
        if (file.originFileObj) {
          const compressedFile = await compressImage(file.originFileObj);
          return {
            ...file,
            originFileObj: compressedFile,
            mediaIndex: index // Add mediaIndex to each file
          };
        }
        return {
          ...file,
          mediaIndex: index // Add mediaIndex even if file is not compressed
        };
      })
    );

    setQualificationsImage(compressedFileList);
    setNewFish(prev => ({
      ...prev,
      qualifications: compressedFileList
    }));
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
        qualifications: order.qualifications.map(q => q.url),
        fishImageUrl: order.fishImage?.url
      }));

      // Prepare the order data
      const orderData = {
        
          notes: values.notes,
          totalPrice: calculatedFinalPrice,
          fishes: fishOrders.map(order => ({
            name: order.name,
            gender: order.gender,
            species: order.species,
            ageInMonth: order.age,
            weight: order.weight,
            length: order.length,
            description: order.descriptions,
            qualifications: order.qualifications.map(q => q.url),
            fishImageUrl: order.fishImage?.url
          })),
          transportServiceId: vehicleType,
          fromAddress: pickUpLocationName,
          toAddress: dropOffLocationName,
          fromProvince: fromProvince,
          toProvince: toProvince,
          receiverName: values.receiverName,
          receiverPhone: values.receiverPhone,
          paymentMethod: values.paymentMethod,
          additionalServiceIds: selectedAdditionalServices,
          servicePricingType: servicePricingType
        
        
      };

      // Convert orderData to FormData if you need to send files
      const formData = new FormData();
      formData.append('data', JSON.stringify(orderData));
      // console.log('FormData:', formData.get('data'));
      
      console.log(orderData);
      const accessToken = sessionStorage.getItem("accessToken");
      console.log(accessToken);
      // Send the data to the API with the token in the headers
      const response = await axios.post(
        'http://26.61.210.173:3001/api/orders/create-order',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },         
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (values.paymentMethod === "vnpay") {
          window.location.href = response.data.others?.paymentUrl;
        } else {
          navigate('/account-management', { state: { activeComponent: 'orders' } });
          message.success('Order placed successfully!');
        }
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
  const [newFish, setNewFish] = useState({
    name: '',
    gender: '',
    species: '',
    age: 0,
    weight: 0,
    length: 0,
    descriptions: '',
    qualifications: [],
    fishImage: null // Change to a single image object
  });
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the fish being edited

  // Thêm state cho additional services
  const [selectedServices, setSelectedServices] = useState([]);

  // Thêm data mẫu cho services (có thể chuyển thành API call sau)


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
      qualifications: [],
      fishImage: null // Initialize fishImage
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
      qualifications: [],
      fishImage: null // Initialize fishImage
    });
    setQualificationsImage([]);
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
        !newFish.age || !newFish.weight || !newFish.length
      ) {
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
      setNewFish({ name: '', gender: '', species: '', age: 0, weight: 0, length: 0, descriptions: '', qualifications: null, fishImage: null });
      setEditingIndex(null);
      setModalVisible(false);
      message.success(editingIndex !== null ? 'Fish updated successfully!' : 'Fish added successfully!');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to save fish information');

    }
  };

  // Add new state for additional services
  const [additionalServices, setAdditionalServices] = useState([]);
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([]);

  // Update the fetchAdditionalServices function to store the results
  const fetchAdditionalServices = async () => {
    const query = `
      query FindManySuitableAdditionalService($data: FindManySuitableAdditionalServiceInputData!) {
        findManySuitableAdditionalService(data: $data) {
          additionalServiceId
          name
          price
        }
      }
    `;
    const accessToken = sessionStorage.getItem("accessToken");

    try {
      const additionalServiceResponse = await axios.post('http://26.61.210.173:3001/graphql',
        { query, variables: { data: { transportType: selectedService } } },
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (additionalServiceResponse.data?.data?.findManySuitableAdditionalService) {
        setAdditionalServices(additionalServiceResponse.data.data.findManySuitableAdditionalService);
      }
    } catch (error) {
      console.error('Error fetching additional services:', error);
      message.error('Failed to load additional services');
    }
  };

  // Add handler for checkbox changes
  const handleAdditionalServiceChange = (checkedValues) => {
    setSelectedAdditionalServices(checkedValues);
  };

  // Update useEffect to fetch services when component mounts
  useEffect(() => {
    fetchAdditionalServices();
  }, [selectedService]); // Re-fetch when selectedService changes

  // Add new state for calculated final price
  const [calculatedFinalPrice, setCalculatedFinalPrice] = useState(0);

  // Add function to calculate total price
  const calculateTotalPrice = () => {
    let finalPrice = totalPrice;

    // Add additional services prices
    const additionalServicesTotal = selectedAdditionalServices.reduce((sum, serviceId) => {
      const service = additionalServices.find(s => s.additionalServiceId === serviceId);
      return sum + (service ? service.price : 0);
    }, 0);
    finalPrice += additionalServicesTotal;

    // Calculate based on pricing type
    if (servicePricingType === 'volume') {
      const totalWeight = fishOrders.reduce((sum, fish) => sum + Number(fish.weight), 0);
      finalPrice += totalWeight * pricePerKg;
    } else if (servicePricingType === 'amount') {
      finalPrice += fishOrders.length * pricePerAmount;
    }

    setCalculatedFinalPrice(finalPrice);
  };

  // Update useEffect to recalculate price when relevant values change
  useEffect(() => {
    calculateTotalPrice();
  }, [fishOrders, selectedAdditionalServices, servicePricingType]);

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Add this state for tracking script loading
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const onMapLoad = useCallback((map) => {
    setMapLoaded(true);
    setMap(map);
  }, []);

  // Modify fitBounds to check for script loading
  const fitBounds = useCallback(() => {
    if (map && window.google && location.state?.pickUpLocation && location.state?.dropOffLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(location.state.pickUpLocation);
      bounds.extend(location.state.dropOffLocation);
      map.fitBounds(bounds);

      const padding = { top: 50, right: 50, bottom: 50, left: 50 };
      map.fitBounds(bounds, padding);
    }
  }, [map, location.state]);

  // Add script load handler
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };
  const [loading, setLoading] = useState(false); // State to track loading

  const handleImageUpload = async (info) => {
    const { fileList } = info; // Get the file list from the info object

    // Filter out files that have been removed
    const filteredFileList = fileList.filter(file => file.status !== 'removed');

    const uploadPromises = []; // Array to hold upload promises
    setLoading(true); // Set loading to true when upload starts

    for (let i = 0; i < filteredFileList.length; i++) {
      const selectedImage = filteredFileList[i].originFileObj; // Access the original file object
      if (selectedImage) {
        const storageRef = ref(getStorage(app), `manyimages/${selectedImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        // Create a promise for each upload task
        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload of ${selectedImage.name} is ${progress}% done`);
            },
            (error) => {
              console.error(`Error uploading ${selectedImage.name}:`, error);
              reject(error); // Reject the promise on error
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log(`Download URL for ${selectedImage.name}:`, downloadURL);
                resolve({ url: downloadURL, name: selectedImage.name }); // Resolve with an object containing the URL and name
              });
            }
          );
        });

        uploadPromises.push(uploadPromise); // Add the promise to the array
      }
    }

    // Wait for all uploads to complete
    try {
      const downloadURLs = await Promise.all(uploadPromises);

      // Append the new URLs to the existing fileList
      const updatedFileList = [
        ...newFish.qualifications.filter(file => file.status !== 'removed'), // Keep existing images that are not removed
        ...downloadURLs.map(file => ({
          uid: file.name,
          name: file.name,
          status: 'done',
          url: file.url
        }))
      ];

      setNewFish(prev => ({
        ...prev,
        qualifications: updatedFileList
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false); // Set loading to false when upload completes
    }
  };

  useEffect(() => {
    if (isScriptLoaded) {
      fitBounds();
    }
  }, [isScriptLoaded, mapLoaded, location.state, fitBounds]);

  const handleFishImageUpload = async (info) => {
    const { file } = info;
    setLoading(true);

    if (file.status === 'removed') {
      setNewFish(prev => ({
        ...prev,
        fishImage: null
      }));
      setLoading(false);
      return;
    }

    const selectedImage = file.originFileObj;
    if (selectedImage) {
      const storageRef = ref(getStorage(app), `fishimages/${selectedImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload of ${selectedImage.name} is ${progress}% done`);
        },
        (error) => {
          console.error(`Error uploading ${selectedImage.name}:`, error);
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`Download URL for ${selectedImage.name}:`, downloadURL);
          setNewFish(prev => ({
            ...prev,
            fishImage: {
              uid: selectedImage.name,
              name: selectedImage.name,
              status: 'done',
              url: downloadURL
            }
          }));
          setLoading(false);
        }
      );
    }
  };

  return (
    <LoadScriptNext
      googleMapsApiKey="AIzaSyDJO2B-_FLwk1R1pje5gKEAB9h2qUDb-FU"
      libraries={libraries}
      onLoad={handleScriptLoad}
    >
      <div>

        <Row className="placeorder-page">
          <Navbar2 />
          <Col span={8} className="left-section">

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              {/* <Form.Item label="Sender Notes" name="senderNote" >
              <Input placeholder="Enter your notes" />
            </Form.Item> */}
              <h2 className="section-title">Receiver Information</h2>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Receiver Name" name="receiverName" rules={[{ required: true, message: 'Please enter receiver name' }]}>
                    <Input placeholder="Enter receiver name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Receiver Phone" name="receiverPhone" rules={[{ required: true, message: 'Please enter receiver phone' }]}>
                    <Input placeholder="Enter receiver phone" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Fish Orders Table */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Fish Orders</h2>
                <a onClick={showModal} style={{ color: '#ff7700', cursor: 'pointer' }}>+ Add Fish</a>
              </div>
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


              {/* Additional Services Section */}
              {additionalServices.length > 0 && (
                <>
                  <h2 className="section-title">Additional Services</h2>
                  <Form.Item name="additionalServices">
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      onChange={handleAdditionalServiceChange}
                    >
                      <Row gutter={[16, 16]}>
                        {additionalServices.map(service => (
                          <Col span={24} key={service.additionalServiceId}>
                            <Checkbox value={service.additionalServiceId}>
                              <span>{service.name}</span>
                              <span style={{ marginLeft: '8px', color: '#1890ff' }}>
                                (+{service.price.toLocaleString()} VNĐ)
                              </span>
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </>
              )}

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
                    qualifications: [],
                    fishImage: null // Initialize fishImage
                  }}
                >
                  <h2 className="section-title">Fish Information</h2>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter fish name' }]}
                        label="Fish Name"
                      >
                        <Input
                          onChange={(e) => handleInputChange({ target: { name: 'name', value: e.target.value } })}
                          placeholder="Enter fish name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        rules={[{ required: true, message: 'Please enter fish gender' }]}
                        label="Fish Gender"
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
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="species"
                        rules={[{ required: true, message: 'Please enter fish species' }]}
                        label="Fish Species"
                      >
                        <Input
                          name="species"
                          value={newFish.species}
                          onChange={handleInputChange}
                          placeholder="Enter fish species"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="age"
                        rules={[{ required: true, message: 'Please enter fish age' }]}
                        label="Fish Age"
                      >
                        <Input
                          name="age"
                          type="number"
                          value={newFish.age}
                          onChange={handleInputChange}
                          placeholder="Enter fish age"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <h2 className="section-title">Appearance</h2>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="weight"
                        rules={[{ required: true, message: 'Please enter fish weight(kg)' }]}
                        label="Fish Weight"
                      >
                        <Input
                          name="weight"
                          type="number"
                          value={newFish.weight}
                          onChange={handleInputChange}
                          placeholder="Enter weight(kg)"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="length"
                        rules={[{ required: true, message: 'Please enter fish length(cm)' }]}
                        label="Fish Length"
                      >
                        <Input
                          name="length"
                          type="number"
                          value={newFish.length}
                          onChange={handleInputChange}
                          placeholder="Enter length(cm)"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <h2 className="section-title">Additional Information</h2>
                  <Form.Item
                    name="descriptions"

                    label="Fish Description"
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
                    <Spin spinning={loading}> {/* Wrap the Upload component with Spin */}
                      <Upload
                        listType="picture-card"
                        fileList={newFish.qualifications || []}
                        onChange={handleImageUpload}
                        onRemove={(file) => {
                          const updatedFileList = newFish.qualifications.filter(item => item.uid !== file.uid);
                          setNewFish(prev => ({
                            ...prev,
                            qualifications: updatedFileList
                          }));
                          return true; // Return true to confirm removal
                        }}
                      >
                        {Array.isArray(newFish.qualifications) && newFish.qualifications.length < 5 && '+ Upload'}
                      </Upload>
                      
                    </Spin>
                  </Form.Item>

                  <Form.Item
                    label="Fish Image"
                    name="fishImage"
                  >
                    <Spin spinning={loading}>
                      <Upload
                        listType="picture-card"
                        fileList={newFish.fishImage ? [newFish.fishImage] : []}
                        onChange={handleFishImageUpload}
                        onRemove={() => {
                          setNewFish(prev => ({
                            ...prev,
                            fishImage: null
                          }));
                          return true;
                        }}
                        maxCount={1} // Limit to one image
                      >
                        {!newFish.fishImage && '+ Upload'}
                      </Upload>
                    </Spin>
                  </Form.Item>

                </Form>
              </Modal>
              <h2 className="section-title">Note</h2>
              <Form.Item
                name="notes"
                rules={[{  message: 'Please enter your notes' }]}
              >
                <TextArea placeholder="Enter your notes" />
              </Form.Item>
              <h2 className="section-title">Payment Method</h2>

              <Form.Item
                label="Select Payment Method"
                name="paymentMethod"
                rules={[{ required: true, message: 'Please select a payment method' }]}
              >
                <Select placeholder="Choose a payment method">

                  <Option value="vnpay">VN Pay</Option>
                  <Option value="cash">Cash</Option>
                </Select>
              </Form.Item>
              <div className="distance-display">
                Final Price: {calculatedFinalPrice.toLocaleString()} VNĐ
                <Tooltip 
                  title={
                      <div>
                        Provisional Price: Total distance × Price per Km<br />
                        Transport Fee ({servicePricingType}): {servicePricingType === 'volume'
                          ? `Price per kg (${pricePerKg?.toLocaleString()} VNĐ) × Total Weight (${fishOrders.reduce((sum, fish) => sum + Number(fish.weight), 0)} kg)`
                          : `Price per amount (${pricePerAmount?.toLocaleString()} VNĐ) × Number of Fish (${fishOrders.length})`
                        }<br />
                        Final Price = Provisional Price + Transport Fee + Additional Services Price (optional)<br />
                        <br />
                        Provisional Price: {totalPrice.toLocaleString()} VNĐ<br />
                        Transport Fee ({servicePricingType}): {servicePricingType === 'volume'
                          ? `${(pricePerKg * fishOrders.reduce((sum, fish) => sum + Number(fish.weight), 0)).toLocaleString()} VNĐ`
                          : `${(pricePerAmount * fishOrders.length).toLocaleString()} VNĐ`
                        }<br />

                        Additional Services Price: {selectedAdditionalServices.reduce((sum, serviceId) => {
                          const service = additionalServices.find(s => s.additionalServiceId === serviceId);
                          return sum + (service ? service.price : 0);
                        }, 0).toLocaleString()} VNĐ<br />
                        <br />
                        Final Price: {calculatedFinalPrice.toLocaleString()} VNĐ

                      </div>
                    }
                    overlayStyle={{
                      maxWidth: '400px',
                      minWidth: '300px'
                    }}
                  >
                    <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: '10px' }} />
                  </Tooltip>
                </div>
                <Form.Item >
                  <Button type="primary" htmlType="submit" className="submit-btn">

                    Submit
                  </Button>
                </Form.Item>
              </Form>

            </Col>

            <Col span={16} className="map-section">

              {isScriptLoaded && (
                <div style={{ height: '400px', width: '100%' }}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={location.state?.pickUpLocation || { lat: 10.8231, lng: 106.6297 }}
                    onLoad={onMapLoad}
                  >
                    {pickUpLocation && (
                      <Marker
                        position={pickUpLocation}
                        icon={{

                          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                          scaledSize: new window.google.maps.Size(40, 40)
                        }}
                        title="Pick-up Location"
                      />
                    )}

                    {dropOffLocation && (
                      <Marker
                        position={dropOffLocation}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                          scaledSize: new window.google.maps.Size(40, 40)
                        }}
                        title="Drop-off Location"
                      />
                    )}
                  </GoogleMap>

                  {location.state?.distance && (
                    <div className="distance-info" style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      backgroundColor: 'white',
                      padding: '10px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      zIndex: 1
                    }}>
                      <strong>Distance:</strong> {location.state.distance.toFixed(2)} km
                    </div>
                  )}
                </div>
              )}

            </Col>

          </Row>
          <Footer />
        </div>
      </LoadScriptNext>
    );
  };

  export default OrderConfirmation;
