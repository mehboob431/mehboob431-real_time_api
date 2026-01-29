import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Modal, Form, Input,InputNumber, Button, message } from 'antd';
import { AiOutlineEye, AiOutlineFileText, AiOutlineCheckCircle } from 'react-icons/ai';
import 'antd/dist/antd.css';
import '../../style/invoice.css';
import OrderDetail from './orderDetail';
import globalConstantUtil from '../../globalConstantUtils.js'
import '../../index.css'

const OrderList = () => {
    const componentRef = useRef();
    const [orders, setOrders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStatusVisible, setIsStatusVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Helper function to format date and time
    const formatDateAndTime = () => {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        return { date, time };
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(globalConstantUtil.baseUrl + '/orders/get-orders');
                const ordersWithDateTime = response.data.map(order => ({
                    ...order,
                    Date: formatDateAndTime().date,
                    Time: formatDateAndTime().time,
                }));
                setOrders(ordersWithDateTime);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, []);


    const handleViewBill = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };
    const handlePopupClick = (order) => {
        if (order) {
            setSelectedOrder(order);
            setIsPopupVisible(true);
        } else {
            message.error('Please select an order first!');
        }
    };
    const handleStatus = (order) => {
        if (order) {
            setSelectedStatus(order);
            setIsStatusVisible(true);

        } else {
            message.error('Please select an order first!');
        }
    };

    const handlePopupCancel = () => {
        setIsPopupVisible(false);
        setIsStatusVisible(false)
    };

    const handleActionComplete = async (args) => {
        if (args.requestType === 'save') {
            const data = args.data;

            try {
                if (args.action === 'add') {
                    await axios.post(globalConstantUtil.baseUrl + '/orders/add-orders', data);
                    message.success('Order added successfully!');
                } else if (args.action === 'edit') {
                    await axios.put(globalConstantUtil.baseUrl + `/orders/update-order/${data._id}`, data);
                    message.success('Order updated successfully!');
                }
            } catch (error) {
                message.error('Failed to save order!');
                console.error('Error:', error);
            }
        }

        if (args.requestType === 'delete') {
            try {
                const orderId = args.data[0]._id;
                await axios.delete(globalConstantUtil.baseUrl + `/orders/delete-order/${orderId}`);
                message.success('Order deleted successfully!');
            } catch (error) {
                message.error('Failed to delete order!');
                console.error('Error:', error);
            }
        }
    };

    const handleBillSubmit = async (values) => {
        if (selectedOrder) {
            const billData = {
                service_charge: values.service_charge,
                customer_Name: values.customer_Name,
                waiter_Name: values.waiter_Name,
                table_No: selectedOrder.table_No,
                total_Amount: selectedOrder.total_Amount,
                cartItems: selectedOrder.cartItems,
                Date: selectedOrder.Date,
                Time: selectedOrder.Time,
            };

            try {
                // Submit the bill data to the backend
                await axios.post(globalConstantUtil.baseUrl + '/bills/add-bill', billData);

                // Remove the selected order from the frontend state
                setOrders((prevOrders) => prevOrders.filter(order => order._id !== selectedOrder._id));

                // Delete the order from the backend
                await axios.delete(globalConstantUtil.baseUrl + `/orders/delete-order/${selectedOrder._id}`);

                message.success('Bill submitted and order removed successfully!');
                setIsPopupVisible(false); // Close the modal after submission
            } catch (error) {
                message.error('Failed to submit the bill or remove the order!');
                console.error('Error:', error);
            }
        } else {
            message.error('No order selected!');
        }
    };



    const actionTemplate = (props) => (
        <div style={{ display: 'flex', alignItems: 'center' }
        }>
            <AiOutlineEye
                size={24}
                onClick={() => handleViewBill(props)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
            />
            < AiOutlineCheckCircle
                size={24}
                onClick={() => handleStatus(props)}
                style={{
                    marginRight: '8px', cursor: 'pointer', background: '#15e715', borderRadius: '50%'
                }}
            />
            < AiOutlineFileText
                size={24}
                onClick={() => handlePopupClick(props)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
            />
        </div>
    );
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl" >
                <GridComponent
                    dataSource={orders}
                    pageSettings={{ pageCount: 4 }}
                    enableHover={false}
                    selectionSettings={{ type: 'Single' }}
                    toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
                    editSettings={{ allowEditing: true, allowAdding: true, allowDeleting: true }}
                    allowSorting={true}
                    allowPaging={true}
                    actionComplete={handleActionComplete}
                >
                    <ColumnsDirective>
                        <ColumnDirective field='name' headerText='Customer' width='100' />
                        <ColumnDirective field='table_No' headerText='Table_NO' width='100' />
                        <ColumnDirective field='Date' headerText='Date' width='100' />
                        <ColumnDirective field='Time' headerText='Time' width='100' />
                        <ColumnDirective field='status' headerText='status' width='100' template={statusTemplate} textAlign='Center' />
                        <ColumnDirective field='total_Amount' headerText='Total Amount' width='100' />
                        <ColumnDirective field='paymentMethod' headerText='PaymentMethod' width='100' />
                        <ColumnDirective headerText='Actions' width='100' template={actionTemplate} />
                    </ColumnsDirective>
                    < Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
                </GridComponent>
            </div>
            {
                isStatusVisible && selectedStatus && (
                    <Modal
                        title="Order Details"
                        visible={isStatusVisible}
                        onCancel={handlePopupCancel}
                        footer={null}
                    >
                        <div>
                            <OrderDetail id={selectedStatus._id} />
                        </div>
                    </Modal >)
            }
            {
                isModalVisible && selectedOrder && (
                    <Modal
                        width={400}
                        title="Invoice Details"
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                    >
                        <div
                            ref={componentRef}
                            className="table bg-white shadow-md rounded p-5 w-full max-w-md mx-auto thermal-print"
                        >
                            <div className="bg-white shadow-lg p-8 rounded-md">
                                {/* Header */}
                                <center className="mb-4">
                                    <div className="logo mb-2" />
                                    <h2 className="text-xl font-bold text-gray-800">Pashwari shanwari & tikka karai</h2>
                                    <p className="text-sm text-gray-600">Contact: 03475959359</p>
                                </center>

                                {/* Info Section */}
                                <div className="text-sm text-gray-700 border-b border-black pb-3 mb-4">
                                    <p className="mb-1">
                                        Customer Name: <b style={{ padding: "7px" }}>{selectedOrder.customer_Name}</b>
                                        Waiter Name: <b style={{ padding: "7px" }}>{selectedOrder.waiter_Name}</b>
                                        Table No: <b style={{ padding: "7px" }}>{selectedOrder.table_No}</b>
                                    </p>
                                    <p>
                                        Date:
                                        <b style={{ padding: "7px" }}>{selectedOrder.Date}</b>
                                        Time:
                                        <b style={{ padding: "7px" }}>{selectedOrder.Time}</b>
                                    </p>
                                </div>

                                {/* Items Table */}
                                <div className="w-full text-sm">
                                    <div className="flex justify-between font-semibold text-gray-700 border-b border-black pb-2">
                                        <span className="w-2/5">Item</span>
                                        <span className="w-1/5 text-center">Qty</span>
                                        <span className="w-1/5 text-center">Price</span>
                                        <span className="w-1/5 text-right">Total</span>
                                    </div>

                                    {selectedOrder.cartItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between border-b border-gray-300 py-2"
                                        >
                                            <span className="w-2/5 text-start">{item.name}</span>
                                            <span className="w-1/5 text-center">{item.quantity}</span>
                                            <span className="w-1/5 text-center">{item.price}</span>
                                            <span className="w-1/5 text-right">
                                                {item.quantity * item.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Print
                            </button>
                        </div>
                    </Modal>
                )}

            <Modal
                title="Final Invoice Form"
                visible={isPopupVisible}
                onCancel={handlePopupCancel}
                footer={null}
            >

                <Form layout="vertical" onFinish={handleBillSubmit} requiredMark={false} >
                    <Form.Item
                        label="Customer Name"
                        name="customer_Name"
                        rules={[{ required: true, message: 'Please input customer name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Waiter Name"
                        name="waiter_Name"
                        rules={[{ required: true, message: 'Please input waiter name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Service Charge (%)"
                        name="service_charge"
                        rules={[{ required: true, message: 'Please input service charge percentage!' }]}
                    >
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
        </>
    );
};
const statusTemplate = (props) => {
    const statusStyle = {
        'delivered': { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
        'pending': { backgroundColor: 'yellow', color: 'black', padding: '5px', borderRadius: '50px', textAlign: 'center' },
        'confirmed': { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
        'canceled': { backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
        'rejected': { backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' }
    };

    // Fallback if the status doesn't match any of the defined ones
    const style = statusStyle[props.status] || { backgroundColor: 'gray', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' };

    return (
        <div style={style} >
            <span>{props.status} </span>
        </div>
    );
};


export default OrderList;

