import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function BookBike() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [form, setForm] = useState({ startTime: '', endTime: '', pickupLocation: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get(`/bikes/${id}`).then(r => setBike(r.data));
  }, [id]);

  const hours = form.startTime && form.endTime
    ? Math.max(0, (new Date(form.endTime) - new Date(form.startTime)) / 3600000)
    : 0;

  // Check if start time is at least 1 month from now
  const isEarlyBooking = form.startTime
    ? (new Date(form.startTime) - new Date()) >= 30 * 24 * 60 * 60 * 1000
    : false;

  const basePrice = hours * (bike?.pricePerHour || 0);
  const discount = isEarlyBooking ? basePrice * 0.10 : 0;
  const totalPrice = basePrice - discount;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/bookings', { bikeId: id, ...form });
      setSuccess(`Booking confirmed${isEarlyBooking ? ' with 10% early bird discount' : ''}! Redirecting...`);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!bike) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Book: {bike.name}</h2>
        <div style={styles.bikeInfo}>
          <span>Type: {bike.type}</span>
          <span style={styles.price}>₹{bike.pricePerHour}/hr</span>
        </div>

        {isEarlyBooking && (
          <div style={styles.discountBanner}>
            🎉 <strong>Early Bird Discount!</strong> You're booking 1+ month in advance — enjoy <strong>10% off</strong>!
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Pickup Location</label>
          <input style={styles.input} placeholder="Enter pickup address" value={form.pickupLocation}
            onChange={e => setForm({ ...form, pickupLocation: e.target.value })} required />

          <label style={styles.label}>Start Time</label>
          <input style={styles.input} type="datetime-local" value={form.startTime}
            onChange={e => setForm({ ...form, startTime: e.target.value })} required />

          <label style={styles.label}>End Time</label>
          <input style={styles.input} type="datetime-local" value={form.endTime}
            onChange={e => setForm({ ...form, endTime: e.target.value })} required />

          {hours > 0 && (
            <div style={styles.summary}>
              <div style={styles.summaryRow}>
                <span>{hours.toFixed(1)} hrs × ₹{bike.pricePerHour}</span>
                <span>₹{basePrice.toFixed(2)}</span>
              </div>
              {isEarlyBooking && (
                <div style={{ ...styles.summaryRow, color: '#22c55e' }}>
                  <span>🎉 Early Bird Discount (10%)</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ ...styles.summaryRow, fontWeight: '700', borderTop: '1px solid #ddd', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total</span>
                <span style={{ color: '#e94560' }}>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button style={styles.btn} type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8', padding: '20px' },
  card: { background: '#fff', padding: '36px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '420px', maxWidth: '100%' },
  title: { color: '#1a1a2e', marginBottom: '12px' },
  bikeInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#718096' },
  price: { color: '#e94560', fontWeight: '700' },
  discountBanner: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#166534', fontSize: '0.9rem' },
  label: { display: 'block', fontSize: '0.85rem', color: '#4a5568', marginBottom: '4px', marginTop: '12px' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '0.95rem' },
  summary: { background: '#f0f4f8', padding: '12px', borderRadius: '6px', margin: '16px 0', fontSize: '0.9rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  btn: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', marginTop: '8px' },
  error: { color: '#e94560', marginBottom: '12px' },
  success: { color: '#22c55e', marginBottom: '12px' },
  loading: { textAlign: 'center', padding: '60px', fontSize: '1.2rem' }
};
