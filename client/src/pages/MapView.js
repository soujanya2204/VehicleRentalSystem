import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import OlaMap from '../components/OlaMap';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1600&q=80',
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80',
  'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=1600&q=80',
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1600&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=80',
];

// Isolated slideshow — state changes here never touch the map
const Slideshow = () => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setBgIndex(i => (i + 1) % BG_IMAGES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {BG_IMAGES.map((img, i) => (
        <div key={img} style={{
          ...styles.bgSlide,
          backgroundImage: `url(${img})`,
          opacity: i === bgIndex ? 1 : 0,
        }} />
      ))}
      <div style={styles.overlay} />
      <div style={styles.dots}>
        {BG_IMAGES.map((_, i) => (
          <span key={i} onClick={() => setBgIndex(i)}
            style={{ ...styles.dot, background: i === bgIndex ? '#e94560' : 'rgba(255,255,255,0.4)' }} />
        ))}
      </div>
    </>
  );
};

// Memoized so it never re-renders due to parent state changes
const MapSection = memo(({ bikes, userLocation, onBikeSelect }) => (
  <div style={styles.mapWrapper}>
    <OlaMap bikes={bikes} userLocation={userLocation} onBikeSelect={onBikeSelect} />
  </div>
));

export default function MapView() {
  const [bikes, setBikes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bikes').then(r => setBikes(r.data)).catch(() => {});
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  return (
    <div style={styles.page}>
      <Slideshow />
      <div style={styles.content}>
        <div style={styles.headerBox}>
          <h2 style={styles.heading}>🗺️ Find Rental Stores Near You</h2>
          <p style={styles.sub}>Click on a 🚗 store marker to get directions. Green = available, Red = booked.</p>
        </div>
        <MapSection
          bikes={bikes}
          userLocation={userLocation}
          onBikeSelect={bike => bike.available && navigate(`/book/${bike._id}`)}
        />
      </div>
    </div>
  );
}

const styles = {
  page: { position: 'relative', minHeight: '100vh', overflow: 'hidden' },
  bgSlide: { position: 'fixed', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1.2s ease-in-out', zIndex: 0 },
  overlay: { position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(10,10,30,0.72) 0%, rgba(10,10,30,0.55) 50%, rgba(10,10,30,0.80) 100%)' },
  content: { position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', padding: '36px 20px' },
  headerBox: { marginBottom: '20px' },
  heading: { fontSize: '2.2rem', color: '#fff', fontWeight: '800', marginBottom: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  sub: { color: 'rgba(255,255,255,0.75)', fontSize: '1rem' },
  mapWrapper: { borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', border: '2px solid rgba(233,69,96,0.4)' },
  dots: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 },
  dot: { width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.3s' },
};
