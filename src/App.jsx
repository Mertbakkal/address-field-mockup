import { useState } from 'react';
import { StatusBar, BottomNav } from './components/chrome';
import PhoneFrame from './components/PhoneFrame';
import LoginScreen from './screens/LoginScreen';
import MainMapScreen from './screens/MainMapScreen';
import {
  BuildingInfoScreen,
  AddressInfoScreen,
  PhotoScreen,
} from './screens/AddressFlowScreens';
import { RecordsScreen, ProfileScreen, TasksScreen, FormScreen } from './screens/OtherScreens';
import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('map');
  const [flow, setFlow] = useState(null);
  const [coords, setCoords] = useState([18.086, -15.9785]);
  const [buildingData, setBuildingData] = useState(null);
  const [layers, setLayers] = useState({
    addressPoints: true,
    fieldZone: true,
    osm: true,
    integrations: false,
    training: false,
    reference: false,
    electricity: true,
    address: true,
  });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const goTab = (id) => {
    setFlow(null);
    setTab(id);
  };

  const startAddress = (pt) => {
    setCoords(pt);
    setFlow('building');
    setTab('map');
  };

  const finishReview = () => {
    setFlow(null);
    setTab('records');
    showToast(t('addressSaved'));
  };

  let content = null;
  if (!authed) {
    content = <LoginScreen onLogin={() => setAuthed(true)} />;
  } else if (flow === 'building') {
    content = (
      <BuildingInfoScreen
        coords={coords}
        onCancel={() => setFlow(null)}
        onNext={(data) => {
          setBuildingData(data);
          setFlow('address');
        }}
      />
    );
  } else if (flow === 'address') {
    content = (
      <AddressInfoScreen
        building={buildingData}
        coords={coords}
        onBack={() => setFlow('building')}
        onNext={() => setFlow('photo')}
      />
    );
  } else if (flow === 'photo') {
    content = <PhotoScreen onBack={() => setFlow('address')} onReview={finishReview} />;
  } else if (flow === 'form') {
    content = (
      <FormScreen
        onClose={() => setFlow(null)}
        onContinue={() => {
          setFlow(null);
          showToast(t('formSaved'));
        }}
      />
    );
  } else if (tab === 'map') {
    content = (
      <MainMapScreen
        layers={layers}
        setLayers={setLayers}
        onStartAddress={startAddress}
        onOpenForm={() => setFlow('form')}
        onOpenTasks={() => setTab('tasks')}
      />
    );
  } else if (tab === 'records') {
    content = <RecordsScreen />;
  } else if (tab === 'tasks') {
    content = <TasksScreen />;
  } else if (tab === 'profile') {
    content = (
      <ProfileScreen
        onSignOut={() => {
          setAuthed(false);
          setTab('map');
          setFlow(null);
        }}
      />
    );
  }

  const navActive = flow ? 'map' : tab;

  return (
    <PhoneFrame>
      <StatusBar />
      {content}
      {authed && <BottomNav active={navActive} onChange={goTab} />}
      {toast && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 96,
            zIndex: 80,
            background: 'var(--primary-dark)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            textAlign: 'center',
            boxShadow: 'var(--shadow)',
          }}
        >
          {toast}
        </div>
      )}
    </PhoneFrame>
  );
}
