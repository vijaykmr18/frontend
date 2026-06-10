import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">E-Commerce</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            ) : (
              <>
                {!isAdmin && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/returns">Returns</Link></li>
                  </>
                )}
                {isAdmin && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/admin/products">Products</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/admin/add-product">Add Product</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/admin/orders">Orders</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/admin/returns">Returns</Link></li>
                  </>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;