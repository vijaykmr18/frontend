export const LoadingState = ({ label = 'Loading...' }) => (
  <div className="page-state" role="status">
    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export const EmptyState = ({ message }) => (
  <div className="empty-state">{message}</div>
);

export const Alert = ({ message, type = 'info' }) =>
  message ? (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  ) : null;
