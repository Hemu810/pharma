import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal.jsx';
import { FIELD_DEFS, FIELD_TYPE_DEFAULT_OP, FIELD_TYPE_DEFAULT_VAL } from '../data/fields.js';

// Lets the user multi-select any number of fields (across every group in the
// current module) and confirm once to add them all to the search builder in a
// single batch, rather than adding — and closing the modal — one at a time.
export default function SearchFieldsModal({ open, onClose, moduleKey, moduleLabel, onAddFields }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(new Map()); // fieldName -> fieldType

  const groups = FIELD_DEFS[moduleKey] || {};

  const totalFields = useMemo(
    () => Object.values(groups).reduce((sum, fields) => sum + fields.length, 0),
    [groups]
  );

  // Reset selection whenever the modal is (re)opened or the module changes.
  useEffect(() => {
    if (open) setSelected(new Map());
  }, [open, moduleKey]);

  const q = query.trim().toLowerCase();

  const toggleField = (field) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(field.n)) next.delete(field.n);
      else next.set(field.n, field.t);
      return next;
    });
  };

  const confirmSelection = () => {
    if (selected.size === 0) return;
    const fields = [...selected.entries()].map(([name, type]) => ({
      field: name,
      op: FIELD_TYPE_DEFAULT_OP[type] || '=',
      value: FIELD_TYPE_DEFAULT_VAL[type] || '(set value)',
    }));
    onAddFields(fields);
    onClose();
  };

  const selectedCount = selected.size;

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={`Search fields — ${moduleLabel}`}
      subtitle="Every field indexed for this module — select one or more, then confirm to add them all to your search builder"
      footer={
        <>
          <span className="ai-cta-text">
            {selectedCount > 0
              ? `${selectedCount} field${selectedCount > 1 ? 's' : ''} selected · ${totalFields} searchable fields in ${moduleLabel}`
              : `${totalFields} searchable fields in ${moduleLabel}`}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={selectedCount === 0} onClick={confirmSelection}>
              {selectedCount > 0 ? `Add ${selectedCount} selected field${selectedCount > 1 ? 's' : ''}` : 'Add selected fields'}
            </button>
          </div>
        </>
      }
    >
      <div className="search-box" style={{ marginBottom: 16, background: 'var(--bg)' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          placeholder="Filter fields…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {Object.keys(groups).length === 0 && <div className="fields-empty">No indexed fields for this module yet.</div>}

      {Object.entries(groups).map(([groupName, fields]) => {
        const visible = fields.filter((f) => !q || f.n.toLowerCase().includes(q));
        if (visible.length === 0) return null;
        return (
          <div className="field-group" key={groupName}>
            <div className="field-group-title">
              {groupName} <span className="count">{fields.length}</span>
            </div>
            <div className="field-chips">
              {visible.map((f) => (
                <button
                  className={`field-chip ${selected.has(f.n) ? 'selected' : ''}`}
                  key={f.n}
                  onClick={() => toggleField(f)}
                >
                  <span className="fcheck">✓</span>
                  <span className={`ftype ${f.t}`}>{f.t}</span>
                  {f.n}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </Modal>
  );
}
