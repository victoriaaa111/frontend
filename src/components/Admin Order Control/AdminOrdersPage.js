import React, { useState, useEffect } from 'react';
import './AdminOrdersPage.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/orders`
        );

        const formattedOrders = response.data.map((order) => ({
          _id: order._id,
          workerName: order.workerId.fullName,
          userName: order.userId.fullName,
          serviceType: order.service,
          date: order.startDate,
          endDate: order.endDate,
          status: order.status,
        }));

        setOrders(formattedOrders);
      } catch (error) {
        setError('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/order/${orderId}`,
        {
          status: newStatus,
        }
      );

      if (response.status === 200) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
        }
      } else {
        throw new Error('Failed to update status in the backend');
      }
    } catch (error) {
      setError('Error updating status');
    }
  };

  const handleRescheduleClick = (order) => {
    setSelectedOrder(order);
    setStartDate(new Date(order.date)); // Setează data de start existentă
    setEndDate(new Date(order.endDate)); // Setează data de final existentă
    setIsRescheduleModalOpen(true);
  };

  const handleReschedule = async () => {
    if (!startDate || !endDate) {
      setError('Please select valid start and end dates.');
      return;
    }

    try {
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/order/reschedule/${selectedOrder._id}`,
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }
      );

      if (response.status === 200) {
        setOrders(
          orders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, date: formattedStartDate, endDate: formattedEndDate }
              : order
          )
        );

        setIsRescheduleModalOpen(false);
        setError(null);
      } else {
        throw new Error('Failed to reschedule order');
      }
    } catch (error) {
      setError('Error rescheduling order');
    }
  };

  return (
    <div className="admin-orders-page">
      <h1>Admin Orders Page</h1>
      {error && <p className="error">{error}</p>}
      <div className="orders-list">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
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
                <td>
                  <span
                    className={`order-id ${
                      order.status === 'Done'
                        ? 'green'
                        : order.status === 'Declined' ||
                          order.status === 'Canceled'
                        ? 'red'
                        : order.status === 'In Progress'
                        ? 'blue'
                        : order.status === 'Pending'
                        ? 'yellow'
                        : ''
                    }`}
                  >
                    {order._id}
                  </span>
                </td>
                <td>{order.workerName}</td>
                <td>{order.userName}</td>
                <td>{order.serviceType}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td className="status">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Declined">Declined</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="button1"
                      onClick={() => handleSelectOrder(order)}
                    >
                      View Details
                    </button>
                    <button
                      className="button2"
                      onClick={() => handleRescheduleClick(order)}
                    >
                      Reschedule
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        {selectedOrder && (
          <div>
            <h3>Order Details</h3>
            <p>
              <strong>Worker:</strong> {selectedOrder.workerName}
            </p>
            <p>
              <strong>User:</strong> {selectedOrder.userName}
            </p>
            <p>
              <strong>Service:</strong> {selectedOrder.serviceType}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {new Date(selectedOrder.date).toLocaleString()}
            </p>
            <p>
              <strong>End Date:</strong>{' '}
              {new Date(selectedOrder.endDate).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
      >
        {selectedOrder && (
          <div>
            <h3>Reschedule Order</h3>
            <p>Order ID: {selectedOrder._id}</p>
            <label>
              Start Date:
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                dateFormat="dd.MM.yyyy, HH:mm"
                className="custom-datepicker"
              />
            </label><br />
            <label>
              End Date:
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                dateFormat="dd.MM.yyyy, HH:mm"
                className="custom-datepicker"
              />
            </label>
            <div className="modal-buttons">
              <button className="button1" onClick={handleReschedule}>
                Confirm Reschedule
              </button>
              <button
                className="button2"
                onClick={() => setIsRescheduleModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
