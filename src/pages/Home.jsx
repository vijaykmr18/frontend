import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { token, isAdmin, user } = useAuth();
  const dashboardPath = isAdmin ? '/admin/products' : '/products';

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-content">
          <span className="eyebrow">{token ? 'Your commerce workspace' : 'Modern retail operations'}</span>
          <h1>
            {token
              ? `Welcome back${user?.sub ? `, ${user.sub.split('@')[0]}` : ''}.`
              : 'Commerce operations, without the operational clutter.'}
          </h1>
          <p>
            A focused platform for product discovery, inventory control, order management,
            and accountable return processing.
          </p>
          <div className="hero-actions">
            {token ? (
              <Link to={dashboardPath} className="btn btn-primary btn-lg">Open workspace</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get started</Link>
                <Link to="/login" className="btn btn-ghost btn-lg">Sign in</Link>
              </>
            )}
          </div>
          <div className="hero-metrics">
            <div><strong>One</strong><span>Unified workspace</span></div>
            <div><strong>Live</strong><span>Inventory visibility</span></div>
            <div><strong>Clear</strong><span>Return traceability</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-grid" />
          <div className="floating-panel panel-main">
            <span>Operations overview</span>
            <strong>Built for clarity</strong>
            <div className="mini-chart"><i /><i /><i /><i /><i /></div>
          </div>
          <div className="floating-panel panel-small">
            <span className="live-dot" />
            <div><strong>System online</strong><small>Secure and connected</small></div>
          </div>
        </div>
      </section>

      <section className="capability-grid">
        <article>
          <span className="capability-number">01</span>
          <h3>Inventory intelligence</h3>
          <p>Maintain accurate stock, pricing, and product information from one view.</p>
        </article>
        <article>
          <span className="capability-number">02</span>
          <h3>Order orchestration</h3>
          <p>Move each order from cart to delivery with clear status and ownership.</p>
        </article>
        <article>
          <span className="capability-number">03</span>
          <h3>Return accountability</h3>
          <p>Track Order IDs, Return IDs, quality checks, and refund outcomes.</p>
        </article>
      </section>
    </div>
  );
};

export default Home;
