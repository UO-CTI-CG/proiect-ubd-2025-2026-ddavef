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

export default function MapPanel({ t, vehicles, selectedId, onSelect }) {
  const decorated = vehicles.map((v, idx) => ({ ...v, slot: mapSlots[idx % mapSlots.length] }));

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
