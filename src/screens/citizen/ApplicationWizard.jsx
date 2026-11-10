import { useRef, useState } from 'react';
import { Stepper } from '../../components/chrome';
import { useLanguage } from '../../i18n/LanguageContext';

const STEP_KEYS = ['stepPersonal', 'stepPosition', 'stepBuilding', 'stepExtra', 'stepSummary'];

function show(value, empty) {
  return value ? value : empty;
}

export function ApplicationWizard({ draft, onChange, onSaveDraft, onSubmit, onClose, onLocate }) {
  const { t } = useLanguage();
  const [billError, setBillError] = useState('');
  const photoRef = useRef(null);
  const billRef = useRef(null);
  const phase = draft.phase || 'type';
  const step = draft.step || 1;
  const located = Boolean(draft.coords);

  const patch = (partial) => onChange({ ...draft, ...partial });

  const onBill = (file) => {
    if (!file) return;
    const ok = file.type.startsWith('image/') || file.type === 'application/pdf' || /\.(png|jpe?g|webp|gif|pdf)$/i.test(file.name);
    if (!ok) {
      setBillError(t('billError'));
      return;
    }
    setBillError('');
    patch({ billName: file.name });
  };

  const back = () => {
    if (phase === 'form' && step > 1) patch({ step: step - 1 });
    else if (phase === 'form' && draft.type === 'certificate') patch({ phase: 'bill' });
    else if (phase === 'form') patch({ phase: 'eligibility' });
    else if (phase === 'bill') patch({ phase: 'eligibility' });
    else if (phase === 'eligibility') patch({ phase: 'type' });
    else onClose();
  };

  const title =
    phase === 'type'
      ? t('appTypeTitle')
      : phase === 'eligibility'
        ? t('eligibilityTitle')
        : phase === 'bill'
          ? t('billTitle')
          : t(STEP_KEYS[step - 1]);

  return (
    <div className="screen-body">
      <header className="screen-header">
        <div>
          <h1>{title}</h1>
        </div>
        <button type="button" className="btn btn-secondary" onClick={back}>
          {t('back')}
        </button>
      </header>
      {phase === 'form' ? <Stepper step={step} total={5} /> : null}
      <div className="citizen-scroll">
        {phase === 'type' ? (
          <div className="citizen-stack">
            <button type="button" className="btn btn-primary btn-block" onClick={() => patch({ type: 'address', phase: 'eligibility' })}>
              {t('typeAddress')}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => patch({ type: 'certificate', phase: 'eligibility' })}
            >
              {t('typeCertificate')}
            </button>
          </div>
        ) : null}

        {phase === 'eligibility' ? (
          <div className="citizen-stack">
            <ul className="elig-list">
              <li>{t('eligOwner')}</li>
              <li>{t('eligCommune')}</li>
              <li>{t('eligMobile')}</li>
              <li>{t('eligPhoto')}</li>
            </ul>
            <label className="check-line">
              <input
                type="checkbox"
                checked={Boolean(draft.eligibilityAccepted)}
                onChange={(e) => patch({ eligibilityAccepted: e.target.checked })}
              />
              {t('eligAccept')}
            </label>
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={!draft.eligibilityAccepted}
              onClick={() => patch({ phase: draft.type === 'certificate' ? 'bill' : 'form', step: 1 })}
            >
              {t('eligContinue')}
            </button>
          </div>
        ) : null}

        {phase === 'bill' ? (
          <div className="citizen-stack">
            <div className="channel-row">
              <button
                type="button"
                className={`channel-btn ${draft.billKind === 'water' ? 'on' : ''}`}
                onClick={() => patch({ billKind: 'water' })}
              >
                {t('billWater')}
              </button>
              <button
                type="button"
                className={`channel-btn ${draft.billKind === 'electricity' ? 'on' : ''}`}
                onClick={() => patch({ billKind: 'electricity' })}
              >
                {t('billElectricity')}
              </button>
            </div>
            <input
              ref={billRef}
              type="file"
              accept="image/*,application/pdf"
              hidden
              onChange={(e) => onBill(e.target.files?.[0])}
            />
            <button type="button" className="btn btn-secondary btn-block" onClick={() => billRef.current?.click()}>
              {t('billUpload')}
            </button>
            {draft.billName ? <p className="hint">{t('billReady', { name: draft.billName })}</p> : null}
            {billError ? <p className="form-error">{billError}</p> : null}
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={!draft.billName}
              onClick={() => patch({ phase: 'form', step: 1 })}
            >
              {t('next')}
            </button>
          </div>
        ) : null}

        {phase === 'form' && step === 1 ? (
          <div className="citizen-stack">
            <Field label={t('firstName')} value={draft.firstName} onChange={(v) => patch({ firstName: v })} />
            <Field label={t('lastName')} value={draft.lastName} onChange={(v) => patch({ lastName: v })} />
            <Field label={t('phoneShort')} value={draft.phone} onChange={(v) => patch({ phone: v })} />
            <Field label={t('emailShort')} value={draft.email} onChange={(v) => patch({ email: v })} />
            <Field label={t('niu')} value={draft.niu} onChange={(v) => patch({ niu: v })} />
            <Field label={t('digitalId')} value={draft.digitalId} onChange={(v) => patch({ digitalId: v })} />
          </div>
        ) : null}

        {phase === 'form' && step === 2 ? (
          <div className="citizen-stack">
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={() => onLocate((coords) => patch({ coords }))}
            >
              {t('locateMe')}
            </button>
            {located ? (
              <p className="hint">
                {t('locationOk')}: {draft.coords.lat.toFixed(5)}, {draft.coords.lng.toFixed(5)}
              </p>
            ) : (
              <p className="form-error">{t('locationMissing')}</p>
            )}
          </div>
        ) : null}

        {phase === 'form' && step === 3 ? (
          <div className="citizen-stack">
            <Field label={t('doorNumber')} value={draft.door} onChange={(v) => patch({ door: v })} />
            <Field label={t('roadName')} value={draft.road} onChange={(v) => patch({ road: v })} />
            <Field label={t('commune')} value={draft.commune} onChange={(v) => patch({ commune: v })} />
            <div className="field">
              <label>{t('doorPhoto')}</label>
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                disabled={!located}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) patch({ photoName: file.name });
                }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-block"
                disabled={!located}
                onClick={() => photoRef.current?.click()}
              >
                {t('takePhoto')}
              </button>
              {draft.photoName ? <p className="hint">{draft.photoName}</p> : null}
              {!located ? <p className="form-error">{t('photoLocked')}</p> : null}
            </div>
            <div className="field">
              <label>{t('plaque')}</label>
              <div className="channel-row">
                <button type="button" className={`channel-btn ${draft.plaque === 'yes' ? 'on' : ''}`} onClick={() => patch({ plaque: 'yes' })}>
                  {t('plaqueYes')}
                </button>
                <button type="button" className={`channel-btn ${draft.plaque === 'no' ? 'on' : ''}`} onClick={() => patch({ plaque: 'no' })}>
                  {t('plaqueNo')}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {phase === 'form' && step === 4 ? (
          <div className="citizen-stack">
            <Field label={t('neighborhood')} value={draft.neighborhood} onChange={(v) => patch({ neighborhood: v })} />
            <Field label={t('postal')} value={draft.postal} onChange={(v) => patch({ postal: v })} />
            <Field label={t('cadastral')} value={draft.cadastral} onChange={(v) => patch({ cadastral: v })} />
            <Field label={t('geocode')} value={draft.geocode} onChange={(v) => patch({ geocode: v })} />
            <div className="field">
              <label>{t('description')}</label>
              <textarea value={draft.description} onChange={(e) => patch({ description: e.target.value })} />
            </div>
          </div>
        ) : null}

        {phase === 'form' && step === 5 ? (
          <div className="citizen-stack">
            <Summary label={t('appTypeTitle')} value={draft.type === 'certificate' ? t('typeCertificate') : t('typeAddress')} />
            <Summary label={t('firstName')} value={show(`${draft.firstName} ${draft.lastName}`.trim(), t('summaryEmpty'))} />
            <Summary label={t('niu')} value={show(draft.niu, t('summaryEmpty'))} />
            <Summary label={t('digitalId')} value={show(draft.digitalId, t('summaryEmpty'))} />
            <Summary
              label={t('stepPosition')}
              value={
                located ? `${draft.coords.lat.toFixed(5)}, ${draft.coords.lng.toFixed(5)}` : t('summaryEmpty')
              }
            />
            <Summary label={t('doorNumber')} value={show(draft.door, t('summaryEmpty'))} />
            <Summary label={t('roadName')} value={show(draft.road, t('summaryEmpty'))} />
            <Summary label={t('commune')} value={show(draft.commune, t('summaryEmpty'))} />
            <Summary label={t('neighborhood')} value={show(draft.neighborhood, t('summaryEmpty'))} />
            <Summary label={t('postal')} value={show(draft.postal, t('summaryEmpty'))} />
            <Summary label={t('cadastral')} value={show(draft.cadastral, t('summaryEmpty'))} />
            <Summary label={t('geocode')} value={show(draft.geocode, t('summaryEmpty'))} />
            <Summary label={t('doorPhoto')} value={show(draft.photoName, t('summaryEmpty'))} />
            <Summary
              label={t('plaque')}
              value={draft.plaque === 'yes' ? t('plaqueYes') : draft.plaque === 'no' ? t('plaqueNo') : t('summaryEmpty')}
            />
            {draft.type === 'certificate' ? (
              <Summary
                label={t('billTitle')}
                value={draft.billName ? `${draft.billKind === 'electricity' ? t('billElectricity') : t('billWater')} — ${draft.billName}` : t('summaryEmpty')}
              />
            ) : null}
            <button type="button" className="btn btn-primary btn-block" onClick={onSubmit}>
              {t('submitApp')}
            </button>
          </div>
        ) : null}
      </div>
      {phase === 'form' ? (
        <div className="citizen-footer">
          <button type="button" className="btn btn-secondary" onClick={onSaveDraft}>
            {t('saveDraft')}
          </button>
          {step < 5 ? (
            <button type="button" className="btn btn-primary" onClick={() => patch({ step: step + 1 })}>
              {t('next')}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="card">
      <span className="hint">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
