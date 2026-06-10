import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { generateBarChartData, generateLineChartData } from '../data/mockAnalytics';

export default function AnalyticsCharts() {
  const { timeRange } = useDashboard();
  const barData = useMemo(() => generateBarChartData(timeRange), [timeRange]);
  const lineData = useMemo(() => generateLineChartData(timeRange), [timeRange]);

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Revenue & Orders</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#6366f1" name="Revenue ($)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="orders" fill="#22d3ee" name="Orders" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card">
        <h3>Active Users & Sessions</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} name="Active Users" dot={false} />
            <Line type="monotone" dataKey="sessions" stroke="#22d3ee" strokeWidth={2} name="Sessions" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
