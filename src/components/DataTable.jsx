import { useEffect, useState } from 'react';
import Badge from './Badge.jsx';
import { looksNumeric } from '../utils/classify.js';

const MOCK_TOTAL_ROWS = 60; // materialized sample rows per view, enough to demonstrate real pagination
const PAGE_WINDOW = 5; // how many page-number buttons to show around the current page

// A cell is either a plain string/number, or a small descriptor object:
//   { badge: 'Approved' }                → rendered as a status pill
//   { badge: 'High', suffix: ' 1.33×' }  → status pill plus trailing plain text
function renderCell(cell) {
  if (cell && typeof cell === 'object' && 'badge' in cell) {
    return (
      <>
        <Badge value={cell.badge} />
        {cell.suffix}
      </>
    );
  }
  return cell;
}

function cellClassName(cell, isFirstColumn) {
  if (cell && typeof cell === 'object') return '';
  if (looksNumeric(cell)) return 'cell-mono';
  if (isFirstColumn) return 'cell-strong';
  return '';
}

// Plain-text form of a cell (unwraps badge objects), used for column filtering.
function cellText(cell) {
  if (cell && typeof cell === 'object' && 'badge' in cell) return `${cell.badge}${cell.suffix || ''}`;
  return String(cell);
}

// Materializes a larger sample dataset by cycling the view's authored rows, so
// pagination/column-filtering has enough rows to demonstrate against without
// pretending the whole (much larger) real result set is loaded client-side.
function getExpandedRows(view) {
  const base = view.rows;
  if (!base.length) return [];
  const out = [];
  for (let i = 0; i < MOCK_TOTAL_ROWS; i++) out.push(base[i % base.length]);
  return out;
}

export default function DataTable({ view, resultCount, hiddenCols, resetKey }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [columnFilters, setColumnFilters] = useState({}); // colIndex -> string

  // Reset pagination + column filters whenever the module/view changes.
  useEffect(() => {
    setPage(1);
    setColumnFilters({});
  }, [resetKey]);

  const allRows = getExpandedRows(view);
  const activeFilters = Object.entries(columnFilters).filter(([, val]) => val && val.trim());
  const filteredRows =
    activeFilters.length === 0
      ? allRows
      : allRows.filter((row) =>
          activeFilters.every(([idx, val]) => cellText(row[Number(idx)]).toLowerCase().includes(val.trim().toLowerCase()))
        );

  const totalFiltered = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIdx = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize;
  const pageRows = filteredRows.slice(startIdx, startIdx + pageSize);

  const setColumnFilter = (idx, value) => {
    setColumnFilters((prev) => ({ ...prev, [idx]: value }));
    setPage(1);
  };

  const goToPage = (p) => setPage(Math.min(Math.max(p, 1), totalPages));

  const filtersActive = activeFilters.length > 0;
  const rangeStart = totalFiltered === 0 ? 0 : startIdx + 1;
  const rangeEnd = Math.min(startIdx + pageSize, totalFiltered);

  // Windowed page-number buttons around the current page.
  let winStart = Math.max(1, safePage - Math.floor(PAGE_WINDOW / 2));
  let winEnd = Math.min(totalPages, winStart + PAGE_WINDOW - 1);
  winStart = Math.max(1, winEnd - PAGE_WINDOW + 1);
  const pageNumbers = [];
  for (let p = winStart; p <= winEnd; p++) pageNumbers.push(p);

  return (
    <>
      <div className="tablefoot">
        <span>
          {filtersActive
            ? `Showing ${rangeStart}–${rangeEnd} of ${totalFiltered} rows matching your column filters`
            : `Showing ${rangeStart}–${rangeEnd} of ${totalFiltered} loaded rows · ${resultCount} total matching records`}
        </span>
        <div className="pagectrl">
          <button disabled={safePage <= 1} onClick={() => goToPage(1)} title="First page">
            «
          </button>
          <button disabled={safePage <= 1} onClick={() => goToPage(safePage - 1)} title="Previous page">
            ‹ Prev
          </button>
          <div className="page-numbers">
            {winStart > 1 && (
              <>
                <button onClick={() => goToPage(1)}>1</button>
                {winStart > 2 && <span className="page-ellipsis">…</span>}
              </>
            )}
            {pageNumbers.map((p) => (
              <button key={p} className={p === safePage ? 'active' : ''} onClick={() => goToPage(p)}>
                {p}
              </button>
            ))}
            {winEnd < totalPages && (
              <>
                {winEnd < totalPages - 1 && <span className="page-ellipsis">…</span>}
                <button onClick={() => goToPage(totalPages)}>{totalPages}</button>
              </>
            )}
          </div>
          <button disabled={safePage >= totalPages} onClick={() => goToPage(safePage + 1)} title="Next page">
            Next ›
          </button>
          <button disabled={safePage >= totalPages} onClick={() => goToPage(totalPages)} title="Last page">
            »
          </button>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      <div className="table-scroll-area">
        <table className="data">
          <thead>
            <tr>
              {view.cols.map(
                (col, i) =>
                  !hiddenCols.has(i) && (
                    <th key={col}>
                      {col}
                      <span className="sort">▾</span>
                    </th>
                  )
              )}
            </tr>
            <tr className="col-filter-row">
              {view.cols.map(
                (col, i) =>
                  !hiddenCols.has(i) && (
                    <th key={col}>
                      <input
                        type="text"
                        className="col-filter-input"
                        placeholder="Filter…"
                        value={columnFilters[i] || ''}
                        onChange={(e) => setColumnFilter(i, e.target.value)}
                      />
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={view.cols.length} style={{ textAlign: 'center', color: 'var(--ink-faint)', padding: 28 }}>
                  No rows match your column filters.
                </td>
              </tr>
            ) : (
              pageRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map(
                    (cell, cIdx) =>
                      !hiddenCols.has(cIdx) && (
                        <td key={cIdx} className={cellClassName(cell, cIdx === 0)}>
                          {renderCell(cell)}
                        </td>
                      )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
