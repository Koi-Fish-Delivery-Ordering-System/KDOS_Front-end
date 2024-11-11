import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/orderhistory.css";
import { Modal, Input, Tabs, Carousel } from 'antd';
import { faFish } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'; // Import icons for arrows

const OrderHistory = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = sessionStorage.getItem('accessToken');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFish, setSelectedFish] = useState(null);
  const [fishImages, setFishImages] = useState({});
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isViewFeedbackModalOpen, setIsViewFeedbackModalOpen] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { TabPane } = Tabs;

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
          
        }
      }
    `;
      const orderResponse = await axios.post('http://26.61.210.173:3001/graphql', { query }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setOrder(orderResponse.data.data.findManyUserOrder);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchImages = async (qualifications, fishId) => {
    try {
      const imagePromises = qualifications.map(qual =>
        axios.get(`http://26.61.210.173:3001/api/assets/get-image/${qual.fileId}`, {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      );

      const responses = await Promise.all(imagePromises);
      const urls = responses.map(res => URL.createObjectURL(res.data));
      setFishImages(prev => ({
        ...prev,
        [fishId]: urls
      }));
    } catch (error) {
      console.error('Error fetching images:', error);
      console.error('Error details:', error.response);
    }
  };

  const showOrderDetail = (orderItem) => {
    setSelectedOrder(orderItem);
    setIsModalOpen(true);
  };

  const handleFishClick = (fish) => {
    setSelectedFish(fish);
    setFishImages({});

    if (fish && fish.qualifications && fish.qualifications.length > 0) {
      const imageUrls = fish.qualifications.map(qual => qual.imageUrl);

      if (fish.orderFishId) {
        setFishImages(prev => ({
          ...prev,
          [fish.orderFishId]: imageUrls
        }));
      } else {
        console.error("Fish does not have an orderFishId:", fish);
      }
    } else {
      console.error("Fish is null or has no qualifications:", fish);
    }
  };

  const feedback = (orderItem) => {
    setSelectedOrder(orderItem);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackContent.length < 20) {
      alert('Feedback must be at least 20 characters long.');
      return;
    }
    try {
      await axios.patch(`http://26.61.210.173:3001/api/orders/create-order-feedback`, {
        orderId: selectedOrder.orderId,
        feedBackStars: feedbackStars,
        feedBackContent: feedbackContent
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      console.log('Feedback submitted:', feedbackStars, feedbackContent);
      setIsFeedbackModalOpen(false);
      setFeedbackStars(0);
      setFeedbackContent('');
      fetchOrder();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const viewFeedback = (orderItem) => {
    setSelectedOrder(orderItem);
    setIsViewFeedbackModalOpen(true);
  };

  // Separate orders into completed and other orders
  const completedOrders = order.filter(orderItem => orderItem.orderStatus === 'completed');
  const otherOrders = order.filter(orderItem => orderItem.orderStatus !== 'completed');

  const openImageOverlay = (imageUrl) => {
    // Create an image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = 'auto'; // Maintain aspect ratio
    img.style.height = '80vh'; // Set height to 80% of the viewport height
    img.style.maxWidth = '90vw'; // Ensure it doesn't exceed 90% of the viewport width
    img.style.objectFit = 'contain'; // Maintain aspect ratio
    img.style.borderRadius = '8px'; // Optional: add some border radius for aesthetics

    // Create an overlay div
    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black background
    overlayDiv.style.display = 'flex';
    overlayDiv.style.justifyContent = 'center';
    overlayDiv.style.alignItems = 'center';
    overlayDiv.style.zIndex = '1000'; // Ensure it is on top of other elements
    overlayDiv.style.cursor = 'pointer'; // Change cursor to pointer

    // Close the overlay when clicking on the overlay
    overlayDiv.onclick = () => {
      document.body.removeChild(overlayDiv); // Remove the overlay from the DOM
    };

    // Append the image to the overlay
    overlayDiv.appendChild(img);
    // Append the overlay to the body
    document.body.appendChild(overlayDiv);
  };

  const openImageModal = (index) => {
    if (selectedFish) {
      setCurrentImageIndex(index);
      setIsImageModalOpen(true);
    } else {
      console.error("Selected fish is null:", selectedFish);
    }
  };

  const handleImageClick = (index) => {
    openImageModal(index);
  };

  const nextArrow = (
    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
      <RightOutlined style={{ fontSize: '24px', color: '#fff' }} />
    </div>
  );

  const prevArrow = (
    <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
      <LeftOutlined style={{ fontSize: '24px', color: '#fff' }} />
    </div>
  );

  return (

    <div className="records">
      <h1 className="section-title" >Order History</h1>



      {loading ? (
        <div className="loading">Loading...</div>
      ) : order.length > 0 ? (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Process Orders" key="1">
            {otherOrders.length > 0 ? (
              <div className="orders-container">
                {otherOrders.map((orderItem) => (
                  <div key={orderItem.orderId} className="order-card">
                    <div className="order-detail">
                      <span className="label">Order ID:</span> {orderItem.orderId}
                    </div>
                    <div className="order-detail">
                      <span className="label">Date:</span> {new Date(orderItem.createdAt).toLocaleDateString()}
                    </div>
                    <div className="order-detail">
                      <span className="label">Receiver Name:</span> {orderItem.receiverName}
                    </div>
                    <div className="order-detail">
                      <span className="label">Total Price:</span> {orderItem.totalPrice.toLocaleString()} VNĐ
                    </div>
                    <div className="order-actions">
                      <span className={`status ${orderItem.orderStatus}`}>{orderItem.orderStatus}</span>
                      <div className="order-actions-button" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="detail-button" onClick={() => showOrderDetail(orderItem)}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyState">
                <p>No other orders found.</p>
              </div>
            )}
          </TabPane>
          <TabPane tab="Completed Orders" key="2">
            {completedOrders.length > 0 ? (
              <div className="orders-container">
                {completedOrders.map((orderItem) => (
                  <div key={orderItem.orderId} className="order-card">
                    <div className="order-detail">
                      <span className="label">Order ID:</span> {orderItem.orderId}
                    </div>
                    <div className="order-detail">
                      <span className="label">Date:</span> {new Date(orderItem.createdAt).toLocaleDateString()}
                    </div>
                    <div className="order-detail">
                      <span className="label">Receiver Name:</span> {orderItem.receiverName}
                    </div>
                    <div className="order-detail">
                      <span className="label">Total Price:</span> {orderItem.totalPrice.toLocaleString()} VNĐ
                    </div>
                    <div className="order-actions">
                      <span className={`status ${orderItem.orderStatus}`}>{orderItem.orderStatus}</span>
                      <div className="order-actions-button" >
                        <button className="detail-button" onClick={() => showOrderDetail(orderItem)}>View Details</button>
                        {orderItem.feedBackStars === null ? (
                          <button className="detail-button" onClick={() => feedback(orderItem)}>Feedback</button>
                        ) : (
                          <button className="detail-button" onClick={() => viewFeedback(orderItem)}>View Feedback</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyState">
                <p>No completed orders found.</p>
              </div>
            )}
          </TabPane>
        </Tabs>
      ) : (
        <div className="emptyState">
          <h2>There is no order</h2>
        </div>
      )}

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
          <div className="modal-content">
            <div className="order-info">
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
              <h4 style={{ marginTop: '20px', color: '#1a1a1a' }}>Ordered Fish:</h4>
              <div className="fish-list">
                {selectedOrder.orderedFish && selectedOrder.orderedFish.map((fish, index) => (
                  <div
                    key={index}
                    className={`fish-item ${selectedFish === fish ? 'selected' : ''}`}
                    onClick={() => handleFishClick(fish)}
                  >
                    {fish.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="fish-details">
              <h3>Fish Details</h3>
              {selectedFish ? (
                <div className="fish-info">
                  <p><strong>Name:</strong> {selectedFish.name}</p>
                  <p><strong>Species:</strong> {selectedFish.species}</p>
                  <p><strong>Gender:</strong> {selectedFish.gender}</p>
                  <p><strong>Age:</strong> {selectedFish.ageInMonth} months</p>
                  <p><strong>Weight:</strong> {selectedFish.weight} g</p>
                  <p><strong>Description:</strong> {selectedFish.description}</p>
                  <div className="fish-images">
                    <p><strong>Fish Image:</strong></p>
                    <img
                      src={selectedFish.fishImageUrl}
                      alt="Fish Image"
                      className="fish-image"
                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                    />
                  </div>
                  <p><strong>Qualifications:</strong></p>
                  <div className="fish-images" onClick={() => setShowAllImages(!showAllImages)} style={{ display: 'flex', alignItems: 'center' }}>
                    {fishImages[selectedFish.orderFishId]?.slice(0, showAllImages ? fishImages[selectedFish.orderFishId].length : 2).map((imageUrl, index) => (
                      <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
                        <img
                          src={imageUrl}
                          alt={`Fish ${index + 1}`}
                          className="fish-image"
                          style={{ maxWidth: '150px', maxHeight: '150px', cursor: 'pointer' }}
                          onClick={() => handleImageClick(index)}
                        />
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '50%', padding: '5px' }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click from bubbling up to the parent div
                            openImageOverlay(imageUrl); // Call the function to open the image in fullscreen
                          }}
                        />
                      </div>
                    ))}
                    {fishImages[selectedFish.orderFishId]?.length > 2 && !showAllImages && (
                      <span className="plus-sign" style={{ fontSize: '150%', marginLeft: '30px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowAllImages(!showAllImages)}>
                        +{fishImages[selectedFish.orderFishId].length - 2} images
                      </span>
                    )}
                  </div>

                </div>
              ) : (
                <div className="empty-state">
                  <FontAwesomeIcon icon={faFish} style={{ fontSize: '40px', margin: 'auto', display: 'block' }} />
                  <p>Select a fish to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={<h2 style={{ margin: 0, color: '#ff7700' }}>Feedback</h2>}
        open={isFeedbackModalOpen}
        onCancel={() => setIsFeedbackModalOpen(false)}
        okText="Submit"
        onOk={handleFeedbackSubmit}

      >
        <div className="feedback-content">
          <h3>Rate your experience</h3>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${feedbackStars >= star ? 'selected' : ''}`}
                onClick={() => setFeedbackStars(star)}
                style={{ cursor: 'pointer', fontSize: '24px', color: feedbackStars >= star ? '#ff7700' : '#ccc' }}
              >
                ★
              </span>
            ))}
          </div>
          <Input.TextArea
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
            placeholder="Write your feedback here..."
            rows={4}
            style={{ width: '100%', marginTop: '10px' }}
          />
        </div>
      </Modal>

      <Modal
        title={<h2 style={{ margin: 0, color: '#ff7700' }}>Your Feedback</h2>}
        open={isViewFeedbackModalOpen}
        onCancel={() => setIsViewFeedbackModalOpen(false)}
        footer={null}
        centered
      >
        {selectedOrder && (
          <div style={{ padding: '20px', fontSize: '16px' }}>
            <p><strong>Stars:</strong> <span className={`star-rating stars-${selectedOrder.feedBackStars || 0}`}>★★★★★</span></p>
            <p>
              <strong >Feedback:</strong> {selectedOrder.feedBackContent}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Image Gallery"
        open={isImageModalOpen}
        onCancel={() => setIsImageModalOpen(false)}
        footer={null}
        centered
      >
        <Carousel afterChange={setCurrentImageIndex} nextArrow={nextArrow} prevArrow={prevArrow}>
          {fishImages[selectedFish?.orderFishId]?.map((imageUrl, index) => (
            <div key={index}>
              <img src={imageUrl} alt={`Fish ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
};

export default OrderHistory;
