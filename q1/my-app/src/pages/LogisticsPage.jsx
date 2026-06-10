import { useMemo } from 'react';
import { shipments, getShipmentStats } from '../data/logistics';
import { LOGISTIC_FILTERS } from '../constants/dashboard';
import { useDashboard } from '../hooks/useDashboard';

const statusLabels = {
  delivered: 'Delivered',
  in_transit: 'In Transit',
  delayed: 'Delayed',
};

const statusClasses = {
  delivered: 'status-delivered',
  in_transit: 'status-transit',
  delayed: 'status-delayed',
};

export default function LogisticsPage() {
  const { logisticFilter, setLogisticFilter } = useDashboard();
  const stats = useMemo(() => getShipmentStats(shipments), []);

  const filteredShipments = useMemo(() => {
    if (logisticFilter === LOGISTIC_FILTERS.ALL) return shipments;
    return shipments.filter((s) => s.status === logisticFilter);
  }, [logisticFilter]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Logistics Tracking</h2>
          <p className="page-subtitle">Monitor shipment status and carrier performance</p>
        </div>
      </header>

      <div className="logistics-stats">
        <div className="stat-box">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Shipments</span>
        </div>
        <div className="stat-box stat-delivered">
          <span className="stat-value">{stats.delivered}</span>
          <span className="stat-label">Delivered</span>
        </div>
        <div className="stat-box stat-transit">
          <span className="stat-value">{stats.inTransit}</span>
          <span className="stat-label">In Transit</span>
        </div>
        <button
          type="button"
          className={`stat-box stat-delayed clickable ${logisticFilter === LOGISTIC_FILTERS.DELAYED ? 'active-filter' : ''}`}
          onClick={() =>
            setLogisticFilter(
              logisticFilter === LOGISTIC_FILTERS.DELAYED
                ? LOGISTIC_FILTERS.ALL
                : LOGISTIC_FILTERS.DELAYED
            )
          }
        >
          <span className="stat-value">{stats.delayed}</span>
          <span className="stat-label">Delayed Shipments</span>
          {logisticFilter === LOGISTIC_FILTERS.DELAYED && (
            <span className="filter-active-tag">Filter Active</span>
          )}
        </button>
      </div>

      <div className="filter-bar">
        <span>Filter:</span>
        {Object.entries(LOGISTIC_FILTERS).map(([key, value]) => (
          <button
            key={key}
            type="button"
            className={`filter-btn ${logisticFilter === value ? 'active' : ''}`}
            onClick={() => setLogisticFilter(value)}
          >
            {key.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="table-card">
        <h3>Shipment Tracking Matrix</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Order ID</th>
                <th>Carrier</th>
                <th>Status</th>
                <th>Destination</th>
                <th>ETA</th>
                <th>Tracking No.</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>{shipment.id}</td>
                  <td>{shipment.orderId}</td>
                  <td>{shipment.carrier}</td>
                  <td>
                    <span className={`status-badge ${statusClasses[shipment.status]}`}>
                      {statusLabels[shipment.status]}
                    </span>
                  </td>
                  <td>{shipment.destination}</td>
                  <td>{shipment.eta}</td>
                  <td className="tracking-no">{shipment.trackingNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredShipments.length === 0 && (
          <p className="empty-state">No shipments match the current filter.</p>
        )}
      </div>
    </div>
  );
}
