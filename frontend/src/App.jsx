import { useEffect, useMemo, useState, useCallback } from 'react';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import MapPanel from './components/MapPanel';
import VehicleGrid from './components/VehicleGrid';
import AuthPanel from './components/AuthPanel';
import { useTranslator } from './i18n';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'o2w_token';

function App() {
  const [lang, setLang] = useState('en');
  const t = useTranslator(lang);

  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rentingId, setRentingId] = useState(null);
  const [rentMessage, setRentMessage] = useState('');

  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(null);
  const [showAuthPanel, setShowAuthPanel] = useState(false);

  const apiRoot = useMemo(() => apiBase.replace(/\/$/, ''), []);

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
    }
  }, [apiRoot]);

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
  };

  const handleRent = async id => {
    if (!token) {
      setRentMessage(t('rentRequiresLogin'));
      return;
    }
    setRentingId(id);
    setRentMessage('');
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
      setRentMessage(t('rentSuccess'));
      setSelectedId(id);
      fetchVehicles();
    } catch (err) {
      setRentMessage(err.message);
    } finally {
      setRentingId(null);
    }
  };

  return (
    <div className="container py-4" id="home">
      <NavBar
        lang={lang}
        setLang={setLang}
        user={user}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuthPanel(true)}
        t={t}
      />
      <HeroSection t={t} />

      <div className="row gy-4 mt-1">
        <div className="col-lg-5">
          {!user && showAuthPanel && (
            <AuthPanel
              t={t}
              onLogin={handleLogin}
              onRegister={handleRegister}
              loading={authLoading}
              error={authError}
            />
          )}
          {rentMessage && <div className="alert alert-info">{rentMessage}</div>}
        </div>
        <div className="col-lg-7">
          <MapPanel t={t} vehicles={vehicles} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-4 mb-2" id="vehicles">
        <div>
          <div className="section-label">{t('vehiclesTitle')}</div>
          <h5 className="mb-0 text-white">{t('vehiclesTitle')}</h5>
        </div>
      </div>
      <VehicleGrid
        t={t}
        vehicles={vehicles}
        onRent={handleRent}
        rentingId={rentingId}
        isAuthed={!!token}
      />
    </div>
  );
}

export default App;
