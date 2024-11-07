import React, { useState, useEffect } from 'react';
import "./AdminOrdersPage.css";
import axios from 'axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch the orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/orders');
        
        // Format the response data
        const formattedOrders = response.data.map(order => ({
          _id: order._id,
          workerName: order.workerId.fullName,
          userName: order.userId.fullName,
          serviceType: order.service,
          date: order.startDate,
          endDate: order.endDate,
          status: order.status
        }));

        setOrders(formattedOrders);
      } catch (error) {
        setError("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  // Handle selecting an order to view details
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);  // Set the selected order to be shown in details
  };

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3001/admin/order/change-status/${orderId}`, { status: newStatus });
      
      if (response.status === 200) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prevOrder => ({ ...prevOrder, status: newStatus }));
        }
      } else {
        throw new Error("Failed to update status in the backend");
      }
    } catch (error) {
      setError("Error updating status");
    }
  };

  // Handle reschedule click
  const handleRescheduleClick = (order) => {
    setSelectedOrder(order);
    setIsRescheduleModalOpen(true);
  };

  // Handle reschedule action
  const handleReschedule = async () => {
    if (!startDate || !endDate) {
      setError("Please select valid start and end dates.");
      return;
    }

    try {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      const response = await axios.put(`http://localhost:3001/admin/order/reschedule/${selectedOrder._id}`, {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      if (response.status === 200) {
        setOrders(orders.map(order =>
          order._id === selectedOrder._id ? { ...order, date: formattedStartDate, endDate: formattedEndDate } : order
        ));

        setIsRescheduleModalOpen(false);
        setError(null);
      } else {
        throw new Error("Failed to reschedule order");
      }
    } catch (error) {
      setError("Error rescheduling order");
    }
  };

  // Render detailed information of a selected order
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className="order-details">
        <h3>Order Details</h3>
        <p><strong>Worker:</strong> {selectedOrder.workerName}</p>
        <p><strong>User:</strong> {selectedOrder.userName}</p>
        <p><strong>Service:</strong> {selectedOrder.serviceType}</p>
        <p><strong>Start Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
        <p><strong>End Date:</strong> {new Date(selectedOrder.endDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {selectedOrder.status}</p>
      </div>
    );
  };

  // Render reschedule modal
  const renderRescheduleModal = () => {
    if (!isRescheduleModalOpen) return null;

    return (
      <div className="modal">
        <h3>Reschedule Order</h3>
        <p>Order ID: {selectedOrder._id}</p>
        <label>
          Start Date:
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        
        <div className="modal-buttons">
          <button className='button1' onClick={handleReschedule}>Confirm Reschedule</button>
          <button className='button2' onClick={() => setIsRescheduleModalOpen(false)}>Cancel</button>
        </div>
       
        {error && <p className="error-modal">{error}</p>}
      </div>
    );
  };

  return (
    <div className="admin-orders-page">
      <h1>Admin Orders Page</h1>
      {error && <p className="error">{error}</p>}
      <div className="orders-list">
        <table>
          <thead>
            <tr>
              <th className='order-id'>Order ID</th>
              <th>Worker</th>
              <th>User</th>
              <th>Service Type</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.workerName}</td>
                <td>{order.userName}</td>
                <td>{order.serviceType}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td className='status'>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Declined">Declined</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
                <td>
                  <div className='actions'>
                    <button className='button1' onClick={() => handleSelectOrder(order)}>View Details</button>
                    <button className='button2' onClick={() => handleRescheduleClick(order)}>Reschedule</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderOrderDetails()}
      {renderRescheduleModal()}
    </div>
  );
};

export default AdminOrdersPage;
