import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData, getResponseMessage } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReturns = useCallback(async () => {
    setError('');
    try {
      const response = await api.get('/user/view_return/view');
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

  const requestReturn = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setReceipt(null);

    try {
      const response = await api.post(
        `/user/request_return/request/${encodeURIComponent(orderId.trim())}`,
        { reason: reason.trim() }
      );
      const createdReturn = getResponseData(response)[0];
      setReceipt(createdReturn || null);
      setMessage(getResponseMessage(response, 'Return request created'));
      setOrderId('');
      setReason('');
      await fetchReturns();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create return'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Post-purchase operations</span>
          <h1>Returns</h1>
          <p>Submit a delivered order for review and track its progress.</p>
        </div>
      </div>

      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />

      {receipt && (
        <div className="receipt-card">
          <div>
            <span className="eyebrow">Return request confirmed</span>
            <h3>{receipt.return_id}</h3>
            <p>Return ID for order {receipt.order_id}. Save it for tracking.</p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigator.clipboard?.writeText(receipt.return_id)}
          >
            Copy Return ID
          </button>
        </div>
      )}

      <div className="workspace-grid">
        <form className="surface-card" onSubmit={requestReturn}>
          <div className="section-heading">
            <span className="section-icon">01</span>
            <div>
              <h3>Create a return</h3>
              <p>Use the Order ID shown in your order history.</p>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Order ID</label>
            <input
              className="form-control"
              value={orderId}
              onChange={event => setOrderId(event.target.value)}
              placeholder="Example: 665f..."
              required
            />
            <div className="form-text">The backend validates this ID against your account.</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Reason for return</label>
            <textarea
              className="form-control"
              rows="4"
              value={reason}
              onChange={event => setReason(event.target.value)}
              placeholder="Describe the issue with the delivered order"
              required
            />
          </div>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating return...' : 'Submit Return Request'}
          </button>
        </form>

        <section className="surface-card">
          <div className="section-heading">
            <span className="section-icon">02</span>
            <div>
              <h3>Return history</h3>
              <p>Track quality checks and refund progress.</p>
            </div>
          </div>
          {loading && <LoadingState label="Loading returns..." />}
          {!loading && returns.length === 0 && (
            <EmptyState message="No return requests have been created." />
          )}
          <div className="return-list">
            {returns.map(item => (
              <article className="return-record" key={item.return_id}>
                <div className="record-id-row">
                  <div>
                    <span className="record-label">Return ID</span>
                    <strong>{item.return_id}</strong>
                  </div>
                  <button
                    className="copy-button"
                    onClick={() => navigator.clipboard?.writeText(item.return_id)}
                  >
                    Copy
                  </button>
                </div>
                <div className="record-meta">
                  <span>Order {item.order_id}</span>
                  <span className="status-pill">{item.status}</span>
                </div>
                {item.reason && <p className="record-reason">{item.reason}</p>}
                <div className="progress-grid">
                  <div>
                    <span>Quality check</span>
                    <strong>{item.quality_check_status}</strong>
                  </div>
                  <div>
                    <span>Refund</span>
                    <strong>{item.refund_status}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Returns;
