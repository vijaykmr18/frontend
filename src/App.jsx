import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { LoadingState } from './components/PageState';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Products = lazy(() => import('./pages/User/Products'));
const Cart = lazy(() => import('./pages/User/Cart'));
const Orders = lazy(() => import('./pages/User/Orders'));
const Returns = lazy(() => import('./pages/User/Returns'));
const AdminProducts = lazy(() => import('./pages/Admin/Products'));
const AddProduct = lazy(() => import('./pages/Admin/AddProduct'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminReturns = lazy(() => import('./pages/Admin/Returns'));

function App() {
  return (
    <>
      <Navbar />
      <div className="container page-container">
        <Suspense fallback={<LoadingState label="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute requiredAdmin><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/add-product" element={<ProtectedRoute requiredAdmin><AddProduct /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute requiredAdmin><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/returns" element={<ProtectedRoute requiredAdmin><AdminReturns /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
