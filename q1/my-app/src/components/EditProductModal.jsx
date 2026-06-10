import { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';

function EditProductForm({ product, onClose }) {
  const { updateProduct } = useDashboard();
  const [form, setForm] = useState({
    title: product.title || '',
    category: product.category || '',
    price: product.price?.toString() || '',
    stock: product.stock?.toString() || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateProduct(product.id, {
        title: form.title,
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input id="edit-title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="edit-category">Category</label>
            <input id="edit-category" name="category" value={form.category} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-price">Price ($)</label>
              <input id="edit-price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-stock">Stock</label>
              <input id="edit-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditProductModal({ product, onClose }) {
  if (!product) return null;
  return <EditProductForm key={product.id} product={product} onClose={onClose} />;
}
