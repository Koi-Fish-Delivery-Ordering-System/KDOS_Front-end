import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Input, Row, Col, Select, Checkbox, Radio, message } from 'antd';
import '../../../css/transportservice.css';

function ManageRoute() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [disabledItems, setDisabledItems] = useState(new Set());
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showSelected, setShowSelected] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchOrder = async () => {
    const query = `
      query FindManyProcessingOrder {
        findManyProcessingOrder {
          orderId
          fromProvince
          toProvince
          transportService {
            type
          }
        }
      }
    `;
    try {
      const orderResponse = await axios.post('http://26.61.210.173:3001/graphql', {
        query,       
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('API Response:', orderResponse.data);
      
      if (orderResponse.data && orderResponse.data.data) {
        setOrders(orderResponse.data.data.findManyProcessingOrder);
      } else {
        console.error('Invalid response structure:', orderResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('https://6703b45dab8a8f8927314be8.mockapi.io/orderEx/driver');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  useEffect(() => {
    fetchOrder();
    console.log(orders);
    console.log(sessionStorage.getItem('accessToken'));
    fetchDrivers();
  }, []);

  const handleCreate = () => {
    
    setShowForm(true);

  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const getSelectedFromProvinces = () => {
    return [...new Set(
      orders
        .filter(order => selectedOrders.includes(order.orderId))
        .map(order => order.fromProvince)
    )];
  };

  const filteredDrivers = selectedLocation
    ? drivers.filter(driver => driver.currentLocation === selectedLocation)
    : drivers;

  const handleCreateRoute = () => {
    if (!selectedDriver) {
      message.error('Please select a driver');
      return;
    }
    if (selectedOrders.length === 0) {
      message.error('Please select at least one order');
      return;
    }

    const routeData = {
      driverId: selectedDriver,
      orderIds: selectedOrders
    };

    console.log('Creating new route with data:', routeData);
    message.success('Route created successfully');
    
    // Reset form và đóng modal
    setSelectedDriver(null);
    setSelectedOrders([]);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manage Route</h1>
      <div>
        <button className="new-route-button" onClick={handleCreate}>Create New Route</button>
      </div>
      
      <Modal 
        title={isUpdate ? 'Update Route' : 'Create New Route'}
        open={showForm} 
        onCancel={() => setShowForm(false)}
        footer={null}
        width={1000}
        destroyOnClose={true}
      >
        <Row className="placeorder-page">
          
          <Col span={24} className="">
            <Form >
             
              
              {/* Fish Orders Table */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Orders</h2>
              </div>
              <div className="fish-orders-scroll-container">
                <table className="fixed-table">
                  <thead>
                    <tr>
                      <th className="label-table">Order Id</th>
                      <th className="label-table">Transport Type</th>
                      <th className="label-table">From Province</th>
                      <th className="label-table">To Province</th>
                      <th className="label-table">Select</th>
                    </tr>
                  </thead>
                  <tbody>                  
                    {orders.map((order) => (       
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.transportService?.type}</td>
                        <td>{order.fromProvince}</td>
                        <td>{order.toProvince}</td>
                        <td>
                          <Checkbox 
                            checked={selectedOrders.includes(order.orderId)}
                            onChange={() => handleOrderSelect(order.orderId)}
                          />
                        </td>
                      </tr>                      
                    ))}
                    
                  </tbody>
                </table>                
               </div>
               <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h2 className="section-title" style={{ margin: 0 }}>Driver</h2>
                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter by location"
                    allowClear
                    onChange={(value) => setSelectedLocation(value)}
                  >
                    {getSelectedFromProvinces().map(location => (
                      <Select.Option key={location} value={location}>
                        {location}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <table className="fixed-table">
                  <thead>
                    <tr>
                      <th className="label-table">Driver ID</th>
                      <th className="label-table">Driver Name</th>
                      <th className="label-table">Current Location</th>
                      <th className="label-table">Status</th>
                      <th className="label-table">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id}>
                        <td>{driver.id}</td>
                        <td>{driver.name}</td>
                        <td>{driver.currentLocation}</td>
                        <td>{driver.status}</td>
                        <td>
                          <Radio 
                            checked={selectedDriver === driver.id}
                            onChange={() => setSelectedDriver(driver.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>          
            </Form>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button 
            className="new-route-button" 
            onClick={handleCreateRoute}           
          >
            Create Route
          </button>
        </div>
          </Col>
        </Row>
        
      </Modal>
      <table className="transport-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Route Id</th>
            <th>Driver Name</th>
            <th>Status</th>           
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className={disabledItems.has(item.id) ? 'disabled-row' : ''}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description || 'N/A'}</td>
              <td>{item.updatedDate || 'N/A'}</td>
              <td>
               <button className="view-button" onClick={() => handleView(item.id)}><FontAwesomeIcon icon={faEye} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="arrow-button" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>&laquo;</button>
        <button className="arrow-button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lsaquo;</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button className="arrow-button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&rsaquo;</button>
        <button className="arrow-button" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
        <select
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          className="page-select"
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index} value={index + 1}>
              Page {index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ManageRoute;