import React, { useState, useEffect } from 'react';
import { useQuery, ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Button, Table, Modal, Form, Input } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const GET_ACCOUNTS = gql`
  query FindAllAccount {
  findAllAccount {
    accountId
    username
    password
    roles {
      roleId
      name
      isDisabled
    }
    email
    address
    phone
    verified
    driver {
      driverId
      status
      currentProvince
    }
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
    watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
    query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
  },
});

function AccountManager() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverDetails, setDriverDetails] = useState(null);
  const [driverModalVisible, setDriverModalVisible] = useState(false);

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
      setData(apiData.findAllAccount || []);
      setLoading(false);
    }
  }, [apiData]);
  const viewDriverDetails = (driver) => {
    setDriverDetails(driver);
    setDriverModalVisible(true);
  };
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

  const openRoleModal = (roles) => {
    if (roles && roles.length > 0) {
      setSelectedRoles(roles); // Set selected roles for the modal
      setRoleModalVisible(true); // Show the modal
    } else {
      toast.warn("No roles available for this account.");
    }
  };

  const handleCreate = async (values) => {
    // Handle create logic here
  };

  const handleEdit = async (values) => {
    try {
      const response = await axios.patch('http://26.61.210.173:3001/api/accounts/update-profile', {
        username: values.username,
        phone: values.phone,
        email: values.email,
        address: values.address,
      });

      if (response.status === 200) {
        toast.success("Account updated successfully!");
        setShowForm(false);
        refetch(); // Refresh the data to reflect changes
      } else {
        toast.error("Failed to update account.");
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error("Error updating account: " + error.message);
    }
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
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Address', dataIndex: 'address' },
    {
      title: 'Verified',
      dataIndex: 'verified',
      render: (verified) => (verified ? 'Yes' : 'No'),
    },
    {
      title: 'Roles',
      render: (text, record) => (
        <Button onClick={() => openRoleModal(record.roles)}>View Roles</Button>
      ),
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <>
          <Button onClick={() => openEditModal(record)}>Edit</Button>
          {record.driver && (
            <Button onClick={() => viewDriverDetails(record.driver)} style={{ marginLeft: '8px' }}>
              View Driver Details
            </Button>
          )}
        </>
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
            <Form.Item name="username" style={{ display: 'none' }} >
              <Input type="hidden" />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input phone number!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input email!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input address!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff7700', borderColor: '#ff7700' }}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Role Modal */}
        <Modal
          title="Account Roles"
          open={roleModalVisible}
          onCancel={() => setRoleModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setRoleModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          <Table
            columns={[
              { title: 'Role ID', dataIndex: 'roleId' },
              { title: 'Role Name', dataIndex: 'name' },
              {
                title: 'Is Disabled',
                dataIndex: 'isDisabled',
                render: (isDisabled) => (isDisabled ? 'Yes' : 'No'),
              },
            ]}
            dataSource={selectedRoles}
            rowKey="roleId"
            pagination={false}
          />
        </Modal>
        <Modal
          title="Driver Details"
          open={driverModalVisible}
          onCancel={() => setDriverModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDriverModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {driverDetails && (
            <div>
              <p>Driver ID: {driverDetails.driverId}</p>
              <p>Status: {driverDetails.status}</p>
              <p>Current Province: {driverDetails.currentProvince}</p>
            </div>
          )}
        </Modal>
      </div>
    </ApolloProvider>
  );
}

export default AccountManager;
