import { useState } from 'react';
import { ScreenHeader } from '../components/chrome';
import { LanguageSelect } from '../components/LanguageSelect';
import { initialRecords, tasks } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

const statusStyle = {
  ready: { bg: '#e8f2fb', icon: '◆', color: '#0b6bcb' },
  draft: { bg: '#eef2f6', icon: '✎', color: '#5a6b7d' },
  error: { bg: '#fdecea', icon: '!', color: '#c62828' },
  sent: { bg: '#e3f5ea', icon: '✓', color: '#1b7a45' },
};

const statusLabelKey = {
  ready: 'statusReady',
  draft: 'statusDraft',
  error: 'statusError',
  sent: 'statusSent',
};

const taskNameKey = {
  699: 'taskTransformer',
  698: 'taskAddress',
  697: 'taskLine',
};

export function RecordsScreen() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState('all');

  const list = initialRecords.filter((r) => {
    if (status !== 'all' && r.status !== status) return false;
    return true;
  });

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title={t('myRecords')} subtitle={t('recordsSub')} />
      <div
        style={{
          padding: '0 14px 12px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 8,
        }}
      >
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...selectStyle, width: '100%', minWidth: 0 }}
        >
          <option value="all">{t('allRecords')}</option>
          <option value="mine">{t('myDrafts')}</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ ...selectStyle, width: '100%', minWidth: 0 }}
        >
          <option value="all">{t('allStatuses')}</option>
          <option value="ready">{t('ready')}</option>
          <option value="draft">{t('draft')}</option>
          <option value="error">{t('error')}</option>
          <option value="sent">{t('sent')}</option>
        </select>
      </div>
      <div style={{ padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((r) => {
          const s = statusStyle[r.status];
          const title = r.title.replace(/^Address/, t('recordTitle'));
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
                  width: 34,
                  height: 34,
                  borderRadius: 10,
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
                <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {t(statusLabelKey[r.status])} • {r.meta}
                </div>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
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
  const { t } = useLanguage();

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title={t('profile')} subtitle={t('profileSub')} />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            background: 'linear-gradient(145deg, var(--primary-mid), var(--primary-dark))',
            borderRadius: 18,
            padding: '16px 12px',
            textAlign: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#fff',
              color: 'var(--primary-dark)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 8px',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            FU
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{t('fieldUser')}</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 3 }}>{t('authorizedPersonnel')}</div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{t('account')}</div>
          <Row label={t('role')} value={t('roleValue')} />
          <Row label={t('organization')} value={t('orgValue')} />
          <Row label={t('lastLogin')} value={t('lastLoginValue')} last />
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{t('application')}</div>
          <div style={{ marginBottom: 12 }}>
            <LanguageSelect />
          </div>
          <Row label={t('offlineStorage')} value="284 MB" />
          <Row label={t('gpsPermission')} value={t('allowed')} />
          <Row label={t('cameraPermission')} value={t('allowed')} last />
        </div>

        <button type="button" className="btn btn-danger-soft btn-block" onClick={onSignOut}>
          {t('signOut')}
        </button>
      </div>
    </div>
  );
}

export function TasksScreen() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('available');
  const [taskList, setTaskList] = useState(tasks);

  const removeTask = (id) => {
    setTaskList((list) => list.filter((item) => item.id !== id));
  };

  return (
    <div
      className="screen-body"
      style={{ overflow: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}
    >
      <ScreenHeader title={t('taskManagement')} subtitle={t('tasksSub')} />
      <div className="seg-tabs">
        {['downloaded', 'available'].map((tabId) => (
          <button
            key={tabId}
            type="button"
            className={`seg-tab ${tab === tabId ? 'active' : ''}`}
            onClick={() => setTab(tabId)}
          >
            {tabId === 'downloaded' ? t('downloaded') : t('available')}
          </button>
        ))}
      </div>
      <div style={{ padding: '12px 14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="toolbar-row">
          <input className="toolbar-input" placeholder={t('searchWorkforces')} />
          <button type="button" className="btn btn-primary toolbar-action">
            {t('newTask')}
          </button>
        </div>
        {tab === 'available' ? (
          taskList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 28 }}>
              {t('noAvailableTasks')}
            </div>
          ) : (
            taskList.map((item) => (
              <div key={item.id} className="card" style={{ borderColor: 'var(--primary-muted)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: 8,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {t('taskId')} {item.id}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>
                      {taskNameKey[item.id] ? t(taskNameKey[item.id]) : item.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                      {item.user} · {item.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      className="map-fab"
                      style={{ width: 28, height: 28 }}
                      aria-label={t('syncTask')}
                    >
                      ↻
                    </button>
                    <button
                      type="button"
                      className="task-delete-btn"
                      onClick={() => removeTask(item.id)}
                      aria-label={t('deleteTask')}
                      title={t('deleteTask')}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 28 }}>
            {t('noDownloadedTasks')}
          </div>
        )}
      </div>
    </div>
  );
}

export function FormScreen({ onClose, onContinue }) {
  const { t } = useLanguage();

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title={t('featureForm')} subtitle={t('formSub')} />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
          <Tab active>{t('mainForm')}</Tab>
          <Tab>{t('surgeArrester')}</Tab>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          <Tab active small>
            {t('generalInformation')}
          </Tab>
          <Tab small>{t('otherInformation')}</Tab>
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
            {t('generalOverview')}
          </div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field label="ID" value="982741942" />
            <Field label={t('integrationId')} value="" placeholder="—" />
            <Field label={t('feature')} value="KK" />
            <Field label={t('transformerType')} value={t('concreteKiosk')} />
            <Field label={t('ownership')} value={t('optPrivate')} />
            <Field label={t('operatingVoltage')} value="33000" />
            <Field label={t('code')} value="21TR-99954" />
            <Field label={t('name')} value="TR-99986" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('close')}
          </button>
          <button type="button" className="btn btn-primary" onClick={onContinue}>
            {t('save')}
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
  minHeight: 34,
  borderRadius: 10,
  border: '1px solid var(--border)',
  padding: '0 8px',
  background: '#fff',
  fontSize: 12,
  fontWeight: 600,
};
