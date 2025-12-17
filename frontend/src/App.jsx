import { useEffect, useMemo, useState, useCallback } from 'react';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'o2w_token';

const translations = {
  en: {
    brand: 'Oradea2Wheels',
    heroTitle: 'Rent bikes and scooters with live tracking',
    heroCopy: 'Book a ride, watch it move on the city map, and manage your trips effortlessly.',
    ctaBrowse: 'Browse vehicles',
    ctaAuth: 'Log in to rent',
    mapTitle: 'Live map (simulated)',
    mapSubtitle: 'Markers update as you select vehicles or create a rental.',
    available: 'Available',
    unavailable: 'Unavailable',
    rentNow: 'Rent now',
    renting: 'Renting...',
    loginTab: 'Login',
    registerTab: 'Create account',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    fullName: 'Full name',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    loggedInAs: 'Signed in as',
    backendStatus: 'Backend status',
    statusChecking: 'Checking API...',
    statusOkFallback: 'Backend is reachable',
    statusError: 'Backend offline',
    adminPanel: 'Admin console',
    adminHint: 'API probes and debug lookups live here. Sign in to view.',
    sandbox: 'Sandbox',
    vehicleLookup: 'Look up a vehicle',
    vehicleId: 'Vehicle ID',
    fetchVehicle: 'Fetch vehicle',
    fetching: 'Fetching...',
    responsePlaceholder: 'Response payloads will appear here.',
    tryOne: 'Try 1',
    featureTitle: 'Why riders choose us',
    featureAvailabilityTitle: 'Live locations',
    featureAvailabilityCopy: 'Track bikes and scooters moving across the city.',
    featureRentalsTitle: 'Card-friendly rentals',
    featureRentalsCopy: 'Pay per hour with a smooth checkout.',
    featureSecureTitle: 'Secure accounts',
    featureSecureCopy: 'OAuth2-ready authentication and API tokens.',
    included: 'Included',
    rentSuccess: 'Rental created. Track it on the map.',
    rentRequiresLogin: 'Please sign in to rent a vehicle.',
    vehiclesTitle: 'Pick your next ride',
    statusPill: 'Status',
    logoutConfirm: 'Logout',
    adminAccess: 'Go to admin',
    authRequired: 'Sign in to continue.',
  },
  ro: {
    brand: 'Oradea2Wheels',
    heroTitle: 'Inchiriaza biciclete si trotinete cu harti live',
    heroCopy: 'Rezerva, urmareste pe harta si gestioneaza cursele rapid.',
    ctaBrowse: 'Vezi vehiculele',
    ctaAuth: 'Autentificare pentru inchiriere',
    mapTitle: 'Harta live (simulata)',
    mapSubtitle: 'Marcajele se actualizeaza cand selectezi sau creezi o inchiriere.',
    available: 'Disponibil',
    unavailable: 'Indisponibil',
    rentNow: 'Inchiriaza acum',
    renting: 'Inchiriere...',
    loginTab: 'Autentificare',
    registerTab: 'Creeaza cont',
    email: 'Email',
    password: 'Parola',
    username: 'Utilizator',
    fullName: 'Nume complet',
    login: 'Autentificare',
    register: 'Inregistrare',
    logout: 'Deconectare',
    loggedInAs: 'Autentificat ca',
    backendStatus: 'Stare backend',
    statusChecking: 'Verific API...',
    statusOkFallback: 'Backend disponibil',
    statusError: 'Backend indisponibil',
    adminPanel: 'Consola admin',
    adminHint: 'Probe API si lookup-uri aici. Conecteaza-te pentru acces.',
    sandbox: 'Sandbox',
    vehicleLookup: 'Cauta vehicul',
    vehicleId: 'ID vehicul',
    fetchVehicle: 'Cauta',
    fetching: 'Caut vehicul...',
    responsePlaceholder: 'Raspunsurile vor aparea aici.',
    tryOne: 'Incearca 1',
    featureTitle: 'De ce aleg utilizatorii',
    featureAvailabilityTitle: 'Locatii live',
    featureAvailabilityCopy: 'Urmareste vehiculele in miscare prin oras.',
    featureRentalsTitle: 'Plati rapide',
    featureRentalsCopy: 'Plata pe ora cu flux simplu.',
    featureSecureTitle: 'Conturi sigure',
    featureSecureCopy: 'Autentificare OAuth2 si token-uri API.',
    included: 'Inclus',
    rentSuccess: 'Inchirierea a fost creata. Vezi pe harta.',
    rentRequiresLogin: 'Conecteaza-te pentru a inchiria un vehicul.',
    vehiclesTitle: 'Alege urmatoarea cursa',
    statusPill: 'Status',
    logoutConfirm: 'Deconecteaza-te',
    adminAccess: 'Mergi la admin',
    authRequired: 'Conecteaza-te pentru a continua.',
  },
};

const featureCards = [
  { titleKey: 'featureAvailabilityTitle', copyKey: 'featureAvailabilityCopy' },
  { titleKey: 'featureRentalsTitle', copyKey: 'featureRentalsCopy' },
  { titleKey: 'featureSecureTitle', copyKey: 'featureSecureCopy' },
];

const mapSlots = [
  { x: 12, y: 18 },
  { x: 48, y: 22 },
  { x: 72, y: 30 },
  { x: 26, y: 48 },
  { x: 58, y: 55 },
  { x: 80, y: 64 },
  { x: 35, y: 70 },
  { x: 65, y: 80 },
];

function useTranslator(lang) {
  return useMemo(() => (key) => translations[lang]?.[key] ?? key, [lang]);
}

function StatusPill({ status, text }) {
  const color = {
    ok: 'success',
    error: 'danger',
    checking: 'secondary',
  }[status.state];

  return (
    <span className={`badge bg-${color} rounded-pill px-3 py-2`}>{text}</span>
  );
}

function LanguageSwitcher({ lang, setLang }) {
  return (
    <div className="btn-group" role="group" aria-label="Language selector">
      <button
        type="button"
        className={`btn btn-outline-light ${lang === 'en' ? 'active' : ''}`}
        onClick={() => setLang('en')}
      >
        English
      </button>
      <button
        type="button"
        className={`btn btn-outline-light ${lang === 'ro' ? 'active' : ''}`}
        onClick={() => setLang('ro')}
      >
        Romana
      </button>
    </div>
  );
}

function TopBar({ lang, setLang, user, onLogout, t }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4 topbar">
      <div className="d-flex align-items-center gap-3">
        <div className="brand-mark" aria-hidden />
        <div>
          <div className="section-label mb-1">{t('brand')}</div>
          <div className="fw-semibold text-white-50">
            {user ? `${t('loggedInAs')} ${user.username}` : t('authRequired')}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <LanguageSwitcher lang={lang} setLang={setLang} />
        {user ? (
          <button className="btn btn-outline-light" onClick={onLogout}>{t('logout')}</button>
        ) : null}
      </div>
    </div>
  );
}

function Hero({ t, statusText, status }) {
  return (
    <div className="row align-items-center gy-4">
      <div className="col-lg-6 hero">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="pulse-dot" aria-hidden />
          <span className="section-label">{t('brand')}</span>
        </div>
        <h1 className="display-5 fw-bold mb-3">{t('heroTitle')}</h1>
        <p className="fs-5 text-white-75 mb-4">{t('heroCopy')}</p>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <a className="btn btn-light btn-lg" href="#vehicles">{t('ctaBrowse')}</a>
          <StatusPill status={status} text={`${t('statusPill')}: ${statusText}`} />
        </div>
      </div>
      <div className="col-lg-6">
        <FeatureGrid t={t} />
      </div>
    </div>
  );
}

function FeatureGrid({ t }) {
  return (
    <div className="row g-3">
      {featureCards.map(card => (
        <div key={card.titleKey} className="col-md-4">
          <div className="glass-card p-4 h-100 card-hover">
            <span className="badge-soft mb-2">{t('included')}</span>
            <h6 className="fw-semibold mb-1">{t(card.titleKey)}</h6>
            <p className="mb-0 text-muted small">{t(card.copyKey)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapPanel({ t, vehicles, selectedId, onSelect }) {
  const decorated = useMemo(
    () => vehicles.map((v, idx) => ({ ...v, slot: mapSlots[idx % mapSlots.length] })),
    [vehicles],
  );

  return (
    <div className="glass-card p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <div className="section-label">{t('mapTitle')}</div>
          <div className="text-muted small">{t('mapSubtitle')}</div>
        </div>
      </div>
      <div className="map-shell">
        {decorated.map(item => (
          <button
            key={item.id}
            type="button"
            className={`map-dot ${selectedId === item.id ? 'active' : ''} ${item.available ? 'available' : 'unavailable'}`}
            style={{ left: `${item.slot.x}%`, top: `${item.slot.y}%` }}
            onClick={() => onSelect(item.id)}
            aria-label={`${item.name}`}
          />
        ))}
      </div>
    </div>
  );
}

function VehicleGrid({ t, vehicles, onRent, rentingId, isAuthed }) {
  return (
    <div className="row g-3" id="vehicles">
      {vehicles.map(vehicle => {
        const badge = vehicle.available ? 'success' : 'secondary';
        return (
          <div key={vehicle.id} className="col-md-4">
            <div className="glass-card p-3 h-100 card-hover">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">{vehicle.name}</h6>
                <span className={`badge bg-${badge}`}>{vehicle.available ? t('available') : t('unavailable')}</span>
              </div>
              <p className="text-muted small mb-2">{vehicle.description || vehicle.vehicle_type}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-semibold">€{vehicle.price_per_hour.toFixed(2)} / h</div>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!vehicle.available || rentingId === vehicle.id || !isAuthed}
                  onClick={() => onRent(vehicle.id)}
                >
                  {rentingId === vehicle.id ? t('renting') : t('rentNow')}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AuthPanel({ t, onLogin, onRegister, loading, error }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  const submit = async e => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      onRegister({ email, password, username: username || email.split('@')[0], full_name: fullName || username || email.split('@')[0] });
    }
  };

  return (
    <div className="glass-card p-4 mb-4">
      <div className="btn-group mb-3" role="group">
        <button className={`btn btn-outline-primary ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
          {t('loginTab')}
        </button>
        <button className={`btn btn-outline-primary ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
          {t('registerTab')}
        </button>
      </div>
      <form className="row g-3" onSubmit={submit}>
        {mode === 'register' && (
          <div className="col-md-6">
            <label className="form-label">{t('username')}</label>
            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        )}
        {mode === 'register' && (
          <div className="col-md-6">
            <label className="form-label">{t('fullName')}</label>
            <input className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
        )}
        <div className="col-md-6">
          <label className="form-label">{t('email')}</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">{t('password')}</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="col-12"><div className="alert alert-danger mb-0">{error}</div></div>}
        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t('fetching') : mode === 'login' ? t('login') : t('register')}
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminPanel({ t, status, statusText, onLookup, vehicleId, setVehicleId, vehicleResult, vehicleError, loading, isAuthed }) {
  if (!isAuthed) {
    return (
      <div className="glass-card p-4 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">{t('adminPanel')}</h5>
          <StatusPill status={status} text={statusText} />
        </div>
        <p className="text-muted mb-0">{t('adminHint')}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="section-label">{t('adminPanel')}</div>
          <h5 className="mb-0">{t('backendStatus')}</h5>
        </div>
        <StatusPill status={status} text={statusText} />
      </div>
      <div className="border rounded p-3 mb-3 bg-light text-muted small">
        {statusText}
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <div className="section-label">{t('sandbox')}</div>
          <h6 className="mb-0">{t('vehicleLookup')}</h6>
        </div>
        <span className="badge-soft">GET /vehicles/:id</span>
      </div>
      <form className="row g-3" onSubmit={onLookup}>
        <div className="col-sm-8">
          <label className="form-label" htmlFor="vehicle-id-admin">{t('vehicleId')}</label>
          <input
            id="vehicle-id-admin"
            type="number"
            className="form-control"
            placeholder={t('tryOne')}
            value={vehicleId}
            onChange={e => setVehicleId(e.target.value)}
            min="1"
          />
        </div>
        <div className="col-sm-4 d-flex align-items-end">
          <button className="btn btn-primary w-100" type="submit" disabled={loading || !vehicleId}>
            {loading ? t('fetching') : t('fetchVehicle')}
          </button>
        </div>
      </form>
      <div className="mt-3">
        {vehicleError && <div className="alert alert-danger mb-2">{vehicleError}</div>}
        {vehicleResult && (
          <div className="alert alert-light border">
            <pre className="mb-0 small text-break">{JSON.stringify(vehicleResult, null, 2)}</pre>
          </div>
        )}
        {!vehicleResult && !vehicleError && (
          <p className="text-muted mb-0">{t('responsePlaceholder')}</p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState('en');
  const t = useTranslator(lang);

  const [status, setStatus] = useState({ state: 'checking', detail: '' });
  const [vehicleId, setVehicleId] = useState('');
  const [vehicleResult, setVehicleResult] = useState(null);
  const [vehicleError, setVehicleError] = useState(null);
  const [loadingLookup, setLoadingLookup] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [rentingId, setRentingId] = useState(null);
  const [rentMessage, setRentMessage] = useState('');

  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(null);

  const apiRoot = useMemo(() => apiBase.replace(/\/$/, ''), []);

  const statusText = useMemo(() => {
    if (status.state === 'checking') return t('statusChecking');
    if (status.state === 'ok') return status.detail || t('statusOkFallback');
    const suffix = status.detail ? ` (${status.detail})` : '';
    return `${t('statusError')}${suffix}`;
  }, [status, t]);

  const authorizedHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiRoot}/`);
      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      const data = await res.json();
      setStatus({ state: 'ok', detail: data.message || '' });
    } catch (err) {
      setStatus({ state: 'error', detail: err?.message || 'Unavailable' });
    }
  }, [apiRoot]);

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
    fetchStatus();
    fetchVehicles();
  }, [fetchStatus, fetchVehicles]);

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

  const handleLookup = async event => {
    event.preventDefault();
    setVehicleResult(null);
    setVehicleError(null);
    if (!vehicleId) return;
    setLoadingLookup(true);
    try {
      const res = await fetch(`${apiRoot}/vehicles/${vehicleId}`);
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const detail = payload.detail || `Status ${res.status}`;
        throw new Error(detail);
      }
      const data = await res.json();
      setVehicleResult(data);
    } catch (err) {
      setVehicleError(err.message);
    } finally {
      setLoadingLookup(false);
    }
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
    <div className="container py-4">
      <TopBar lang={lang} setLang={setLang} user={user} onLogout={handleLogout} t={t} />

      <Hero t={t} statusText={statusText} status={status} />

      <div className="row gy-4 mt-1">
        <div className="col-lg-5">
          {!user && (
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

      <AdminPanel
        t={t}
        status={status}
        statusText={statusText}
        onLookup={handleLookup}
        vehicleId={vehicleId}
        setVehicleId={setVehicleId}
        vehicleResult={vehicleResult}
        vehicleError={vehicleError}
        loading={loadingLookup}
        isAuthed={!!token}
      />
    </div>
  );
}

export default App;
