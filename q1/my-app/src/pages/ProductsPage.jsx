import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import EditProductModal from '../components/EditProductModal';

export default function ProductsPage() {
  const {
    products,
    productsLoading,
    productsError,
    selectedProductId,
    setSelectedProductId,
    searchProducts,
    fetchProducts,
  } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts(searchQuery);
      } else {
        fetchProducts();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts, fetchProducts]);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleEditPage = (id) => {
    navigate(`/products/edit/${id}`);
  };

  const isHighlighted = useCallback(
    (id) => selectedProductId === id,
    [selectedProductId]
  );

  useEffect(() => {
    if (selectedProductId) {
      const el = document.getElementById(`product-${selectedProductId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-pulse');
        const timer = setTimeout(() => {
          el.classList.remove('highlight-pulse');
          setSelectedProductId(null);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedProductId, products, setSelectedProductId]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Products</h2>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => navigate('/products/add')}>
          + Add Product
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {productsError && <p className="form-error">{productsError}</p>}
      {productsLoading && <p className="loading-state">Loading products...</p>}

      <div className="products-grid">
        {products.map((product) => (
          <div
            key={product.id}
            id={`product-${product.id}`}
            className={`product-card ${isHighlighted(product.id) ? 'highlighted' : ''}`}
          >
            <div className="product-image">
              <img src={product.thumbnail} alt={product.title} />
            </div>
            <div className="product-body">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-category">{product.category}</p>
              <div className="product-meta">
                <span className="product-price">${product.price?.toFixed(2)}</span>
                <span className="product-stock">Stock: {product.stock}</span>
              </div>
              <div className="product-actions">
                <button type="button" className="btn-secondary btn-sm" onClick={() => handleEdit(product)}>
                  Quick Edit
                </button>
                <button type="button" className="btn-primary btn-sm" onClick={() => handleEditPage(product.id)}>
                  Full Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!productsLoading && products.length === 0 && (
        <p className="empty-state">No products found.</p>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
