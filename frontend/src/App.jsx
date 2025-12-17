import { useEffect, useMemo, useState } from 'react';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

const translations = {
  en: {
    brand: 'Oradea2Wheels',
    heroTitle: 'Move fast with rentals.',
    heroCopy:
      'React + FastAPI starter that is ready to talk to your backend. Designed for quick demos, smooth handoffs, and confident iterations.',
    exploreApi: 'Explore API',
    liveCheckTitle: 'Live backend check',
    liveCheckCopy: 'We ping the FastAPI root endpoint and show the response here.',
    featureAvailabilityTitle: 'Real-time availability',
    featureAvailabilityCopy: 'Track bikes and scooters as they move across the city.',
    featureRentalsTitle: 'One-click rentals',
    featureRentalsCopy: 'Start a ride with minimal friction for every user.',
    featureSecureTitle: 'Secure access',
    featureSecureCopy: 'Authentication hooks ready for your auth provider.',
    included: 'Included',
    sandbox: 'Sandbox',
    vehicleLookup: 'Look up a vehicle',
    vehicleId: 'Vehicle ID',
    fetchVehicle: 'Fetch vehicle',
    fetching: 'Fetching...',
    responsePlaceholder: 'Response payloads will appear here.',
    statusChecking: 'Checking API...',
    statusOkFallback: 'Backend is reachable',
    statusError: 'Backend offline',
    tryOne: 'Try 1',
  },
  ro: {
    brand: 'Oradea2Wheels',
    heroTitle: 'Mergi rapid cu inchirieri.',
    heroCopy:
      'Starter React + FastAPI gata sa vorbeasca cu backend-ul tau. Conceput pentru demo-uri rapide, predari line si iteratii sigure.',
    exploreApi: 'Documentatie API',
    liveCheckTitle: 'Verificare backend in timp real',
    liveCheckCopy: 'Verificam endpoint-ul radacina FastAPI si afisam raspunsul aici.',
    featureAvailabilityTitle: 'Disponibilitate in timp real',
    featureAvailabilityCopy: 'Urmareste bicicletele si trotinetele pe masura ce se misca in oras.',
    featureRentalsTitle: 'Inchirieri rapide',
    featureRentalsCopy: 'Porneste o cursa cu cat mai putina frictiune pentru utilizatori.',
    featureSecureTitle: 'Acces securizat',
    featureSecureCopy: 'Hook-uri de autentificare gata pentru furnizorul tau.',
    included: 'Inclus',
    sandbox: 'Sandbox',
    vehicleLookup: 'Cauta un vehicul',
    vehicleId: 'ID vehicul',
    fetchVehicle: 'Cauta vehicul',
    fetching: 'Caut vehicul...',
    responsePlaceholder: 'Raspunsurile vor aparea aici.',
    statusChecking: 'Verific API...',
    statusOkFallback: 'Backend disponibil',
    statusError: 'Backend indisponibil',
    tryOne: 'Incearca 1',
  },
};

const featureCards = [
  { titleKey: 'featureAvailabilityTitle', copyKey: 'featureAvailabilityCopy' },
  { titleKey: 'featureRentalsTitle', copyKey: 'featureRentalsCopy' },
  { titleKey: 'featureSecureTitle', copyKey: 'featureSecureCopy' },
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

function Hero({ status, statusText, t }) {
  return (
    <div className="row align-items-center py-5">
      <div className="col-lg-6 mb-4 mb-lg-0 hero">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="pulse-dot" aria-hidden />
          <span className="section-label">{t('brand')}</span>
        </div>
        <h1 className="display-5 mb-3">{t('heroTitle')}</h1>
        <p className="fs-5 mb-4">
          {t('heroCopy')}
        </p>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <a className="btn btn-light btn-lg fw-semibold" href="https://localhost:8000/docs" onClick={e => e.preventDefault()}>
            {t('exploreApi')}
          </a>
          <StatusPill status={status} text={statusText} />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="glass-card p-4">
          <h5 className="mb-3">{t('liveCheckTitle')}</h5>
          <p className="mb-4 text-muted">
            {t('liveCheckCopy')}
          </p>
          <StatusPill status={status} text={statusText} />
        </div>
      </div>
    </div>
  );
}

function FeatureGrid({ t }) {
  return (
    <div className="row g-4 mt-1">
      {featureCards.map(card => (
        <div key={card.titleKey} className="col-md-4">
          <div className="glass-card p-4 h-100 card-hover">
            <span className="badge-soft mb-2">{t('included')}</span>
            <h6 className="fw-semibold">{t(card.titleKey)}</h6>
            <p className="mb-0 text-muted">{t(card.copyKey)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VehicleLookup({ onLookup, loading, result, error, vehicleId, setVehicleId, t }) {
  return (
    <div className="glass-card p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="section-label">{t('sandbox')}</div>
          <h5 className="mb-0">{t('vehicleLookup')}</h5>
        </div>
        <span className="badge-soft">GET /vehicles/:id</span>
      </div>
      <form className="row g-3" onSubmit={onLookup}>
        <div className="col-sm-8">
          <label className="form-label" htmlFor="vehicle-id">{t('vehicleId')}</label>
          <input
            id="vehicle-id"
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
        {error && <div className="alert alert-danger mb-2">{error}</div>}
        {result && (
          <div className="alert alert-light border">
            <pre className="mb-0 small text-break">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
        {!result && !error && (
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
  const [loading, setLoading] = useState(false);

  const apiRoot = useMemo(() => apiBase.replace(/\/$/, ''), []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiRoot}/`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        const data = await res.json();
        const detail = data.message || '';
        setStatus({ state: 'ok', detail });
      } catch (err) {
        const detail = err?.message || 'Unavailable';
        setStatus({ state: 'error', detail });
      }
    };

    fetchStatus();
    return () => controller.abort();
  }, [apiRoot]);

  const statusText = useMemo(() => {
    if (status.state === 'checking') return t('statusChecking');
    if (status.state === 'ok') return status.detail || t('statusOkFallback');
    const suffix = status.detail ? ` (${status.detail})` : '';
    return `${t('statusError')}${suffix}`;
  }, [status, t]);

  const handleLookup = async event => {
    event.preventDefault();
    setVehicleResult(null);
    setVehicleError(null);
    if (!vehicleId) {
      return;
    }
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-3">
        <LanguageSwitcher lang={lang} setLang={setLang} />
      </div>
      <Hero status={status} statusText={statusText} t={t} />
      <FeatureGrid t={t} />
      <VehicleLookup
        onLookup={handleLookup}
        loading={loading}
        result={vehicleResult}
        error={vehicleError}
        vehicleId={vehicleId}
        setVehicleId={setVehicleId}
        t={t}
      />
    </div>
  );
}

export default App;
