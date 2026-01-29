import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { message } from 'antd'; // Make sure this is imported
import { useAuth } from '../../contexts/AuthContext';
import globalConstantUtil from '../../globalConstantUtils.js'

const OrderDetail = ({ id }) => {
    const [data, setData] = useState({});
    const [newTime, setNewTime] = useState(''); // State for new time input
    const { authState } = useAuth();
    const Role = authState?.details.role;

    // Fetch order data by ID
    const getData = async () => {
        try {
            const res = await axios.get(globalConstantUtil.baseUrl + `/orders/get-order/${id}`);
            console.log(res.data);
            setData(res.data);
        } catch (error) {
            console.error('Error in fetching orders:', error);
        }
    };

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    // Update order status (for Cashier)
    const updateOrderStatus = async (newStatus) => {
        try {
            await axios.put(globalConstantUtil.baseUrl + `/orders/update-order/${data._id}`, {
                ...data,
                status: newStatus,
                timeTake: data.timeTake,
            });

            message.success('Order status updated successfully!');
            setData({ ...data, status: newStatus });
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    // Update timeTake (for Chief)
    const updateTimeTake = async (newTime) => {
        try {
            await axios.put(globalConstantUtil.baseUrl + `/orders/update-order/${data._id}`, {
                ...data,
                timeTake: newTime,
            });
            await axios.put(globalConstantUtil.baseUrl + `/tables/tables/book`, {
                table_No: data.table_No

            });
            message.success('Order timeTake updated successfully!');
            setData({ ...data, timeTake: newTime });
        } catch (error) {
            console.error('Failed to update timeTake:', error);
        }
    };

    // Cashier-specific actions (update status only, not "Delivered")
    const renderCashierActions = () => (
        <>
            {data.status === 'pending' && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => updateOrderStatus('rejected')}
                        className="p-1 rounded-lg bg-red-400"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => updateOrderStatus('confirmed')}
                        className="p-1 rounded-lg bg-green-400"
                    >
                        Accept
                    </button>
                </div>
            )}
        </>
    );

    // Chief-specific actions (timeTake update + setting status to "Delivered")
    const renderChiefActions = () => (
        <>
            {data.status === 'confirmed' && (
                <div className="flex items-center space-x-2 px-3">
                    <button
                        className="text-xl font-medium px-2 py-1 bg-gray-300"
                        onClick={() => {
                            if (data.timeTake > 5) updateTimeTake(data.timeTake - 5);
                        }}
                    >
                        -5
                    </button>
                    <span className="text-xl font-medium">{data.timeTake}</span>
                    <button
                        className="text-xl bg-gray-300 px-2 py-1 font-medium"
                        onClick={() => {
                            if (data.timeTake < 56) updateTimeTake(data.timeTake + 5);
                        }}
                    >
                        +5
                    </button>
                    {/* New Input Field for Time Update */}
                    <input
                        type="number"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)} // Update the input value
                        placeholder="Enter new time"
                        className="border rounded p-1"
                    />
                    <button
                        className="bg-blue-500 text-white rounded px-2"
                        onClick={() => {
                            const timeValue = parseInt(newTime); // Convert input to integer
                            if (!isNaN(timeValue) && timeValue >= 0) {
                                updateTimeTake(timeValue); // Call the update function with new time
                                setNewTime(''); // Reset input field
                            } else {
                                message.error('Please enter a valid time.');
                            }
                        }}
                    >
                        Update Time
                    </button>
                </div>
            )}

            {data.status === 'confirmed' && (
                <button
                    onClick={() => updateOrderStatus('delivered')}
                    className="p-1 rounded-lg bg-green-400"
                >
                    Mark as Delivered
                </button>
            )}
        </>
    );

    return (
        <div className="flex item-start space-x-2">
            {data && data.table_No ? (
                <div className="p-5 rounded-md shadow-lg w-full max-w-lg">
                    <div className="mb-4 flex items-start justify-between w-full">
                        <div>
                            <h2 className="text-lg font-medium">Table NO: {data.table_No}</h2>
                            <p>
                                Order Date:{' '}
                                {data.createdAt
                                    ? format(new Date(data.createdAt), 'dd MMM yyyy, hh:mm a')
                                    : 'N/A'}
                            </p>
                            <span>
                                Payment Method:{' '}
                                {data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                            </span>
                            {data.orderDescription && (
                                <span>Additional Instructions: {data.orderDescription}</span>
                            )}
                            <span>Total: Rs {data.total_Amount}</span>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div className="flex flex-col items-center justify-start gap-2">
                        <div>Status</div>
                        <div
                            className={`px-2 py-1 rounded-lg max-w-max ${data.status === 'pending'
                                ? 'bg-orange-400 text-orange-800 bg-opacity-50'
                                : data.status === 'confirmed'
                                    ? 'bg-blue-400 text-blue-800 bg-opacity-50'
                                    : data.status === 'delivered'
                                        ? 'bg-green-400 text-green-800 bg-opacity-50'
                                        : (data.status === 'rejected' || data.status === 'canceled')
                                            ? 'bg-red-400 text-red-800 bg-opacity-50'
                                            : ''
                                }`}
                        >
                            {data.status}
                        </div>

                        {(data.status === 'pending' || data.status === 'confirmed') && <div>Actions</div>}

                        {/* Render actions based on the role */}
                        {Role === 'Cashier' && renderCashierActions()}
                        {Role === 'Chief' && renderChiefActions()}
                    </div>
                </div>
            ) : (
                <p>Loading...</p> // Show loading or placeholder while fetching data
            )}
        </div>
    );
};

export default OrderDetail;
