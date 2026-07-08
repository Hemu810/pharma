import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { ICONS } from '../data/icons.jsx';

export default function AIExportModal({ open, onClose, initialQuery, resultCount, onExport }) {
  const [query, setQuery] = useState(initialQuery);
  const [format, setFormat] = useState('.xlsx');
  const [scope, setScope] = useState('page');
  const [sheetName, setSheetName] = useState('AI Query Export');

  // Keep the query field in sync when opened from a different suggested prompt.
  useEffect(() => {
    if (open) setQuery(initialQuery);
  }, [open, initialQuery]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export to Excel with AI query"
      subtitle="Adds an AI-generated column alongside your data"
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn ai-export-btn"
            onClick={() => {
              onExport({ query, format, scope, sheetName });
              onClose();
            }}
          >
            <ICONS.export />
            Run &amp; export
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Your query</label>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="note" style={{ marginBottom: 16 }}>
        This will run your query against each of the <b>{resultCount}</b> matching rows and add it as a new column,{' '}
        <b>AI Insight</b>, in the exported workbook.
      </div>

      <div className="grid2">
        <div className="form-group">
          <label>Format</label>
          <div className="seg">
            {['.xlsx', '.csv'].map((f) => (
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
            <input type="radio" checked={scope === 'all'} onChange={() => setScope('all')} /> All matching results
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Sheet name</label>
        <input type="text" value={sheetName} onChange={(e) => setSheetName(e.target.value)} />
      </div>
    </Modal>
  );
}
