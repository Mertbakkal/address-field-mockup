import { useState } from 'react';
import { ScreenHeader, Stepper } from '../components/chrome';

export function BuildingInfoScreen({ coords, onCancel, onNext }) {
  const [form, setForm] = useState({
    buildingType: 'Residential building',
    occupation: 'Residential',
    ownership: 'Private',
    electricity: 'Yes',
    water: 'Yes',
    internet: 'Unknown',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title="Building Information" subtitle="Step 1 of 3" />
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
          GPS captured • {coords[0].toFixed(5)}, {coords[1].toFixed(5)} • Accuracy 3.4 m
        </div>
        <SelectField label="Building type" required value={form.buildingType} onChange={set('buildingType')} options={['Residential building', 'Commercial', 'Mixed use', 'Public']} />
        <SelectField label="Occupation type" required value={form.occupation} onChange={set('occupation')} options={['Residential', 'Commercial', 'Industrial', 'Vacant']} />
        <SelectField label="Ownership" required value={form.ownership} onChange={set('ownership')} options={['Private', 'Public', 'Communal']} />
        <SelectField label="Electricity connection" value={form.electricity} onChange={set('electricity')} options={['Yes', 'No', 'Unknown']} />
        <SelectField label="Water connection" value={form.water} onChange={set('water')} options={['Yes', 'No', 'Unknown']} />
        <SelectField label="Internet connection" value={form.internet} onChange={set('internet')} options={['Yes', 'No', 'Unknown']} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onNext(form)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddressInfoScreen({ building, coords, onBack, onNext }) {
  const [form, setForm] = useState({
    digital: 'NO31-A42 102987',
    postal: 'NO31-A42',
    physicalExists: true,
    physical: 'Tevragh Zeina, existing address reference 145',
    name: 'Building 1842',
    gps: `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`,
  });

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title="Address Information" subtitle="Step 2 of 3" />
      <Stepper step={2} />
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="field">
          <label>Digital address</label>
          <input value={form.digital} onChange={(e) => setForm({ ...form, digital: e.target.value })} />
        </div>
        <div className="field">
          <label>Postal code</label>
          <input value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={form.physicalExists}
            onChange={(e) => setForm({ ...form, physicalExists: e.target.checked })}
            style={{ accentColor: 'var(--primary-mid)', width: 18, height: 18 }}
          />
          A physical address exists
        </label>
        <div className="field">
          <label>Physical address</label>
          <textarea value={form.physical} onChange={(e) => setForm({ ...form, physical: e.target.value })} />
        </div>
        <div className="field">
          <label>Address name / identifier</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>GPS coordinates</label>
          <input value={form.gps} onChange={(e) => setForm({ ...form, gps: e.target.value })} />
        </div>
        <button type="button" className="btn btn-secondary btn-block">
          Check / correct on map
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onNext({ building, ...form })}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export function PhotoScreen({ onBack, onReview }) {
  const [hasPhoto, setHasPhoto] = useState(true);

  return (
    <div className="screen-body" style={{ overflow: 'auto', background: 'var(--bg)' }}>
      <ScreenHeader title="Photo" subtitle="Step 3 of 3" />
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
              ADDRESS PHOTO
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
            No photo
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={() => setHasPhoto(true)}>
            Retake
          </button>
          <button type="button" className="btn btn-danger-soft" onClick={() => setHasPhoto(false)}>
            Remove
          </button>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Additional photo</div>
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
            <span style={{ fontWeight: 600 }}>Open camera</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>(Optional)</span>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="button" className="btn btn-primary" onClick={onReview}>
            Review
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
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
