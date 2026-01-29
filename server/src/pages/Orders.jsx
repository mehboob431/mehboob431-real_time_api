// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Sort, Filter } from '@syncfusion/ej2-react-grids';
// import { Modal, Button, message } from 'antd';
// import { AiOutlineEye, AiOutlineFileText } from 'react-icons/ai';
// // import 'antd/dist/antd.css';
// import '../style/invoice.css'
// import OrderDetail from './Order/orderDetail';

// const Orders = () => {
//     const [orders, setOrders] = useState([]);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [isStatusVisible, setIsStatusVisible] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [selectedStatus, setSelectedStatus] = useState(null);

//     // Helper function to format date and time
//     const formatDateAndTime = () => {
//         const now = new Date();
//         const date = now.toLocaleDateString();
//         const time = now.toLocaleTimeString();
//         return { date, time };
//     };

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/orders/get-orders');
//                 const ordersWithDateTime = response.data.map(order => ({
//                     ...order,
//                     Date: formatDateAndTime().date,
//                     Time: formatDateAndTime().time,
//                 }));
//                 setOrders(ordersWithDateTime);
//             } catch (error) {
//                 console.error('Failed to fetch orders:', error);
//             }
//         };

//         fetchOrders();
//     }, []);


//     const handleViewBill = (order) => {
//         setSelectedOrder(order);
//         setIsModalVisible(true);
//     };
//     const handleStatus = (order) => {
//         if (order) {
//             setSelectedStatus(order);
//             setIsStatusVisible(true);

//         } else {
//             message.error('Please select an order first!');
//         }
//     };

//     const handlePopupCancel = () => {
//         setIsStatusVisible(false)
//     };




//     const actionTemplate = (props) => (
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//             <AiOutlineEye
//                 size={24}
//                 onClick={() => handleViewBill(props)}
//                 style={{ marginRight: '8px', cursor: 'pointer' }}
//             />
//             <AiOutlineFileText
//                 size={24}
//                 onClick={() => handleStatus(props)}
//                 style={{
//                     marginRight: '8px', cursor: 'pointer', background: '#15e715', borderRadius: '50%'
//                 }}
//             />
//         </div>
//     );

//     return (
//         <>
//             <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
//                 <GridComponent
//                     dataSource={orders}
//                     allowSorting={true}
//                 >
//                     <ColumnsDirective>
//                         <ColumnDirective field='name' headerText='Customer' width='100' />
//                         <ColumnDirective field='table_No' headerText='Table_NO' width='100' />
//                         <ColumnDirective field='Date' headerText='Date' width='100' />
//                         <ColumnDirective field='Time' headerText='Time' width='100' />
//                         <ColumnDirective field='status' headerText='status' width='100' template={statusTemplate} textAlign='Center' />
//                         <ColumnDirective field='total_Amount' headerText='Total Amount' width='100' />
//                         <ColumnDirective field='paymentMethod' headerText='PaymentMethod' width='100' />
//                         <ColumnDirective headerText='Actions' width='100' template={actionTemplate} />
//                     </ColumnsDirective>
//                     <Inject services={[Sort, Filter]} />
//                 </GridComponent>
//             </div>
//             {isStatusVisible && selectedStatus && (
//                 <Modal
//                     title="Order Details"
//                     visible={isStatusVisible}
//                     onCancel={handlePopupCancel}
//                     footer={null}
//                 >
//                     <div>
//                         <OrderDetail id={selectedStatus._id} />
//                     </div>
//                 </Modal >)
//             }
//             {
//                 isModalVisible && selectedOrder && (
//                     <Modal
//                         width={400}
//                         title="Invoice Details"
//                         visible={isModalVisible}
//                         onCancel={() => setIsModalVisible(false)}
//                         footer={null}
//                     >
//                         <div id="invoice-pos">
//                             <center id="top">
//                                 <div className="logo" />
//                                 <div className="info">
//                                     <h2>Shahi Dewan</h2>
//                                     <p>Contact: 0349</p>
//                                 </div>
//                             </center>
//                             <div id="mid">
//                                 <div className="my-2">
//                                     <p>
//                                         Table No :
//                                         <b style={{ padding: '8px' }}>{selectedOrder.table_No}</b>
//                                         Date :
//                                         <b style={{ padding: '8px' }}>{selectedOrder.Date}</b>
//                                         Time :
//                                         <b style={{ padding: '8px' }}>{selectedOrder.Time}</b>
//                                     </p>
//                                     <hr style={{ margin: '5px' }} />
//                                 </div>
//                             </div>
//                             <div id="bot">
//                                 <div id="table">
//                                     <table>
//                                         {/* <tbody>
//                                             <tr className="tabletitle">
//                                                 <td className="item">
//                                                     <h2>Items</h2>
//                                                 </td>
//                                                 <td className="Hours">
//                                                     <h2>Quantity</h2>
//                                                 </td>
//                                                 <td className="Rate">
//                                                     <h2>Price</h2>
//                                                 </td>
//                                                 <td className="Rate">
//                                                     <h2>Total</h2>
//                                                 </td>
//                                             </tr>
//                                             {selectedOrder.cartItems.map((item) => (
//                                                 <tr className="service" key={item.name}>
//                                                     <td className="tableitem">
//                                                         <p className="itemtext">{item.name}</p>
//                                                     </td>
//                                                     <td className="tableitem">
//                                                         <p className="itemtext">{item.quantity}</p>
//                                                     </td>
//                                                     <td className="tableitem">
//                                                         <p className="itemtext">{item.price}</p>
//                                                     </td>
//                                                     <td className="tableitem">
//                                                         <p className="itemtext">
//                                                             {item.price * item.quantity}
//                                                         </p>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody> */}
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                         <div style={{ textAlign: 'right', marginTop: '16px' }}>
//                             <Button type="primary" onClick={() => { /* Implement print functionality */ }}>
//                                 Print
//                             </Button>
//                         </div>
//                     </Modal>
//                 )
//             }
//         </>
//     );
// };
// const statusTemplate = (props) => {
//     const statusStyle = {
//         'delivered': { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
//         'pending': { backgroundColor: 'yellow', color: 'black', padding: '5px', borderRadius: '50px', textAlign: 'center' },
//         'confirmed': { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
//         'canceled': { backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' },
//         'rejected': { backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' }
//     };

//     // Fallback if the status doesn't match any of the defined ones
//     const style = statusStyle[props.status] || { backgroundColor: 'gray', color: 'white', padding: '5px', borderRadius: '50px', textAlign: 'center' };

//     return (
//         <div style={style}>
//             <span>{props.status}</span>
//         </div>
//     );
// };


// export default Orders;
