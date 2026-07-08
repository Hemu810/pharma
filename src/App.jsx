import { useMemo, useState } from 'react';
import { MODULES } from './data/modules.js';
import { ICONS } from './data/icons.jsx';

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

const DEFAULT_CONDITIONS = [
  { field: 'Indication', op: '=', value: 'Oncology' },
  { field: 'Phase', op: '=', value: 'III', join: 'AND' },
  { field: 'Molecule Type', op: '=', value: 'Monoclonal antibody', join: 'OR' },
];

export default function App() {
  // 'home' | 'module' | 'analytics' | 'reports' — which top-level page is showing
  const [page, setPage] = useState('home');

  const [moduleKey, setModuleKey] = useState('drugs');
  const [viewKey, setViewKey] = useState('basic');

  const [hiddenCols, setHiddenCols] = useState(new Set());
  const [builderOpen, setBuilderOpen] = useState(false);
  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS);
  const [fieldsModalOpen, setFieldsModalOpen] = useState(false);

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [customExportOpen, setCustomExportOpen] = useState(false);
  const [aiExportOpen, setAiExportOpen] = useState(false);
  const [aiExportSeedQuery, setAiExportSeedQuery] = useState('Summarize this result set by phase and indication.');

  const { message, showToast } = useToast();

  const activeModule = MODULES[moduleKey];
  const activeView = activeModule.views[viewKey];
  const ModuleIcon = ICONS[activeModule.icon];

  const fileNameSeed = useMemo(
    () => `veridian_export_${moduleKey}_${viewKey}_${new Date().toISOString().slice(0, 10)}`,
    [moduleKey, viewKey]
  );

  const goHome = () => setPage('home');
  const goAnalytics = () => setPage('analytics');
  const goReports = () => setPage('reports');

  const selectModule = (key, opts) => {
    setModuleKey(key);
    setViewKey(Object.keys(MODULES[key].views)[0]);
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
    const n = fields.length;
    showToast(
      n > 1
        ? `Added ${n} fields to your search builder — set operators and values.`
        : `Added "${fields[0].field}" to your search builder — set an operator and value.`
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

  return (
    <div className="app">
      <TopNav
        currentModuleKey={moduleKey}
        homeActive={page === 'home'}
        analyticsActive={page === 'analytics'}
        reportsActive={page === 'reports'}
        onShowHome={goHome}
        onShowAnalytics={goAnalytics}
        onShowReports={goReports}
        onSelectModule={selectModule}
        onOpenAskAI={openAskAIFromNav}
        showToast={showToast}
      />

      <div className="main">
        {page === 'home' && (
          <Home
            onSelectModule={selectModule}
            onSelectModuleView={selectView}
            onOpenBuilder={() => setBuilderOpen(true)}
            onShowAnalytics={goAnalytics}
            onOpenProducts={() => showToast('Open the Products menu in the top navbar to see all platforms.')}
            showToast={showToast}
          />
        )}

        {page === 'analytics' && <Analytics />}

        {page === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
            <div className="topbar" style={{ borderBottom: 'none' }}>
              <div className="topbar-title-row">
                <div className="module-heading">
                  <ICONS.star />
                  <div>
                    <h1>Reports</h1>
                    <p>Saved and scheduled reports across your workspace</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="analytics-wrap">
              <div className="chart-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <h3>Reports library is on its way</h3>
                <p className="sub">Saved, scheduled, and shared reports will show up here.</p>
                <div style={{ marginTop: 12 }}>
                  <button className="btn" onClick={() => showToast("You're on the list for Reports.")}>
                    Notify me
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                onRunSearch={() => showToast('Search executed — results refreshed below.')}
              />

              <SubTabs views={activeModule.views} activeView={viewKey} onSelect={selectView} />
            </div>

            <FilterBar
              filters={activeModule.filters}
              onAddFilter={() =>
                showToast('Filter picker would open here — pick a field, operator and value.')
              }
            />

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

