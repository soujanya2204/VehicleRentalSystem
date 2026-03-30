import React, { useEffect, useState } from 'react';
import api from '../api';

const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', completed: '#22c55e', cancelled: '#ef4444' };

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/bookings').then(r => setBookings(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    load();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Bookings</h2>
      <div style={styles.filters}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ ...styles.filterBtn, ...(filter === s ? styles.active : {}) }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div style={styles.table}>
        <table style={styles.tbl}>
          <thead>
            <tr style={styles.thead}>
              {['Customer', 'Bike', 'Pickup', 'Duration', 'Total', 'Status', 'Actions'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id} style={styles.tr}>
                <td style={styles.td}><div>{b.user?.name}</div><div style={styles.email}>{b.user?.email}</div></td>
                <td style={styles.td}>{b.bike?.name}</td>
                <td style={styles.td}>{b.pickupLocation}</td>
                <td style={styles.td}>
                  <div style={styles.small}>{new Date(b.startTime).toLocaleDateString()}</div>
                  <div style={styles.small}>{new Date(b.endTime).toLocaleDateString()}</div>
                </td>
                <td style={styles.td}>₹{b.totalPrice?.toFixed(2)}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: statusColors[b.status] }}>{b.status}</span>
                </td>
                <td style={styles.td}>
                  {b.status === 'pending' && (
                    <button style={styles.confirmBtn} onClick={() => updateStatus(b._id, 'confirmed')}>Confirm</button>
                  )}
                  {b.status === 'confirmed' && (
                    <button style={styles.completeBtn} onClick={() => updateStatus(b._id, 'completed')}>Complete</button>
                  )}
                  {['pending', 'confirmed'].includes(b.status) && (
                    <button style={styles.cancelBtn} onClick={() => updateStatus(b._id, 'cancelled')}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px' },
  heading: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '20px' },
  filters: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  filterBtn: { padding: '7px 16px', borderRadius: '20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' },
  active: { background: '#e94560', color: '#fff', border: '1px solid #e94560' },
  table: { background: '#fff', borderRadius: '10px', overflow: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  tbl: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
  thead: { background: '#f7fafc' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem', color: '#718096', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f0f4f8' },
  td: { padding: '12px 16px', fontSize: '0.88rem', color: '#2d3748' },
  email: { color: '#718096', fontSize: '0.78rem' },
  small: { fontSize: '0.78rem', color: '#718096' },
  badge: { color: '#fff', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' },
  confirmBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '0.78rem' },
  completeBtn: { background: '#22c55e', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '0.78rem' },
  cancelBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }
};
