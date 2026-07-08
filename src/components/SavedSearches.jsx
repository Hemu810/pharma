import { useEffect, useState } from 'react';
import { fetchSavedSearches } from '../services/api.js';

// Full CRUD over the saved-search list: run, edit (inline form), delete, and a
// toggle to reveal older ("historical") entries alongside the recent ones.
export default function SavedSearches({ onSelectModule, onSelectModuleView, onOpenBuilder, showToast }) {
  const [items, setItems] = useState([]);
  const [showHistorical, setShowHistorical] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftQuery, setDraftQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchSavedSearches().then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = items.filter((s) => showHistorical || !s.historical);

  const runSearch = (s) => {
    onSelectModule(s.target.moduleKey);
    if (s.target.openBuilder) onOpenBuilder();
    if (s.target.viewKey) onSelectModuleView(s.target.viewKey);
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setDraftTitle(s.title);
    setDraftQuery(s.query);
  };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id) => {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: draftTitle.trim() || s.title, query: draftQuery.trim() || s.query } : s))
    );
    setEditingId(null);
    showToast('Saved search updated.');
  };
  const remove = (id) => {
    setItems((prev) => prev.filter((s) => s.id !== id));
    showToast('Saved search deleted.');
  };

  return (
    <>
      <div className="home-section-head">
        <h2>Saved searches</h2>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowHistorical((v) => !v);
          }}
        >
          {showHistorical ? 'Hide historical searches →' : 'Show historical searches →'}
        </a>
      </div>
      <div className="panel">
        {visible.length === 0 && (
          <div className="saved-empty">No saved searches yet. Build a search in any module and save it to see it here.</div>
        )}

        {visible.map((s) =>
          editingId === s.id ? (
            <div className="saved-edit-form" key={s.id}>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Saved search name"
              />
              <input
                type="text"
                className="mono"
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                placeholder="Query"
              />
              <div className="saved-edit-actions">
                <button onClick={cancelEdit}>Cancel</button>
                <button className="save" onClick={() => saveEdit(s.id)}>
                  Save changes
                </button>
              </div>
            </div>
          ) : (
            <div className="saved-row" key={s.id}>
              <div className="saved-row-left">
                <div className="saved-row-title">
                  {s.title}
                  {s.historical && <span className="saved-historical-badge">Historical</span>}
                </div>
                <div className="saved-row-query">{s.query}</div>
                <div className="saved-row-date">Saved {s.savedOn}</div>
              </div>
              <div className="saved-row-actions">
                <button className="saved-row-run" onClick={() => runSearch(s)}>
                  Run
                </button>
                <button className="icon-btn-sm" title="Edit" onClick={() => startEdit(s)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button className="icon-btn-sm danger" title="Delete" onClick={() => remove(s.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                  </svg>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
