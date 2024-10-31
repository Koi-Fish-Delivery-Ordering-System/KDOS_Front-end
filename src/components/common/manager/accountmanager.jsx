import React, { useState, useEffect } from 'react';
import { useQuery, ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Button, Table, Modal, Form, Input } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

// Define your GraphQL query here
const GET_ACCOUNTS = gql`
  query FindAllAccounts {
    findAllAccounts {
      accountId
      name
      email
      isActive
    }
  }
`;

// Apollo Client setup
const client = new ApolloClient({
  uri: 'http://your-api-url/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  },
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
    query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
  },
});

function AccountManager() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const { loading: queryLoading, data: apiData, refetch } = useQuery(GET_ACCOUNTS, {
    client,
    onError: (error) => {
      console.error('GraphQL Error:', error);
      toast.error("Error fetching accounts: " + error.message);
    },
  });

  useEffect(() => {
    if (apiData) {
      setData(apiData.findAllAccounts || []);
      setLoading(false);
    }
  }, [apiData]);

  const openAddModal = () => {
    form.resetFields();
    setFormData(null);
    setShowForm(true);
  };

  const openEditModal = (record) => {
    setFormData(record);
    form.setFieldsValue(record);
    setShowForm(true);
  };

  const handleCreate = async (values) => {
    // ... handle create logic
  };

  const handleEdit = async (values) => {
    // ... handle edit logic
  };

  const handleSubmit = async (values) => {
    if (formData) {
      await handleEdit(values);
    } else {
      await handleCreate(values);
    }
  };

  const columns = [
    { title: 'Account ID', dataIndex: 'accountId' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleToggleActive(record)}
          style={{
            opacity: record.isActive ? 1 : 0.5,
            backgroundColor: record.isActive ? '#ff7700' : '#ccc',
            color: 'white',
            borderColor: '#ff7700',
          }}
        >
          {record.isActive ? 'Active' : 'Inactive'}
        </Button>
      ),
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <Button onClick={() => openEditModal(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      <div>
        <h2>Manage Accounts</h2>
        <Button
          onClick={openAddModal}
          type="primary"
          style={{ marginBottom: '16px', backgroundColor: '#ff7700', borderColor: '#ff7700' }}
        >
          Add Account
        </Button>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading || queryLoading}
          rowKey="accountId"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
        />
        <Modal
          title={formData ? "Edit Account" : "Add Account"}
          open={showForm}
          onCancel={() => setShowForm(false)}
          footer={null}
        >
          <Form
            form={form}
            initialValues={formData || {}}
            onFinish={handleSubmit}
            layout="horizontal"
          >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="accountId" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff7700', borderColor: '#ff7700' }}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ApolloProvider>
  );
}

export default AccountManager;