import { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../api/products';
import { deleteProductAdmin } from '../api/admin';
import { RawErrorDisplay } from '../components/ErrorBoundary';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const fetchProductsList = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve marketplace catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing from catalog?')) return;
    try {
      await deleteProductAdmin(productId);
      fetchProductsList();
    } catch (err) {
      setError(err.message || 'Failed to delete listing');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createProduct({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image_url: '/static/uploads/placeholder.png' // Default
      });
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      fetchProductsList();
    } catch (err) {
      setError(err.message || 'Failed to create product listing');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Catalog Control Center</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px' }}>
          Create, verify, and terminate marketplace assets.
        </p>
      </div>

      {error && <RawErrorDisplay error={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
        {/* Create new product Form */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>➕ Create New Listing</h3>
          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="products-count" htmlFor="prod-name" style={{ display: 'block', marginBottom: '6px' }}>Asset Name</label>
              <input
                id="prod-name"
                type="text"
                className="search-input"
                style={{ borderRadius: 'var(--radius-md)', paddingLeft: '12px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Exploits pack"
                required
              />
            </div>
            <div>
              <label className="products-count" htmlFor="prod-desc" style={{ display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea
                id="prod-desc"
                className="search-input"
                style={{ borderRadius: 'var(--radius-md)', paddingLeft: '12px', paddingTop: '8px', minHeight: '80px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the asset..."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="products-count" htmlFor="prod-price" style={{ display: 'block', marginBottom: '6px' }}>Price ($)</label>
                <input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  className="search-input"
                  style={{ borderRadius: 'var(--radius-md)', paddingLeft: '12px' }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99.99"
                  required
                />
              </div>
              <div>
                <label className="products-count" htmlFor="prod-stock" style={{ display: 'block', marginBottom: '6px' }}>Stock Qty</label>
                <input
                  id="prod-stock"
                  type="number"
                  className="search-input"
                  style={{ borderRadius: 'var(--radius-md)', paddingLeft: '12px' }}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} id="btn-create-product">
              Broadcast Asset 📡
            </button>
          </form>
        </div>

        {/* Product listing table */}
        {loading ? (
          <div>Loading catalog node database...</div>
        ) : (
          <div className="card animate-fade-in" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Stock</th>
                  <th style={{ padding: '12px' }}>Created By</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>#{p.id}</td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '12px' }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>{p.stock}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>vendor_{p.created_by}</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-ghost"
                        style={{ padding: '6px 12px', color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)' }}
                        id={`btn-delete-product-${p.id}`}
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
