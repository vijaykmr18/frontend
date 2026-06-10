import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userLinks = [
  ['/products', 'Catalog'],
  ['/cart', 'Cart'],
  ['/orders', 'Orders'],
  ['/returns', 'Returns'],
];

const adminLinks = [
  ['/admin/products', 'Inventory'],
  ['/admin/add-product', 'Add Product'],
  ['/admin/orders', 'Orders'],
  ['/admin/returns', 'Returns'],
];

const Navbar = () => {
  const { token, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <span className="brand-mark">N</span>
            <span>
              <strong>Nexus</strong>
              <small>Commerce</small>
            </span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {token && (
              <div className="navbar-nav nav-shell mx-auto">
                {links.map(([path, label]) => (
                  <NavLink
                    key={path}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    to={path}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
            <div className="navbar-actions">
              {!token ? (
                <>
                  <NavLink className="btn btn-ghost" to="/login">Sign in</NavLink>
                  <NavLink className="btn btn-primary" to="/register">Create account</NavLink>
                </>
              ) : (
                <>
                  <div className="account-chip">
                    <span className="account-avatar">
                      {(user?.sub || 'U').charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <strong>{isAdmin ? 'Administrator' : 'Customer'}</strong>
                      <small>{user?.sub}</small>
                    </span>
                  </div>
                  <button className="btn btn-ghost" onClick={handleLogout}>Sign out</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
