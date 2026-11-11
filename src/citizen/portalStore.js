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
    phase: 'intro',
    step: 1,
    introOk: false,
    privacyOk: false,
    district: '',
    appType: '',
    appForm: '',
    idValue: '',
    birthDate: '',
    fullName: '',
    phoneLocal: String(profile.phone || '').replace(/^\+222/, ''),
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

const TYPE_FR = {
  new: 'Nouvelle détection d’adresse',
  correction: 'Correction d’adresse',
  official: 'Détection pour document officiel',
};
const TYPE_AR = {
  new: 'كشف عنوان جديد',
  correction: 'تصحيح العنوان',
  official: 'كشف لوثيقة رسمية',
};

function labelsFor(draft) {
  const typed = (draft.description || '').trim();
  const name = (draft.fullName || `${draft.firstName || ''} ${draft.lastName || ''}`).trim();
  const district = draft.district || draft.commune || '';
  const generated = [district, TYPE_FR[draft.appType], name].filter(Boolean).join(' — ');
  const generatedAr = [district, TYPE_AR[draft.appType], name].filter(Boolean).join(' — ');
  if (draft.appType || draft.district || draft.fullName) {
    return { description: generated, descriptionAr: generatedAr };
  }
  return {
    description: typed,
    descriptionAr: draft.descriptionAr || '',
  };
}

export function upsertDraft(state, draft) {
  const next = {
    ...draft,
    ...labelsFor(draft),
    commune: draft.district || draft.commune,
    draft: true,
    fileNumber: null,
    status: null,
  };
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
    phase: 'wizard',
    step: 4,
    commune: draft.district || draft.commune,
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

export function buildInbox(applications) {
  const highlights = [];
  const rest = [];
  for (const app of applications) {
    if (app.draft) continue;
    let sawPdf = false;
    for (const item of app.notifications || []) {
      if (item.kind === 'approval') highlights.push({ id: item.id, kind: 'approval', app, note: item });
      else if (item.kind === 'status' && item.status === 'certificateAvailable') {
        sawPdf = true;
        highlights.push({ id: item.id, kind: 'pdf', app, note: item });
      } else rest.push({ id: item.id, kind: item.kind, app, note: item });
    }
    if (app.status === 'certificateAvailable' && !sawPdf) {
      const note = { id: `${app.id}-pdf`, kind: 'status', at: app.createdAt, status: 'certificateAvailable' };
      highlights.push({ id: note.id, kind: 'pdf', app, note });
    }
  }
  const rank = { approval: 0, pdf: 1 };
  highlights.sort((a, b) => rank[a.kind] - rank[b.kind]);
  rest.sort((a, b) => String(b.note.at).localeCompare(String(a.note.at)));
  return { highlights, rest };
}

export function alertCount(applications) {
  return buildInbox(applications).highlights.length;
}

function pdfText(text) {
  let out = '';
  for (const ch of String(text ?? '')) {
    if (ch === '\\' || ch === '(' || ch === ')') {
      out += `\\${ch}`;
      continue;
    }
    const code = ch.codePointAt(0);
    if (code >= 32 && code <= 126) out += ch;
    else if (code >= 160 && code <= 255) out += `\\${code.toString(8).padStart(3, '0')}`;
    else out += ' ';
  }
  return out;
}

function pdfLine(font, size, x, y, color, text) {
  const [r, g, b] = color;
  return `BT\n/${font} ${size} Tf\n${r} ${g} ${b} rg\n1 0 0 1 ${x} ${y} Tm\n(${pdfText(text)}) Tj\nET\n`;
}

function qrBlock(value, x, y, size) {
  const n = 21;
  const cell = size / n;
  let hash = 2166136261;
  for (const ch of String(value)) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  let ops = `0.059 0.153 0.267 RG\n1.2 w\n${x} ${y} ${size} ${size} re S\n0 0 0 rg\n`;
  const paint = (col, row) => {
    const cx = (x + col * cell).toFixed(2);
    const cy = (y + row * cell).toFixed(2);
    const side = (cell * 0.86).toFixed(2);
    ops += `${cx} ${cy} ${side} ${side} re f\n`;
  };
  const finder = (fx, fy) => {
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const edge = row === 0 || col === 0 || row === 6 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4);
        if (edge) paint(fx + col, fy + row);
      }
    }
  };
  finder(0, n - 7);
  finder(n - 7, n - 7);
  finder(0, 0);
  for (let i = 0; i < n * n; i += 1) {
    const col = i % n;
    const row = Math.floor(i / n);
    const inFinder = (col < 7 && row >= n - 7) || (col >= n - 7 && row >= n - 7) || (col < 7 && row < 7);
    if (inFinder) continue;
    if (((hash >>> (i % 24)) ^ (i * 17)) & 1) paint(col, row);
  }
  return ops;
}

function issuedOn(app) {
  const note = (app.notifications || []).find((item) => item.status === 'certificateAvailable');
  return note?.at || app.createdAt;
}

export function buildCertificatePdf(app) {
  const issued = formatStamp(issuedOn(app), 'fr');
  const rows = [
    ['Dossier', app.fileNumber || '-'],
    ['Demandeur', `${app.firstName || ''} ${app.lastName || ''}`.trim() || '-'],
    ['NIU', app.niu || '-'],
    ['Identité numérique', app.digitalId || '-'],
    ['Numéro de porte', app.door || '-'],
    ['Voie', app.road || '-'],
    ['Commune', app.commune || '-'],
    ['Quartier', app.neighborhood || '-'],
    ['Code postal', app.postal || '-'],
    ['Références cadastrales', app.cadastral || '-'],
    ['Géocode', app.geocode || '-'],
    ["Numéro d'adresse", app.addressNumber || '-'],
    ["Date d'émission", `${issued.date} à ${issued.time}`],
  ];
  const ink = [0.059, 0.153, 0.267];
  const muted = [0.42, 0.48, 0.55];
  let body = '0.059 0.153 0.267 rg\n0 748 595 94 re f\n';
  body += pdfLine('F2', 20, 40, 792, [1, 1, 1], "CERTIFICAT D'ADRESSE");
  body += pdfLine('F1', 11, 40, 768, [0.78, 0.86, 0.93], 'Adressage numérique - Mauritanie');
  rows.forEach((row, index) => {
    const y = 688 - index * 34;
    if (index === 11) body += `0.90 0.96 0.93 rg\n36 ${y - 8} 280 30 re f\n`;
    body += pdfLine('F1', 9, 40, y + 14, muted, row[0]);
    body += pdfLine('F2', 12, 40, y, ink, row[1]);
  });
  body += qrBlock(app.fileNumber || 'AD', 420, 86, 126);
  body += pdfLine('F1', 8, 420, 70, muted, app.fileNumber || '');
  body += '0.82 0.86 0.90 RG\n0.6 w\n40 46 515 0 re S\n';
  body += pdfLine('F1', 9, 40, 28, muted, `Certificat du dossier ${app.fileNumber || ''}.`);

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj\n',
    `4 0 obj << /Length ${body.length} >> stream\n${body}\nendstream\nendobj\n`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj\n',
    '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> endobj\n',
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
  return pdf;
}

export function downloadCertificate(app) {
  const pdf = buildCertificatePdf(app);
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${app.fileNumber || 'certificat'}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
