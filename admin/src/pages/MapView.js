import React, { useEffect, useRef, useState } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';
import api from '../api';

const OLA_KEY = 'qNjpc4BtjxTy33eJQcyw1RZxsZKJRkHV9T5KW9a4';

const STORES = [
  { name: 'YOR Khandagiri - Bike Rental', lat: 20.258547951499857, lng: 85.78651866934183 },
  { name: 'BIKERLANE Premium Bike Rental', lat: 20.268322610113724, lng: 85.75801293721932 },
  { name: "Let's driEV - Electric Bike Rental", lat: 20.230163102473742, lng: 85.77246773141816 },
  { name: 'Velote - Scooter & Bike Rentals', lat: 20.26168866124048, lng: 85.79766096477218 },
  { name: 'Yana Zap Point OD 02', lat: 20.235517603640027, lng: 85.76264204386815 },
  { name: 'Royal Bike Rental', lat: 20.234593888479854, lng: 85.72760917832863 },
  { name: 'Rajlaxmi Rent & Ride (RRR) 🏍️', lat: 20.22429507403344, lng: 85.73388368624514 },
];

function createStoreMarkerEl() {
  const el = document.createElement('div');
  el.innerHTML = '🚲';
  el.style.cssText = `
    font-size: 22px;
    background: #1a1a2e;
    border: 2px solid #e94560;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  `;
  return el;
}

export default function MapView() {
  const [bikes, setBikes] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    api.get('/bikes').then(r => setBikes(r.data));
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const olaMaps = new OlaMaps({ apiKey: OLA_KEY });

    olaMaps.init({
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
      container: mapRef.current,
      center: [85.8246, 20.2960],
      zoom: 12,
    }).then(map => {
      mapInstance.current = map;

      // Store markers
      STORES.forEach(store => {
        const popup = olaMaps.addPopup({ offset: 25 }).setHTML(
          `<div style="padding:10px;font-family:sans-serif;min-width:160px">
            <div style="font-size:1.2rem;margin-bottom:4px">🚲</div>
            <b style="color:#1a1a2e">${store.name}</b><br/>
            <span style="color:#e94560;font-size:0.85rem">📍 Our Rental Outlet</span>
          </div>`
        );
        olaMaps
          .addMarker({ element: createStoreMarkerEl() })
          .setLngLat([store.lng, store.lat])
          .setPopup(popup)
          .addTo(map);
      });

      // Bike markers
      bikes.forEach(bike => {
        if (!bike.location) return;
        const popup = olaMaps.addPopup({ offset: 25 }).setHTML(
          `<div style="padding:8px;font-family:sans-serif">
            <b>${bike.name}</b><br/>
            ₹${bike.pricePerHour}/hr<br/>
            📍 ${bike.location.address}<br/>
            ${bike.available ? '✅ Available' : '❌ Booked'}
          </div>`
        );
        olaMaps
          .addMarker({ color: bike.available ? '#22c55e' : '#ef4444' })
          .setLngLat([bike.location.lng, bike.location.lat])
          .setPopup(popup)
          .addTo(map);
      });
    }).catch(err => console.error('Map init error:', err));

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [bikes]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Bike Locations Map</h2>
      <div ref={mapRef} style={styles.map} />
      <div style={styles.legend}>
        <span style={{ ...styles.iconDot, background: '#1a1a2e', border: '2px solid #e94560' }}>🚲</span> Our Outlets ({STORES.length})
        <span style={{ ...styles.dot, background: '#22c55e', marginLeft: '16px' }} /> Available ({bikes.filter(b => b.available).length})
        <span style={{ ...styles.dot, background: '#ef4444', marginLeft: '16px' }} /> Booked ({bikes.filter(b => !b.available).length})
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '32px' },
  heading: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '20px' },
  map: { width: '100%', height: '500px', borderRadius: '10px' },
  legend: { display: 'flex', alignItems: 'center', marginTop: '12px', color: '#4a5568', fontSize: '0.9rem', gap: '6px' },
  dot: { display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%' },
  iconDot: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', fontSize: '13px' },
};
