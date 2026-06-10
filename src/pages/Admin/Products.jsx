import { useEffect, useState } from 'react';
import api from '../../api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await api.get('/admin/products');
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (productName) => {
    if (window.confirm('Delete this product?')) {
      await api.delete(`/admin/delete/${productName}`);
      fetchProducts();
    }
  };

  return (
    <div>
      <h2>Admin Products</h2>
      <table className="table">
        <thead><tr><th>Name</th><th>Price</th><th>Action</th></tr></thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={idx}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td><button className="btn btn-danger btn-sm" onClick={()=>deleteProduct(p.name)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;