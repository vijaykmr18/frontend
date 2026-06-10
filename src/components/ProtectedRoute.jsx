import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from './PageState';

const ProtectedRoute = ({ children, requiredAdmin = false }) => {
  const { token, isAdmin, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) return <LoadingState label="Restoring your session..." />;
  if (!token) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (requiredAdmin && !isAdmin) return <Navigate to="/products" replace />;
  return children;
};

export default ProtectedRoute;
