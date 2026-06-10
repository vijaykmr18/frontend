import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password, role);
      navigate('/login', {
        state: { message: 'Account created successfully. Sign in to continue.' },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-story">
        <span className="eyebrow">Structured from day one</span>
        <h1>Create your workspace access.</h1>
        <p>Choose the appropriate role and enter a secure account environment built around clear operational ownership.</p>
        <div className="auth-proof">
          <span>Controlled access</span>
          <span>Auditable workflows</span>
          <span>Persistent sessions</span>
        </div>
      </section>
      <section className="auth-card">
        <div className="auth-card-header">
          <span className="brand-mark">N</span>
          <div>
            <h2>Create account</h2>
            <p>Start using Nexus Commerce</p>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full name</label>
            <input
              className="form-control"
              value={name}
              onChange={event => setName(event.target.value)}
              pattern="[A-Za-z]+"
              title="Use letters only"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Work email</label>
            <input type="email" className="form-control" value={email} onChange={event => setEmail(event.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={event => setPassword(event.target.value)} required />
            <div className="form-text">Use 8+ characters with uppercase, lowercase, number, and symbol.</div>
          </div>
          <div className="mb-4">
            <label className="form-label">Account role</label>
            <div className="role-selector">
              <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>
                <strong>Customer</strong><span>Shop and manage orders</span>
              </button>
              <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>
                <strong>Administrator</strong><span>Manage store operations</span>
              </button>
            </div>
          </div>
          <button className="btn btn-primary w-100" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </div>
  );
};

export default Register;
