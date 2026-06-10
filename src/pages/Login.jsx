import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-story">
        <span className="eyebrow">Secure commerce workspace</span>
        <h1>Welcome back.</h1>
        <p>Manage inventory, orders, returns, and customer activity from one focused workspace.</p>
        <div className="auth-proof">
          <span>Secure JWT sessions</span>
          <span>Role-based access</span>
          <span>Real-time operations</span>
        </div>
      </section>
      <section className="auth-card">
        <div className="auth-card-header">
          <span className="brand-mark">N</span>
          <div>
            <h2>Sign in</h2>
            <p>Continue to Nexus Commerce</p>
          </div>
        </div>
        {location.state?.message && (
          <div className="alert alert-success">{location.state.message}</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Work email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary w-100" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
