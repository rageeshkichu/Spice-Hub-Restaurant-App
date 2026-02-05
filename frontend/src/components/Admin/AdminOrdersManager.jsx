import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders, updateOrderStatus } from '../../services/adminApi';

function AdminOrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      preparing: '#ff5722',
      ready: '#4caf50',
      completed: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="admin-section">
      <h3>Orders Management</h3>

      <div className="filter-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Orders</option>
          {(Array.isArray(statuses) ? statuses : []).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <button onClick={fetchOrders} className="btn btn-small btn-primary">
          🔄 Refresh
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="empty-state">No orders found</p>
      ) : (
        <div className="orders-grid">
          {(Array.isArray(filteredOrders) ? filteredOrders : []).map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h5>Order #{order.order_number}</h5>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <strong>Type:</strong> {order.order_type.toUpperCase()}
                </div>
                <div className="detail-row">
                  <strong>Customer:</strong> {order.customer_name}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> {order.customer_phone}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {order.customer_email}
                </div>

                {order.order_type === 'delivery' && (
                  <>
                    <div className="detail-row">
                      <strong>Address:</strong> {order.delivery_address}, {order.delivery_postcode}
                    </div>
                  </>
                )}

                {order.requested_time && (
                  <div className="detail-row">
                    <strong>Requested Time:</strong> {new Date(order.requested_time).toLocaleString()}
                  </div>
                )}

                {order.notes && (
                  <div className="detail-row">
                    <strong>Notes:</strong> {order.notes}
                  </div>
                )}
              </div>

              <div className="order-items">
                <strong>Items:</strong>
                <ul>
                  {(Array.isArray(order.items) ? order.items : []).map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.menu_item_name} ({item.portion_type})
                      {item.special_instructions && (
                        <div className="special-instructions">📝 {item.special_instructions}</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>£{parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                {order.delivery_fee > 0 && (
                  <div className="total-row">
                    <span>Delivery:</span>
                    <span>£{parseFloat(order.delivery_fee).toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row" style={{ fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
                  <span>Total:</span>
                  <span>£{parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>

              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="status-select"
                >
                  {(Array.isArray(statuses) ? statuses : []).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="order-footer">
                <small>Placed: {new Date(order.created_at).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersManager;
