import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={styles.hero}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Ride the City Your Way</h1>
        <p style={styles.subtitle}>Affordable bike rentals at your fingertips. Explore, commute, and adventure.</p>
        <div style={styles.btnGroup}>
          <Link to="/bikes" style={styles.primaryBtn}>Browse Bikes</Link>
          <Link to="/map" style={styles.secondaryBtn}>View Map</Link>
        </div>
        <div style={styles.features}>
          {[['🚲', 'Wide Selection', 'Mountain, road, electric & more'],
            ['📍', 'Live Map', 'Find bikes near you with Ola Maps'],
            ['⚡', 'Instant Booking', 'Book in seconds, ride immediately'],
            ['💰', 'Best Prices', 'Starting at just ₹50/hr']
          ].map(([icon, title, desc]) => (
            <div key={title} style={styles.featureCard}>
              <span style={styles.icon}>{icon}</span>
              <h3 style={styles.featureTitle}>{title}</h3>
              <p style={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { textAlign: 'center', padding: '40px 20px', maxWidth: '900px' },
  title: { fontSize: '3rem', color: '#fff', marginBottom: '16px', fontWeight: '800' },
  subtitle: { fontSize: '1.2rem', color: '#a0aec0', marginBottom: '32px' },
  btnGroup: { display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '60px' },
  primaryBtn: { background: '#e94560', color: '#fff', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' },
  secondaryBtn: { background: 'transparent', color: '#fff', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem', border: '2px solid #fff' },
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' },
  featureCard: { background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', backdropFilter: 'blur(10px)' },
  icon: { fontSize: '2rem' },
  featureTitle: { color: '#fff', margin: '10px 0 6px', fontSize: '1rem' },
  featureDesc: { color: '#a0aec0', fontSize: '0.85rem', margin: 0 }
};
