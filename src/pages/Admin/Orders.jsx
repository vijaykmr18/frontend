import { useEffect, useState } from 'react';
import api from '../../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    const { data } = await api.get('/admin/orders');
    setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId) => {
    if (!newStatus) return;
    await api.put(`/admin/order/${orderId}`, { status: newStatus });
    fetchOrders();
  };

  return (
    <div>
      <h2>All Orders</h2>
      <table className="table">
        <thead><tr><th>Order ID</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={idx}>
              <td>{o.id || o._id}</td>
              <td>{o.status}</td>
              <td>
                <input className="form-control form-control-sm mb-1" placeholder="New status" value={newStatus} onChange={e=>setNewStatus(e.target.value)} />
                <button className="btn btn-sm btn-primary" onClick={()=>updateStatus(o.id || o._id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;