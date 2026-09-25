import { useState } from 'react';
import { ScreenHeader, Stepper } from '../components/chrome';
import { useLanguage } from '../i18n/LanguageContext';

export function BuildingInfoScreen({ coords, onCancel, onNext }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    buildingType: 'residential_building',
    occupation: 'residential',
    ownership: 'private',
    electricity: 'yes',
    water: 'yes',
    internet: 'unknown',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const buildingOpts = [
    { value: 'residential_building', label: t('optResidentialBuilding') },
    { value: 'commercial', label: t('optCommercial') },
    { value: 'mixed_use', label: t('optMixedUse') },
    { value: 'public', label: t('optPublic') },
  ];
  const occupationOpts = [
    { value: 'residential', label: t('optResidential') },
    { value: 'commercial', label: t('optCommercial') },
    { value: 'industrial', label: t('optIndustrial') },
    { value: 'vacant', label: t('optVacant') },
  ];
  const ownershipOpts = [
    { value: 'private', label: t('optPrivate') },
    { value: 'public', label: t('optPublic') },
    { value: 'communal', label: t('optCommunal') },
  ];
  const ynOpts = [
    { value: 'yes', label: t('optYes') },
    { value: 'no', label: t('optNo') },
    { value: 'unknown', label: t('optUnknown') },
  ];

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title={t('buildingInfo')} subtitle={t('stepOf', { n: 1 })} />
      <Stepper step={1} />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            background: 'var(--primary-soft)',
            borderRadius: 14,
            padding: '12px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--primary-dark)',
          }}
        >
          {t('gpsCaptured', {
            coords: `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`,
          })}
        </div>
        <SelectField
          label={t('buildingType')}
          required
          value={form.buildingType}
          onChange={set('buildingType')}
          options={buildingOpts}
        />
        <SelectField
          label={t('occupationType')}
          required
          value={form.occupation}
          onChange={set('occupation')}
          options={occupationOpts}
        />
        <SelectField
          label={t('ownership')}
          required
          value={form.ownership}
          onChange={set('ownership')}
          options={ownershipOpts}
        />
        <SelectField
          label={t('electricityConnection')}
          value={form.electricity}
          onChange={set('electricity')}
          options={ynOpts}
        />
        <SelectField
          label={t('waterConnection')}
          value={form.water}
          onChange={set('water')}
          options={ynOpts}
        />
        <SelectField
          label={t('internetConnection')}
          value={form.internet}
          onChange={set('internet')}
          options={ynOpts}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {t('cancel')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onNext(form)}>
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddressInfoScreen({ building, coords, onBack, onNext }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    digital: 'NO31-A42 102987',
    postal: 'NO31-A42',
    physicalExists: true,
    physical: t('physicalDefault'),
    name: t('buildingNameDefault'),
    gps: `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`,
  });

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title={t('addressInfo')} subtitle={t('stepOf', { n: 2 })} />
      <Stepper step={2} />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="field">
          <label>{t('digitalAddress')}</label>
          <input value={form.digital} onChange={(e) => setForm({ ...form, digital: e.target.value })} />
        </div>
        <div className="field">
          <label>{t('postalCode')}</label>
          <input value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={form.physicalExists}
            onChange={(e) => setForm({ ...form, physicalExists: e.target.checked })}
            style={{ accentColor: 'var(--primary-mid)', width: 18, height: 18 }}
          />
          {t('physicalExists')}
        </label>
        <div className="field">
          <label>{t('physicalAddress')}</label>
          <textarea value={form.physical} onChange={(e) => setForm({ ...form, physical: e.target.value })} />
        </div>
        <div className="field">
          <label>{t('addressName')}</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>{t('gpsCoordinates')}</label>
          <input value={form.gps} onChange={(e) => setForm({ ...form, gps: e.target.value })} />
        </div>
        <button type="button" className="btn btn-secondary btn-block">
          {t('checkOnMap')}
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            {t('back')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onNext({ building, ...form })}>
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PhotoScreen({ onBack, onReview }) {
  const { t } = useLanguage();
  const [hasPhoto, setHasPhoto] = useState(true);

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title={t('photo')} subtitle={t('stepOf', { n: 3 })} />
      <Stepper step={3} />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {hasPhoto ? (
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 180 }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(180deg,#7eb6e8 0%,#c4a882 45%,#8b6b4a 100%)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 12,
                bottom: 12,
                background: 'rgba(15,39,68,.75)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '5px 10px',
                borderRadius: 8,
              }}
            >
              {t('addressPhoto')}
            </span>
          </div>
        ) : (
          <div
            style={{
              height: 180,
              borderRadius: 16,
              border: '2px dashed var(--border)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--muted)',
            }}
          >
            {t('noPhoto')}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={() => setHasPhoto(true)}>
            {t('retake')}
          </button>
          <button type="button" className="btn btn-danger-soft" onClick={() => setHasPhoto(false)}>
            {t('remove')}
          </button>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{t('additionalPhoto')}</div>
          <button
            type="button"
            style={{
              width: '100%',
              minHeight: 100,
              borderRadius: 16,
              border: '2px dashed var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: 'var(--primary-dark)',
              background: '#fff',
            }}
          >
            <span style={{ fontSize: 28, color: 'var(--primary-mid)', fontWeight: 700 }}>+</span>
            <span style={{ fontWeight: 600 }}>{t('openCamera')}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t('optional')}</span>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            {t('back')}
          </button>
          <button type="button" className="btn btn-primary" onClick={onReview}>
            {t('review')}
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, required, value, onChange, options }) {
  return (
    <div className="field">
      <label>
        {label}
        {required ? <span className="req">*</span> : null}
      </label>
      <select value={value} onChange={onChange}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
