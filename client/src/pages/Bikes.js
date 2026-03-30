import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bikes').then(r => setBikes(r.data));
  }, []);

  const types = ['all', ...new Set(bikes.map(b => b.type))];
  const filtered = filter === 'all' ? bikes : bikes.filter(b => b.type === filter);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Bikes</h2>
      <div style={styles.filters}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ ...styles.filterBtn, ...(filter === t ? styles.activeFilter : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {filtered.map(bike => (
          <div key={bike._id} style={styles.card}>
            <div style={styles.imgBox}>
              {bike.image ? <img src={bike.image} alt={bike.name} style={styles.img} /> : <div style={styles.placeholder}>🚲</div>}
              <span style={{ ...styles.badge, background: bike.available ? '#22c55e' : '#ef4444' }}>
                {bike.available ? 'Available' : 'Booked'}
              </span>
            </div>
            <div style={styles.info}>
              <h3 style={styles.bikeName}>{bike.name}</h3>
              <p style={styles.bikeType}>{bike.type}</p>
              <p style={styles.desc}>{bike.description}</p>
              <div style={styles.footer}>
                <span style={styles.price}>₹{bike.pricePerHour}/hr</span>
                <button
                  style={{ ...styles.bookBtn, opacity: bike.available ? 1 : 0.5 }}
                  disabled={!bike.available}
                  onClick={() => {
                    if (!user) return navigate('/login');
                    navigate(`/book/${bike._id}`);
                  }}>
                  {bike.available ? 'Book Now' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
  heading: { fontSize: '2rem', color: '#1a1a2e', marginBottom: '20px' },
  filters: { display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' },
  filterBtn: { padding: '8px 18px', borderRadius: '20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  activeFilter: { background: '#e94560', color: '#fff', border: '1px solid #e94560' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  imgBox: { position: 'relative', height: '180px', background: '#f0f4f8' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem' },
  badge: { position: 'absolute', top: '10px', right: '10px', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' },
  info: { padding: '16px' },
  bikeName: { margin: '0 0 4px', color: '#1a1a2e', fontSize: '1.1rem' },
  bikeType: { color: '#718096', fontSize: '0.85rem', margin: '0 0 8px', textTransform: 'capitalize' },
  desc: { color: '#4a5568', fontSize: '0.85rem', margin: '0 0 16px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#e94560', fontWeight: '700', fontSize: '1.1rem' },
  bookBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};
