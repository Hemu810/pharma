import Badge from './Badge.jsx';
import { looksNumeric } from '../utils/classify.js';

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

export default function DataTable({ view, resultCount, hiddenCols }) {
  return (
    <>
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
        </thead>
        <tbody>
          {view.rows.map((row, rIdx) => (
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
          ))}
        </tbody>
      </table>

      <div className="tablefoot">
        <span>
          Showing {view.rows.length} of {resultCount} · sample preview
        </span>
        <div className="pagectrl">
          <button>‹ Prev</button>
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>Next ›</button>
          <select defaultValue="25">
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>
      </div>
    </>
  );
}
