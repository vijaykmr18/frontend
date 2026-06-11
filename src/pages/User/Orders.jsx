import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData, getResponseMessage } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState('');
  const [returnReasons, setReturnReasons] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [returnReceipt, setReturnReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');

  const fetchOrders = useCallback(async () => {
    setError('');
    try {
      const response = await api.get('/user/view_order/orders');
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

  const placeOrder = async (event) => {
    event.preventDefault();
    setBusy('place-order');
    setError('');
    try {
      const response = await api.post('/user/place_order/order', {
        location: location.trim(),
      });
      setMessage(getResponseMessage(response, 'Order placed'));
      setLocation('');
      await fetchOrders();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Order failed'));
    } finally {
      setBusy('');
    }
  };

  const deleteOrderItem = async (productName, quantity) => {
    const key = `delete-${productName}`;
    setBusy(key);
    setError('');
    try {
      const response = await api.delete(
        `/user/delete_order/order/${encodeURIComponent(productName)}`,
        { params: { quantity } }
      );
      setMessage(getResponseMessage(response, 'Order updated'));
      await fetchOrders();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update order'));
    } finally {
      setBusy('');
    }
  };

  const requestReturn = async (orderId) => {
    const reason = returnReasons[orderId]?.trim();
    if (!reason) {
      setError('Enter a return reason first.');
      return;
    }

    setBusy(`return-${orderId}`);
    setError('');
    try {
      const response = await api.post(
        `/user/request_return/request/${orderId}`,
        { reason }
      );
      const receipt = getResponseData(response)[0];
      setReturnReceipt(receipt || null);
      setMessage(getResponseMessage(response, 'Return requested'));
      setReturnReasons(current => ({ ...current, [orderId]: '' }));
      await fetchOrders();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Return request failed'));
    } finally {
      setBusy('');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Orders</h2>
      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />
      {returnReceipt && (
        <div className="receipt-card">
          <div>
            <span className="eyebrow">Return created</span>
            <h4>{returnReceipt.return_id}</h4>
            <p>Keep this Return ID for tracking and support.</p>
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigator.clipboard?.writeText(returnReceipt.return_id)}
          >
            Copy Return ID
          </button>
        </div>
      )}

      <form className="form-panel mb-4" onSubmit={placeOrder}>
        <h4>Place Order</h4>
        <label className="form-label">Delivery Location</label>
        <textarea
          className="form-control mb-3"
          rows="3"
          value={location}
          onChange={event => setLocation(event.target.value)}
          required
        />
        <button className="btn btn-success" disabled={busy === 'place-order'}>
          {busy === 'place-order' ? 'Placing order...' : 'Place Order from Cart'}
        </button>
      </form>

      <h4 className="mb-3">Order History</h4>
      {loading && <LoadingState label="Loading orders..." />}
      {!loading && orders.length === 0 && <EmptyState message="No orders found." />}
      <div className="stack-list">
        {orders.map(order => (
          <article className="order-card" key={order.order_id}>
            <div className="order-card-header">
              <div>
                <span className="record-label">Order ID</span>
                <div className="record-id-row">
                  <strong>{order.order_id}</strong>
                  <button
                    className="copy-button"
                    onClick={() => navigator.clipboard?.writeText(order.order_id)}
                    aria-label="Copy order ID"
                  >
                    Copy
                  </button>
                </div>
                <div className="text-muted small">{order.location}</div>
              </div>
              <span className="badge text-bg-secondary">{order.status}</span>
            </div>
            <div className="mt-3">
              {order.items?.map(item => (
                <div className="order-item" key={item.product_id}>
                  <span>{item.product_name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                  {order.status !== 'Delivered' && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      disabled={busy === `delete-${item.product_name}`}
                      onClick={() => deleteOrderItem(item.product_name, 1)}
                    >
                      Remove one
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="order-footer">
              <strong>Total: ₹{order.total_amount}</strong>
              {order.status === 'Delivered' && (
                <div className="return-form">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Return reason"
                    value={returnReasons[order.order_id] || ''}
                    onChange={event =>
                      setReturnReasons(current => ({
                        ...current,
                        [order.order_id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    disabled={busy === `return-${order.order_id}`}
                    onClick={() => requestReturn(order.order_id)}
                  >
                    Create Return
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Orders;
