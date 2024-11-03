import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Input, Row, Col, Select, Checkbox, Radio, message, Table, Spin } from 'antd';
import '../../../css/transportservice.css';

function ManageRoute() {
  const [showForm, setShowForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);


  const [disabledItems, setDisabledItems] = useState(new Set());
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }


  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const query = `
      query FindManyAvailableDriver {
  findManyAvailableDriver {
    driverId
    currentProvince
          status
          account {
            username
          }
          }
        }
      `;
      const driverResponse = await axios.post('http://26.61.210.173:3001/graphql', {
        query,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });
      setDrivers(driverResponse.data.data.findManyAvailableDriver);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const query = `
      query FindManyRoutes {
        findManyRoutes {
          routeId
          driver {
            account {
              username
            }
          }
          status
          deliveryStartDate
          updatedAt
          notes
          routeStops {
            address
            status
            stopType
            orderId
          }
        }
      }
      `;
      const routeResponse = await axios.post('http://26.61.210.173:3001/graphql', {
        query,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        }
      });
      setRoutes(routeResponse.data.data.findManyRoutes);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrder();
    console.log(orders);
    console.log(sessionStorage.getItem('accessToken'));
    fetchDrivers();
    fetchRoutes();
  }, []);

  const handleCreate = () => {

    setShowForm(true);

  };






  const handleView = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

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
    ? drivers.filter(driver => driver.currentProvince === selectedLocation)
    : drivers;

  const handleCreateRoute = async (values) => {
    if (!selectedDriver) {
      message.error('Please select a driver');
      return;
    }
    if (selectedOrders.length === 0) {
      message.error('Please select at least one order');
      return;
    }
    const formData = form.getFieldsValue();
    const routeData = {
      notes: formData.note,
      driverId: selectedDriver,
      orderIds: selectedOrders
    };
    const createRouteResponse = await axios.post('http://26.61.210.173:3001/api/transport/create-route', routeData, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      }
    });


    console.log('Creating new route with data:', routeData);
    message.success('Route created successfully');


    form.resetFields();
    setSelectedDriver(null);
    setSelectedOrders([]);
    setShowForm(false);
  };

  const orderColumns = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Transport Type',
      dataIndex: ['transportService', 'type'],
      key: 'transportType',
    },
    {
      title: 'From Province',
      dataIndex: 'fromProvince',
      key: 'fromProvince',
    },
    {
      title: 'To Province',
      dataIndex: 'toProvince',
      key: 'toProvince',
    },
    {
      title: 'Select',
      key: 'select',
      render: (_, record) => (
        <Checkbox
          checked={selectedOrders.includes(record.orderId)}
          onChange={() => handleOrderSelect(record.orderId)}
        />
      ),
    },
  ];

  const driverColumns = [
    {
      title: 'Driver ID',
      dataIndex: 'driverId',
      key: 'driverId',
    },
    {
      title: 'Driver Name',
      dataIndex: ['account', 'username'],
      key: 'driverName',
    },
    {
      title: 'Current Location',
      dataIndex: 'currentProvince',
      key: 'currentLocation',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-driver ${status}`}>{status}</span>
      ),
    },
    {
      title: 'Select',
      key: 'select',
      render: (_, record) => (
        <Radio
          checked={selectedDriver === record.driverId}
          onChange={() => setSelectedDriver(record.driverId)}
        />
      ),
    },
  ];

  const routeColumns = [
    {
      title: 'No',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Route Id',
      dataIndex: 'routeId',
      key: 'routeId',
    },
    {
      title: 'Driver Name',
      dataIndex: ['driver', 'account', 'username'],
      key: 'driverName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (
        <span className={`status-route ${status.toLowerCase()}`}>{status}</span>
      ),
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryStartDate',
      key: 'deliveryDate',
      render: (date) => date ? date : <span style={{ color: '#790808', fontWeight: 'bold' }}>Not Started</span>,
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <button className="view-button" onClick={() => handleView(record)}>
          <FontAwesomeIcon icon={faEye} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1 className='section-title'>Manage Route</h1>
      <div>
        <button className="new-route-button" onClick={handleCreate}>Create New Route</button>
      </div>

      <Modal
        title={isUpdate ? 'Update Route' : 'Create New Route'}
        className='route-detail-modal'
        open={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
        width={1000}
        destroyOnClose={true}
      >
        <Row className="placeorder-page">

          <Col span={24} className="">
            <Form form={form}>


              {/* Fish Orders Table */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Orders</h2>
              </div>
              <div className="fish-orders-scroll-container">
                <Table 
                  loading={{
                    indicator: (
                      <div style={{ padding: "20px 0" }}>
                        <Spin tip="Loading..." size="large" />
                      </div>
                    ),
                    spinning: loading
                  }}
                  columns={orderColumns}
                  dataSource={orders}
                  pagination={false}
                  scroll={{ y: 240 }}
                  rowKey="orderId"
                />
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
                <div>

                </div>
                <div className="fish-orders-scroll-container">

                  <Table 
                    loading={{
                      indicator: (
                        <div style={{ padding: "20px 0" }}>
                          <Spin tip="Loading..."  />
                        </div>
                      ),
                      spinning: loading
                    }}
                    columns={driverColumns}
                    dataSource={filteredDrivers}
                    pagination={false}
                    scroll={{ y: 240 }}
                    rowKey="driverId"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Note</h2>
              </div>
              <Form.Item name="note" >
                <Input.TextArea style={{ height: '150px' }} />
              </Form.Item>
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
      <Table 
        loading={{
          indicator: (
            <div style={{ padding: "20px 0" }}>
              <Spin tip="Loading..." size="large" />
            </div>
          ),
          spinning: loading
        }}
        columns={routeColumns}
        dataSource={routes}
        rowKey="routeId"
        rowClassName={(record) => disabledItems.has(record.routeId) ? 'disabled-row' : ''}
      />
      <Modal
        title={`Route ID: ${selectedRoute?.routeId}`}
        className='route-detail-modal'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
      >
        {selectedRoute && (
          <div className="route-detail">
            <div className="route-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Route Information</h2>

              </div>
              <div className="info-item">
                <span className="info-label"><strong>Driver:</strong></span>
                <span className="info-value">{selectedRoute.driver.account.username}</span>
              </div>


              <div className="info-item">
                <span className="info-label"><strong>Delivery Date:</strong></span>
                <span className="info-value">
                  {selectedRoute.deliveryStartDate ? selectedRoute.deliveryStartDate : <span style={{ color: '#790808', fontWeight: 'bold' }}>Not Started</span>}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label"><strong>Last Updated:</strong></span>
                <span className="info-value">{new Date(selectedRoute.updatedAt).toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><strong>Notes:</strong></span>
                <span className="info-value">{selectedRoute.notes}</span>
              </div>
              <div className="info-item" >
                <span className="info-label"><strong>Status:</strong></span>
                <span className={`status-route ${selectedRoute.status.toLowerCase()}`}>
                  {selectedRoute.status}
                </span>
              </div>

            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Route Stops</h2>
              <a style={{ color: '#ff7700', cursor: 'pointer' }}>+ Add Stop</a>
            </div>
            <div className="route-stops">
              {Object.entries(selectedRoute.routeStops.reduce((groups, stop) => {
                if (!groups[stop.orderId]) {
                  groups[stop.orderId] = [];
                }
                groups[stop.orderId].push(stop);
                return groups;
              }, {})).map(([orderId, orderStops]) => (
                <div key={orderId} className="order-group">
                  <h3>Order ID: {orderId}</h3>
                  <div className="stops-container">
                    {orderStops.map((stop, index) => (
                      <div key={index} className="route-stop-item">
                        <span className="route-stop-marker"></span>
                        <p>{stop.address}</p>
                        <span className={`status-route ${stop.status.toLowerCase()}`}>
                          {stop.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

export default ManageRoute;