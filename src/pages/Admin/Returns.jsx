import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData, getResponseMessage } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyReturn, setBusyReturn] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchReturns = useCallback(async () => {
    try {
      const response = await api.get('/admin/view');
      setReturns(getResponseData(response));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load returns'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const runAction = async (returnId, request, fallback) => {
    setBusyReturn(returnId);
    setError('');
    try {
      const response = await request();
      setMessage(getResponseMessage(response, fallback));
      await fetchReturns();
    } catch (err) {
      setError(getApiErrorMessage(err, fallback));
    } finally {
      setBusyReturn('');
    }
  };

  const initiateReturn = (returnId) =>
    runAction(
      returnId,
      () => api.put(`/admin/update-status/${returnId}`, null, {
        params: { status: 'Initiated' },
      }),
      'Unable to initiate return'
    );

  const qualityCheck = (returnId, result) =>
    runAction(
      returnId,
      () => api.put(`/admin/quality-check/${returnId}`, null, {
        params: { result },
      }),
      'Unable to complete quality check'
    );

  return (
    <div>
      <h2 className="mb-4">Returns</h2>
      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />
      {loading && <LoadingState label="Loading returns..." />}
      {!loading && returns.length === 0 && <EmptyState message="No returns found." />}
      <div className="stack-list">
        {returns.map(item => (
          <article className="order-card" key={item.return_id}>
            <div className="order-card-header">
              <div>
                <strong>Return {item.return_id}</strong>
                <div className="text-muted small">{item.user_email}</div>
              </div>
              <span className="badge text-bg-secondary">{item.status}</span>
            </div>
            <p className="mt-3 mb-2"><strong>Reason:</strong> {item.reason}</p>
            <p className="mb-3">
              Quality: {item.quality_check_status} | Refund: {item.refund_status}
            </p>
            <div className="action-row">
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={busyReturn === item.return_id || item.status !== 'Return Requested'}
                onClick={() => initiateReturn(item.return_id)}
              >
                Initiate
              </button>
              <button
                className="btn btn-success btn-sm"
                disabled={busyReturn === item.return_id || item.status !== 'Initiated'}
                onClick={() => qualityCheck(item.return_id, 'Passed')}
              >
                Pass Check
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={busyReturn === item.return_id || item.status !== 'Initiated'}
                onClick={() => qualityCheck(item.return_id, 'Failed')}
              >
                Fail Check
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminReturns;
