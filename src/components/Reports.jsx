import { REPORTS_CATEGORIES } from '../data/reportsCategories.jsx';

export default function Reports({ onOpenReportView }) {
  return (
    <div className="reports-wrap">
      <div className="reports-head">
        <h1>Reports</h1>
        <p>
          Pick a disease, country, or industry trend to open a full data view — with the same search, filters,
          columns, export, and pagination as any Aurion module.
        </p>
      </div>

      <div className="reports-category-grid">
        {Object.entries(REPORTS_CATEGORIES).map(([catKey, cat]) => {
          const Icon = cat.icon;
          return (
            <div className="reports-category-card" key={catKey}>
              <div className="reports-category-head">
                <div className="reports-category-icon">
                  <Icon />
                </div>
                <h3>{cat.label}</h3>
              </div>
              <p className="sub">{cat.desc}</p>
              <div className="reports-item-list">
                {cat.items.map((item) => (
                  <button key={item} className="reports-item-btn" onClick={() => onOpenReportView(catKey, item)}>
                    {item}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
