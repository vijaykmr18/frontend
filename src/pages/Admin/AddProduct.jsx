import { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/add', { name, price: parseFloat(price), description });
      setMessage('Product added');
      navigate('/admin/products');
    } catch (err) {
      setMessage('Failed to add product');
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><label>Name</label><input className="form-control" value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div className="mb-3"><label>Price</label><input type="number" step="0.01" className="form-control" value={price} onChange={e=>setPrice(e.target.value)} required /></div>
        <div className="mb-3"><label>Description</label><textarea className="form-control" value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <button className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;