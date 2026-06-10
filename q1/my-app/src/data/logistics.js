export const shipments = [
  { id: 'SHP-1001', orderId: 'ORD-501', carrier: 'FedEx', status: 'delivered', destination: 'New York, NY', eta: '2025-06-01', trackingNo: 'FX1234567890' },
  { id: 'SHP-1002', orderId: 'ORD-502', carrier: 'UPS', status: 'in_transit', destination: 'Los Angeles, CA', eta: '2025-06-12', trackingNo: 'UP9876543210' },
  { id: 'SHP-1003', orderId: 'ORD-503', carrier: 'DHL', status: 'delayed', destination: 'Chicago, IL', eta: '2025-06-15', trackingNo: 'DH5551234567' },
  { id: 'SHP-1004', orderId: 'ORD-504', carrier: 'FedEx', status: 'in_transit', destination: 'Houston, TX', eta: '2025-06-11', trackingNo: 'FX0987654321' },
  { id: 'SHP-1005', orderId: 'ORD-505', carrier: 'USPS', status: 'delivered', destination: 'Phoenix, AZ', eta: '2025-06-03', trackingNo: 'US1122334455' },
  { id: 'SHP-1006', orderId: 'ORD-506', carrier: 'DHL', status: 'delayed', destination: 'Seattle, WA', eta: '2025-06-18', trackingNo: 'DH6677889900' },
  { id: 'SHP-1007', orderId: 'ORD-507', carrier: 'UPS', status: 'delivered', destination: 'Miami, FL', eta: '2025-06-02', trackingNo: 'UP4455667788' },
  { id: 'SHP-1008', orderId: 'ORD-508', carrier: 'FedEx', status: 'delayed', destination: 'Denver, CO', eta: '2025-06-20', trackingNo: 'FX3344556677' },
  { id: 'SHP-1009', orderId: 'ORD-509', carrier: 'USPS', status: 'in_transit', destination: 'Boston, MA', eta: '2025-06-13', trackingNo: 'US2233445566' },
  { id: 'SHP-1010', orderId: 'ORD-510', carrier: 'DHL', status: 'in_transit', destination: 'Atlanta, GA', eta: '2025-06-14', trackingNo: 'DH8899001122' },
];

export function getShipmentStats(data) {
  return {
    delivered: data.filter((s) => s.status === 'delivered').length,
    inTransit: data.filter((s) => s.status === 'in_transit').length,
    delayed: data.filter((s) => s.status === 'delayed').length,
    total: data.length,
  };
}
