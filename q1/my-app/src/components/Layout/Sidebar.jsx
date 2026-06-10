import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Analytics', icon: '📊' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/products/add', label: 'Add Product', icon: '➕' },
  { to: '/ecommerce', label: 'E-Commerce', icon: '🛒' },
  { to: '/logistics', label: 'Logistics', icon: '🚚' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">⚡</span>
        <div>
          <h1>AdminPro</h1>
          <p>Enterprise Dashboard</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
