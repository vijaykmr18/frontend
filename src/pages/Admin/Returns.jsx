import { useEffect, useState } from 'react';
import api from '../../api';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [message, setMessage] = useState('');

  const fetchReturns = async () => {
    const { data } = await api.get('/admin/view');
    setReturns(data);
  };

  useEffect(() => { fetchReturns(); }, []);

  const qualityCheck = async (returnId) => {
    await api.put(`/admin/quality-check/${returnId}`);
    fetchReturns();
  };

  const updateStatus = async (returnId, status) => {
    await api.put(`/admin/update-status/${returnId}`, { status });
    fetchReturns();
  };

  return (
    <div>
      <h2>Returns</h2>
      {returns.length === 0 ? <p>No returns</p> : (
        <table className="table">
          <thead><tr><th>Return ID</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {returns.map((r, idx) => (
              <tr key={idx}>
                <td>{r.id || r._id}</td>
                <td>{r.status}</td>
                <td>
                  <button className="btn btn-sm btn-info me-1" onClick={()=>qualityCheck(r.id || r._id)}>Quality Check</button>
                  <button className="btn btn-sm btn-success me-1" onClick={()=>updateStatus(r.id || r._id, 'approved')}>Approve</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>updateStatus(r.id || r._id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReturns;