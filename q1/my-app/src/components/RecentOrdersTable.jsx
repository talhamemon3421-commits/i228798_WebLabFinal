import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';

export default function RecentOrdersTable() {
  const { products, setSelectedProductId } = useDashboard();
  const navigate = useNavigate();
  const recentProducts = products.slice(0, 7);

  const handleProductClick = (product) => {
    setSelectedProductId(product.id);
    navigate('/products');
  };

  if (recentProducts.length === 0) {
    return (
      <div className="table-card">
        <h3>Recent Orders</h3>
        <p className="empty-state">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <h3>Recent Orders</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <button
                    type="button"
                    className="product-link"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.title}
                  </button>
                </td>
                <td>{product.category}</td>
                <td>${product.price?.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className="rating-badge">★ {product.rating?.toFixed(1) || 'N/A'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
