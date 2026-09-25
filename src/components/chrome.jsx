import { useLanguage } from '../i18n/LanguageContext';

export function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-bar__left">9:41</span>
      <span className="status-bar__center" aria-hidden />
      <span className="status-bar__right">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
          <rect x="0" y="7" width="3" height="5" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
          <path d="M8 3.6c1.8 0 3.4.7 4.6 1.9l-1.2 1.2A4.7 4.7 0 0 0 8 5.4c-1.3 0-2.5.5-3.4 1.3L3.4 5.5A6.5 6.5 0 0 1 8 3.6Zm0 3.2c.9 0 1.7.3 2.3 1l-1.2 1.2a1.9 1.9 0 0 0-2.2 0L5.7 7.8A3.3 3.3 0 0 1 8 6.8ZM8 11.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <path d="M24 4.5v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

export function BottomNav({ active, onChange }) {
  const { t } = useLanguage();
  const items = [
    { id: 'map', label: t('navMap'), icon: IconMap },
    { id: 'records', label: t('navRecords'), icon: IconList },
    { id: 'tasks', label: t('navTasks'), icon: IconSync },
    { id: 'profile', label: t('navProfile'), icon: IconUser },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <Icon />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function ScreenHeader({ title, subtitle, onDot }) {
  const { t } = useLanguage();
  return (
    <header className="screen-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <button type="button" className="header-dot-btn" onClick={onDot} aria-label={t('quickMenu')}>
        <span />
      </button>
    </header>
  );
}

export function Stepper({ step }) {
  return (
    <div className="stepper">
      {[1, 2, 3].map((n, i) => (
        <div key={n} style={{ display: 'contents' }}>
          {i > 0 && <div className={`step-line ${step > i ? 'done' : ''}`} />}
          <div className={`step-node ${step >= n ? (step === n ? 'active' : 'done') : ''}`}>{n}</div>
        </div>
      ))}
    </div>
  );
}

function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function IconSync() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 0 0-15.5-6.4M3 4v5h5" />
      <path d="M3 12a9 9 0 0 0 15.5 6.4M21 20v-5h-5" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
