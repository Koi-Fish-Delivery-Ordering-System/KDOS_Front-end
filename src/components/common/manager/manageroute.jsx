import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Input, Row, Col, Select, Checkbox } from 'antd';

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

  useEffect(() => {
    fetchOrder();
    console.log(orders);
    console.log(sessionStorage.getItem('accessToken'));
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
      >
        <Row className="placeorder-page">
          
          <Col span={24} className="">
            <Form >
             
              
              {/* Fish Orders Table */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Orders</h2>
                {/* <a onClick={showModal} style={{ color: '#ff7700', cursor: 'pointer' }}>+ Add Fish</a> */}
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


              
              
            </Form>
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