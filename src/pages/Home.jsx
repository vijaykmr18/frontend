import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { token, isAdmin } = useAuth();
  return (
    <div className="text-center mt-5">
      <h1>Welcome to the Store</h1>
      {!token ? (
        <p>
          <Link to="/login" className="btn btn-primary me-2">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </p>
      ) : (
        <p>
          <Link to={isAdmin ? '/admin/products' : '/products'} className="btn btn-success">
            Go to Dashboard
          </Link>
        </p>
      )}
    </div>
  );
};

export default Home;