import React, { useEffect, useState } from 'react';
import api from '../api';

const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', completed: '#22c55e', cancelled: '#ef4444' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/my').then(r => setBookings(r.data));
  }, []);

  const cancel = async id => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Bookings</h2>
      {bookings.length === 0 ? (
        <p style={styles.empty}>No bookings yet. <a href="/bikes">Browse bikes</a></p>
      ) : (
        <div style={styles.list}>
          {bookings.map(b => (
            <div key={b._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.bikeName}>{b.bike?.name}</h3>
                <span style={{ ...styles.status, background: statusColors[b.status] }}>{b.status}</span>
              </div>
              <div style={styles.details}>
                <p>📍 {b.pickupLocation}</p>
                <p>🕐 {new Date(b.startTime).toLocaleString()} → {new Date(b.endTime).toLocaleString()}</p>
                <p>💰 Total: <strong>₹{b.totalPrice.toFixed(2)}</strong></p>
              </div>
              {b.status === 'pending' && (
                <button onClick={() => cancel(b._id)} style={styles.cancelBtn}>Cancel Booking</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 20px' },
  heading: { fontSize: '2rem', color: '#1a1a2e', marginBottom: '24px' },
  empty: { color: '#718096', fontSize: '1.1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  bikeName: { margin: 0, color: '#1a1a2e' },
  status: { color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' },
  details: { color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.8' },
  cancelBtn: { marginTop: '12px', background: '#ef4444', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }
};
