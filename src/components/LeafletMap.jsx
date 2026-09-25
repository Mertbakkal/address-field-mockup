import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { NOUAKCHOTT } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import 'leaflet/dist/leaflet.css';

const redPin = L.divIcon({
  className: '',
  html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:#e53935;transform:rotate(-45deg);display:grid;place-items:center;box-shadow:0 4px 12px rgba(229,57,53,.4)"><span style="transform:rotate(45deg);color:#fff;font-size:18px;font-weight:700;line-height:1">+</span></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

const clusterIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#f0a500;color:#fff;font-weight:700;font-size:13px;display:grid;place-items:center;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.25)">8</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const doneIcon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#0b6bcb;color:#fff;font-weight:700;font-size:14px;display:grid;place-items:center;border:2px solid #fff;box-shadow:0 3px 10px rgba(11,107,203,.4)">✓</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

function MapController({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

export default function LeafletMap({
  mapRef,
  center = [NOUAKCHOTT.lat, NOUAKCHOTT.lng],
  markers = [],
  showOsm = true,
  pendingPoint,
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      zoomControl={false}
      attributionControl
      style={{ width: '100%', height: '100%' }}
    >
      {showOsm && (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}
      <MapController mapRef={mapRef} />
      <Recenter center={center} />
      {markers.map((m) => {
        const icon = m.type === 'cluster' ? clusterIcon : m.type === 'done' ? doneIcon : redPin;
        return <Marker key={m.id} position={m.coords} icon={icon} />;
      })}
      {pendingPoint && <Marker position={pendingPoint} icon={redPin} />}
    </MapContainer>
  );
}

export function MapTools({
  onZoomIn,
  onZoomOut,
  onLocate,
  onInfo,
  onLayers,
  onSearch,
  onTasks,
  onForm,
  layersActive,
}) {
  const { t } = useLanguage();

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          className={`map-fab ${layersActive ? 'map-fab--active' : ''}`}
          onClick={onLayers}
          aria-label={t('layerManagement')}
          title={t('layerManagement')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
            <path d="m2 12 10 5 10-5M2 17l10 5 10-5" />
          </svg>
        </button>
        <button type="button" className="map-fab" onClick={onForm} aria-label={t('form')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M8 13h8M8 17h6" />
          </svg>
        </button>
        <button type="button" className="map-fab" onClick={onSearch} aria-label={t('search')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </button>
        <button type="button" className="map-fab" onClick={onTasks} aria-label={t('navTasks')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </button>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <button type="button" className="map-fab" onClick={onInfo} aria-label={t('info')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v6M12 7h.01" />
          </svg>
        </button>
        <button type="button" className="map-fab" onClick={onLocate} aria-label={t('myLocation')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
          </svg>
        </button>
        <button type="button" className="map-fab" onClick={onZoomIn} aria-label={t('zoomIn')}>
          <strong style={{ fontSize: 14, lineHeight: 1 }}>+</strong>
        </button>
        <button type="button" className="map-fab" onClick={onZoomOut} aria-label={t('zoomOut')}>
          <strong style={{ fontSize: 15, lineHeight: 1 }}>−</strong>
        </button>
      </div>
    </>
  );
}
