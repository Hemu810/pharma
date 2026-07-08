// The "Products" mega-menu in the top navbar lists Aurion alongside sibling
// platforms in the wider product suite. Only `aurion` (this app) is real;
// the rest are placeholders so the navigation pattern reads correctly and can
// be wired up to real destinations later. Platforms with `hasSubmenu` show a
// chevron in column 1 and preview their (stubbed) sub-item in column 2.
export const PLATFORMS = [
  {
    key: 'aurion',
    label: 'Aurion',
    sub: 'Companies, Drugs, Clinical Trials, Drug Price & Cost of Therapy',
    launching: false,
    hasSubmenu: true,
  },
  { key: 'bio360', label: 'BIO 360', sub: 'Biopharma business intelligence', launching: true, hasSubmenu: false },
  {
    key: 'clinovate',
    label: 'Clinovate',
    sub: 'Clinical innovation & protocol design',
    launching: true,
    hasSubmenu: true,
    submenuItem: 'Gen AI Protocol',
  },
  {
    key: 'heorvia',
    label: 'HEOR Via',
    sub: 'Health economics & outcomes research',
    launching: true,
    hasSubmenu: true,
    submenuItem: 'Smart HTA Dossier',
  },
  { key: 'moleculens', label: 'MolecuLens', sub: 'Chemistry & structure search', launching: true, hasSubmenu: false },
  {
    key: 'nextgen',
    label: 'NextGen',
    sub: 'Next-generation biopharma workflows',
    launching: true,
    hasSubmenu: true,
    submenuItem: 'BioPharmaKSM',
  },
];
