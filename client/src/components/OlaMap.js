import React, { useEffect, useRef, useState } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';

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
  el.innerHTML = '🚗';
  el.style.cssText = `font-size:22px;background:#1a1a2e;border:2px solid #e94560;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4);`;
  return el;
}

function createUserMarkerEl() {
  const el = document.createElement('div');
  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#1a1a2e">
      <circle cx="12" cy="5" r="3"/>
      <path d="M12 10c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z"/>
      <rect x="9" y="15" width="6" height="5" rx="1"/>
    </svg>
  `;
  el.style.cssText = `
    background: #fff;
    border: 2px solid #3b82f6;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
  return el;
}

export default function OlaMap({ bikes = [], onBikeSelect, userLocation = null }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const olaMapsRef = useRef(null);
  const userLocationRef = useRef(userLocation);
  const [locStatus, setLocStatus] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const drawRoute = async (userLng, userLat, store) => {
    const map = mapInstance.current;
    if (!map) return;
    setRouteLoading(true);
    setRouteInfo(null);

    try {
      const url = `https://api.olamaps.io/routing/v1/directions?origin=${userLat},${userLng}&destination=${store.lat},${store.lng}&api_key=${OLA_KEY}`;
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();

      const route = data?.routes?.[0];
      if (!route) { setRouteInfo({ error: 'No route found' }); setRouteLoading(false); return; }

      const polyline = route.overview_polyline;
      const coords = typeof polyline === 'string'
        ? decodePolyline(polyline)
        : polyline?.points
          ? decodePolyline(polyline.points)
          : route.legs?.[0]?.steps?.map(s => [s.start_location.lng, s.start_location.lat]) || [];

      // Remove old route layer/source if exists
      if (map.getLayer('route-line')) map.removeLayer('route-line');
      if (map.getSource('route')) map.removeSource('route');

      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#e94560', 'line-width': 4, 'line-opacity': 0.85 }
      });

      // Fit map to show full route
      const allCoords = [[userLng, userLat], [store.lng, store.lat], ...coords];
      const lngs = allCoords.map(c => c[0]);
      const lats = allCoords.map(c => c[1]);
      map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 60 });

      const leg = route.legs?.[0];
      setRouteInfo({
        store: store.name,
        distance: leg?.readable_distance ? leg.readable_distance + ' km' : (leg?.distance ? (leg.distance / 1000).toFixed(1) + ' km' : '—'),
        duration: leg?.readable_duration || (leg?.duration ? Math.round(leg.duration / 60) + ' mins' : '—'),
      });
    } catch (err) {
      setRouteInfo({ error: 'Failed to fetch route' });
    }
    setRouteLoading(false);
  };

  const clearRoute = () => {
    const map = mapInstance.current;
    if (!map) return;
    if (map.getLayer('route-line')) map.removeLayer('route-line');
    if (map.getSource('route')) map.removeSource('route');
    setRouteInfo(null);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const olaMaps = new OlaMaps({ apiKey: OLA_KEY });
    olaMapsRef.current = olaMaps;

    const initialCenter = userLocation ? [userLocation.lng, userLocation.lat] : [85.8246, 20.2960];

    olaMaps.init({
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
      container: mapRef.current,
      center: initialCenter,
      zoom: userLocation ? 14 : 12,
    }).then(map => {
      mapInstance.current = map;

      // Auto-place user marker if location was provided
      if (userLocation) {
        userLocationRef.current = userLocation;
        olaMaps.addMarker({ element: createUserMarkerEl() })
          .setLngLat([userLocation.lng, userLocation.lat])
          .setPopup(olaMaps.addPopup({ offset: 10 }).setHTML('<b>📍 You are here</b>'))
          .addTo(map);
      }

      // Store markers with "Get Route" button in popup
      STORES.forEach(store => {
        const popupEl = document.createElement('div');
        popupEl.style.cssText = 'padding:10px;font-family:sans-serif;min-width:180px';
        popupEl.innerHTML = `
          <div style="font-size:1.2rem;margin-bottom:4px">🚲</div>
          <b style="color:#1a1a2e">${store.name}</b><br/>
          <span style="color:#e94560;font-size:0.82rem">📍 Our Rental Outlet</span><br/>
          <button id="route-btn-${store.lng}" style="margin-top:10px;background:#e94560;color:#fff;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:0.85rem;width:100%">
            🗺️ Get Route
          </button>
        `;

        const popup = olaMaps.addPopup({ offset: 25 }).setDOMContent(popupEl);

        popup.on('open', () => {
          setTimeout(() => {
            const btn = document.getElementById(`route-btn-${store.lng}`);
            if (btn) {
              btn.onclick = () => {
                if (!userLocationRef.current) {
                  alert('Please click "Find My Location" first to get directions.');
                  return;
                }
                popup.remove();
                drawRoute(userLocationRef.current.lng, userLocationRef.current.lat, store);
              };
            }
          }, 50);
        });

        olaMaps.addMarker({ element: createStoreMarkerEl() })
          .setLngLat([store.lng, store.lat])
          .setPopup(popup)
          .addTo(map);
      });

      // Bike markers
      bikes.forEach(bike => {
        if (!bike.location) return;
        const popup = olaMaps.addPopup({ offset: 25 }).setHTML(
          `<div style="padding:8px;font-family:sans-serif">
            <b>${bike.name}</b><br/>₹${bike.pricePerHour}/hr<br/>
            📍 ${bike.location.address}<br/>
            ${bike.available ? '✅ Available' : '❌ Booked'}
          </div>`
        );
        const marker = olaMaps
          .addMarker({ color: bike.available ? '#22c55e' : '#ef4444' })
          .setLngLat([bike.location.lng, bike.location.lat])
          .setPopup(popup)
          .addTo(map);
        if (onBikeSelect) {
          marker.getElement().style.cursor = 'pointer';
          marker.getElement().addEventListener('click', () => onBikeSelect(bike));
        }
      });
    }).catch(err => console.error('Map init error:', err));

    return () => { mapInstance.current?.remove(); mapInstance.current = null; };
  }, [bikes, onBikeSelect, userLocation]);

  const locateMe = () => {
    if (!navigator.geolocation) return setLocStatus('Geolocation not supported');
    setLocStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        userLocationRef.current = { lat, lng };
        const map = mapInstance.current;
        if (!map) return;
        map.flyTo({ center: [lng, lat], zoom: 14 });
        const olaMaps = olaMapsRef.current;
        olaMaps.addMarker({ element: createUserMarkerEl() })
          .setLngLat([lng, lat])
          .setPopup(olaMaps.addPopup({ offset: 10 }).setHTML('<b>📍 You are here</b>'))
          .addTo(map);
        setLocStatus('');
      },
      () => setLocStatus('Location access denied')
    );
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '480px', borderRadius: '10px' }} />
        <button onClick={locateMe} style={locBtn}>
          📍 {locStatus || 'Find My Location'}
        </button>
        {routeLoading && (
          <div style={routeLoadingBox}>🗺️ Fetching route...</div>
        )}
        {routeInfo && !routeInfo.error && (
          <div style={routeInfoBox}>
            <div style={{ fontWeight: '700', marginBottom: '4px' }}>🗺️ Route to {routeInfo.store}</div>
            <div>📏 {routeInfo.distance} &nbsp;|&nbsp; ⏱️ {routeInfo.duration}</div>
            <button onClick={clearRoute} style={clearBtn}>✕ Clear Route</button>
          </div>
        )}
        {routeInfo?.error && (
          <div style={{ ...routeInfoBox, background: '#fee2e2', borderColor: '#fca5a5' }}>
            ⚠️ {routeInfo.error}
            <button onClick={() => setRouteInfo(null)} style={clearBtn}>✕</button>
          </div>
        )}
      </div>
      <div style={legendStyle}>
        <span style={{ ...dot, background: '#1a1a2e', border: '2px solid #e94560' }}>🚗</span> Our Outlets
        <span style={{ ...dot, background: '#22c55e', marginLeft: '16px' }} /> Available
        <span style={{ ...dot, background: '#ef4444', marginLeft: '16px' }} /> Booked
        <span style={{ marginLeft: '16px' }}>📍 You</span>
        <span style={{ marginLeft: '16px', color: '#e94560' }}>━ Route</span>
      </div>
    </div>
  );
}

// Decode Google-encoded polyline
function decodePolyline(encoded) {
  const coords = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : result >> 1;
    coords.push([lng / 1e5, lat / 1e5]);
  }
  return coords;
}

const locBtn = { position: 'absolute', bottom: '16px', left: '16px', zIndex: 10, background: '#fff', border: '1px solid #ddd', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '0.9rem' };
const routeInfoBox = { position: 'absolute', top: '16px', left: '16px', zIndex: 10, background: '#fff', border: '1px solid #e94560', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', fontSize: '0.88rem', maxWidth: '260px' };
const routeLoadingBox = { position: 'absolute', top: '16px', left: '16px', zIndex: 10, background: '#fff', border: '1px solid #ddd', padding: '10px 16px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '0.88rem' };
const clearBtn = { marginTop: '8px', background: 'transparent', border: '1px solid #ccc', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', display: 'block' };
const legendStyle = { display: 'flex', alignItems: 'center', marginTop: '12px', color: '#4a5568', fontSize: '0.9rem', gap: '6px', flexWrap: 'wrap' };
const dot = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px' };
