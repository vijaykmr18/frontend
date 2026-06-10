import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData, getResponseMessage } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyOrder, setBusyOrder] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(getResponseData(response));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load orders'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const markDelivered = async (orderId) => {
    setBusyOrder(orderId);
    setError('');
    try {
      const response = await api.put(`/admin/order/${orderId}`, null, {
        params: { status: 'Delivered' },
      });
      setOrders(current =>
        current.map(order =>
          order.order_id === orderId ? { ...order, status: 'Delivered' } : order
        )
      );
      setMessage(getResponseMessage(response, 'Order marked as delivered'));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update order'));
    } finally {
      setBusyOrder('');
    }
  };

  return (
    <div>
      <h2 className="mb-4">All Orders</h2>
      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />
      {loading && <LoadingState label="Loading orders..." />}
      {!loading && orders.length === 0 && <EmptyState message="No orders found." />}
      <div className="stack-list">
        {orders.map(order => (
          <article className="order-card" key={order.order_id}>
            <div className="order-card-header">
              <div>
                <strong>{order.order_id}</strong>
                <div className="text-muted small">{order.user_email}</div>
              </div>
              <span className="badge text-bg-secondary">{order.status}</span>
            </div>
            <div className="mt-3">
              {order.items?.map(item => (
                <div className="order-item" key={item.product_id}>
                  <span>{item.product_name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <strong>Total: ₹{order.total_amount}</strong>
              <button
                className="btn btn-success btn-sm"
                disabled={order.status === 'Delivered' || busyOrder === order.order_id}
                onClick={() => markDelivered(order.order_id)}
              >
                {busyOrder === order.order_id ? 'Updating...' : 'Mark Delivered'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
