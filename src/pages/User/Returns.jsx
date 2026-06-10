import { useState, useEffect } from 'react';
import api from '../../api';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [message, setMessage] = useState('');

  const fetchReturns = async () => {
    try {
      const { data } = await api.get('/user/view_return/view');
      setReturns(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  return (
    <div>
      <h2>My Returns</h2>
      {returns.length === 0 ? <p>No returns found.</p> : (
        <ul className="list-group">
          {returns.map((ret, idx) => (
            <li key={idx} className="list-group-item">
              Return ID: {ret.id || ret._id} — Status: {ret.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Returns;