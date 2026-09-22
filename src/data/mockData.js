export const NOUAKCHOTT = { lat: 18.086, lng: -15.9785 };

export const initialRecords = [
  {
    id: 'r1',
    title: 'Address NO31…102806',
    status: 'ready',
    statusLabel: 'Ready to upload',
    meta: 'Tevragh Zeina',
    coords: [18.0892, -15.9751],
  },
  {
    id: 'r2',
    title: 'Address NO31…102841',
    status: 'draft',
    statusLabel: 'Local draft',
    meta: 'Tevragh Zeina',
    coords: [18.0821, -15.9812],
  },
  {
    id: 'r3',
    title: 'Address NO31…102798',
    status: 'error',
    statusLabel: 'Validation error',
    meta: 'Ksar',
    coords: [18.0915, -15.9688],
  },
  {
    id: 'r4',
    title: 'Address NO31…102760',
    status: 'sent',
    statusLabel: 'Sent 09:12',
    meta: 'Tevragh Zeina',
    coords: [18.0788, -15.984],
  },
];

export const tasks = [
  { id: 699, user: 'field.user', name: 'Transformer survey', date: '23.02.2026 10:12' },
  { id: 698, user: 'field.user', name: 'Address verification', date: '23.02.2026 09:53' },
  { id: 697, user: 'field.user', name: 'Line inspection', date: '23.02.2026 09:28' },
];

export const searchResults = [
  { id: '982741942', source: 'public.tbl_address', term: 'TEVRAGH ZEINA EXIT TR3' },
  { id: '982741955', source: 'public.tbl_address', term: 'KSAR JUNCTION TR75' },
  { id: '982741960', source: 'public.tbl_building', term: 'BUILDING 1842 RESIDENTIAL' },
  { id: '982741971', source: 'public.tbl_address', term: 'NO31-A42 DIGITAL POINT' },
];
