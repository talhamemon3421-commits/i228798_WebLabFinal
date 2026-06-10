import { useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { generateKPIs } from '../data/mockAnalytics';

const kpiConfig = [
  { key: 'uniqueVisitors', label: 'Unique Visitors', icon: '👥', format: (v) => v.toLocaleString() },
  { key: 'totalPageviews', label: 'Total Pageviews', icon: '📄', format: (v) => v.toLocaleString() },
  { key: 'bounceRate', label: 'Bounce Rate', icon: '↩️', format: (v) => `${v}%` },
  { key: 'visitDuration', label: 'Visit Duration', icon: '⏱️', format: (v) => `${v} min` },
];

export default function KPICards() {
  const { timeRange } = useDashboard();
  const kpis = useMemo(() => generateKPIs(timeRange), [timeRange]);

  return (
    <div className="kpi-grid">
      {kpiConfig.map(({ key, label, icon, format }) => (
        <div key={key} className="kpi-card">
          <div className="kpi-icon">{icon}</div>
          <div className="kpi-info">
            <span className="kpi-label">{label}</span>
            <span className="kpi-value">{format(kpis[key])}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
