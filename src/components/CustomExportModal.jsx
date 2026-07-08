import { useState } from 'react';
import Modal from './Modal.jsx';

const FORMATS = ['.xlsx', '.csv', '.pdf'];

export default function CustomExportModal({ open, onClose, cols, resultCount, onExport, fileNameSeed }) {
  const [format, setFormat] = useState('.xlsx');
  const [scope, setScope] = useState('page');
  const [checkedCols, setCheckedCols] = useState(() => new Set(cols.map((_, i) => i)));

  const toggleCol = (i) => {
    setCheckedCols((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Custom export"
      subtitle="Choose exactly what leaves this screen"
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onExport({ format, scope, columns: [...checkedCols] });
              onClose();
            }}
          >
            Export file
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>File name</label>
        <input type="text" defaultValue={fileNameSeed} />
      </div>

      <div className="grid2">
        <div className="form-group">
          <label>Format</label>
          <div className="seg">
            {FORMATS.map((f) => (
              <button key={f} className={format === f ? 'active' : ''} onClick={() => setFormat(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Row scope</label>
          <div className="radio-row">
            <input type="radio" checked={scope === 'page'} onChange={() => setScope('page')} /> Current page (25 rows)
          </div>
          <div className="radio-row">
            <input type="radio" checked={scope === 'all'} onChange={() => setScope('all')} /> All matching results (
            {resultCount} rows)
          </div>
          <div className="radio-row">
            <input type="radio" checked={scope === 'selected'} onChange={() => setScope('selected')} /> Selected rows
            only (0)
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Columns to include</label>
        <div className="col-checklist" style={{ border: '1px solid var(--line)', borderRadius: 8 }}>
          {cols.map((col, i) => (
            <label className="col-check" key={col}>
              <input type="checkbox" checked={checkedCols.has(i)} onChange={() => toggleCol(i)} />
              {col}
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
