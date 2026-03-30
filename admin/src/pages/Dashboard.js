import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ bikes: 0, bookings: 0, available: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([api.get('/bikes'), api.get('/bookings')]).then(([bikesRes, bookingsRes]) => {
      const bikes = bikesRes.data;
      const bookings = bookingsRes.data;
      setStats({
        bikes: bikes.length,
        available: bikes.filter(b => b.available).length,
        bookings: bookings.length,
        revenue: bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.totalPrice, 0)
      });
    });
  }, []);

  const cards = [
    { label: 'Total Bikes', value: stats.bikes, icon: '🚲', color: '#3b82f6' },
    { label: 'Available', value: stats.available, icon: '✅', color: '#22c55e' },
    { label: 'Total Bookings', value: stats.bookings, icon: '📋', color: '#f59e0b' },
    { label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, icon: '💰', color: '#e94560' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard</h2>
      <div style={styles.grid}>
        {cards.map(c => (
          <div key={c.label} style={{ ...styles.card, borderTop: `4px solid ${c.color}` }}>
            <span style={styles.icon}>{c.icon}</span>
            <div>
              <p style={styles.label}>{c.label}</p>
              <p style={{ ...styles.value, color: c.color }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px' },
  heading: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '28px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '16px' },
  icon: { fontSize: '2.5rem' },
  label: { color: '#718096', fontSize: '0.85rem', margin: '0 0 4px' },
  value: { fontSize: '1.8rem', fontWeight: '700', margin: 0 }
};
