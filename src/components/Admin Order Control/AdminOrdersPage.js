import React, { useState, useEffect } from 'react';
import './AdminOrdersPage.css';
import axios from 'axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/admin/orders');
        setOrders(response.data);
      } catch (error) {
        setError("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setError(null);
    } catch (error) {
      setError("Failed to update order status");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.delete(`/admin/orders/${orderId}`);
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        setError(null);
      } catch (error) {
        setError("Failed to cancel order");
      }
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    const { worker, user, serviceType, status, date, totalPrice, history } = selectedOrder;

    return (
      <div className="order-details">
        <h3>Order Details</h3>
        <p><strong>Worker:</strong> {worker.name}</p>
        <p><strong>User:</strong> {user.name}</p>
        <p><strong>Service Type:</strong> {serviceType}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleString()}</p>
        <p><strong>Total Price:</strong> {totalPrice ? `$${totalPrice}` : 'N/A'}</p>
        <p><strong>Status:</strong> {status}</p>
        <h4>Order History:</h4>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <strong>{entry.date}:</strong> {entry.description} (Status: {entry.status})
            </li>
          ))}
        </ul>
        <div className="actions">
          <button onClick={() => handleStatusUpdate(selectedOrder._id, 'Completed')}>Mark as Completed</button>
          <button onClick={() => handleCancelOrder(selectedOrder._id)}>Cancel Order</button>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-orders-page">
      <h2>Admin Orders Page</h2>
      {error && <p className="error">{error}</p>}
      <div className="orders-list">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Worker</th>
              <th>User</th>
              <th>Service Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.worker.name}</td>
                <td>{order.user.name}</td>
                <td>{order.serviceType}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => handleSelectOrder(order)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderOrderDetails()}
    </div>
  );
};

export default AdminOrdersPage;
