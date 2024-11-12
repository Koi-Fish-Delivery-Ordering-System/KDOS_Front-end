import React, { useState, useEffect } from 'react';
import { useQuery, ApolloProvider } from '@apollo/client';
import { Button, Table, Modal, Form, Input, Checkbox } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { GetAllAccount, UpdateCustomerProfile, client } from '../../../api/AccountApi';


function AccountManager() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  const { loading: queryLoading, error, data: apiData } = GetAllAccount();
  //Effect to set the data and loading state
  useEffect(() => {
    if (apiData) {
      setData(apiData);
      setLoading(false);
    }
    if (error) {
      toast.error("Error fetching accounts: " + error.message);
    }
  }, [apiData, error]);

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

  const handleEdit = async (values) => {
    // Construct profileData using the values from the form
    const profileData = {
      username: values.username,
      phone: values.phone,
      email: values.email,
      address: values.address,
    };

    try {
      // Call the UpdateAccount function with the account ID and profileData
      const response = await UpdateCustomerProfile(profileData); // Ensure formData contains the accountId

      if (response.success) {
        toast.success("Account updated successfully!");
        setShowForm(false);
        GetAllAccount(); // Refresh the data to reflect changes
      } else {
        toast.error("Failed to update account.");
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error("Error updating account: " + error.message);
    }
  };

  const handleSubmit = async (values) => {
    await handleEdit(values);
  };

  const columns = [
    { title: 'Account ID', dataIndex: 'accountId', width: '100' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Address', dataIndex: 'address' },
    // {
    //   title: 'Verified',
    //   dataIndex: 'verified',
    //   render: (verified) => (verified ? 'Yes' : 'No'),
    // },
    {
      title: 'Roles',
      dataIndex: 'roles',
      render: (roles) => (
        <span>{roles && roles.length > 0 ? roles.map(role => role.name).join(', ') : 'No Roles'}</span>
      ),
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'User', value: 'User' },
      ],
      onFilter: (value, record) => {
        return record.roles && record.roles.some(role => role.name.includes(value));
      },
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <>
          <Button onClick={() => openEditModal(record)}>Edit</Button>
          {/* {record.driver && (
            <Button onClick={() => viewDriverDetails(record.driver)} style={{ marginLeft: '8px' }}>
              View Driver Details
            </Button>
          )} */}
        </>
      ),
    },
  ];

  return (
    <ApolloProvider client={client}>
      <ToastContainer />
      <div>
        <h1 className='section-title'>Manage Accounts</h1>
        <button
          onClick={openAddModal}
          type="primary"
          className='new-route-button'
        >
          Add Account
        </button>
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
          title="Edit Account"
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
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" >
              <Input />
            </Form.Item>
            <Form.Item label="Address" name="address" >
              <Input />
            </Form.Item>
            <Form.Item label="Roles" name="roles">
              <Checkbox value="customer">Customer</Checkbox>
              <Checkbox value="delivery">Delivery</Checkbox>
              <Checkbox value="manager">Manager</Checkbox>
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
        {/* <Modal
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
        </Modal> */}
      </div>
    </ApolloProvider>
  );
}

export default AccountManager;
