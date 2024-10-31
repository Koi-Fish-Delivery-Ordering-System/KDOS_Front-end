import React, { useState, useEffect } from 'react';
import { useQuery, ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Button, Table, Modal, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Switch, Select } from 'antd'; // Add this import


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

function TransportService() {
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
      const response = await axios({
        method: 'PATCH', // Only using PATCH for updates
        url: 'http://26.61.210.173:3001/api/transport/update-transport-service',
        data: {
          transportServiceId: formData.transportServiceId, // Include ID for updates
          ...values, // Spread the form values
        },
      });

      if (response.data) {
        toast.success("Transport service updated successfully");
        refetch(); // Refetch data to reflect changes
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error updating transport service:", error);
      toast.error("Failed to update transport service");
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
            layout="horizontal" // Set layout to horizontal
          >
            <Form.Item label="Service Type" style={{ flex: '0 0 30%' }}>
              <Select>
                <Select.Option value="air">Air</Select.Option>
                <Select.Option value="road">Road</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Service Name" style={{ flex: '0 0 30%' }}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" style={{ flex: '0 0 30%' }}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Price per KM" style={{ flex: '0 0 30%' }} rules={[{ message: 'Please input price per KM!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Price per KG" style={{ flex: '0 0 30%' }} rules={[{ message: 'Please input price per KG!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Price per Amount" style={{ flex: '0 0 30%' }} rules={[{ message: 'Please input price per Amount!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Is Active" style={{ flex: '0 0 30%' }} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item style={{ flex: '0 0 30%' }}>
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

export default TransportService;