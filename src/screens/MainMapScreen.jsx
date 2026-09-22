import { useRef, useState } from 'react';
import LeafletMap, { MapTools } from '../components/LeafletMap';
import { ScreenHeader } from '../components/chrome';
import { NOUAKCHOTT } from '../data/mockData';
import { searchResults } from '../data/mockData';

const defaultMarkers = [
  { id: 'm1', coords: [18.089, -15.975], type: 'pin' },
  { id: 'm2', coords: [18.082, -15.984], type: 'cluster' },
  { id: 'm3', coords: [18.078, -15.97], type: 'done' },
];

export default function MainMapScreen({
  onStartAddress,
  onOpenForm,
  onOpenTasks,
  layers,
  setLayers,
}) {
  const mapRef = useRef(null);
  const [sheet, setSheet] = useState(null);
  const [layerTab, setLayerTab] = useState('layers');
  const [pendingPoint, setPendingPoint] = useState(null);
  const [center, setCenter] = useState([NOUAKCHOTT.lat, NOUAKCHOTT.lng]);
  const [searchTerm, setSearchTerm] = useState('NO31');
  const [basemap, setBasemap] = useState('osm');
  const [infoOpen, setInfoOpen] = useState(false);

  const markers = (layers.address || layers.addressPoints) ? defaultMarkers : [];

  const zoomBy = (delta) => {
    const map = mapRef.current;
    if (map) map.setZoom(map.getZoom() + delta);
  };

  const locate = () => {
    setCenter([NOUAKCHOTT.lat, NOUAKCHOTT.lng]);
    mapRef.current?.setView([NOUAKCHOTT.lat, NOUAKCHOTT.lng], 15);
  };

  const placeAddress = () => {
    const pt = [NOUAKCHOTT.lat + 0.004, NOUAKCHOTT.lng - 0.003];
    setPendingPoint(pt);
    setCenter(pt);
    setSheet(null);
    onStartAddress(pt);
  };

  return (
    <div className="screen-body">
      <ScreenHeader title="Main Map" subtitle="OSM • Nouakchott" />
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <LeafletMap
          mapRef={mapRef}
          center={center}
          markers={markers}
          showOsm={layers.osm && basemap === 'osm'}
          pendingPoint={pendingPoint}
        />
        <MapTools
          onZoomIn={() => zoomBy(1)}
          onZoomOut={() => zoomBy(-1)}
          onLocate={locate}
          onInfo={() => setInfoOpen(true)}
          onLayers={() => {
            setLayerTab('layers');
            setSheet('layers');
          }}
          onSearch={() => setSheet('search')}
          onTasks={onOpenTasks}
          onForm={onOpenForm}
          layersActive={sheet === 'layers'}
        />

        {!sheet && (
          <div className="map-footer-bar">
            <div
              className="card"
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)' }}>
                  GPS 3.4 m
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  Tevragh Zeina, Nouakchott · Online
                </div>
              </div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--primary-mid)',
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', boxShadow: 'var(--shadow)' }}
              onClick={() => setSheet('actions')}
            >
              + Address actions
            </button>
          </div>
        )}

        {sheet && (
          <>
            <div className="sheet-backdrop" onClick={() => setSheet(null)} />
            {sheet === 'actions' && (
              <div className="bottom-sheet">
                <div className="sheet-head">
                  <h2>Address actions</h2>
                  <button type="button" className="sheet-close" onClick={() => setSheet(null)}>
                    ×
                  </button>
                </div>
                <div className="address-actions-grid">
                  <ActionTile
                    label="Add address"
                    onClick={placeAddress}
                    icon={
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    }
                  />
                  <ActionTile
                    label="Edit address"
                    onClick={() => {
                      setSheet(null);
                      onStartAddress([NOUAKCHOTT.lat, NOUAKCHOTT.lng]);
                    }}
                    icon={
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    }
                  />
                  <ActionTile
                    label="Move address"
                    onClick={() => setSheet(null)}
                    icon={
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    }
                  />
                </div>
              </div>
            )}
            {sheet === 'layers' && (
              <div className="bottom-sheet tall layer-mgmt">
                <div className="sheet-head">
                  <div className="layer-mgmt__title">
                    <span className="layer-mgmt__icon" aria-hidden>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                        <path d="m2 12 10 5 10-5M2 17l10 5 10-5" />
                      </svg>
                    </span>
                    <h2>Layer Management</h2>
                  </div>
                  <button type="button" className="sheet-close" onClick={() => setSheet(null)} aria-label="Close">
                    ×
                  </button>
                </div>

                <div className="layer-mgmt__tabs">
                  {['layers', 'task', 'personal'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`layer-mgmt__tab ${layerTab === t ? 'active' : ''}`}
                      onClick={() => setLayerTab(t)}
                    >
                      {t === 'layers' ? 'Layers' : t === 'task' ? 'Task Layers' : 'Personal Layers'}
                    </button>
                  ))}
                </div>

                {layerTab === 'layers' && (
                  <div className="layer-mgmt__list">
                    <MgmtLayerRow
                      title="Integrations"
                      on={layers.integrations}
                      onToggle={() => setLayers((l) => ({ ...l, integrations: !l.integrations }))}
                    />
                    <MgmtLayerRow
                      title="Training"
                      on={layers.training}
                      onToggle={() => setLayers((l) => ({ ...l, training: !l.training }))}
                    />
                    <MgmtLayerRow
                      title="Reference"
                      on={layers.reference}
                      onToggle={() => setLayers((l) => ({ ...l, reference: !l.reference }))}
                    />
                    <MgmtLayerRow
                      title="Electricity"
                      on={layers.electricity}
                      onToggle={() => setLayers((l) => ({ ...l, electricity: !l.electricity }))}
                    />
                    <MgmtLayerRow
                      title="Address"
                      on={layers.address}
                      onToggle={() => {
                        setLayers((l) => ({
                          ...l,
                          address: !l.address,
                          addressPoints: !l.address,
                        }));
                      }}
                    />
                  </div>
                )}

                {layerTab === 'task' && (
                  <div className="layer-mgmt__empty">No task layers assigned</div>
                )}

                {layerTab === 'personal' && (
                  <div className="layer-mgmt__list">
                    <MgmtLayerRow
                      title="Field zone"
                      on={layers.fieldZone}
                      onToggle={() => setLayers((l) => ({ ...l, fieldZone: !l.fieldZone }))}
                    />
                    <MgmtLayerRow
                      title="OpenStreetMap"
                      on={layers.osm}
                      onToggle={() => {
                        setLayers((l) => ({ ...l, osm: !l.osm }));
                        setBasemap('osm');
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            {sheet === 'search' && (
              <div className="bottom-sheet tall">
                <div className="sheet-head">
                  <h2>Quick Search</h2>
                  <button type="button" className="sheet-close" onClick={() => setSheet(null)}>
                    ×
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, minWidth: 0 }}>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search term"
                    className="toolbar-input"
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-primary toolbar-action">
                    Search
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {searchResults.map((r) => (
                    <div key={r.id} className="card" style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            background: 'var(--primary-soft)',
                            color: 'var(--primary-dark)',
                            padding: '3px 8px',
                            borderRadius: 999,
                          }}
                        >
                          ID: {r.id}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            background: '#eef2f6',
                            color: 'var(--muted)',
                            padding: '3px 8px',
                            borderRadius: 999,
                          }}
                        >
                          {r.source}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Term values</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{r.term}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {infoOpen && (
          <>
            <div className="sheet-backdrop" onClick={() => setInfoOpen(false)} />
            <div className="bottom-sheet">
              <div className="sheet-head">
                <h2>Map info</h2>
                <button type="button" className="sheet-close" onClick={() => setInfoOpen(false)}>
                  ×
                </button>
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                Latitude: {NOUAKCHOTT.lat.toFixed(6)}
                <br />
                Longitude: {NOUAKCHOTT.lng.toFixed(6)}
                <br />
                Format: Decimal degrees
                <br />
                Basemap: OpenStreetMap
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ActionTile({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '12px 4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        background: '#fff',
        color: 'var(--primary-dark)',
        fontSize: 10,
        fontWeight: 600,
        minWidth: 0,
        width: '100%',
        textAlign: 'center',
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: 'var(--primary-soft)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function MgmtLayerRow({ title, on, onToggle }) {
  return (
    <div className="layer-mgmt__row">
      <button type="button" className="layer-mgmt__expand" aria-label={`Expand ${title}`}>
        ›
      </button>
      <span className="layer-mgmt__name">{title}</span>
      <button
        type="button"
        className={`toggle ${on ? 'on' : ''}`}
        onClick={onToggle}
        aria-label={title}
        aria-pressed={on}
      />
    </div>
  );
}
