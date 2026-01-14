import { MapContainer, TileLayer, Polygon, CircleMarker, Tooltip, Popup } from 'react-leaflet';

export default function MapPanel({ t, vehicles, positions, scooterArea, parkingSpots, selectedId, onSelect }) {
  const center = [47.0465, 21.9189];

  const bikesByParking = parkingSpots.reduce((acc, spot) => {
    const bikes = vehicles
      .filter(v => v.vehicle_type === 'bike')
      .filter(b => {
        const pos = positions[b.id];
        return pos && pos.lat === spot.lat && pos.lng === spot.lng;
      });
    acc[spot.id] = bikes;
    return acc;
  }, {});

  return (
    <div className="glass-card p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <div className="section-label">{t('mapTitle')}</div>
          <div className="text-muted small">{t('mapSubtitle')}</div>
        </div>
      </div>
      <div className="map-shell leaflet-shell" style={{ height: '420px' }}>
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-100 w-100 rounded-3">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polygon
            positions={scooterArea.map(p => [p.lat, p.lng])}
            pathOptions={{ color: '#00b894', weight: 2, fillOpacity: 0.15 }}
          >
            <Tooltip sticky>{t('scooterArea')}</Tooltip>
          </Polygon>

          {parkingSpots.map(spot => {
            const bikes = bikesByParking[spot.id] || [];
            const hasBikes = bikes.length > 0;
            const color = hasBikes ? '#e74c3c' : '#3498db';
            return (
              <CircleMarker
                key={spot.id}
                center={[spot.lat, spot.lng]}
                radius={8}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
              >
                <Tooltip>{t('bikeParking')}</Tooltip>
                <Popup>
                  <div className="small">
                    <div className="fw-bold mb-1">{t('bikeParking')}</div>
                    {bikes.length === 0 ? (
                      <div className="text-body-secondary">{t('noBikesParked')}</div>
                    ) : (
                      <ul className="mb-0 ps-3">
                        {bikes.map(b => (
                          <li key={b.id} className="mb-1">
                            <div className="fw-semibold">{b.name}</div>
                            <div className="text-body-secondary">{t('vehicleType')}: {t(b.vehicle_type)}</div>
                            <div className="text-body-secondary">€{b.price_per_hour?.toFixed?.(2) ?? b.price_per_hour}</div>
                            <div className={b.available ? 'text-success' : 'text-danger'}>
                              {b.available ? t('available') : t('unavailable')}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {vehicles.map(item => {
            if (item.vehicle_type === 'bike') return null; // bikes handled via parking
            const pos = positions[item.id];
            if (!pos) return null;
            const color = '#2ecc71';
            return (
              <CircleMarker
                key={item.id}
                center={[pos.lat, pos.lng]}
                radius={9}
                pathOptions={{ color, fillColor: color, fillOpacity: selectedId === item.id ? 0.9 : 0.7 }}
                eventHandlers={{ click: () => onSelect(item.id) }}
              >
                <Tooltip>{item.name}</Tooltip>
                <Popup>
                  <div className="small">
                    <div className="fw-bold mb-1">{item.name}</div>
                    <div className="text-body-secondary">{t('vehicleType')}: {t(item.vehicle_type)}</div>
                    <div className="text-body-secondary">€{item.price_per_hour?.toFixed?.(2) ?? item.price_per_hour}</div>
                    <div className={item.available ? 'text-success' : 'text-danger'}>
                      {item.available ? t('available') : t('unavailable')}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
