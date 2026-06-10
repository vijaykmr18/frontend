import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/User/Products';
import Cart from './pages/User/Cart';
import Orders from './pages/User/Orders';
import Returns from './pages/User/Returns';
import AdminProducts from './pages/Admin/Products';
import AddProduct from './pages/Admin/AddProduct';
import AdminOrders from './pages/Admin/Orders';
import AdminReturns from './pages/Admin/Returns';

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* User routes */}
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
          {/* Admin routes */}
          <Route path="/admin/products" element={<ProtectedRoute requiredAdmin><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute requiredAdmin><AddProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requiredAdmin><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/returns" element={<ProtectedRoute requiredAdmin><AdminReturns /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;