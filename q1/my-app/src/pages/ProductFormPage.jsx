import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { API_BASE } from '../constants/dashboard';

function ProductForm({ product, isEdit, onCancel, onSaved }) {
  const { addProduct, updateProduct } = useDashboard();
  const [form, setForm] = useState({
    title: product?.title || '',
    category: product?.category || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '',
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
    const payload = {
      title: form.title,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };
    try {
      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await addProduct(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} required placeholder="Product title" />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input id="category" name="category" value={form.category} onChange={handleChange} required placeholder="e.g. electronics" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="0.00" />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required placeholder="0" />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { products } = useDashboard();
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetchState, setFetchState] = useState('idle');

  const productFromContext = isEdit
    ? products.find((p) => p.id === parseInt(id, 10))
    : null;
  const product = productFromContext || fetchedProduct;
  const needsFetch = isEdit && !productFromContext;
  const loading = isEdit && !product && fetchState !== 'error';

  useEffect(() => {
    if (!needsFetch) return undefined;

    let cancelled = false;

    (async () => {
      setFetchState('loading');
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        if (!cancelled) {
          setFetchedProduct(data);
          setFetchState('done');
        }
      } catch {
        if (!cancelled) setFetchState('error');
      }
    })();

    return () => { cancelled = true; };
  }, [needsFetch, id]);

  if (loading) {
    return (
      <div className="page">
        <p className="loading-state">Loading product...</p>
      </div>
    );
  }

  if (isEdit && !product) {
    return (
      <div className="page">
        <p className="form-error">Product not found.</p>
        <button type="button" className="btn-secondary" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <p className="page-subtitle">
            {isEdit ? `Editing product #${id}` : 'Create a new product listing'}
          </p>
        </div>
      </header>

      <ProductForm
        key={isEdit ? product.id : 'new'}
        product={product}
        isEdit={isEdit}
        onCancel={() => navigate('/products')}
        onSaved={() => navigate('/products')}
      />
    </div>
  );
}
