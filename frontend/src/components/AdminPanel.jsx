import { useEffect, useState } from 'react';

export default function AdminPanel({ t, apiRoot, token, vehicles = [], onSaved, onBack }) {
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState('scooter');
  const [price, setPrice] = useState('1.00');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const loadUsers = async () => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const res = await fetch(`${apiRoot}/users/`, { headers: authHeaders() });
      if (!res.ok) throw new Error(t('loadFailed'));
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token, apiRoot, t]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${apiRoot}/vehicles/`, {
        method: 'POST',
        headers: authHeaders(),
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

  const handleDeleteVehicle = async id => {
    setMessage('');
    try {
      const res = await fetch(`${apiRoot}/vehicles/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(t('deleteFailed'));
      onSaved?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleToggleAvailability = async (id, currentValue) => {
    setMessage('');
    try {
      const res = await fetch(`${apiRoot}/vehicles/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ available: !currentValue }),
      });
      if (!res.ok) throw new Error(t('updateFailed'));
      onSaved?.();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteUser = async id => {
    setMessage('');
    try {
      const res = await fetch(`${apiRoot}/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(t('deleteFailed'));
      loadUsers();
    } catch (err) {
      setMessage(err.message);
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

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="text-white mb-0">{t('adminVehiclesTitle')}</h6>
          <button className="btn btn-outline-light btn-sm" onClick={onSaved}>
            {t('refresh')}
          </button>
        </div>
        {vehicles.length === 0 ? (
          <div className="text-muted small">{t('noVehicles')}</div>
        ) : (
          <div className="table-responsive small">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('vehicleName')}</th>
                  <th>{t('vehicleType')}</th>
                  <th>{t('vehiclePrice')}</th>
                  <th>{t('vehicleAvailable')}</th>
                  <th>{t('toggleAvailability')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.name}</td>
                    <td>{t(v.vehicle_type)}</td>
                    <td>€{v.price_per_hour?.toFixed?.(2) ?? v.price_per_hour}</td>
                    <td>
                      <span className={v.available ? 'text-success' : 'text-danger'}>
                        {v.available ? t('available') : t('unavailable')}
                      </span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={!!v.available}
                        onChange={() => handleToggleAvailability(v.id, v.available)}
                      />
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteVehicle(v.id)}
                      >
                        {t('deleteLabel')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="text-white mb-0">{t('adminUsersTitle')}</h6>
          <button className="btn btn-outline-light btn-sm" onClick={loadUsers} disabled={loadingUsers}>
            {loadingUsers ? t('renting') : t('refresh')}
          </button>
        </div>
        {users.length === 0 ? (
          <div className="text-muted small">{t('noUsers')}</div>
        ) : (
          <div className="table-responsive small">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('username')}</th>
                  <th>{t('email')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        {t('deleteLabel')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
