import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  alertCount,
  archiveApplication,
  downloadCertificate,
  emptyDraft,
  loadState,
  saveState,
  submitDraft,
  upsertDraft,
} from './portalStore';
import { ApplicationWizard } from '../screens/citizen/ApplicationWizard';
import {
  CitizenHome,
  CitizenLoginScreen,
  CitizenNav,
  CitizenProfile,
  NotificationInbox,
  OtpScreen,
  PermissionsScreen,
  TrackingDetail,
  TrackingScreen,
  VerifyScreen,
} from '../screens/citizen/CitizenScreens';

export default function CitizenPortal({ onExit }) {
  const { lang, t } = useLanguage();
  const [state, setState] = useState(loadState);
  const [screen, setScreen] = useState('otp');
  const [draft, setDraft] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [returnTo, setReturnTo] = useState('tracking');
  const [inboxFrom, setInboxFrom] = useState('home');
  const [toast, setToast] = useState('');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2400);
  };

  const askLocation = (apply) => {
    if (!navigator.geolocation) {
      setState((current) => ({ ...current, locationStatus: 'denied' }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setState((current) => ({ ...current, locationStatus: 'granted', location: coords }));
        apply?.(coords);
      },
      () => setState((current) => ({ ...current, locationStatus: 'denied' })),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const askCamera = () => {
    const media = navigator.mediaDevices;
    if (!media?.getUserMedia) {
      setState((current) => ({ ...current, camera: 'denied' }));
      return;
    }
    media
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setState((current) => ({ ...current, camera: 'granted' }));
      })
      .catch(() => setState((current) => ({ ...current, camera: 'denied' })));
  };

  const openDraft = (item) => {
    setDraft(item.coords ? item : { ...item, coords: state.location });
    setScreen('wizard');
  };

  const openApp = (item, from = 'tracking') => {
    setOpenId(item.id);
    setReturnTo(from);
    setScreen('detail');
  };

  const openInbox = () => {
    setInboxFrom(screen);
    setScreen('inbox');
  };

  const opened = state.applications.find((item) => item.id === openId) || null;
  const alerts = alertCount(state.applications);
  const showNav = screen === 'home' || screen === 'tracking' || screen === 'profile';

  let body = null;
  if (screen === 'otp') {
    body = (
      <OtpScreen
        profile={state.profile}
        onExit={onExit}
        onVerified={({ phone, email }) => {
          setState((current) => ({
            ...current,
            profile: {
              ...current.profile,
              phone: phone || current.profile.phone,
              email: email || current.profile.email,
            },
          }));
          setScreen('login');
        }}
      />
    );
  } else if (screen === 'login') {
    body = <CitizenLoginScreen onBack={() => setScreen('otp')} onSuccess={() => setScreen('perms')} />;
  } else if (screen === 'perms') {
    body = (
      <PermissionsScreen
        locationStatus={state.locationStatus}
        camera={state.camera}
        onLocation={() => askLocation()}
        onCamera={askCamera}
        onContinue={() => setScreen('home')}
      />
    );
  } else if (screen === 'home') {
    body = (
      <CitizenHome
        applications={state.applications}
        onNew={() => openDraft(emptyDraft(state.profile))}
        onOpenDraft={openDraft}
        onOpenApp={openApp}
        onNotify={openInbox}
        alertCount={alerts}
      />
    );
  } else if (screen === 'wizard' && draft) {
    body = (
      <ApplicationWizard
        draft={draft}
        onChange={setDraft}
        onClose={() => setScreen('home')}
        onSaveDraft={() => {
          setState(upsertDraft(state, draft));
          showToast(t('draftSaved'));
          setScreen('home');
        }}
        onSubmit={() => {
          const result = submitDraft(state, draft);
          setState(result.state);
          setOpenId(result.submitted.id);
          setReturnTo('home');
          showToast(t('submittedToast', { ref: result.submitted.fileNumber }));
          setScreen('detail');
        }}
      />
    );
  } else if (screen === 'tracking') {
    body = (
      <TrackingScreen
        applications={state.applications}
        onOpen={openApp}
        onArchive={(id) => setState((current) => archiveApplication(current, id))}
        onNotify={openInbox}
        alertCount={alerts}
      />
    );
  } else if (screen === 'detail' && opened) {
    body = (
      <TrackingDetail
        app={opened}
        onBack={() => setScreen(returnTo)}
        onDownload={() => downloadCertificate(opened)}
        onVerify={() => setScreen('verify')}
      />
    );
  } else if (screen === 'inbox') {
    body = (
      <NotificationInbox
        applications={state.applications}
        onBack={() => setScreen(inboxFrom)}
        onOpen={(item) => openApp(item, 'inbox')}
        onDownload={downloadCertificate}
      />
    );
  } else if (screen === 'verify' && opened) {
    body = <VerifyScreen app={opened} onBack={() => setScreen('detail')} />;
  } else if (screen === 'profile') {
    body = (
      <CitizenProfile
        profile={state.profile}
        onExit={onExit}
        onNotify={openInbox}
        alertCount={alerts}
        onSave={(profile) => {
          setState((current) => ({ ...current, profile }));
          showToast(t('profileSaved'));
        }}
      />
    );
  }

  return (
    <div className="citizen-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {body}
      {showNav ? (
        <CitizenNav
          active={screen === 'tracking' ? 'tracking' : screen}
          onChange={(id) => setScreen(id === 'tracking' ? 'tracking' : id)}
        />
      ) : null}
      {toast ? <div className="citizen-toast">{toast}</div> : null}
    </div>
  );
}
