export default function SubTabs({ views, activeView, onSelect }) {
  const entries = Object.entries(views);
  if (entries.length <= 1) return null;

  return (
    <div className="subtabs">
      {entries.map(([key, view]) => (
        <button key={key} className={`subtab ${activeView === key ? 'active' : ''}`} onClick={() => onSelect(key)}>
          {view.label}
        </button>
      ))}
    </div>
  );
}
