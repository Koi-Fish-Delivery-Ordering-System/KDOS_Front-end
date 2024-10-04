import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import { Form, Input, Button, List, Upload, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../css/orderdetailpage.css';

function OrderDetailPage() {
    const location = useLocation();
    const { info } = location.state || {};
    const [fishList, setFishList] = useState([]);
    const [fishForm] = Form.useForm();

    useEffect(() => {
        console.log('Fish List updated:', fishList);
    }, [fishList]);

    const handleAddFish = async (values) => {
        console.log('Form values:', values);
        try {
            const newFish = {
                ...values,
                images: await Promise.all(
                    (values.images || []).map(async (file) => {
                        // Kiểm tra xem file có thuộc tính originFileObj không
                        const fileObj = file.originFileObj || file;
                        const base64 = await convertToBase64(fileObj);
                        console.log('Converted image:', base64.slice(0, 50) + '...'); // Log first 50 chars
                        return base64;
                    })
                )
            };
            console.log('New fish object:', newFish);
            console.log('values.images:', values.images);
console.log('values.images?.fileList:', values.images?.fileList);
            setFishList(prevList => [...prevList, newFish]);
            fishForm.resetFields();
        } catch (error) {
            console.error('Error in handleAddFish:', error);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const navigate = useNavigate();

    const handleSubmitOrder = () => {
        const order = { fishList }; // Create the order from the fish list
        console.log(order);
        console.log(info);
        navigate("/checkout", { state: { order, info } });
    };

    const handleRemoveFish = (index) => {
        setFishList(prevList => prevList.filter((_, i) => i !== index));
    };

    return (
        <div>
            <Navbar />
            <div className="order-detail-container">
                <h1>Order Detail</h1>
                <h2>Add Fish</h2>
                <Form form={fishForm} onFinish={handleAddFish} className="fish-form">
                    <Form.Item
                        label="Fish Name"
                        name="fishName"
                        rules={[{ required: true, message: "Please enter fish name!" }]}
                    >
                        <Input type="text" placeholder="Fish Name" />
                    </Form.Item>
                    <Form.Item
                        label="Weight (Kg)"
                        name="weight"
                        rules={[
                            { required: true, message: "Please enter fish weight!" },
                            
                        ]}
                    >
                        <Input type="text" placeholder="Weight" />
                    </Form.Item>
                    <Form.Item
                        label="Certification"
                        name="images"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload 
                            beforeUpload={() => false} 
                            listType="picture-card" 
                            multiple
                        >
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Fish
                        </Button>
                    </Form.Item>
                </Form>

                <h2>Fish List</h2>
                <List
                    bordered
                    className="fish-list"
                    dataSource={fishList}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <div className="fish-item">
                                <div>
                                    {item.fishName} - {item.weight}
                                    {item.images && item.images.length > 0 ? (
                                        <div style={{ display: 'flex', marginLeft: '10px' }}>
                                            {item.images.map((image, imgIndex) => (
                                                <div key={imgIndex}>
                                                    <img 
                                                        src={image}
                                                        alt={`Fish ${index + 1} Image ${imgIndex + 1}`} 
                                                        style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '5px' }} 
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No images for this fish</p>
                                    )}
                                </div>
                                <Popconfirm
                                    title="Are you sure you want to remove this fish?"
                                    onConfirm={() => handleRemoveFish(index)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button 
                                    className='remove-button'
                                        type="danger" 
                                        icon={<DeleteOutlined />}
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                            </div>
                        </List.Item>
                    )}
                />
                <Button type="primary" onClick={handleSubmitOrder}>
                    Submit Order
                </Button>
            </div>
            <Footer />
        </div>
    );
}

export default OrderDetailPage;
