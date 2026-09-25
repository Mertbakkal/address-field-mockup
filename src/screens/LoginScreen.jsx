import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelect } from '../components/LanguageSelect';

export default function LoginScreen({ onLogin }) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('field.user');
  const [password, setPassword] = useState('••••••••');
  const [showPass, setShowPass] = useState(false);
  const [offline, setOffline] = useState(true);

  return (
    <div className="login-screen">
      <div className="login-hero">
        <div className="login-logo" aria-hidden>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
              stroke="#fff"
              strokeWidth="1.6"
              fill="rgba(255,255,255,.12)"
            />
            <circle cx="12" cy="12" r="2.5" fill="#7ec8ff" />
          </svg>
        </div>
        <h1>{t('appName')}</h1>
        <p>{t('appTagline')}</p>
      </div>

      <div className="login-body">
        <div className="card login-card">
          <div className="field">
            <label>{t('username')}</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="field">
            <label>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={showPass ? 'password' : password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="login-eye"
                aria-label={t('togglePassword')}
              >
                ●
              </button>
            </div>
          </div>
          <LanguageSelect />
          <label className="login-check">
            <input
              type="checkbox"
              checked={offline}
              onChange={(e) => setOffline(e.target.checked)}
            />
            {t('keepSignedIn')}
          </label>
          <button type="button" className="btn btn-primary btn-block" onClick={onLogin}>
            {t('signIn')}
          </button>
          <button type="button" className="login-detection-btn" tabIndex={-1} aria-disabled="true">
            <svg className="login-detection-btn__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M7 3.5h7.2L19 8.3V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path d="M14 3.5V8h4.8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9 11h5.5M9 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="15.2" cy="16.8" r="2.4" stroke="currentColor" strokeWidth="1.7" />
              <path d="m17 18.6 1.6 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <span>{t('addressDetection')}</span>
          </button>
        </div>
        <p className="login-foot">{t('loginFoot')}</p>
      </div>
    </div>
  );
}
