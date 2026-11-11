import { useRef, useState } from 'react';
import { Stepper } from '../../components/chrome';
import { useLanguage } from '../../i18n/LanguageContext';

const DISTRICTS = ['Tevragh Zeina', 'Ksar', 'Dar Naim', 'Teyaret'];
const APP_TYPES = [
  ['new', 'webTypeNew'],
  ['correction', 'webTypeCorrection'],
  ['official', 'webTypeOfficial'],
];
const APP_FORMS = [
  ['individual', 'webFormIndividual'],
  ['corporate', 'webFormCorporate'],
  ['proxy', 'webFormProxy'],
];
const STEP_KEYS = ['webStepPrivacy', 'webStepType', 'webStepPerson', 'webStepDocs'];

function viewOf(draft) {
  if (draft.phase === 'wizard' || draft.phase === 'form') {
    const step = Math.min(Math.max(draft.step || 1, 1), 4);
    return { phase: 'wizard', step };
  }
  return { phase: 'intro', step: 1 };
}

function acceptFile(file, extraDoc) {
  if (!file) return false;
  const doc = extraDoc && /\.docx?$/i.test(file.name);
  return file.type.startsWith('image/') || file.type === 'application/pdf' || /\.(png|jpe?g|pdf)$/i.test(file.name) || doc;
}

export function ApplicationWizard({ draft, onChange, onSaveDraft, onSubmit, onClose }) {
  const { t } = useLanguage();
  const [fileError, setFileError] = useState('');
  const addressRef = useRef(null);
  const proxyRef = useRef(null);
  const idRef = useRef(null);
  const { phase, step } = viewOf(draft);

  const patch = (partial) => onChange({ ...draft, ...partial });

  const pickFile = (key, extraDoc) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!acceptFile(file, extraDoc)) {
      setFileError(t('billError'));
      return;
    }
    setFileError('');
    patch({ [key]: file.name });
  };

  const back = () => {
    if (phase === 'wizard' && step > 1) patch({ phase: 'wizard', step: step - 1 });
    else if (phase === 'wizard') patch({ phase: 'intro', step: 1 });
    else onClose();
  };

  const title = phase === 'intro' ? t('webIntroTitle') : t(STEP_KEYS[step - 1]);

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
      {phase === 'wizard' ? <Stepper step={step} total={4} /> : null}
      <div className="citizen-scroll">
        {phase === 'intro' ? (
          <div className="citizen-stack">
            <p className="hint">{t('webIntroLead')}</p>
            <ul className="elig-list">
              <li>{t('webDocAddress')}</li>
              <li>{t('webDocProxy')}</li>
              <li>{t('webDocId')}</li>
            </ul>
            <label className="check-line">
              <input
                type="checkbox"
                checked={Boolean(draft.introOk)}
                onChange={(e) => patch({ introOk: e.target.checked })}
              />
              {t('webIntroAccept')}
            </label>
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={!draft.introOk}
              onClick={() => patch({ phase: 'wizard', step: 1 })}
            >
              {t('webContinue')}
            </button>
          </div>
        ) : null}

        {phase === 'wizard' && step === 1 ? (
          <div className="citizen-stack">
            <div className="card">
              <strong>{t('webRequiredDocs')}</strong>
              <ul className="elig-list">
                <li>{t('webPrivacyUse1')}</li>
                <li>{t('webPrivacyUse2')}</li>
                <li>{t('webPrivacyUse3')}</li>
              </ul>
            </div>
            <label className="check-line">
              <input
                type="checkbox"
                checked={Boolean(draft.privacyOk)}
                onChange={(e) => patch({ privacyOk: e.target.checked })}
              />
              {t('webPrivacyAccept')}
            </label>
          </div>
        ) : null}

        {phase === 'wizard' && step === 2 ? (
          <div className="citizen-stack">
            <div className="field">
              <label>{t('webDistrict')}</label>
              <select value={draft.district || ''} onChange={(e) => patch({ district: e.target.value, commune: e.target.value })}>
                <option value="">{t('webSelectDistrict')}</option>
                {DISTRICTS.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t('webAppType')}</label>
              <select value={draft.appType || ''} onChange={(e) => patch({ appType: e.target.value })}>
                <option value="">{t('webSelectAppType')}</option>
                {APP_TYPES.map(([id, key]) => (
                  <option key={id} value={id}>{t(key)}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t('webAppForm')}</label>
              <select value={draft.appForm || ''} onChange={(e) => patch({ appForm: e.target.value })}>
                <option value="">{t('webSelectAppForm')}</option>
                {APP_FORMS.map(([id, key]) => (
                  <option key={id} value={id}>{t(key)}</option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {phase === 'wizard' && step === 3 ? (
          <div className="citizen-stack">
            <div className="field">
              <label>{t('webId')}</label>
              <input value={draft.idValue || ''} onChange={(e) => patch({ idValue: e.target.value })} />
            </div>
            <div className="field">
              <label>{t('webBirthDate')}</label>
              <input type="date" value={draft.birthDate || ''} onChange={(e) => patch({ birthDate: e.target.value })} />
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={() => patch({ fullName: 'Mohamed Fall', firstName: 'Mohamed', lastName: 'Fall' })}
            >
              {t('webVerifyPerson')}
            </button>
            <div className="field">
              <label>{t('webFullName')}</label>
              <input
                value={draft.fullName || ''}
                onChange={(e) => {
                  const fullName = e.target.value;
                  const [firstName, ...rest] = fullName.trim().split(/\s+/);
                  patch({ fullName, firstName: firstName || '', lastName: rest.join(' ') });
                }}
              />
            </div>
            <div className="field">
              <label>{t('webPhone')}</label>
              <div className="phone-row">
                <span className="phone-prefix">+222</span>
                <input
                  value={draft.phoneLocal || ''}
                  onChange={(e) => patch({ phoneLocal: e.target.value.replace(/\D/g, ''), phone: `+222${e.target.value.replace(/\D/g, '')}` })}
                />
              </div>
            </div>
          </div>
        ) : null}

        {phase === 'wizard' && step === 4 ? (
          <div className="citizen-stack">
            <UploadRow
              label={t('webDocAddress')}
              formats={t('webDocAddressFormats')}
              name={draft.fileAddress}
              inputRef={addressRef}
              onPick={pickFile('fileAddress', false)}
              uploadLabel={t('webUpload')}
            />
            <UploadRow
              label={t('webDocProxy')}
              optional={t('webOptional')}
              formats={t('webDocProxyFormats')}
              name={draft.fileProxy}
              inputRef={proxyRef}
              onPick={pickFile('fileProxy', true)}
              uploadLabel={t('webUpload')}
            />
            <UploadRow
              label={t('webDocId')}
              formats={t('webDocIdFormats')}
              name={draft.fileId}
              inputRef={idRef}
              onPick={pickFile('fileId', false)}
              uploadLabel={t('webUpload')}
            />
            {fileError ? <p className="form-error">{fileError}</p> : null}
          </div>
        ) : null}
      </div>
      {phase === 'wizard' ? (
        <div className="citizen-footer">
          <button type="button" className="btn btn-secondary" onClick={onSaveDraft}>
            {t('saveDraft')}
          </button>
          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={step === 1 && !draft.privacyOk}
              onClick={() => patch({ phase: 'wizard', step: step + 1 })}
            >
              {t('next')}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onSubmit}>
              {t('webSendSms')}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function UploadRow({ label, optional, formats, name, inputRef, onPick, uploadLabel }) {
  return (
    <div className="card citizen-stack">
      <strong>{label}</strong>
      {optional ? <span className="hint">{optional}</span> : null}
      <input ref={inputRef} type="file" hidden onChange={onPick} />
      <button type="button" className="btn btn-secondary btn-block" onClick={() => inputRef.current?.click()}>
        {uploadLabel}
      </button>
      <span className="hint">{formats}</span>
      {name ? <span className="hint">{name}</span> : null}
    </div>
  );
}
