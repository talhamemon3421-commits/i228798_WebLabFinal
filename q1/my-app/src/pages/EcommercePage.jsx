import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

const DEVICE_DATA = [
  { name: 'Desktop', value: 45, color: '#6366f1' },
  { name: 'Mobile', value: 38, color: '#22d3ee' },
  { name: 'Tablet', value: 17, color: '#a78bfa' },
];

const COLORS = ['#6366f1', '#22d3ee', '#a78bfa'];

export default function EcommercePage() {
  const { timeRange, products } = useDashboard();

  const categoryData = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cat = p.category || 'Other';
      if (!map[cat]) map[cat] = { category: cat, value: 0, stock: 0 };
      map[cat].value += p.price * (p.stock || 1);
      map[cat].stock += p.stock || 0;
    });
    return Object.values(map)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [products]);

  const bannerText = `Displaying insights for last ${timeRange}`;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>E-Commerce Insights</h2>
          <p className="page-subtitle">Device segmentation and category performance</p>
        </div>
      </header>

      <div className="insight-banner">{bannerText}</div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Session by Device</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={DEVICE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {DEVICE_DATA.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Category Performance (Value)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Bar dataKey="value" fill="#6366f1" name="Total Value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Category Stock Levels</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="stock" fill="#22d3ee" name="Stock Units" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
