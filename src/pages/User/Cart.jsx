import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData, getResponseMessage } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyItem, setBusyItem] = useState('');
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      const response = await api.get('/user/add_cart/view');
      setCartItems(getResponseData(response));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load cart'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (productName, quantity) => {
    if (quantity < 1) return;
    setBusyItem(productName);
    setError('');
    try {
      const response = await api.put(
        `/user/update_cart/cart/${encodeURIComponent(productName)}`,
        null,
        { params: { quantity } }
      );
      setCartItems(items =>
        items.map(item =>
          item.product_name === productName ? { ...item, quantity } : item
        )
      );
      setMessage(getResponseMessage(response, 'Cart updated'));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update cart'));
    } finally {
      setBusyItem('');
    }
  };

  const deleteItem = async (productName) => {
    setBusyItem(productName);
    setError('');
    try {
      const response = await api.delete(
        `/user/delete_cart/cart/${encodeURIComponent(productName)}`
      );
      setCartItems(items => items.filter(item => item.product_name !== productName));
      setMessage(getResponseMessage(response, 'Item removed'));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to remove item'));
    } finally {
      setBusyItem('');
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Purchase workspace</span>
          <h1>Your cart</h1>
          <p>Review quantities, availability, and order value before checkout.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/products')}>
          Continue shopping
        </button>
      </div>
      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />
      {loading && <LoadingState label="Loading cart..." />}
      {!loading && cartItems.length === 0 && (
        <EmptyState message="Your cart is empty. Add a product to get started." />
      )}
      {!loading && cartItems.length > 0 && (
        <section className="surface-card">
          <div className="table-responsive">
            <table className="table enterprise-table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.product_name}>
                    <td>{item.product_name}</td>
                    <td>₹{item.price || 0}</td>
                    <td>
                      <div className="quantity-control">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          disabled={busyItem === item.product_name || item.quantity <= 1}
                          onClick={() => updateQuantity(item.product_name, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          disabled={busyItem === item.product_name || item.quantity >= item.stock}
                          onClick={() => updateQuantity(item.product_name, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>₹{(item.price || 0) * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={busyItem === item.product_name}
                        onClick={() => deleteItem(item.product_name)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-summary">
            <div>
              <span className="record-label">Order total</span>
              <strong className="cart-total">₹{total}</strong>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
              Continue to Order
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Cart;
