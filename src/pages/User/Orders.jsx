import { useState } from 'react';
import api from '../../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/user/view_oder/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const placeOrder = async () => {
    try {
      await api.post('/user/place_order/order', { address });
      setMessage('Order placed!');
      fetchOrders();
    } catch (err) {
      setMessage('Order failed');
    }
  };

  const deleteOrder = async (productName) => {
    try {
      await api.delete(`/user/delete_order/order/${productName}`);
      setMessage('Order item deleted');
      fetchOrders();
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  const requestReturn = async (orderId) => {
    try {
      await api.post(`/user/request_return/request/${orderId}`);
      setMessage('Return requested');
    } catch (err) {
      setMessage('Return request failed');
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-4">
        <h4>Place Order</h4>
        <div className="mb-2">
          <label>Shipping Address</label>
          <textarea className="form-control" value={address} onChange={e=>setAddress(e.target.value)} />
        </div>
        <button className="btn btn-success" onClick={placeOrder}>Place Order</button>
      </div>
      <hr />
      <button className="btn btn-secondary mb-3" onClick={fetchOrders}>Refresh Orders</button>
      <h4>My Orders</h4>
      {orders.length === 0 ? <p>No orders found.</p> : (
        <ul className="list-group">
          {orders.map((order, idx) => (
            <li key={idx} className="list-group-item">
              <strong>Order ID: {order.id || order._id}</strong> — Status: {order.status}
              <br />
              Items: {order.items?.map(i => i.product_name).join(', ')}
              <div className="mt-2">
                <button className="btn btn-sm btn-danger me-2" onClick={() => deleteOrder(order.items?.[0]?.product_name)}>Delete by first product</button>
                <button className="btn btn-sm btn-warning" onClick={() => requestReturn(order.id || order._id)}>Request Return</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;