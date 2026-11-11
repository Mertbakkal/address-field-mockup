import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  DEMO_EMAIL,
  DEMO_NIU,
  DEMO_OTP,
  DEMO_PASSWORD,
  EXPIRED_OTP,
  STATUS_KEY,
  buildInbox,
  formatStamp,
  matchesFilter,
  matchesQuery,
} from '../../citizen/portalStore';

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function Screen({ title, subtitle, onBack, onNotify, alertCount = 0, children, footer }) {
  const { t } = useLanguage();
  const actions = onNotify || onBack;
  return (
    <div className="screen-body">
      <header className="screen-header">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? (
          <div className="header-actions">
            {onNotify ? (
              <button type="button" className="bell-btn" onClick={onNotify} aria-label={t('notifBell')}>
                <BellIcon />
                {alertCount > 0 ? <span className="bell-badge">{alertCount}</span> : null}
              </button>
            ) : null}
            {onBack ? (
              <button type="button" className="btn btn-secondary" onClick={onBack}>
                {t('back')}
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
      <div className="citizen-scroll">{children}</div>
      {footer}
    </div>
  );
}

function noteText(t, app, note, lang) {
  const received = formatStamp(app.createdAt, lang);
  if (note.kind === 'submission') return t('notifSubmission', { ref: app.fileNumber });
  if (note.kind === 'approval') {
    const base = t('notifApproval', { ref: app.fileNumber, date: received.date, number: app.addressNumber || '—' });
    if (!app.previousAddressNumber) return base;
    return `${base} ${t('notifApprovalPrev', { prev: app.previousAddressNumber })}`;
  }
  if (note.kind === 'rejection') {
    return t('notifRejection', { ref: app.fileNumber, reason: t(app.rejectionReason || 'reasonOutside') });
  }
  return t('notifStatus', { ref: app.fileNumber, status: t(STATUS_KEY[note.status] || note.status) });
}

export function OtpScreen({ profile, onVerified, onExit }) {
  const { t } = useLanguage();
  const [channel, setChannel] = useState('sms');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const contact = channel === 'sms' ? phone.trim() : email.trim();

  const send = () => {
    if (!contact) {
      setError(t('otpNeedContact'));
      setSent(false);
      return;
    }
    setError('');
    setCode('');
    setSent(true);
  };

  const check = () => {
    if (code.trim() === EXPIRED_OTP) {
      setError(t('otpExpired'));
      return;
    }
    if (code.trim() !== DEMO_OTP) {
      setError(t('otpWrong'));
      return;
    }
    onVerified({ channel, phone: phone.trim(), email: email.trim() });
  };

  return (
    <Screen title={t('otpTitle')} subtitle={t('otpLead')} onBack={onExit}>
      <div className="citizen-stack">
        <div className="channel-row">
          <button
            type="button"
            className={`channel-btn ${channel === 'sms' ? 'on' : ''}`}
            onClick={() => {
              setChannel('sms');
              setSent(false);
              setError('');
            }}
          >
            {t('otpSms')}
          </button>
          <button
            type="button"
            className={`channel-btn ${channel === 'email' ? 'on' : ''}`}
            onClick={() => {
              setChannel('email');
              setSent(false);
              setError('');
            }}
          >
            {t('otpEmail')}
          </button>
        </div>
        <div className="field">
          <label>{channel === 'sms' ? t('otpPhone') : t('otpEmailAddress')}</label>
          <input
            value={channel === 'sms' ? phone : email}
            onChange={(e) => (channel === 'sms' ? setPhone(e.target.value) : setEmail(e.target.value))}
          />
        </div>
        <button type="button" className="btn btn-secondary btn-block" onClick={send}>
          {sent ? t('otpResend') : t('otpSend')}
        </button>
        {sent ? (
          <p className="hint">{t('otpSent', { channel: channel === 'sms' ? t('otpSms') : t('otpEmail') })}</p>
        ) : null}
        <div className="field">
          <label>{t('otpCode')}</label>
          <input inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <p className="hint">{t('otpDemo')}</p>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="button" className="btn btn-primary btn-block" onClick={check}>
          {t('otpContinue')}
        </button>
      </div>
    </Screen>
  );
}

export function CitizenLoginScreen({ onSuccess, onBack }) {
  const { t } = useLanguage();
  const [niu, setNiu] = useState(DEMO_NIU);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState('');

  const withNiu = () => {
    if (niu.trim() === DEMO_NIU) onSuccess({ method: 'niu', niu: niu.trim() });
    else setError(t('loginError'));
  };

  const withEmail = () => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      onSuccess({ method: 'email', email: email.trim() });
    } else setError(t('loginError'));
  };

  return (
    <Screen title={t('citizenLoginTitle')} onBack={onBack}>
      <div className="citizen-stack">
        <div className="field">
          <label>{t('niu')}</label>
          <input value={niu} onChange={(e) => setNiu(e.target.value)} />
          <p className="hint">{t('niuHint')}</p>
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={withNiu}>
          {t('citizenSignIn')}
        </button>
        <p className="hint">{t('demoNiu')}</p>
        <div className="or-split">
          <span>{t('citizenOr')}</span>
        </div>
        <div className="field">
          <label>{t('emailShort')}</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>{t('password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={withEmail}>
          {t('emailPassword')}
        </button>
        <p className="hint">{t('demoAccount')}</p>
        {error ? <p className="form-error">{error}</p> : null}
      </div>
    </Screen>
  );
}

export function PermissionsScreen({ locationStatus, camera, onLocation, onCamera, onContinue }) {
  const { t } = useLanguage();
  const label = (status) => {
    if (status === 'granted') return t('permGranted');
    if (status === 'denied') return t('permDenied');
    return t('permIdle');
  };

  return (
    <Screen title={t('permTitle')} subtitle={t('permLead')}>
      <div className="citizen-stack">
        <div className="card">
          <strong>{t('permAskLocation')}</strong>
          <p className="hint">{label(locationStatus)}</p>
          <button type="button" className="btn btn-secondary btn-block" onClick={onLocation}>
            {t('permAskLocation')}
          </button>
          {locationStatus === 'denied' ? <p className="form-error">{t('permLocationWhy')}</p> : null}
        </div>
        <div className="card">
          <strong>{t('permAskCamera')}</strong>
          <p className="hint">{label(camera)}</p>
          <button type="button" className="btn btn-secondary btn-block" onClick={onCamera}>
            {t('permAskCamera')}
          </button>
          {camera === 'denied' ? <p className="form-error">{t('permCameraWhy')}</p> : null}
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={onContinue}>
          {t('permContinue')}
        </button>
      </div>
    </Screen>
  );
}

function StatusChip({ status }) {
  const { t } = useLanguage();
  if (!status) return null;
  return <span className={`status-chip status-${status}`}>{t(STATUS_KEY[status] || status)}</span>;
}

export function CitizenHome({ applications, onNew, onOpenDraft, onOpenApp, onNotify, alertCount = 0 }) {
  const { t, lang } = useLanguage();
  const drafts = applications.filter((item) => item.draft);
  const submitted = applications.filter((item) => !item.draft && !item.archived);

  return (
    <Screen title={t('citizenHome')} onNotify={onNotify} alertCount={alertCount}>
      <div className="citizen-stack">
        <button type="button" className="btn btn-primary btn-block" onClick={onNew}>
          {t('citizenNew')}
        </button>
        <h2 className="section-label">{t('draftsTitle')}</h2>
        {drafts.length === 0 ? <p className="hint">{t('noDrafts')}</p> : null}
        {drafts.map((item) => (
          <button key={item.id} type="button" className="app-card" onClick={() => onOpenDraft(item)}>
            <strong>{lang === 'ar' ? item.descriptionAr || t('draftsTitle') : item.description || t('draftsTitle')}</strong>
            <Initiated at={item.createdAt} />
            <span className="btn btn-secondary">{t('continueDraft')}</span>
          </button>
        ))}
        <h2 className="section-label">{t('submittedTitle')}</h2>
        {submitted.length === 0 ? <p className="hint">{t('noSubmitted')}</p> : null}
        {submitted.map((item) => (
          <button key={item.id} type="button" className="app-card" onClick={() => onOpenApp(item)}>
            <strong>{item.fileNumber}</strong>
            <span>{lang === 'ar' ? item.descriptionAr : item.description}</span>
            <StatusChip status={item.status} />
            <Initiated at={item.createdAt} />
          </button>
        ))}
      </div>
    </Screen>
  );
}

export function CitizenProfile({ profile, onSave, onExit, onNotify, alertCount = 0 }) {
  const { t, lang, setLang } = useLanguage();
  const [form, setForm] = useState(profile);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <Screen title={t('citizenProfile')} onNotify={onNotify} alertCount={alertCount}>
      <div className="citizen-stack">
        <h2 className="section-label">{t('editProfile')}</h2>
        <div className="field">
          <label>{t('firstName')}</label>
          <input value={form.firstName} onChange={set('firstName')} />
        </div>
        <div className="field">
          <label>{t('lastName')}</label>
          <input value={form.lastName} onChange={set('lastName')} />
        </div>
        <div className="field">
          <label>{t('phoneShort')}</label>
          <input value={form.phone} onChange={set('phone')} />
        </div>
        <div className="field">
          <label>{t('emailShort')}</label>
          <input value={form.email} onChange={set('email')} />
        </div>
        <div className="field">
          <label>{t('niu')}</label>
          <input value={form.niu} onChange={set('niu')} />
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={() => onSave(form)}>
          {t('save')}
        </button>
        <div className="field">
          <label>{t('citizenLanguage')}</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <button type="button" className="btn btn-secondary btn-block" onClick={onExit}>
          {t('citizenExit')}
        </button>
      </div>
    </Screen>
  );
}

function Initiated({ at }) {
  const { t, lang } = useLanguage();
  const stamp = formatStamp(at, lang);
  return <span className="hint">{t('initiated', stamp)}</span>;
}

export function TrackingScreen({ applications, onOpen, onArchive, onNotify, alertCount = 0 }) {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const filters = [
    ['all', 'filterAll'],
    ['ongoing', 'filterOngoing'],
    ['done', 'filterDone'],
    ['archived', 'filterArchived'],
  ];
  const list = applications.filter((item) => matchesFilter(item, filter) && matchesQuery(item, query));

  return (
    <Screen title={t('trackTitle')} onNotify={onNotify} alertCount={alertCount}>
      <div className="citizen-stack">
        <div className="field">
          <input
            value={query}
            placeholder={t('searchPlaceholder')}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-row">
          {filters.map(([id, key]) => (
            <button key={id} type="button" className={`filter-btn ${filter === id ? 'on' : ''}`} onClick={() => setFilter(id)}>
              {t(key)}
            </button>
          ))}
        </div>
        {list.length === 0 ? <p className="hint">{t('noMatch')}</p> : null}
        {list.map((item) => (
          <div key={item.id} className="app-card">
            <button type="button" className="app-card__open" onClick={() => onOpen(item)}>
              <strong>{item.fileNumber}</strong>
              <span>{lang === 'ar' ? item.descriptionAr : item.description}</span>
              <StatusChip status={item.status} />
              <Initiated at={item.createdAt} />
            </button>
            {!item.archived ? (
              <button type="button" className="btn btn-secondary" onClick={() => onArchive(item.id)}>
                {t('archive')}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </Screen>
  );
}

function QrMark({ value, onClick, label }) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 33 + value.charCodeAt(i)) >>> 0;
  const cells = Array.from({ length: 49 }, (_, i) => ((hash >> (i % 24)) ^ i * 7) & 1);
  return (
    <button type="button" className="qr-btn" onClick={onClick} aria-label={label}>
      <svg viewBox="0 0 7 7" width="88" height="88" aria-hidden>
        {cells.map((on, i) =>
          on ? <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="0.9" height="0.9" fill="#0f2744" /> : null,
        )}
      </svg>
    </button>
  );
}

export function TrackingDetail({ app, onBack, onDownload, onVerify }) {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState('notifications');

  return (
    <Screen title={app.fileNumber} subtitle={lang === 'ar' ? app.descriptionAr : app.description} onBack={onBack}>
      <div className="citizen-stack">
        <StatusChip status={app.status} />
        <Initiated at={app.createdAt} />
        <div className="filter-row">
          <button
            type="button"
            className={`filter-btn ${tab === 'notifications' ? 'on' : ''}`}
            onClick={() => setTab('notifications')}
          >
            {t('tabNotifications')}
          </button>
          <button type="button" className={`filter-btn ${tab === 'payment' ? 'on' : ''}`} onClick={() => setTab('payment')}>
            {t('tabPayment')}
          </button>
        </div>
        {tab === 'payment' ? <p className="card">{t('paymentNone')}</p> : null}
        {tab === 'notifications'
          ? app.notifications.map((item) => (
              <p key={item.id} className="card">
                {noteText(t, app, item, lang)}
              </p>
            ))
          : null}
        {app.status === 'certificateAvailable' ? (
          <div className="card citizen-stack">
            <QrMark value={app.fileNumber} onClick={onVerify} label={t('verifyScan')} />
            <button type="button" className="btn btn-secondary btn-block" onClick={onVerify}>
              {t('verifyScan')}
            </button>
            <button type="button" className="btn btn-primary btn-block" onClick={onDownload}>
              {t('downloadCertificate')}
            </button>
          </div>
        ) : null}
      </div>
    </Screen>
  );
}

export function NotificationInbox({ applications, onBack, onOpen, onDownload }) {
  const { t, lang } = useLanguage();
  const { highlights, rest } = buildInbox(applications);
  const approval = highlights.filter((item) => item.kind === 'approval');
  const ready = highlights.filter((item) => item.kind === 'pdf');

  return (
    <Screen title={t('inboxTitle')} onBack={onBack}>
      <div className="citizen-stack">
        {approval.map((item) => (
          <button key={item.id} type="button" className="app-card" onClick={() => onOpen(item.app)}>
            <strong>{t('approvalArrived')}</strong>
            <span>{noteText(t, item.app, item.note, lang)}</span>
          </button>
        ))}
        {ready.map((item) => (
          <div key={item.id} className="app-card">
            <strong>{t('pdfReadyTitle')}</strong>
            <span>{t('pdfReadyBody', { ref: item.app.fileNumber })}</span>
            <span>{item.app.addressNumber}</span>
            <button type="button" className="btn btn-primary btn-block" onClick={() => onDownload(item.app)}>
              {t('downloadCertificate')}
            </button>
          </div>
        ))}
        {rest.map((item) => (
          <button key={item.id} type="button" className="app-card" onClick={() => onOpen(item.app)}>
            <strong>{item.app.fileNumber}</strong>
            <span>{noteText(t, item.app, item.note, lang)}</span>
          </button>
        ))}
        {highlights.length + rest.length === 0 ? <p className="hint">{t('noNotifications')}</p> : null}
      </div>
    </Screen>
  );
}

export function VerifyScreen({ app, onBack }) {
  const { t } = useLanguage();
  const address = [app.door, app.road, app.commune].filter(Boolean).join(', ');
  return (
    <Screen title={t('verifyTitle')} onBack={onBack}>
      <div className="citizen-stack">
        <p className="card status-chip status-approved">{t('verifyValid')}</p>
        <p className="card">
          <strong>{app.fileNumber}</strong>
          <br />
          {app.firstName} {app.lastName}
          <br />
          {address}
        </p>
      </div>
    </Screen>
  );
}

export function CitizenNav({ active, onChange }) {
  const { t } = useLanguage();
  const items = [
    ['home', 'citizenHome'],
    ['tracking', 'citizenTrack'],
    ['profile', 'citizenProfile'],
  ];
  return (
    <nav className="citizen-nav">
      {items.map(([id, key]) => (
        <button key={id} type="button" className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onChange(id)}>
          {t(key)}
        </button>
      ))}
    </nav>
  );
}
