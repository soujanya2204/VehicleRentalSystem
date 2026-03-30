import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🚲 BikeRental</Link>
      <div style={styles.links}>
        <Link to="/bikes" style={styles.link}>Bikes</Link>
        <Link to="/map" style={styles.link}>Map</Link>
        {user ? (
          <>
            <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
            <span style={styles.user}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px', background: '#1a1a2e', color: '#fff' },
  brand: { color: '#e94560', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '0.95rem' },
  user: { color: '#e94560', fontSize: '0.9rem' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }
};
