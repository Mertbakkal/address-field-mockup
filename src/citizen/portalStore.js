const KEY = 'citizen-portal-v1';

export const DEMO_OTP = '482913';
export const EXPIRED_OTP = '000000';
export const DEMO_NIU = '1234567890123';
export const DEMO_EMAIL = 'demo@anac.mr';
export const DEMO_PASSWORD = 'demo';

const MONTHS = {
  fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const STATUS_KEY = {
  received: 'statusReceived',
  underReview: 'statusUnderReview',
  approved: 'statusApproved',
  rejected: 'statusRejected',
  certificateAvailable: 'statusCertificate',
};

const ONGOING = new Set(['received', 'underReview']);
const DONE = new Set(['approved', 'rejected', 'certificateAvailable']);

export function formatStamp(iso, lang) {
  const d = new Date(iso);
  const locale = MONTHS[lang] ? lang : 'en';
  const date = `${d.getDate()} ${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return { date, time };
}

function uid() {
  return crypto.randomUUID();
}

function note(kind, at, extra = {}) {
  return { id: uid(), kind, at, ...extra };
}

function seed() {
  const profile = {
    firstName: 'Amina',
    lastName: 'Mint Salem',
    phone: '+22246123456',
    email: DEMO_EMAIL,
    niu: DEMO_NIU,
  };

  const receivedAt = '2026-11-02T09:15:00';
  const reviewAt = '2026-10-28T11:40:00';
  const approvedAt = '2026-10-18T16:05:00';
  const rejectedAt = '2026-10-12T08:22:00';
  const certAt = '2026-09-30T13:10:00';
  const archivedAt = '2026-09-01T10:00:00';
  const draftAt = '2026-11-08T18:45:00';

  return {
    profile,
    location: null,
    camera: 'unknown',
    locationStatus: 'unknown',
    applications: [
      {
        id: 'seed-received',
        draft: false,
        fileNumber: 'AD-2026-1001',
        type: 'address',
        status: 'received',
        archived: false,
        createdAt: receivedAt,
        description: 'Adresse — Tevragh Zeina, porte 12',
        descriptionAr: 'عنوان — تفرغ زينة، الباب 12',
        firstName: 'Amina',
        lastName: 'Mint Salem',
        phone: profile.phone,
        email: profile.email,
        niu: profile.niu,
        digitalId: 'NO31-A42 102987',
        door: '12',
        road: 'Rue 42',
        commune: 'Tevragh Zeina',
        neighborhood: 'Tevragh Zeina',
        postal: 'NO31-A42',
        cadastral: 'TZ-145',
        geocode: '18.08600, -15.97850',
        plaque: 'yes',
        photoName: 'porte-12.jpg',
        billName: '',
        billKind: 'water',
        coords: { lat: 18.086, lng: -15.9785 },
        addressNumber: null,
        previousAddressNumber: null,
        rejectionReason: null,
        notifications: [note('submission', receivedAt), note('status', receivedAt, { status: 'received' })],
      },
      {
        id: 'seed-review',
        draft: false,
        fileNumber: 'AD-2026-1002',
        type: 'certificate',
        status: 'underReview',
        archived: false,
        createdAt: reviewAt,
        description: 'Certificat — Ksar, porte 4',
        descriptionAr: 'شهادة — لكصر، الباب 4',
        firstName: 'Amina',
        lastName: 'Mint Salem',
        phone: profile.phone,
        email: profile.email,
        niu: profile.niu,
        digitalId: 'NKC-KS-004',
        door: '4',
        road: 'Avenue Gamal',
        commune: 'Ksar',
        neighborhood: '',
        postal: '',
        cadastral: 'KS-88',
        geocode: '',
        plaque: '',
        photoName: 'porte-4.jpg',
        billName: 'facture-eau.pdf',
        billKind: 'water',
        coords: { lat: 18.0902, lng: -15.973 },
        addressNumber: null,
        previousAddressNumber: null,
        rejectionReason: null,
        notifications: [
          note('submission', reviewAt),
          note('status', reviewAt, { status: 'received' }),
          note('status', '2026-10-29T09:00:00', { status: 'underReview' }),
        ],
      },
      {
        id: 'seed-approved',
        draft: false,
        fileNumber: 'AD-2026-1003',
        type: 'address',
        status: 'approved',
        archived: false,
        createdAt: approvedAt,
        description: 'Adresse — Sebkha, porte 7',
        descriptionAr: 'عنوان — السبخة، الباب 7',
        firstName: 'Amina',
        lastName: 'Mint Salem',
        phone: profile.phone,
        email: profile.email,
        niu: profile.niu,
        digitalId: 'NKC-SB-007',
        door: '7',
        road: 'Rue 10',
        commune: 'Sebkha',
        neighborhood: 'Sebkha',
        postal: 'NKC-10',
        cadastral: 'SB-22',
        geocode: '18.079, -15.965',
        plaque: 'no',
        photoName: 'porte-7.jpg',
        billName: '',
        billKind: 'water',
        coords: { lat: 18.079, lng: -15.965 },
        addressNumber: 'NKC-1842',
        previousAddressNumber: 'NKC-0901',
        rejectionReason: null,
        notifications: [
          note('submission', approvedAt),
          note('status', approvedAt, { status: 'received' }),
          note('approval', '2026-10-20T15:12:00'),
        ],
      },
      {
        id: 'seed-rejected',
        draft: false,
        fileNumber: 'AD-2026-1004',
        type: 'address',
        status: 'rejected',
        archived: false,
        createdAt: rejectedAt,
        description: 'Adresse — hors communes',
        descriptionAr: 'عنوان — خارج البلديات',
        firstName: 'Amina',
        lastName: 'Mint Salem',
        phone: profile.phone,
        email: profile.email,
        niu: profile.niu,
        digitalId: '',
        door: '1',
        road: 'Piste nord',
        commune: 'Hors zone',
        neighborhood: '',
        postal: '',
        cadastral: '',
        geocode: '',
        plaque: 'yes',
        photoName: '',
        billName: '',
        billKind: 'water',
        coords: null,
        addressNumber: null,
        previousAddressNumber: null,
        rejectionReason: 'reasonOutside',
        notifications: [
          note('submission', rejectedAt),
          note('rejection', '2026-10-13T11:05:00'),
        ],
      },
      {
        id: 'seed-certificate',
        draft: false,
        fileNumber: 'AD-2026-1005',
        type: 'certificate',
        status: 'certificateAvailable',
        archived: false,
        createdAt: certAt,
        description: 'Certificat — Tevragh Zeina, porte 18',
        descriptionAr: 'شهادة — تفرغ زينة، الباب 18',
        firstName: 'Amina',
        lastName: 'Mint Salem',
        phone: profile.phone,
        email: profile.email,
        niu: profile.niu,
        digitalId: 'NO31-A42 220811',
        door: '18',
        road: 'Avenue Abdel Nasser',
        commune: 'Tevragh Zeina',
        neighborhood: 'Ilot C',
        postal: 'NO31-A18',
        cadastral: 'TZ-220',
        geocode: '18.09210, -15.97540',
        plaque: 'yes',
        photoName: 'porte-18.jpg',
        billName: 'facture-electricite.pdf',
        billKind: 'electricity',
        coords: { lat: 18.0921, lng: -15.9754 },
        addressNumber: 'NKC-2208',
        previousAddressNumber: null,
        rejectionReason: null,
        notifications: [
          note('submission', certAt),
          note('approval', '2026-10-02T10:20:00'),
          note('status', '2026-10-03T08:00:00', { status: 'certificateAvailable' }),
        ],
      },
      {
        id: 'seed-archived',
        draft: false,
        fileNumber: 'AD-2026-1006',
        type: 'address',
        status: 'received',
        archived: true,
        createdAt: archivedAt,
        description: 'Adresse archivée — Dar Naim',
        descriptionAr: 'عنوان مؤرشف — دار النعيم',
        firstName: 'Amina',
        lastName: 'Mint Salem',
        phone: profile.phone,
        email: profile.email,
        niu: profile.niu,
        digitalId: '',
        door: '3',
        road: 'Rue 3',
        commune: 'Dar Naim',
        neighborhood: '',
        postal: '',
        cadastral: 'DN-3',
        geocode: '',
        plaque: '',
        photoName: '',
        billName: '',
        billKind: 'water',
        coords: null,
        addressNumber: null,
        previousAddressNumber: null,
        rejectionReason: null,
        notifications: [note('submission', archivedAt)],
      },
      {
        id: 'seed-draft',
        draft: true,
        fileNumber: null,
        type: 'address',
        status: null,
        archived: false,
        createdAt: draftAt,
        description: 'Brouillon — Riad',
        descriptionAr: 'مسودة — الرياض',
        firstName: 'Amina',
        lastName: 'Mint Salem',
        phone: profile.phone,
        email: profile.email,
        niu: profile.niu,
        digitalId: '',
        door: '',
        road: '',
        commune: 'Riad',
        neighborhood: '',
        postal: '',
        cadastral: '',
        geocode: '',
        plaque: '',
        photoName: '',
        billName: '',
        billKind: 'water',
        coords: null,
        addressNumber: null,
        previousAddressNumber: null,
        rejectionReason: null,
        notifications: [],
        phase: 'form',
        step: 3,
        eligibilityAccepted: true,
      },
    ],
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* keep the seed when storage is unreadable */
  }
  return seed();
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function emptyDraft(profile) {
  return {
    id: uid(),
    draft: true,
    fileNumber: null,
    type: null,
    status: null,
    archived: false,
    createdAt: new Date().toISOString(),
    description: '',
    descriptionAr: '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    email: profile.email || '',
    niu: profile.niu || '',
    digitalId: '',
    door: '',
    road: '',
    commune: 'Tevragh Zeina',
    neighborhood: '',
    postal: '',
    cadastral: '',
    geocode: '',
    plaque: '',
    photoName: '',
    billName: '',
    billKind: 'water',
    coords: null,
    addressNumber: null,
    previousAddressNumber: null,
    rejectionReason: null,
    notifications: [],
    phase: 'type',
    step: 1,
    eligibilityAccepted: false,
  };
}

function nextFileNumber(applications) {
  let n = 2000;
  for (const app of applications) {
    const match = /^AD-2026-(\d+)$/.exec(app.fileNumber || '');
    if (match) n = Math.max(n, Number(match[1]));
  }
  return `AD-2026-${n + 1}`;
}

function labelsFor(draft) {
  const typed = (draft.description || '').trim();
  const place = [draft.commune, draft.door].filter(Boolean).join(', ');
  const generated = draft.type === 'certificate'
    ? (place ? `Certificat — ${place}` : 'Certificat d’adresse')
    : (place ? `Adresse — ${place}` : 'Demande d’adresse');
  const generatedAr = draft.type === 'certificate'
    ? (place ? `شهادة عنوان — ${place}` : 'شهادة عنوان')
    : (place ? `عنوان — ${place}` : 'طلب عنوان');
  return {
    description: typed || generated,
    descriptionAr: typed ? `${generatedAr} ${typed}` : generatedAr,
  };
}

export function upsertDraft(state, draft) {
  const next = { ...draft, draft: true, fileNumber: null, status: null };
  const exists = state.applications.some((item) => item.id === next.id);
  const applications = exists
    ? state.applications.map((item) => (item.id === next.id ? next : item))
    : [next, ...state.applications];
  return { ...state, applications };
}

export function submitDraft(state, draft) {
  const now = new Date().toISOString();
  const names = labelsFor(draft);
  const fileNumber = nextFileNumber(state.applications);
  const submitted = {
    ...draft,
    ...names,
    draft: false,
    fileNumber,
    status: 'received',
    archived: false,
    createdAt: now,
    phase: 'form',
    step: 5,
    notifications: [{ id: uid(), kind: 'submission', at: now }],
  };
  const exists = state.applications.some((item) => item.id === submitted.id);
  const applications = exists
    ? state.applications.map((item) => (item.id === submitted.id ? submitted : item))
    : [submitted, ...state.applications];
  return { state: { ...state, applications }, submitted };
}

export function archiveApplication(state, id) {
  return {
    ...state,
    applications: state.applications.map((item) => (item.id === id ? { ...item, archived: true } : item)),
  };
}

export function matchesQuery(app, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = `${app.fileNumber || ''} ${app.description || ''} ${app.descriptionAr || ''}`.toLowerCase();
  return hay.includes(q);
}

export function matchesFilter(app, filter) {
  if (app.draft) return false;
  if (filter === 'archived') return app.archived;
  if (filter === 'ongoing') return !app.archived && ONGOING.has(app.status);
  if (filter === 'done') return !app.archived && DONE.has(app.status);
  return true;
}

function pdfText(text) {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (ch === '\\' || ch === '(' || ch === ')') out += `\\${ch}`;
    else if (code > 126) out += `\\${code.toString(8).padStart(3, '0')}`;
    else if (code < 32) out += ' ';
    else out += ch;
  }
  return out;
}

export function downloadCertificate(app) {
  const lines = [
    "CERTIFICAT D'ADRESSE",
    `Dossier: ${app.fileNumber}`,
    `Identite numerique: ${app.digitalId || '-'}`,
    `Demandeur: ${app.firstName} ${app.lastName}`.trim(),
    `Numero de porte: ${app.door || '-'}`,
    `Voie: ${app.road || '-'}`,
    `Commune: ${app.commune || '-'}`,
  ];
  if (app.neighborhood) lines.push(`Quartier: ${app.neighborhood}`);
  if (app.postal) lines.push(`Code postal: ${app.postal}`);
  lines.push(`References cadastrales: ${app.cadastral || '-'}`);
  if (app.geocode) lines.push(`Geocode: ${app.geocode}`);
  if (app.addressNumber) lines.push(`Numero d'adresse: ${app.addressNumber}`);
  lines.push(`QR: ${app.fileNumber}`);

  let body = 'BT\n/F1 11 Tf\n50 800 Td\n';
  lines.forEach((line, index) => {
    if (index === 0) body += `/F1 16 Tf\n(${pdfText(line)}) Tj\n/F1 11 Tf\n0 -28 Td\n`;
    else body += `(${pdfText(line)}) Tj\n0 -18 Td\n`;
  });
  body += 'ET';

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n',
    `4 0 obj << /Length ${body.length} >> stream\n${body}\nendstream\nendobj\n`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${app.fileNumber || 'certificat'}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
