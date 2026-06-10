import { useEffect, useState } from 'react';
import api from '../../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/user/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productName) => {
    try {
      await api.post('/user/add_cart/add', { product_name: productName });
      setMessage(`Added ${productName} to cart!`);
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to cart');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        {products.map((p, idx) => (
          <div key={idx} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="card-text"><strong>${p.price}</strong></p>
                <button className="btn btn-primary" onClick={() => addToCart(p.name)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;