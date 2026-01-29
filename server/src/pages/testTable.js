


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Header } from '../../components';
import HeroBanner from './HeroBanner';
import { DatePicker, Button } from 'antd';
import ReactToPrint from 'react-to-print';
import 'antd/dist/antd.css'; // Import Ant Design CSS
import './sale.css'; // Custom print styles (if needed)
import globalConstantUtil from '../../globalConstantUtils.js'

const { RangePicker } = DatePicker;

const PurchaseReport = () => {
    const [purchaseData, setpurchaseData] = useState(null); // Renamed to purchaseData to store supplier data
    const [filteredpurchaseData, setFilteredpurchaseData] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Ref for the table
    const tableRef = useRef();

    // Fetch supplier data
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(globalConstantUtil.baseUrl + '/suppliers/');
                const suppliers = response.data;
                setpurchaseData(suppliers);
                setFilteredpurchaseData(suppliers); // Initialize filtered data with full data
                calculateTotalAmount(suppliers); // Calculate total amount based on orders
                calculateTotalBalance(suppliers); // Calculate total balance
            } catch (error) {
                console.error('Failed to fetch suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);

    // Calculate total amount from suppliers' orders
    const calculateTotalAmount = (suppliers) => {
        const total = suppliers.reduce((sum, supplier) => {
            return sum + supplier.order.reduce((orderSum, item) => orderSum + item.unitPrice * item.quantity, 0);
        }, 0);
        setTotalAmount(total);
    };

    // Calculate total balance from suppliers
    const calculateTotalBalance = (suppliers) => {
        const balance = suppliers.reduce((sum, supplier) => sum + (supplier.balance || 0), 0);
        setTotalBalance(balance);
    };

    // Handle date range selection
    const handleDateChange = (dates) => {
        if (dates) {
            const [start, end] = dates;
            setStartDate(start.toDate());
            setEndDate(end.toDate());
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    // Filter and search report based on selected date range
    const handleSearchReport = () => {
        if (startDate && endDate) {
            const filteredData = purchaseData.filter(supplier => {
                const supplierDate = new Date(supplier.createdAt); // Assuming supplier's createdAt is the relevant date
                return supplierDate >= startDate && supplierDate <= endDate;
            });
            setFilteredpurchaseData(filteredData);
            calculateTotalAmount(filteredData); // Recalculate totals based on filtered data
            calculateTotalBalance(filteredData);
        } else {
            // If no date range selected, show full data
            setFilteredpurchaseData(purchaseData);
            calculateTotalAmount(purchaseData);
            calculateTotalBalance(purchaseData);
        }
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Purchase Report" />
            <HeroBanner />
            <div className="mb-4 mt-5">
                <RangePicker onChange={handleDateChange} format="YYYY-MM-DD" />
                <Button type="primary" onClick={handleSearchReport} className="ml-4"
                    style={{ borderRadius: '10px' }}
                >
                    Search Report
                </Button>
            </div>

            {filteredpurchaseData ? (
                <div className="overflow-x-auto print-table">
                    <ReactToPrint
                        trigger={() => (
                            <Button
                                type="primary"
                                className="ml-4"
                                style={{ borderRadius: '10px', marginTop: '10px' }}
                            >
                                Print Report
                            </Button>
                        )}
                        content={() => tableRef.current} // Table to print
                    />

                    <div className="overflow-x-auto">
                        <table ref={tableRef} className="min-w-full table-auto text-left">
                            <thead>
                                <tr>
                                    <th colSpan="7" className="text-center w-full">
                                        Purchase Report {startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : ''}
                                    </th>
                                </tr>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 font-bold">Date</th>
                                    <th className="px-4 py-2 font-bold">Items</th>
                                    <th className="px-4 py-2 font-bold">Quantity</th>
                                    <th className="px-4 py-2 font-bold">Price</th>
                                    <th className="px-4 py-2 font-bold">Total</th>
                                    <th className="px-4 py-2 font-bold">Paid</th>
                                    <th className="px-4 py-2 font-bold">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredpurchaseData.map((supplier) => {
                                    const itemsBySupplier = supplier.order.reduce((acc, item) => {
                                        if (!acc[supplier.name]) {
                                            acc[supplier.name] = [];
                                        }
                                        acc[supplier.name].push(item);
                                        return acc;
                                    }, {});

                                    let grandTotal = 0;

                                    return Object.keys(itemsBySupplier).map((supplierName) => {
                                        // Calculate the total amount for this supplier
                                        const supplierTotal = itemsBySupplier[supplierName].reduce(
                                            (sum, item) => sum + item.unitPrice * item.quantity, 0
                                        );
                                        grandTotal += supplierTotal;

                                        return (
                                            <React.Fragment key={supplierName}>
                                                {/* Display supplier name */}
                                                <tr className="bg-gray-200 font-bold">
                                                    <td colSpan="7" className="px-4 py-2">{supplierName}</td>
                                                </tr>

                                                {/* Display items under supplier */}
                                                {itemsBySupplier[supplierName].map((item) => (
                                                    <tr key={item.name} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-2">{new Date(supplier.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-4 py-2">{item.itemName}</td>
                                                        <td className="px-4 py-2">{item.quantity}</td>
                                                        <td className="px-4 py-2">RS {item.unitPrice.toFixed(2)}</td>
                                                        <td className="px-4 py-2">RS {(item.unitPrice * item.quantity).toFixed(2)}</td>

                                                        <td className="px-4 py-2">RS {supplier.paid}</td>
                                                        <td className="px-4 py-2">RS {supplier.balance}</td>

                                                    </tr>
                                                ))}

                                                {/* Display total for this supplier */}
                                                <tr className="bg-gray-100 font-bold">
                                                    <td colSpan="5" className="px-4 py-2"></td>
                                                    <td className="px-4 py-2">Supplier Total</td>
                                                    <td className="px-4 py-2">RS {supplierTotal.toFixed(2)}</td>
                                                </tr>
                                                <tr className="bg-gray-100 font-bold">
                                                    <td colSpan="5" className="px-4 py-2"></td>
                                                    <td className="px-4 py-2">Paid</td>
                                                    <td className="px-4 py-2">RS {(supplierTotal - supplier.balance).toFixed(2)}</td>
                                                </tr>
                                                <tr className="bg-gray-100 font-bold">
                                                    <td colSpan="5" className="px-4 py-2"></td>
                                                    <td className="px-4 py-2">Balance</td>
                                                    <td className="px-4 py-2">RS {supplier.balance}</td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    });
                                })}
                            </tbody>

                            <tfoot>
                                <tr className="font-bold">
                                    <td colSpan="3" className="px-4 py-2"></td>
                                    <td className="px-4 py-2">Total</td>
                                    <td className="px-4 py-2">RS {totalAmount.toFixed(2)}</td>
                                </tr>
                                <tr className="bg-gray-100 font-bold">
                                    <td colSpan="3" className="px-4 py-2"></td>
                                    <td className="px-4 py-2">Balance</td>
                                    <td className="px-4 py-2">RS {totalBalance.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading purchase data...</p>
            )}
        </div>
    );
};

export default PurchaseReport;