export default function VehicleGrid({ t, vehicles, onRent, rentingId, isAuthed }) {
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
