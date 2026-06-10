import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredAdmin = false }) => {
  const { token, isAdmin } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (requiredAdmin && !isAdmin) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;