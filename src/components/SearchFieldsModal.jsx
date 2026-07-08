import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import { FIELD_DEFS, FIELD_TYPE_DEFAULT_OP, FIELD_TYPE_DEFAULT_VAL } from '../data/fields.js';
import { VALUE_OPTIONS } from '../data/valueOptions.js';

function fieldValueSummary(entry) {
  if (entry.type === 'num' || entry.type === 'date') {
    if (entry.rangeMin && entry.rangeMax) return `${entry.rangeMin} – ${entry.rangeMax}`;
    if (entry.rangeMin) return `≥ ${entry.rangeMin}`;
    if (entry.rangeMax) return `≤ ${entry.rangeMax}`;
    return 'Any';
  }
  if (entry.values.length === 0) return 'Any';
  if (entry.values.length <= 2) return entry.values.join(', ');
  return `${entry.values.slice(0, 2).join(', ')} +${entry.values.length - 2} more`;
}

// One field's row: the toggle button, and — when selected — its value picker.
// The picker adapts to the field's data type:
//   enum/txt with a known pick-list -> searchable multi-select checkboxes
//   enum/txt without one            -> free-text tag entry (type + Enter)
//   num/date                        -> a min/max range pair
function FieldRow({ field, entry, onToggle, onToggleValue, onAddTextValue, onRemoveTextValue, onSetRange }) {
  const [valueQuery, setValueQuery] = useState('');
  const textInputRef = useRef(null);
  const isSelected = !!entry;
  const options = VALUE_OPTIONS[field.n];

  return (
    <div className={`field-row-item ${isSelected ? 'selected' : ''}`}>
      <button className="field-row-toggle" onClick={() => onToggle(field)}>
        <span className="fcheck">✓</span>
        <span className={`ftype ${field.t}`}>{field.t}</span>
        <span className="field-row-name">{field.n}</span>
        <span className="field-row-summary">{isSelected ? fieldValueSummary(entry) : 'Any'}</span>
        <svg className="field-row-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isSelected && (field.t === 'num' || field.t === 'date') && (
        <div className="field-value-panel">
          <div className="range-input-row">
            <input
              type="text"
              placeholder={field.t === 'date' ? 'From (e.g. 2026-01-01)' : 'Min'}
              value={entry.rangeMin}
              onChange={(e) => onSetRange(field.n, 'rangeMin', e.target.value)}
            />
            <span>–</span>
            <input
              type="text"
              placeholder={field.t === 'date' ? 'To (e.g. 2026-12-31)' : 'Max'}
              value={entry.rangeMax}
              onChange={(e) => onSetRange(field.n, 'rangeMax', e.target.value)}
            />
          </div>
        </div>
      )}

      {isSelected && field.t !== 'num' && field.t !== 'date' && options && (
        <div className="field-value-panel">
          <div className="value-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${field.n} values…`}
              value={valueQuery}
              onChange={(e) => setValueQuery(e.target.value)}
            />
          </div>
          <div className="value-option-list">
            {options
              .filter((v) => !valueQuery.trim() || v.toLowerCase().includes(valueQuery.trim().toLowerCase()))
              .map((v) => (
                <label className="value-option" key={v}>
                  <input type="checkbox" checked={entry.values.includes(v)} onChange={() => onToggleValue(field.n, v)} />
                  {v}
                </label>
              ))}
          </div>
        </div>
      )}

      {isSelected && field.t !== 'num' && field.t !== 'date' && !options && (
        <div className="field-value-panel">
          <div className="value-tag-input-row">
            <input
              ref={textInputRef}
              type="text"
              placeholder="Type a value and press Enter…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddTextValue(field.n, e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              className="btn btn-sm"
              onClick={() => {
                onAddTextValue(field.n, textInputRef.current.value);
                textInputRef.current.value = '';
              }}
            >
              Add
            </button>
          </div>
          {entry.values.length > 0 && (
            <div className="value-tags">
              {entry.values.map((v, i) => (
                <span className="value-tag" key={`${v}-${i}`}>
                  {v}
                  <button onClick={() => onRemoveTextValue(field.n, i)}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchFieldsModal({ open, onClose, moduleKey, moduleLabel, onAddFields }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({}); // { [fieldName]: { type, values, rangeMin, rangeMax } }

  const groups = FIELD_DEFS[moduleKey] || {};

  const totalFields = useMemo(
    () => Object.values(groups).reduce((sum, fields) => sum + fields.length, 0),
    [groups]
  );

  useEffect(() => {
    if (open) setSelected({});
  }, [open, moduleKey]);

  const q = query.trim().toLowerCase();
  const selectedCount = Object.keys(selected).length;

  const toggleField = (field) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[field.n]) delete next[field.n];
      else next[field.n] = { type: field.t, values: [], rangeMin: '', rangeMax: '' };
      return next;
    });
  };
  const toggleValue = (fieldName, value) => {
    setSelected((prev) => {
      const entry = prev[fieldName];
      if (!entry) return prev;
      const values = entry.values.includes(value)
        ? entry.values.filter((v) => v !== value)
        : [...entry.values, value];
      return { ...prev, [fieldName]: { ...entry, values } };
    });
  };
  const addTextValue = (fieldName, raw) => {
    const value = (raw || '').trim();
    if (!value) return;
    setSelected((prev) => {
      const entry = prev[fieldName];
      if (!entry || entry.values.includes(value)) return prev;
      return { ...prev, [fieldName]: { ...entry, values: [...entry.values, value] } };
    });
  };
  const removeTextValue = (fieldName, idx) => {
    setSelected((prev) => {
      const entry = prev[fieldName];
      if (!entry) return prev;
      return { ...prev, [fieldName]: { ...entry, values: entry.values.filter((_, i) => i !== idx) } };
    });
  };
  const setRange = (fieldName, which, val) => {
    setSelected((prev) => {
      const entry = prev[fieldName];
      if (!entry) return prev;
      return { ...prev, [fieldName]: { ...entry, [which]: val } };
    });
  };

  const confirmSelection = () => {
    const entries = Object.entries(selected);
    if (entries.length === 0) return;

    const fields = entries.map(([name, entry]) => {
      let op;
      let value;
      if (entry.type === 'num' || entry.type === 'date') {
        if (entry.rangeMin && entry.rangeMax) {
          op = 'between';
          value = `${entry.rangeMin} – ${entry.rangeMax}`;
        } else if (entry.rangeMin) {
          op = '≥';
          value = entry.rangeMin;
        } else if (entry.rangeMax) {
          op = '≤';
          value = entry.rangeMax;
        } else {
          op = FIELD_TYPE_DEFAULT_OP[entry.type] || '=';
          value = FIELD_TYPE_DEFAULT_VAL[entry.type] || '(set value)';
        }
      } else if (entry.values.length === 0) {
        op = FIELD_TYPE_DEFAULT_OP[entry.type] || '=';
        value = FIELD_TYPE_DEFAULT_VAL[entry.type] || '(set value)';
      } else if (entry.values.length === 1) {
        op = '=';
        value = entry.values[0];
      } else {
        op = 'in';
        value = entry.values.join(', ');
      }
      return { field: name, op, value };
    });

    onAddFields(fields);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={`Search fields — ${moduleLabel}`}
      subtitle="Select one or more fields, choose specific values for each, then confirm to add them all to your search builder"
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
        <input type="text" placeholder="Filter fields…" value={query} onChange={(e) => setQuery(e.target.value)} />
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
            <div className="field-list">
              {visible.map((f) => (
                <FieldRow
                  key={f.n}
                  field={f}
                  entry={selected[f.n]}
                  onToggle={toggleField}
                  onToggleValue={toggleValue}
                  onAddTextValue={addTextValue}
                  onRemoveTextValue={removeTextValue}
                  onSetRange={setRange}
                />
              ))}
            </div>
          </div>
        );
      })}
    </Modal>
  );
}
