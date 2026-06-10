import { useState } from 'react';
import api from '../../api';
import { getApiErrorMessage } from '../../api/errors';
import { getResponseMessage } from '../../api/response';
import { Alert } from '../../components/PageState';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/admin/add', {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        description: description.trim(),
      });
      setMessage(getResponseMessage(response, 'Product saved'));
      setTimeout(() => navigate('/admin/products'), 500);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to add product'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-panel">
      <h2 className="mb-4">Add Product</h2>
      <Alert message={message} type="success" />
      <Alert message={error} type="danger" />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price</label>
            <input type="number" min="1" step="1" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Stock</label>
            <input type="number" min="1" step="1" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
