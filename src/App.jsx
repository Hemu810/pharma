import { useEffect, useMemo, useState } from 'react';
import { NAV_ORDER } from './data/nav.js';
import { ICONS } from './data/icons.jsx';
import { fetchAllModules } from './services/api.js';

import TopNav from './components/TopNav.jsx';
import Home from './components/Home.jsx';
import SearchBuilder from './components/SearchBuilder.jsx';
import SearchFieldsModal from './components/SearchFieldsModal.jsx';
import SubTabs from './components/SubTabs.jsx';
import FilterBar from './components/FilterBar.jsx';
import TableToolbar from './components/TableToolbar.jsx';
import DataTable from './components/DataTable.jsx';
import AIPanel from './components/AIPanel.jsx';
import CustomExportModal from './components/CustomExportModal.jsx';
import AIExportModal from './components/AIExportModal.jsx';
import Analytics from './components/Analytics.jsx';
import Toast from './components/Toast.jsx';
import { useToast } from './hooks/useToast.js';
import { buildCriteriaSummary } from './utils/searchSummary.js';

const DEFAULT_CONDITIONS = [
  { field: 'Indication', op: '=', value: 'Oncology' },
  { field: 'Phase', op: '=', value: 'III', join: 'AND' },
  { field: 'Molecule Type', op: '=', value: 'Monoclonal antibody', join: 'OR' },
];

const MODULE_KEYS = NAV_ORDER.flatMap((g) => g.items);

export default function App() {
  // 'home' | 'module' | 'analytics' — which top-level page is showing
  const [page, setPage] = useState('home');

  const [modules, setModules] = useState(null);
  const [modulesError, setModulesError] = useState(null);

  const [moduleKey, setModuleKey] = useState('drugs');
  const [viewKey, setViewKey] = useState('basic');

  const [hiddenCols, setHiddenCols] = useState(new Set());
  const [builderOpen, setBuilderOpen] = useState(false);
  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS);
  const [searchSummary, setSearchSummary] = useState('');
  const [fieldsModalOpen, setFieldsModalOpen] = useState(false);

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [customExportOpen, setCustomExportOpen] = useState(false);
  const [aiExportOpen, setAiExportOpen] = useState(false);
  const [aiExportSeedQuery, setAiExportSeedQuery] = useState('Summarize this result set by phase and indication.');

  const { message, showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    fetchAllModules(MODULE_KEYS)
      .then((data) => {
        if (!cancelled) setModules(data);
      })
      .catch((err) => {
        if (!cancelled) setModulesError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeModule = modules?.[moduleKey];
  const activeView = activeModule?.views[viewKey];
  const ModuleIcon = activeModule ? ICONS[activeModule.icon] : null;

  const fileNameSeed = useMemo(
    () => `veridian_export_${moduleKey}_${viewKey}_${new Date().toISOString().slice(0, 10)}`,
    [moduleKey, viewKey]
  );

  const goHome = () => setPage('home');
  const goAnalytics = () => setPage('analytics');

  const selectModule = (key, opts) => {
    setModuleKey(key);
    setViewKey(Object.keys(modules[key].views)[0]);
    setHiddenCols(new Set());
    setPage('module');
    if (opts?.openBuilder) setBuilderOpen(true);
  };

  const selectView = (key) => {
    setViewKey(key);
    setHiddenCols(new Set());
  };

  const toggleCol = (i) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const addFieldsToBuilder = (fields) => {
    setConditions((prev) => {
      const next = [...prev];
      fields.forEach((f) => {
        next.push({ ...f, join: next.length ? 'AND' : undefined });
      });
      return next;
    });
    setBuilderOpen(true);
    setSearchSummary('');
    const n = fields.length;
    showToast(
      n > 1
        ? `Added ${n} fields to your search builder — review and confirm to run.`
        : `Added "${fields[0].field}" to your search builder — review and confirm to run.`
    );
  };

  const openAIExportWithQuery = (query) => {
    setAiExportSeedQuery(query);
    setAiExportOpen(true);
  };

  const openAskAIFromNav = () => {
    if (page !== 'module') selectModule('drugs');
    setAiPanelOpen(true);
  };

  if (modulesError) {
    return (
      <div className="app">
        <div className="main" style={{ padding: 32 }}>
          <p>Couldn&apos;t load data: {modulesError}</p>
        </div>
      </div>
    );
  }

  if (!modules) {
    return (
      <div className="app">
        <div className="main" style={{ padding: 32 }}>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <TopNav
        modules={modules}
        currentModuleKey={moduleKey}
        homeActive={page === 'home'}
        analyticsActive={page === 'analytics'}
        onShowHome={goHome}
        onShowAnalytics={goAnalytics}
        onSelectModule={selectModule}
        onOpenAskAI={openAskAIFromNav}
        showToast={showToast}
      />

      <div className="main">
        {page === 'home' && (
          <Home
            modules={modules}
            onSelectModule={selectModule}
            onSelectModuleView={selectView}
            onOpenBuilder={() => setBuilderOpen(true)}
            onShowAnalytics={goAnalytics}
            onOpenProducts={() => showToast('Open the Products menu in the top navbar to see all platforms.')}
            showToast={showToast}
          />
        )}

        {page === 'analytics' && <Analytics modules={modules} />}

        {page === 'module' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div className="topbar">
              <div className="topbar-title-row">
                <div className="module-heading">
                  <ModuleIcon />
                  <div>
                    <h1>{activeModule.label}</h1>
                    <p>{activeModule.desc}</p>
                  </div>
                </div>
                <div className="topbar-actions">
                  <button className="btn" onClick={() => setFieldsModalOpen(true)}>
                    <ICONS.fields />
                    Search fields
                  </button>
                  <button
                    className={`btn ${builderOpen ? 'active' : ''}`}
                    onClick={() => setBuilderOpen((v) => !v)}
                  >
                    <ICONS.build />
                    Build search
                  </button>
                  <button className="btn" onClick={() => showToast('Search saved to your workspace library.')}>
                    <ICONS.star />
                    Save search
                  </button>
                </div>
              </div>

              <div className="search-row">
                <div className="search-box">
                  <ICONS.search />
                  <input type="text" placeholder="Search drug names, sponsors, indications, NCT-style IDs…" />
                  <span className="kbd">⌘K</span>
                </div>
                <button className="btn btn-ai" onClick={() => setAiPanelOpen(true)}>
                  <ICONS.sparkles />
                  Ask AI
                </button>
              </div>

              <SearchBuilder
                open={builderOpen}
                conditions={conditions}
                setConditions={setConditions}
                onRunSearch={() => {
                  setSearchSummary(buildCriteriaSummary(conditions));
                  showToast('Search executed — results refreshed below.');
                }}
                onClear={() => setSearchSummary('')}
              />

              <SubTabs views={activeModule.views} activeView={viewKey} onSelect={selectView} />
            </div>

            <FilterBar
              filters={activeModule.filters}
              onAddFilter={() =>
                showToast('Filter picker would open here — pick a field, operator and value.')
              }
            />

            {searchSummary && (
              <div className="search-summary-banner">
                <span className="ssb-text">
                  Showing results for: <b>{searchSummary}</b>
                </span>
                <button
                  onClick={() => {
                    setBuilderOpen(true);
                  }}
                >
                  Edit search
                </button>
              </div>
            )}

            <TableToolbar
              resultCount={activeModule.count}
              cols={activeView.cols}
              hiddenCols={hiddenCols}
              onToggleCol={toggleCol}
              onQuickExport={() => showToast('Exporting current view to CSV…')}
              onCustomExport={() => setCustomExportOpen(true)}
              onAIExport={() => setAiExportOpen(true)}
            />

            <div className={`content-split ${aiPanelOpen ? 'ai-open' : ''}`}>
              <div className="table-wrap">
                <DataTable view={activeView} resultCount={activeModule.count} hiddenCols={hiddenCols} />
              </div>

              <AIPanel
                open={aiPanelOpen}
                onClose={() => setAiPanelOpen(false)}
                moduleLabel={activeModule.label}
                viewLabel={activeView.label}
                rowCount={activeView.rows.length}
                onOpenAIExport={openAIExportWithQuery}
              />
            </div>
          </div>
        )}
      </div>

      <SearchFieldsModal
        open={fieldsModalOpen}
        onClose={() => setFieldsModalOpen(false)}
        moduleKey={moduleKey}
        moduleLabel={activeModule.label}
        onAddFields={addFieldsToBuilder}
      />

      <CustomExportModal
        open={customExportOpen}
        onClose={() => setCustomExportOpen(false)}
        cols={activeView.cols}
        resultCount={activeModule.count}
        fileNameSeed={fileNameSeed}
        onExport={() => showToast("Custom export queued — you'll get a download notification shortly.")}
      />

      <AIExportModal
        open={aiExportOpen}
        onClose={() => setAiExportOpen(false)}
        initialQuery={aiExportSeedQuery}
        resultCount={activeModule.count}
        onExport={() => showToast('Running AI query across rows and preparing your Excel file…')}
      />

      <Toast message={message} />
    </div>
  );
}

