import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Page } from '@syncfusion/ej2-react-grids';
import { Header } from '../../components';
import { Button, Modal, Form, Input, message, Select } from 'antd';
import { AiOutlineDelete } from 'react-icons/ai';
import 'antd/dist/antd.css';
import globalConstantUtil from '../../globalConstantUtils.js'

const User = () => {
    const [userData, setUserData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const getAllUser = async () => {
        try {
            const response = await axios.get(globalConstantUtil.baseUrl + '/auth/');
            const filteredUsers = response.data.filter(user => user.role !== 'Superadmin');
            setUserData(filteredUsers);
        } catch (error) {
            console.error('Error fetching Users:', error);
        }
    };
    

    useEffect(() => {
        getAllUser();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete( globalConstantUtil.baseUrl + `/auth/${id}`);
            message.success('Employee Deleted Successfully');
            await getAllUser();
        } catch (error) {
            message.error('Error deleting employee');
            console.error(error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            await axios.post( globalConstantUtil.baseUrl + '/auth/register', values);
            message.success('User Added Successfully');
            await getAllUser();
            form.resetFields(); // Reset fields after successful submission
            setIsModalVisible(false); // Close the modal
        } catch (error) {
            message.error('Error adding User');
            console.error(error);
        }
    };

    const handleCancel = () => {
        form.resetFields(); // Reset form fields when the modal is closed
        setIsModalVisible(false);
    };

    const showModal = () => {
        form.resetFields(); // Reset form fields each time modal is opened
        setIsModalVisible(true); // Then open the modal
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Users" />
            <Button
                type="primary"
                onClick={showModal}
                style={{ borderRadius: '10px', marginBottom: '10px' }}
            >
                Add New User
            </Button>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GridComponent
                    dataSource={userData}
                    allowPaging={true}
                    width="80%"
                    style={{ fontSize: '12px' }}
                >
                    <ColumnsDirective>
                        <ColumnDirective field="name" headerText="Name" width="100" />
                        <ColumnDirective field="email" headerText="Email" width="150" />
                        <ColumnDirective field="role" headerText="Role" width="100" />
                        <ColumnDirective
                            field="Actions"
                            headerText="Actions"
                            width="100"
                            template={(record) => (
                                <Button
                                    type="link"
                                    icon={<AiOutlineDelete />}
                                    onClick={() => handleDelete(record._id)}
                                />
                            )}
                        />
                    </ColumnsDirective>
                    <Inject services={[Page]} />
                </GridComponent>
            </div>

            <Modal
                title="Add New User"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText="Add"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                    <Form.Item
                        name="name"
                        label="User Name"
                        rules={[
                            { required: true, message: 'Please enter the user name' },
                            { pattern: /^[A-Za-z\s]+$/, message: 'User name must contain only letters' }
                        ]}
                    >
                        <Input placeholder="Enter User name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter the email' },
                            {
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email must contain "@" and a valid domain',
                            },
                        ]}
                    >
                        <Input placeholder="Enter User Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter the password' },
                            {
                                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                message: 'Password must be at least 8 characters long and contain both letters and numbers',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select placeholder="Select a user role">
                            <Select.Option value="Admin">Admin</Select.Option>
                            <Select.Option value="Cashier">Cashier</Select.Option>
                            <Select.Option value="Chief">Chief</Select.Option>
                            <Select.Option value="Storeman">Storeman</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default User;
