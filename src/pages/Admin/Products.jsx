import { useEffect, useState } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseData, getResponseMessage } from '../../api/response';
import { Alert, EmptyState, LoadingState } from '../../components/PageState';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(getResponseData(response));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (productName) => {
    if (window.confirm('Delete this product?')) {
      setDeleting(productName);
      setError('');
      try {
        const response = await api.delete(`/admin/delete/${encodeURIComponent(productName)}`);
        setProducts(current => current.filter(product => product.name !== productName));
        setMessage(getResponseMessage(response, 'Product deleted'));
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to delete product'));
      } finally {
        setDeleting('');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Inventory</h2>
      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />
      {loading && <LoadingState label="Loading inventory..." />}
      {!loading && products.length === 0 && <EmptyState message="No products in inventory." />}
      {!loading && products.length > 0 && <div className="table-responsive"><table className="table align-middle">
        <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td><button className="btn btn-danger btn-sm" disabled={deleting === p.name} onClick={() => deleteProduct(p.name)}>{deleting === p.name ? 'Deleting...' : 'Delete'}</button></td>
            </tr>
          ))}
        </tbody>
      </table></div>}
    </div>
  );
};

export default AdminProducts;
