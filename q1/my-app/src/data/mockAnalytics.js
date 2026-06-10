const RANGE_CONFIG = {
  '12 months': { points: 12, label: (i) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i] },
  '30 days': { points: 30, label: (i) => `Day ${i + 1}` },
  '7 days': { points: 7, label: (i) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] },
  '24 hours': { points: 24, label: (i) => `${i}:00` },
};

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateKPIs(timeRange) {
  const seed = timeRange.length;
  const multiplier = timeRange === '24 hours' ? 0.1 : timeRange === '7 days' ? 0.3 : timeRange === '30 days' ? 0.6 : 1;
  return {
    uniqueVisitors: Math.floor((45000 + seededRandom(seed) * 15000) * multiplier),
    totalPageviews: Math.floor((120000 + seededRandom(seed + 1) * 30000) * multiplier),
    bounceRate: (32 + seededRandom(seed + 2) * 8).toFixed(1),
    visitDuration: (3.2 + seededRandom(seed + 3) * 2).toFixed(1),
  };
}

export function generateBarChartData(timeRange) {
  const config = RANGE_CONFIG[timeRange] || RANGE_CONFIG['12 months'];
  return Array.from({ length: config.points }, (_, i) => ({
    name: config.label(i),
    revenue: Math.floor(2000 + seededRandom(i + timeRange.length) * 8000),
    orders: Math.floor(50 + seededRandom(i + 100) * 200),
  }));
}

export function generateLineChartData(timeRange) {
  const config = RANGE_CONFIG[timeRange] || RANGE_CONFIG['12 months'];
  return Array.from({ length: config.points }, (_, i) => ({
    name: config.label(i),
    users: Math.floor(100 + seededRandom(i + 200 + timeRange.length) * 500),
    sessions: Math.floor(150 + seededRandom(i + 300) * 600),
  }));
}
