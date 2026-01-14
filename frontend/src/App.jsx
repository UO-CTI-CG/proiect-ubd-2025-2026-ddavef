import { useEffect, useMemo, useState, useCallback } from 'react';
import NavBar from './components/NavBar';
import MapPanel from './components/MapPanel';
import VehicleGrid from './components/VehicleGrid';
import AuthPanel from './components/AuthPanel';
import AdminPanel from './components/AdminPanel';
import ProfilePanel from './components/ProfilePanel';
import { useTranslator } from './i18n';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'o2w_token';
const ADMIN_EMAIL = 'admin@admin.com';
const THEME_KEY = 'o2w_theme';

const GRAPH_NODES = {
  central: { lat: 47.0525, lng: 21.93 },
  university: { lat: 47.0575, lng: 21.93 },
  oldTown: { lat: 47.0505, lng: 21.921 },
  station: { lat: 47.0675, lng: 21.917 },
  nufarul: { lat: 47.038, lng: 21.98 },
  westPark: { lat: 47.067, lng: 21.888 },
  zoo: { lat: 47.069, lng: 21.948 },
  industrial: { lat: 47.03, lng: 21.99 },
};

const GRAPH_EDGES = {
  central: [['oldTown'], ['station'], ['university'], ['nufarul']],
  oldTown: [['central'], ['westPark'], ['zoo']],
  westPark: [['oldTown'], ['station']],
  station: [['central'], ['westPark']],
  university: [['central'], ['zoo'], ['nufarul']],
  zoo: [['oldTown'], ['university']],
  nufarul: [['central'], ['university'], ['industrial']],
  industrial: [['nufarul']],
};

const SCOOTER_AREA = [
  { lat: 47.085, lng: 21.85 },
  { lat: 47.090, lng: 21.90 },
  { lat: 47.090, lng: 21.99 },
  { lat: 47.060, lng: 22.02 },
  { lat: 47.025, lng: 22.02 },
  { lat: 47.010, lng: 21.95 },
  { lat: 47.015, lng: 21.88 },
  { lat: 47.045, lng: 21.84 },
];

const BIKE_PARKING = [
  { id: 'p1', lat: 47.0515, lng: 21.9275 },
  { id: 'p2', lat: 47.0575, lng: 21.932 },
  { id: 'p3', lat: 47.0495, lng: 21.9195 },
  { id: 'p4', lat: 47.064, lng: 21.9155 },
  { id: 'p5', lat: 47.041, lng: 21.983 },
  { id: 'p6', lat: 47.068, lng: 21.889 },
  { id: 'p7', lat: 47.0305, lng: 21.994 },
];

function App() {
  const [lang, setLang] = useState('en');
  const t = useTranslator(lang);

  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rentingId, setRentingId] = useState(null);
  const [rentMessage, setRentMessage] = useState('');
  const [positions, setPositions] = useState({});

  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(null);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [view, setView] = useState('home');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem(THEME_KEY) || 'auto');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  const apiRoot = useMemo(() => apiBase.replace(/\/$/, ''), []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const haversineKm = (a, b) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  };

  const nearestNode = point => {
    let best = { id: null, d: Number.POSITIVE_INFINITY };
    Object.entries(GRAPH_NODES).forEach(([id, p]) => {
      const d = haversineKm(point, p);
      if (d < best.d) best = { id, d };
    });
    return best.id;
  };

  const dijkstra = (startId, endId) => {
    if (!startId || !endId) return 0;
    const dist = {};
    const visited = new Set();
    Object.keys(GRAPH_NODES).forEach(k => (dist[k] = Number.POSITIVE_INFINITY));
    dist[startId] = 0;
    while (visited.size < Object.keys(GRAPH_NODES).length) {
      let u = null;
      let best = Number.POSITIVE_INFINITY;
      Object.keys(dist).forEach(k => {
        if (!visited.has(k) && dist[k] < best) {
          best = dist[k];
          u = k;
        }
      });
      if (u === null || u === endId) break;
      visited.add(u);
      (GRAPH_EDGES[u] || []).forEach(([v]) => {
        const w = haversineKm(GRAPH_NODES[u], GRAPH_NODES[v]);
        const alt = dist[u] + w;
        if (alt < dist[v]) dist[v] = alt;
      });
    }
    return dist[endId] === Number.POSITIVE_INFINITY ? 0 : dist[endId];
  };

  const randomPointInPolygon = poly => {
    // Simple bounding-box rejection sampling for the polygon.
    const lats = poly.map(p => p.lat);
    const lngs = poly.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    function inside(lat, lng) {
      let insideFlag = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].lat, yi = poly[i].lng;
        const xj = poly[j].lat, yj = poly[j].lng;
        const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
        if (intersect) insideFlag = !insideFlag;
      }
      return insideFlag;
    }
    let lat, lng;
    do {
      lat = minLat + Math.random() * (maxLat - minLat);
      lng = minLng + Math.random() * (maxLng - minLng);
    } while (!inside(lat, lng));
    return { lat, lng };
  };

  const pickParking = () => BIKE_PARKING[Math.floor(Math.random() * BIKE_PARKING.length)];

  const ensurePositions = useCallback(
    nextVehicles => {
      setPositions(prev => {
        const next = { ...prev };
        nextVehicles.forEach(v => {
          if (next[v.id]) return;
          if (v.vehicle_type === 'bike') {
            const spot = pickParking();
            next[v.id] = { lat: spot.lat, lng: spot.lng };
          } else {
            const p = randomPointInPolygon(SCOOTER_AREA);
            next[v.id] = p;
          }
        });
        return next;
      });
    },
    [],
  );

  const authorizedHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchVehicles = useCallback(async () => {
    const res = await fetch(`${apiRoot}/vehicles/`);
    if (res.ok) {
      const data = await res.json();
      setVehicles(data);
      ensurePositions(data);
    }
  }, [apiRoot, ensurePositions]);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiRoot}/users/me`, { headers: authorizedHeaders() });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
      setToken('');
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [apiRoot, authorizedHeaders, token]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  const handleLogin = async ({ email, password }) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const body = new URLSearchParams();
      body.set('username', email);
      body.set('password', password);
      const res = await fetch(`${apiRoot}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await res.json();
      setToken(data.access_token);
      setAuthLoading(false);
      setShowAuthPanel(false);
      fetchProfile();
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
    }
  };

  const handleRegister = async payload => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch(`${apiRoot}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || 'Registration failed');
      }
      await handleLogin({ email: payload.email, password: payload.password });
    } catch (err) {
      setAuthError(err.message);
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setRentMessage('');
    setView('home');
  };

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (mode, match) => {
      const finalTheme = mode === 'auto' ? (match ? 'dark' : 'light') : mode;
      setResolvedTheme(finalTheme);
      document.documentElement.setAttribute('data-theme', finalTheme);
    };
    apply(themeMode, mql.matches);
    const handler = e => {
      if (themeMode === 'auto') apply('auto', e.matches);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [themeMode]);

  const handleRent = async id => {
    if (!token) {
      setRentMessage(t('rentRequiresLogin'));
      return;
    }
    setRentingId(id);
    setRentMessage(t('rentSimulating'));
    try {
      const res = await fetch(`${apiRoot}/rentals/`, {
        method: 'POST',
        headers: authorizedHeaders(),
        body: JSON.stringify({
          vehicle_id: id,
          start_time: new Date().toISOString(),
          end_time: null,
          total_cost: null,
          user_id: user?.id || 0,
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || `Status ${res.status}`);
      }
      setSelectedId(id);
      simulateRideEnd(id);
    } catch (err) {
      setRentMessage(err.message);
    } finally {
      setRentingId(null);
    }
  };

  const simulateRideEnd = vehicleId => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    const prevPos = positions[vehicleId];
    const startNode = nearestNode(prevPos || GRAPH_NODES.central);
    const nextPos = vehicle.vehicle_type === 'bike' ? pickParking() : randomPointInPolygon(SCOOTER_AREA);
    const endNode = nearestNode(nextPos);
    const distanceKm = Math.max(0.2, dijkstra(startNode, endNode));
    const rate = vehicle.price_per_hour || 1;
    const cost = (distanceKm * rate).toFixed(2);
    setPositions(prev => ({ ...prev, [vehicleId]: { lat: nextPos.lat, lng: nextPos.lng } }));
    setRentMessage(
      t('rentEnded')
        .replace('{distance}', distanceKm.toFixed(1))
        .replace('{cost}', cost),
    );
  };

  const heroTiles = [
    {
      title: t('tileScooters'),
      copy: t('tileScootersCopy'),
      img:
        'https://images.pexels.com/photos/30716393/pexels-photo-30716393/free-photo-of-row-of-electric-scooters-parked-in-florence.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      title: t('tileBikes'),
      copy: t('tileBikesCopy'),
      img:
        'https://images.pexels.com/photos/8627307/pexels-photo-8627307.jpeg',
    },
    {
      title: t('tileNight'),
      copy: t('tileNightCopy'),
      img:
        'https://images.pexels.com/photos/9660941/pexels-photo-9660941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  return (
    <div className="container-fluid py-4 px-lg-5" id="home">
      <NavBar
        lang={lang}
        setLang={setLang}
        user={user}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuthPanel(true)}
        onShowAdmin={() => setView('admin')}
        onShowProfile={() => setView('profile')}
        onShowHome={() => setView('home')}
        onShowRentals={() => setView('rentals')}
        isAdminView={view === 'admin'}
        isProfileView={view === 'profile'}
        isRentalsView={view === 'rentals'}
        showAdmin={isAdmin}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
        t={t}
      />

      {view === 'admin' && isAdmin ? (
        <AdminPanel
          t={t}
          apiRoot={apiRoot}
          token={token}
          vehicles={vehicles}
          onSaved={fetchVehicles}
          onBack={() => setView('home')}
        />
      ) : view === 'profile' && user ? (
        <ProfilePanel
          t={t}
          user={user}
          apiRoot={apiRoot}
          token={token}
          isAdmin={isAdmin}
          onUpdated={() => {
            fetchProfile();
          }}
          onBack={() => setView('home')}
        />
      ) : view === 'rentals' ? (
        <>
          <section className="glass-card p-4 mb-4">
            <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
              <div>
                <div className="section-label">{t('rentalsLabel')}</div>
                <h2 className="mb-2">{t('rentalsHeadline')}</h2>
                <p className="mb-0 text-muted">{t('rentalsSubhead')}</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                {!token && (
                  <button className="btn btn-outline-light btn-animate" onClick={() => setShowAuthPanel(true)}>
                    {t('loginCta')}
                  </button>
                )}
                <button className="btn btn-primary btn-lg cta-glow btn-animate" onClick={() => setView('home')}>
                  {t('ctaBackHome')}
                </button>
              </div>
            </div>
          </section>

          {rentMessage && <div className="alert alert-info">{rentMessage}</div>}

          <div className="row gy-4">
            <div className="col-lg-6 col-xl-7">
              <MapPanel
                t={t}
                vehicles={vehicles}
                positions={positions}
                scooterArea={SCOOTER_AREA}
                parkingSpots={BIKE_PARKING}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <div className="col-lg-6 col-xl-5">
              <VehicleGrid
                t={t}
                vehicles={vehicles}
                onRent={handleRent}
                rentingId={rentingId}
                isAuthed={!!token}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <section className="glass-card p-5 text-center mb-4">
            <div className="section-label mb-2">{t('homeLabel')}</div>
            <h1 className="mb-3">{t('homeUpsellTitle')}</h1>
            <p className="lead mb-4 text-muted">{t('homeUpsellCopy')}</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button className="btn btn-primary btn-lg cta-glow btn-animate" onClick={() => setView('rentals')}>
                {t('homeUpsellCta')}
              </button>
            </div>
          </section>

          <div className="row g-3 mb-4">
            {heroTiles.map(tile => (
              <div className="col-12 col-md-4" key={tile.title}>
                <div className="promo-card promo-hover" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.25)), url(${tile.img})` }}>
                  <div className="promo-copy">
                    <h4 className="mb-2">{tile.title}</h4>
                    <p className="mb-0 small">{tile.copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showAuthPanel && !user && (
        <div className="auth-overlay" onClick={() => setShowAuthPanel(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{t('loginCta')}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAuthPanel(false)} />
            </div>
            <AuthPanel
              t={t}
              onLogin={handleLogin}
              onRegister={handleRegister}
              loading={authLoading}
              error={authError}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
