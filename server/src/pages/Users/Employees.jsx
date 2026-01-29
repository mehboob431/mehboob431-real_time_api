import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Page } from '@syncfusion/ej2-react-grids';
import { Header } from '../../components';
import { Button, Modal, Form, Input, message } from 'antd';
import { AiOutlineDelete } from 'react-icons/ai';
import 'antd/dist/antd.css';
import globalConstantUtil from '../../globalConstantUtils.js'

const Employees = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getAllEmployee = async () => {
    try {
      const response = await axios.get(globalConstantUtil.baseUrl + '/employees/employees');
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    getAllEmployee();
  }, []);

  const imageTemplate = (props) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={props.EmployeeImage} alt="Employee" style={{ width: '50px', borderRadius: '50%', marginRight: '10px' }} />
      <span>{props.EmployeeName}</span>
    </div>
  );

  const handleDelete = async (record) => {
    try {
      await axios.post(globalConstantUtil.baseUrl + '/employees/delete-employees', { EmployeeId: record._id });
      message.success('Employee Deleted Successfully');
      await getAllEmployee();
    } catch (error) {
      message.error('Error deleting employee');
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    formData.append('EmployeeName', values.EmployeeName);
    formData.append('Designation', values.Designation);
    formData.append('Salary', values.Salary);
    formData.append('HireDate', values.HireDate);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.post(globalConstantUtil.baseUrl + '/employees/add-employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Employee Added Successfully');
      await getAllEmployee();
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      message.error('Error adding employee');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Employees" />
      <Button
        type="primary"
        onClick={showModal}
        style={{ borderRadius: '10px', marginBottom: '10px' }}
      >
        Add New Employee
      </Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '90%' }}>
          <GridComponent dataSource={employeeData} allowPaging={true}>
            <ColumnsDirective>
              <ColumnDirective
                field='EmployeeImage'
                headerText='Employee'
                width='200'
                template={imageTemplate}
                textAlign="Left"
              />
              <ColumnDirective
                field='Designation'
                headerText='Designation'
                width='150'  // Increased width
                textAlign="Left"
                clipMode="EllipsisWithTooltip" // Show ellipsis with tooltip for longer text
              />
              <ColumnDirective
                field='Salary'
                headerText='Salary'
                width='100'
                textAlign='Right'
              />
              <ColumnDirective
                field='HireDate'
                headerText='Hire Date'
                width='150'
                textAlign='Right'
                template={(props) => new Date(props.HireDate).toLocaleDateString()}
              />
              <ColumnDirective
                field='Actions'
                headerText='Actions'
                width='100'
                template={(record) => (
                  <Button
                    type="link"
                    icon={<AiOutlineDelete />}
                    onClick={() => handleDelete(record)}
                  />
                )}
              />
            </ColumnsDirective>
            <Inject services={[Page]} />
          </GridComponent>
        </div>
      </div>

      <Modal
        title="Add New Employee"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Add"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="EmployeeName"
            label="Employee Name"
            rules={[{ required: true, message: 'Please input the employee name!' }]}
            required={false}
          >
            <Input placeholder="Enter employee name" />
          </Form.Item>
          <Form.Item label="Image" name="EmployeeImage" required={false}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Item>
          <Form.Item
            name="Designation"
            label="Designation"
            rules={[{ required: true, message: 'Please input the designation!' }]}
            required={false}
          >
            <Input placeholder="Enter designation" />
          </Form.Item>
          <Form.Item
            name="Salary"
            label="Salary"
            rules={[{ required: true, message: 'Please input the salary!' }]}
            required={false}
          >
            <Input placeholder="Enter salary" />
          </Form.Item>
          <Form.Item
            name="HireDate"
            label="Hire Date"
            rules={[{ required: true, message: 'Please input the hire date!' }]}
            required={false}
          >
            <Input placeholder="Enter hire date (e.g., 01/02/2021)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
