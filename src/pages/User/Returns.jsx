import { useState, useEffect } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    try {
      const response = await api.get('/user/view_return/view');
      setReturns(getResponseData(response));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load returns'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  return (
    <div>
      <h2>My Returns</h2>
      <Alert message={error} type="danger" />
      {loading && <LoadingState label="Loading returns..." />}
      {!loading && returns.length === 0 && <EmptyState message="No returns found." />}
      {!loading && returns.length > 0 && (
        <ul className="list-group">
          {returns.map((ret) => (
            <li key={ret.return_id} className="list-group-item">
              <strong>Return {ret.return_id}</strong>
              <div>Status: {ret.status}</div>
              <div>Quality check: {ret.quality_check_status}</div>
              <div>Refund: {ret.refund_status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Returns;
