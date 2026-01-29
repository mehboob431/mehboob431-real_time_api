import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Modal, Button, message } from 'antd';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import 'antd/dist/antd.css'; // Ensure the Ant Design CSS is correctly imported
import '../../style/invoice.css';
import OrderDetail from './orderDetail';
import globalConstantUtil from '../../globalConstantUtils.js'

const ConfirmedOrder = () => {
    const [orders, setOrders] = useState([]);
    const [isStatusVisible, setIsStatusVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

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
                console.log('Orders data:', response.data); // Check if data is being fetched

                // Filter orders to only include those with status 'confirmed'
                const confirmedOrders = response.data
                    .filter(order => order.status === 'confirmed')
                    .map(order => ({
                        ...order,
                        Date: formatDateAndTime().date,
                        Time: formatDateAndTime().time,
                    }));

                setOrders(confirmedOrders);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // Handle order status click
    const handleStatus = (order) => {
        if (order) {
            console.log('Selected order:', order);
            setSelectedStatus(order);
            setIsStatusVisible(true);
        } else {
            message.error('Please select an order first!');
        }
    };

    // Close the status modal
    const handlePopupCancel = () => {
        setIsStatusVisible(false);
    };

    // Action button template for the grid
    const actionTemplate = (props) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <AiOutlineCheckCircle
                size={24}
                onClick={() => handleStatus(props)}
                style={{
                    marginRight: '8px', cursor: 'pointer', background: '#15e715', borderRadius: '50%'
                }}
            />
        </div>
    );

    // Status template for grid rows
    const statusTemplate = (props) => {
        const statusStyle = {
            'confirmed': { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
        };

        const style = statusStyle[props.status] || { backgroundColor: 'gray', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' };

        return (
            <div style={style}>
                <span>{props.status}</span>
            </div>
        );
    };

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <GridComponent
                    dataSource={orders}
                    pageSettings={{ pageCount: 4 }}
                    enableHover={false}
                    allowSorting={true}
                    allowPaging={true}
                >
                    <ColumnsDirective>
                        <ColumnDirective field='name' headerText='Customer' width='100' />
                        <ColumnDirective field='table_No' headerText='Table No' width='100' />
                        <ColumnDirective field='Date' headerText='Date' width='100' />
                        <ColumnDirective field='Time' headerText='Time' width='100' />
                        <ColumnDirective field='status' headerText='Status' width='100' template={statusTemplate} textAlign='Center' />
                        <ColumnDirective field='total_Amount' headerText='Total Amount' width='100' />
                        <ColumnDirective field='paymentMethod' headerText='Payment Method' width='100' />
                        <ColumnDirective headerText='Actions' width='100' template={actionTemplate} />
                    </ColumnsDirective>
                    <Inject services={[Page, Selection, Sort, Filter]} />
                </GridComponent>
            </div>

            {/* Order Details Modal */}
            {isStatusVisible && selectedStatus && (
                <Modal
                    title="Order Details"
                    visible={isStatusVisible}
                    onCancel={handlePopupCancel}
                    footer={null}
                >
                    <div>
                        <p><strong>Order Details:</strong></p>
                        <p>{selectedStatus ? `Table No: ${selectedStatus.table_No}` : 'No order selected.'}</p>
                        <p>{selectedStatus ? `Customer Name: ${selectedStatus.name}` : 'No order selected.'}</p>
                        <p>{selectedStatus ? `Date: ${selectedStatus.Date}` : 'No order selected.'}</p>
                        <p>{selectedStatus ? `Time: ${selectedStatus.Time}` : 'No order selected.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <div>
                                <OrderDetail id={selectedStatus._id} />
                            </div>

                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ConfirmedOrder;
