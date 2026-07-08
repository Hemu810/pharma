import { useEffect, useRef, useState } from 'react';
import { ICONS } from '../data/icons.jsx';

export default function TableToolbar({
  resultCount,
  cols,
  hiddenCols,
  onToggleCol,
  onQuickExport,
  onCustomExport,
  onAIExport,
}) {
  const [openMenu, setOpenMenu] = useState(null); // 'columns' | 'export' | null
  const wrapRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, []);

  const toggleMenu = (name) => setOpenMenu((prev) => (prev === name ? null : name));

  return (
    <div className="tabletoolbar" ref={wrapRef}>
      <div className="result-count">
        <b>{resultCount}</b> matching records
      </div>
      <div className="toolbar-right">
        <div className="dropdown">
          <button className="btn btn-sm" onClick={() => toggleMenu('columns')}>
            <ICONS.columns />
            Columns
          </button>
          <div className={`dropdown-menu ${openMenu === 'columns' ? 'open' : ''}`}>
            <div className="col-checklist">
              {cols.map((col, i) => (
                <label className="col-check" key={col}>
                  <input type="checkbox" checked={!hiddenCols.has(i)} onChange={() => onToggleCol(i)} />
                  {col}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="dropdown">
          <button className="btn btn-sm" onClick={() => toggleMenu('export')}>
            <ICONS.export />
            Export
          </button>
          <div className={`dropdown-menu ${openMenu === 'export' ? 'open' : ''}`}>
            <button
              onClick={() => {
                setOpenMenu(null);
                onQuickExport();
              }}
            >
              <span>Quick export (.csv)</span>
              <span className="sub">Current view, visible columns only</span>
            </button>
            <hr />
            <button
              onClick={() => {
                setOpenMenu(null);
                onCustomExport();
              }}
            >
              <span>Custom export…</span>
              <span className="sub">Pick columns, format, and row scope</span>
            </button>
            <button
              onClick={() => {
                setOpenMenu(null);
                onAIExport();
              }}
            >
              <span>Export to Excel with AI query…</span>
              <span className="sub">Adds an AI-generated insight column</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
