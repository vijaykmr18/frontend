import { useEffect, useState } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData, getResponseMessage } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/user/products');
      setProducts(getResponseData(response));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productName) => {
    setAdding(productName);
    setError('');
    try {
      const response = await api.post('/user/add_cart/add', null, {
        params: { product_name: productName, quantity: 1 },
      });
      setMessage(getResponseMessage(response, `Added ${productName} to cart`));
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to add to cart'));
    } finally {
      setAdding('');
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Product catalog</span>
          <h1>Discover products</h1>
          <p>Explore live inventory and add available items to your cart.</p>
        </div>
      </div>
      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />
      {loading && <LoadingState label="Loading products..." />}
      {!loading && products.length === 0 && <EmptyState message="No products are available." />}
      <div className="row">
        {products.map((p) => (
          <div key={p.name} className="col-md-6 col-lg-4 mb-4">
            <div className="card product-card h-100">
              <div className="card-body">
                <span className="product-kicker">In catalog</span>
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <div className="product-meta">
                  <strong>₹{p.price}</strong>
                  <span>{p.stock} in stock</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(p.name)}
                  disabled={adding === p.name || p.stock < 1}
                >
                  {adding === p.name ? 'Adding...' : p.stock < 1 ? 'Out of stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
