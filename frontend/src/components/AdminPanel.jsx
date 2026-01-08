import { useState } from 'react';

export default function AdminPanel({ t, apiRoot, token, onSaved, onBack }) {
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState('scooter');
  const [price, setPrice] = useState('1.00');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${apiRoot}/vehicles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          vehicle_type: vehicleType,
          description,
          price_per_hour: Number(price),
          available,
        }),
      });
      if (!res.ok) {
        throw new Error(t('saveFailed'));
      }
      setMessage(t('savedVehicle'));
      setName('');
      setDescription('');
      setPrice('1.00');
      setVehicleType('scooter');
      setAvailable(true);
      onSaved?.();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="section-label">{t('adminOnly')}</div>
          <h5 className="mb-1 text-white">{t('adminTitle')}</h5>
          <p className="text-muted mb-0 small">{t('adminDescription')}</p>
        </div>
        <button className="btn btn-outline-light btn-sm" onClick={onBack}>
          {t('ctaBackHome')}
        </button>
      </div>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">{t('vehicleName')}</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">{t('vehicleType')}</label>
          <select className="form-select" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
            <option value="scooter">{t('scooter')}</option>
            <option value="bike">{t('bike')}</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">{t('vehiclePrice')}</label>
          <input
            type="number"
            min="0"
            step="0.1"
            className="form-control"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label">{t('vehicleDescription')}</label>
          <textarea
            className="form-control"
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="col-12 d-flex align-items-center gap-2">
          <input
            type="checkbox"
            id="available"
            className="form-check-input"
            checked={available}
            onChange={e => setAvailable(e.target.checked)}
          />
          <label htmlFor="available" className="form-check-label">
            {t('vehicleAvailable')}
          </label>
        </div>
        {message && (
          <div className="col-12">
            <div className="alert alert-info mb-0">{message}</div>
          </div>
        )}
        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? t('renting') : t('saveVehicle')}
          </button>
        </div>
      </form>
    </div>
  );
}
