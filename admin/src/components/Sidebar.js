import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/bikes', label: '🚲 Bikes' },
    { to: '/bookings', label: '📋 Bookings' },
    { to: '/map', label: '🗺️ Map View' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>⚙️ Admin Panel</div>
      <div style={styles.adminName}>{admin?.name}</div>
      <nav style={styles.nav}>
        {links.map(l => (
          <Link key={l.to} to={l.to}
            style={{ ...styles.link, ...(pathname === l.to ? styles.activeLink : {}) }}>
            {l.label}
          </Link>
        ))}
      </nav>
      <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout</button>
    </div>
  );
}

const styles = {
  sidebar: { width: '220px', minHeight: '100vh', background: '#1a1a2e', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0 },
  brand: { color: '#e94560', fontSize: '1.2rem', fontWeight: 'bold', padding: '0 20px 8px' },
  adminName: { color: '#a0aec0', fontSize: '0.8rem', padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  nav: { display: 'flex', flexDirection: 'column', marginTop: '16px', flex: 1 },
  link: { color: '#a0aec0', textDecoration: 'none', padding: '12px 20px', fontSize: '0.95rem', transition: 'all 0.2s' },
  activeLink: { color: '#fff', background: 'rgba(233,69,96,0.2)', borderLeft: '3px solid #e94560' },
  logoutBtn: { margin: '20px', background: '#e94560', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }
};
