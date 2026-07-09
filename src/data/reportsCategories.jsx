// Categories shown on the Reports landing page. Each maps to one of the
// `reports` module's views (fetched via services/api.js) — picking an item
// within a category opens that view with the item carried as context (see
// App.jsx's `reportContext` state) rather than mutating shared module data.
export const REPORTS_BASE_LABELS = {
  diseaseView: 'Disease View',
  countryView: 'Country View',
  trendView: 'Industry Trend View',
};

export const REPORTS_CATEGORIES = {
  disease: {
    label: 'Disease',
    viewKey: 'diseaseView',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M9 2h6M10 2v6.2L4.6 18a2 2 0 0 0 1.8 3h11.2a2 2 0 0 0 1.8-3L14 8.2V2" />
        <path d="M6.5 15h11" />
      </svg>
    ),
    desc: 'Explore the pipeline, trials, and pricing landscape for a specific disease area.',
    items: [
      'Oncology',
      'Immunology',
      'Infectious Disease',
      'Metabolic Disease',
      'Respiratory',
      'Rare Disease',
      'Cardiovascular',
      'Neurology',
    ],
  },
  country: {
    label: 'Country',
    viewKey: 'countryView',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    ),
    desc: 'Explore regulatory, pricing, and market data for a specific country.',
    items: ['United States', 'Germany', 'United Kingdom', 'Japan', 'France', 'Canada', 'India', 'Australia'],
  },
  trend: {
    label: 'Industry Trend',
    viewKey: 'trendView',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M4 19V10M11 19V5M18 19v-7" />
      </svg>
    ),
    desc: 'Explore emerging themes shaping biopharma strategy.',
    items: [
      'GLP-1 & Metabolic Therapies',
      'Biosimilar Competition',
      'Cell & Gene Therapy Access',
      'AI in Drug Discovery',
      'Value-Based Pricing',
      'Patent Cliff Wave 2026–2028',
    ],
  },
};
