import { MapContainer, TileLayer, Polygon, CircleMarker, Tooltip } from 'react-leaflet';

export default function MapPanel({ t, vehicles, positions, scooterArea, parkingSpots, selectedId, onSelect }) {
  const center = [47.0465, 21.9189];

  const bikesByParking = parkingSpots.reduce((acc, spot) => {
    const bikes = vehicles.filter(v => v.vehicle_type === 'bike');
    const names = bikes
      .filter(b => {
        const pos = positions[b.id];
        return pos && pos.lat === spot.lat && pos.lng === spot.lng;
      })
      .map(b => b.name);
    acc[spot.id] = names;
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
            const names = bikesByParking[spot.id] || [];
            const label = names.length ? names.join(', ') : t('bikeParking');
            return (
              <CircleMarker
                key={spot.id}
                center={[spot.lat, spot.lng]}
                radius={7}
                pathOptions={{ color: '#3498db', fillColor: '#3498db', fillOpacity: 0.9 }}
              >
                <Tooltip>{label}</Tooltip>
              </CircleMarker>
            );
          })}

          {vehicles.map(item => {
            const pos = positions[item.id];
            if (!pos) return null;
            const isBike = item.vehicle_type === 'bike';
            const color = isBike ? '#e74c3c' : '#2ecc71';
            return (
              <CircleMarker
                key={item.id}
                center={[pos.lat, pos.lng]}
                radius={9}
                pathOptions={{ color, fillColor: color, fillOpacity: selectedId === item.id ? 0.9 : 0.7 }}
                eventHandlers={{ click: () => onSelect(item.id) }}
              >
                <Tooltip>{item.name}</Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
