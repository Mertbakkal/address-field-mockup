import { useState } from 'react';
import { ScreenHeader } from '../components/chrome';
import { initialRecords, tasks } from '../data/mockData';

const statusStyle = {
  ready: { bg: '#e8f2fb', icon: '◆', color: '#0b6bcb' },
  draft: { bg: '#eef2f6', icon: '✎', color: '#5a6b7d' },
  error: { bg: '#fdecea', icon: '!', color: '#c62828' },
  sent: { bg: '#e3f5ea', icon: '✓', color: '#1b7a45' },
};

export function RecordsScreen() {
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState('all');

  const list = initialRecords.filter((r) => {
    if (status !== 'all' && r.status !== status) return false;
    return true;
  });

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title="My Records" subtitle="Address records only" />
      <div style={{ padding: '0 14px 12px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...selectStyle, width: '100%', minWidth: 0 }}
        >
          <option value="all">All records</option>
          <option value="mine">My drafts</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ ...selectStyle, width: '100%', minWidth: 0 }}
        >
          <option value="all">All statuses</option>
          <option value="ready">Ready</option>
          <option value="draft">Draft</option>
          <option value="error">Error</option>
          <option value="sent">Sent</option>
        </select>
      </div>
      <div style={{ padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((r) => {
          const s = statusStyle[r.status];
          return (
            <div
              key={r.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: s.bg,
                  color: s.color,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {r.statusLabel} • {r.meta}
                </div>
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'var(--primary-soft)',
                  color: 'var(--primary-dark)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                }}
              >
                ›
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileScreen({ onSignOut }) {
  const [lang, setLang] = useState('English');

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title="Profile" subtitle="User & language" />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            background: 'linear-gradient(145deg, var(--primary-mid), var(--primary-dark))',
            borderRadius: 18,
            padding: '24px 16px',
            textAlign: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#fff',
              color: 'var(--primary-dark)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 12px',
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            FU
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Field User 0123</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Authorized field personnel</div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Account</div>
          <Row label="Role" value="Field user" />
          <Row label="Organization" value="Local authority" />
          <Row label="Last login" value="Today 08:41" last />
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Application</div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Language</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option>English</option>
              <option>Français</option>
              <option>العربية</option>
            </select>
          </div>
          <Row label="Offline storage" value="284 MB" />
          <Row label="GPS permission" value="Allowed" />
          <Row label="Camera permission" value="Allowed" last />
        </div>

        <button type="button" className="btn btn-danger-soft btn-block" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}

export function TasksScreen() {
  const [tab, setTab] = useState('available');

  return (
    <div className="screen-body" style={{ overflow: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}>
      <ScreenHeader title="Task Management" subtitle="Field workforces" />
      <div className="seg-tabs">
        {['downloaded', 'available'].map((t) => (
          <button
            key={t}
            type="button"
            className={`seg-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'downloaded' ? 'Downloaded' : 'Available'}
          </button>
        ))}
      </div>
      <div style={{ padding: '12px 14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="toolbar-row">
          <input className="toolbar-input" placeholder="Search workforces..." />
          <button type="button" className="btn btn-primary toolbar-action">
            + New
          </button>
        </div>
        {tab === 'available' ? (
          tasks.map((t) => (
            <div key={t.id} className="card" style={{ borderColor: 'var(--primary-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Task ID {t.id}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    {t.user} · {t.date}
                  </div>
                </div>
                <button
                  type="button"
                  className="map-fab"
                  style={{ width: 36, height: 36, flexShrink: 0 }}
                  aria-label="Sync task"
                >
                  ↻
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 28 }}>
            No downloaded tasks yet
          </div>
        )}
      </div>
    </div>
  );
}

export function FormScreen({ onClose, onContinue }) {
  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title="Feature Form" subtitle="Transformer building type" />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
          <Tab active>Main Form</Tab>
          <Tab>Surge Arrester</Tab>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          <Tab active small>
            General Information
          </Tab>
          <Tab small>Other Information</Tab>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              background: 'var(--primary-dark)',
              color: '#fff',
              padding: '10px 14px',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            General Overview
          </div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field label="ID" value="982741942" />
            <Field label="Integration ID" value="" placeholder="—" />
            <Field label="Feature" value="KK" />
            <Field label="Transformer type" value="Concrete kiosk" />
            <Field label="Ownership" value="Private" />
            <Field label="Operating voltage" value="33000" />
            <Field label="Code" value="21TR-99954" />
            <Field label="Name" value="TR-99986" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={onContinue}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Tab({ children, active, small }) {
  return (
    <div
      style={{
        padding: small ? '8px 10px' : '10px 12px',
        fontWeight: 700,
        fontSize: small ? 12 : 13,
        color: active ? 'var(--primary-dark)' : 'var(--muted)',
        borderBottom: active ? '3px solid var(--primary-mid)' : '3px solid transparent',
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, value, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input defaultValue={value} placeholder={placeholder} />
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        fontSize: 14,
      }}
    >
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

const selectStyle = {
  minHeight: 44,
  borderRadius: 12,
  border: '1px solid var(--border)',
  padding: '0 10px',
  background: '#fff',
  fontSize: 13,
  fontWeight: 600,
};
