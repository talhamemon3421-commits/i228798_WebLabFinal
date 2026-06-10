import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardProvider';
import Layout from './components/Layout/Layout';
import AnalyticsPage from './pages/AnalyticsPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import EcommercePage from './pages/EcommercePage';
import LogisticsPage from './pages/LogisticsPage';

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AnalyticsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/add" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="ecommerce" element={<EcommercePage />} />
            <Route path="logistics" element={<LogisticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}
