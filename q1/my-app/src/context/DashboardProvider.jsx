import { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardContext } from './dashboardContext';
import { API_BASE } from '../constants/dashboard';

export function DashboardProvider({ children }) {
  const [timeRange, setTimeRange] = useState('12 months');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [logisticFilter, setLogisticFilter] = useState('all');

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await fetch(`${API_BASE}/products?limit=100`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const res = await fetch(`${API_BASE}/products?limit=100`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (!cancelled) setProducts(data.products || []);
      } catch (err) {
        if (!cancelled) setProductsError(err.message);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addProduct = useCallback(async (productData) => {
    const res = await fetch(`${API_BASE}/products/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to add product');
    const data = await res.json();
    setProducts((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to update product');
    const data = await res.json();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    return data;
  }, []);

  const searchProducts = useCallback(async (query) => {
    if (!query.trim()) {
      await fetchProducts();
      return;
    }
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  }, [fetchProducts]);

  const value = useMemo(
    () => ({
      timeRange,
      setTimeRange,
      products,
      productsLoading,
      productsError,
      selectedProductId,
      setSelectedProductId,
      logisticFilter,
      setLogisticFilter,
      fetchProducts,
      addProduct,
      updateProduct,
      searchProducts,
    }),
    [
      timeRange,
      products,
      productsLoading,
      productsError,
      selectedProductId,
      logisticFilter,
      fetchProducts,
      addProduct,
      updateProduct,
      searchProducts,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
