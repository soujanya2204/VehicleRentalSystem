import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { MapPin, Navigation, Locate, SlidersHorizontal, X, Car, Clock, Route } from 'lucide-react'

// Fix default leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const makeVehicleIcon = (status) => {
  const colors = { Available: '#10b981', Rented: '#3b82f6', Maintenance: '#f59e0b' }
  const c = colors[status] || '#64748b'
  return L.divIcon({
    className: '',
    html: `<div style="background:${c};color:white;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white">
      <span style="display:flex;align-items:center;gap:4px">&#9679; ${status}</span>
    </div>`,
    iconAnchor: [30, 12],
  })
}

const allVehicles = [
  { id: 1, name: 'Toyota Camry', type: 'Sedan', status: 'Available', priceDay: 80, location: [27.7172, 85.3240] },
  { id: 2, name: 'Ford Explorer', type: 'SUV', status: 'Rented', priceDay: 110, location: [27.7050, 85.3180] },
  { id: 3, name: 'Honda Civic', type: 'Sedan', status: 'Available', priceDay: 70, location: [27.7280, 85.3350] },
  { id: 4, name: 'BMW X5', type: 'SUV', status: 'Maintenance', priceDay: 150, location: [27.6950, 85.3080] },
  { id: 5, name: 'Tesla Model 3', type: 'Sedan', status: 'Available', priceDay: 120, location: [27.7320, 85.3120] },
  { id: 6, name: 'Hyundai Tucson', type: 'SUV', status: 'Available', priceDay: 90, location: [27.7100, 85.3400] },
  { id: 7, name: 'Kia Sportage', type: 'SUV', status: 'Rented', priceDay: 85, location: [27.7200, 85.3050] },
  { id: 8, name: 'Maruti Swift', type: 'Hatchback', status: 'Available', priceDay: 45, location: [27.7380, 85.3280] },
]

function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function NearbyMap() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const clusterGroupRef = useRef(null)
  const userMarkerRef = useRef(null)
  const routeLayerRef = useRef(null)
  const vehicleMarkersRef = useRef({})

  const [userLocation, setUserLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')
  const [maxDist, setMaxDist] = useState(10)
  const [selected, setSelected] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')

  // Init map once
  useEffect(() => {
    if (mapInstanceRef.current) return
    const map = L.map(mapRef.current, { center: [27.7172, 85.3240], zoom: 13, zoomControl: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)
    mapInstanceRef.current = map

    // Init cluster group
    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      iconCreateFunction: (c) => L.divIcon({
        html: `<div style="background:#2563eb;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${c.getChildCount()}</div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }),
    })
    clusterGroupRef.current = cluster
    map.addLayer(cluster)

    return () => { map.remove(); mapInstanceRef.current = null }
  }, [])

  // Detect user location
  const detectLocation = () => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported by your browser.'); return }
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(loc)
        setLocating(false)
        const map = mapInstanceRef.current
        if (!map) return
        if (userMarkerRef.current) userMarkerRef.current.remove()
        userMarkerRef.current = L.marker(loc, { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Your Location</b>')
        map.flyTo(loc, 14, { duration: 1.2 })
      },
      (err) => {
        setLocating(false)
        setLocError('Could not get location. Please allow location access.')
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  // Filter vehicles by distance + status
  const filteredVehicles = allVehicles.filter(v => {
    const distOk = !userLocation || haversineKm(userLocation, v.location) <= maxDist
    const statusOk = statusFilter === 'All' || v.status === statusFilter
    return distOk && statusOk
  }).map(v => ({
    ...v,
    distance: userLocation ? haversineKm(userLocation, v.location) : null,
  })).sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999))

  // Rebuild cluster markers when filter changes
  useEffect(() => {
    const cluster = clusterGroupRef.current
    const map = mapInstanceRef.current
    if (!cluster || !map) return

    cluster.clearLayers()
    vehicleMarkersRef.current = {}

    filteredVehicles.forEach(v => {
      const marker = L.marker(v.location, { icon: makeVehicleIcon(v.status) })
      marker.bindPopup(`
        <div style="min-width:160px">
          <b style="font-size:13px">${v.name}</b><br/>
          <span style="color:#64748b;font-size:11px">${v.type} · ${v.status}</span><br/>
          <span style="font-size:12px;font-weight:600;color:#2563eb">$${v.priceDay}/day</span>
          ${v.distance != null ? `<br/><span style="font-size:11px;color:#64748b">${v.distance.toFixed(1)} km away</span>` : ''}
        </div>
      `)
      marker.on('click', () => setSelected(v))
      cluster.addLayer(marker)
      vehicleMarkersRef.current[v.id] = marker
    })
  }, [filteredVehicles.length, userLocation, maxDist, statusFilter])

  // Get directions via OSRM (free, no API key)
  const getDirections = async (vehicle) => {
    if (!userLocation) { setLocError('Detect your location first to get directions.'); return }
    setLoadingRoute(true)
    setRouteInfo(null)
    if (routeLayerRef.current) { mapInstanceRef.current.removeLayer(routeLayerRef.current); routeLayerRef.current = null }

    const [uLat, uLon] = userLocation
    const [vLat, vLon] = vehicle.location
    const url = `https://router.project-osrm.org/route/v1/driving/${uLon},${uLat};${vLon},${vLat}?overview=full&geometries=geojson`

    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data.code !== 'Ok') throw new Error('No route found')
      const route = data.routes[0]
      const coords = route.geometry.coordinates.map(([lon, lat]) => [lat, lon])
      const distKm = (route.distance / 1000).toFixed(1)
      const mins = Math.round(route.duration / 60)

      const polyline = L.polyline(coords, { color: '#2563eb', weight: 4, opacity: 0.85, dashArray: null })
      polyline.addTo(mapInstanceRef.current)
      routeLayerRef.current = polyline
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] })
      setRouteInfo({ distKm, mins, vehicle: vehicle.name })
    } catch {
      setLocError('Could not fetch route. Try again.')
    }
    setLoadingRoute(false)
  }

  const clearRoute = () => {
    if (routeLayerRef.current) { mapInstanceRef.current.removeLayer(routeLayerRef.current); routeLayerRef.current = null }
    setRouteInfo(null)
  }

  const focusVehicle = (v) => {
    setSelected(v)
    mapInstanceRef.current?.flyTo(v.location, 16, { duration: 0.8 })
    vehicleMarkersRef.current[v.id]?.openPopup()
  }

  return (
    <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Fleet Map</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">{filteredVehicles.length} vehicles shown</p>
        </div>

        <div className="flex-1" />

        {/* Status filter */}
        <div className="flex gap-1.5">
          {['All', 'Available', 'Rented', 'Maintenance'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Distance filter */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5">
          <SlidersHorizontal size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Within</span>
          <input type="range" min={1} max={50} value={maxDist} onChange={e => setMaxDist(Number(e.target.value))}
            className="w-24 accent-blue-600" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap w-12">{maxDist} km</span>
        </div>

        {/* Locate button */}
        <button onClick={detectLocation} disabled={locating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          <Locate size={14} className={locating ? 'animate-pulse' : ''} />
          {locating ? 'Locating...' : 'Detect My Location'}
        </button>
      </div>

      {/* Error banner */}
      {locError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-5 py-2 flex items-center justify-between">
          <span className="text-xs text-red-600 dark:text-red-400">{locError}</span>
          <button onClick={() => setLocError('')}><X size={14} className="text-red-400" /></button>
        </div>
      )}

      {/* Route info banner */}
      {routeInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-blue-700 dark:text-blue-300">
            <span className="flex items-center gap-1.5 font-semibold"><Route size={13} /> Route to {routeInfo.vehicle}</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> {routeInfo.distKm} km</span>
            <span className="flex items-center gap-1"><Clock size={12} /> ~{routeInfo.mins} min</span>
          </div>
          <button onClick={clearRoute} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <X size={13} /> Clear Route
          </button>
        </div>
      )}

      {/* Map + sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div ref={mapRef} className="flex-1 z-0" />

        {/* Vehicle list sidebar */}
        <div className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {userLocation ? 'Sorted by Distance' : 'All Vehicles'}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredVehicles.length === 0 && (
              <p className="text-center text-slate-400 dark:text-slate-500 text-xs py-10">No vehicles within {maxDist} km</p>
            )}
            {filteredVehicles.map(v => (
              <button key={v.id} onClick={() => focusVehicle(v)}
                className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selected?.id === v.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Car size={14} className="text-slate-500 dark:text-slate-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{v.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{v.type}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium block mb-1 ${
                      v.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      v.status === 'Rented' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>{v.status}</span>
                    {v.distance != null && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">{v.distance.toFixed(1)} km</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">${v.priceDay}/day</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); getDirections(v) }}
                    disabled={loadingRoute || !userLocation}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-40 font-medium transition-colors">
                    <Navigation size={11} />
                    {loadingRoute && selected?.id === v.id ? 'Loading...' : 'Directions'}
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Legend</p>
            {[['Available', '#10b981'], ['Rented', '#3b82f6'], ['Maintenance', '#f59e0b'], ['Your Location', '#2563eb']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
