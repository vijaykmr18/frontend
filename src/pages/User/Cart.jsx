import { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/user/products'); // Might need a dedicated cart endpoint; fallback to products
      // Assuming cart is stored in user session; for demo we will store locally
      // Since no explicit GET cart endpoint, we'll simulate with a local state.
      // However, to stay true to your API, we can show add/update/delete only.
      // We'll just list items from local state (you may need to create a /user/cart endpoint).
      // For full compliance, we'll skip listing and only allow actions via input.
      setCartItems([]); // placeholder
    } catch (err) {
      console.error(err);
    }
  };

  // Because the API endpoints only update/delete by product_name, we'll provide a manual form
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = async () => {
    try {
      await api.post('/user/add_cart/add', { product_name: productName });
      setMessage(`Added ${productName}`);
    } catch (err) {
      setMessage('Error adding item');
    }
  };

  const updateItem = async () => {
    try {
      await api.put(`/user/update_cart/cart/${productName}`, { quantity });
      setMessage(`Updated ${productName}`);
    } catch (err) {
      setMessage('Error updating item');
    }
  };

  const deleteItem = async () => {
    try {
      await api.delete(`/user/delete_cart/cart/${productName}`);
      setMessage(`Deleted ${productName}`);
    } catch (err) {
      setMessage('Error deleting item');
    }
  };

  return (
    <div>
      <h2>Cart Management</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label>Product Name</label>
        <input className="form-control mb-2" value={productName} onChange={(e)=>setProductName(e.target.value)} />
        <div className="mb-2">
          <label>Quantity (for update)</label>
          <input type="number" className="form-control" value={quantity} onChange={(e)=>setQuantity(e.target.value)} />
        </div>
        <button className="btn btn-success me-2" onClick={addItem}>Add to Cart</button>
        <button className="btn btn-warning me-2" onClick={updateItem}>Update</button>
        <button className="btn btn-danger" onClick={deleteItem}>Delete</button>
      </div>
      <hr />
      <button className="btn btn-primary" onClick={() => navigate('/orders')}>Go to Place Order</button>
    </div>
  );
};

export default Cart;