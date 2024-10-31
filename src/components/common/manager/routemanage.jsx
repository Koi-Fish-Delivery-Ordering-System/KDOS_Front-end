import React, { useState, useEffect } from 'react';
import { useQuery, ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Button, Table, Modal, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GET_TRANSPORT_SERVICE = gql`
  query FindAllTransportService($data: FindAllTransportServiceInputData!) {
    findAllTransportService(data: $data) {
      transportServiceId
      name
      type
      pricePerKm
      pricePerKg
      pricePerAmount
      description
      isActive
    }
  }
`;

const client = new ApolloClient({
  uri: 'http://26.61.210.173:3001/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  },
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

function Routemanage() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { loading: queryLoading, error, data: apiData, refetch } = useQuery(GET_TRANSPORT_SERVICE, {
    client,
    variables: {
      data: {
        options: {
          take: 10,
          skip: 0,
        },
      },
    },
    onError: (error) => {
      console.error('GraphQL Error:', error);
      toast.error("Error fetching transport services: " + error.message);
    }
  });

  useEffect(() => {
    if (apiData) {
      setData(apiData.findAllTransportService || []);
      setLoading(false);
    }
    if (error) {
      console.error('Apollo Error:', error);
      toast.error("Error fetching transport services: " + error.message);
      setLoading(false);
    }
  }, [apiData, error]);

  const handleCreate = () => {
    setFormData(null);
    setShowForm(true);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setShowForm(true);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://26.61.210.173:3001/api/transport', values); // Adjust the endpoint as needed
      if (response.data) {
        toast.success("Transport service saved successfully");
        // Refresh or update data accordingly
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error saving transport service:", error);
      toast.error("Failed to save transport service");
    }
  };

  const columns = [
    {
      title: 'Service ID',
      dataIndex: 'transportServiceId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Price per KM',
      dataIndex: 'pricePerKm',
    },
    {
      title: 'Price per KG',
      dataIndex: 'pricePerKg',
    },
    {
      title: 'Price per Amount',
      dataIndex: 'pricePerAmount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (text, record) => (
        <Button
          type="primary"
          disabled={!record.isActive}
          style={{ opacity: record.isActive ? 1 : 0.5 }} // Faded when disabled
        >
          {record.isActive ? 'Active' : 'Inactive'}
        </Button>
      ),
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      <div>
        <h2>Transport Services</h2>
        <Button onClick={handleCreate} type="primary" style={{ marginBottom: '16px' }}>
          Add Service
        </Button>
        <Table columns={columns} dataSource={data} loading={loading || queryLoading} rowKey="transportServiceId" />
        <Modal
          title={formData ? "Edit Transport Service" : "Add Transport Service"}
          open={showForm}
          onCancel={() => setShowForm(false)}
          footer={null}
        >
          <Form
            initialValues={formData}
            onFinish={handleSubmit}
          >
            <Form.Item name="type" label="Service Type" rules={[{ message: 'Please input the service name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="name" label="Service Name" rules={[{ message: 'Please input the service name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ message: 'Please input the service name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="pricePerKm" label="Price per KM" rules={[{ message: 'Please input price per KM!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerKg" label="Price per KG" rules={[{ message: 'Please input price per KG!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerAmount" label="Price per Amount" rules={[{ message: 'Please input price per Amount!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="isActive" label="Is Active" rules={[{ message: 'Please input price per Amount!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ApolloProvider>
  );
}

export default Routemanage;