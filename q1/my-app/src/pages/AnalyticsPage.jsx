import KPICards from '../components/KPICards';
import TimelineFilter from '../components/TimelineFilter';
import AnalyticsCharts from '../components/AnalyticsCharts';
import RecentOrdersTable from '../components/RecentOrdersTable';
import { useDashboard } from '../hooks/useDashboard';

export default function AnalyticsPage() {
  const { timeRange } = useDashboard();

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Analytics Dashboard</h2>
          <p className="page-subtitle">Real-time overview of your enterprise metrics</p>
        </div>
        <TimelineFilter />
      </header>
      <div className="time-range-badge">Showing data for: <strong>{timeRange}</strong></div>
      <KPICards />
      <AnalyticsCharts />
      <RecentOrdersTable />
    </div>
  );
}
