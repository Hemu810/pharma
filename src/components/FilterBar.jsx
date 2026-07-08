import { useEffect, useState } from 'react';

// `filters` is the module's default filter-chip set (from data/modules.js).
// We copy it into local state so the user can remove chips per-module without
// mutating the shared data, and reset that local copy whenever the module changes.
export default function FilterBar({ filters, onAddFilter }) {
  const [items, setItems] = useState(filters);

  useEffect(() => {
    setItems(filters);
  }, [filters]);

  const remove = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="filterbar">
      <span className="filterbar-label">Filters</span>
      {items.map((f, i) => (
        <span className="chip" key={`${f}-${i}`}>
          {f}
          <button onClick={() => remove(i)}>✕</button>
        </span>
      ))}
      <button className="chip-add" onClick={onAddFilter}>
        + Add filter
      </button>
    </div>
  );
}
