import { TIME_RANGES } from '../constants/dashboard';
import { useDashboard } from '../hooks/useDashboard';

export default function TimelineFilter() {
  const { timeRange, setTimeRange } = useDashboard();

  return (
    <div className="timeline-filter">
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          className={`timeline-btn ${timeRange === range ? 'active' : ''}`}
          onClick={() => setTimeRange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
