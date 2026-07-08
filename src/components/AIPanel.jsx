import { useState } from 'react';
import { ICONS } from '../data/icons.jsx';

const SUGGESTIONS = [
  'Summarize this result set by phase and indication.',
  'Which assets here face the highest patent-cliff exposure by 2028?',
  'Compare sales forecast trajectory against cost-of-therapy trends.',
  'Flag any rows with elevated adverse event severity or regulatory risk.',
];

export default function AIPanel({ open, onClose, moduleLabel, viewLabel, rowCount, onOpenAIExport }) {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState(null); // { question }

  const runQuery = (q) => {
    if (!q.trim()) return;
    setAnswer({ question: q });
    setInput('');
  };

  return (
    <aside className="ai-panel">
      <div className="ai-panel-inner" style={{ display: open ? 'flex' : 'flex' }}>
        <div className="ai-head">
          <div className="ai-head-title">
            <ICONS.sparkles />
            AI Analyst
          </div>
          <button className="ai-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ai-body">
          {!answer && (
            <>
              <div className="ai-suggest-label">Suggested for this view</div>
              {SUGGESTIONS.map((s) => (
                <button className="ai-chip" key={s} onClick={() => runQuery(s)}>
                  {s}
                </button>
              ))}
            </>
          )}

          {answer && (
            <div className="ai-answer">
              <div className="ai-answer-q">&quot;{answer.question}&quot;</div>
              <p>
                Across the <span className="ref">{rowCount} rows</span> shown in{' '}
                <b>
                  {moduleLabel} · {viewLabel}
                </b>
                , three patterns stand out:
              </p>
              <ul>
                <li>
                  Assets skew toward <b>marketed / late Phase III</b> status, with the strongest forecast growth
                  concentrated in metabolic and oncology indications.
                </li>
                <li>
                  Two records carry elevated risk flags — one on patent exposure, one on adverse-event severity —
                  worth a closer look before this goes into a board pack.
                </li>
                <li>
                  Pricing spread across reference markets suggests <b>~30–80%</b> headroom between US list price and
                  the international median, consistent with the broader portfolio.
                </li>
              </ul>
              <p>Want this broken down by country, or turned into a chart for the Analytics view?</p>
              <div className="ai-cta">
                <span className="ai-cta-text">Add this analysis as a new column and export the full table</span>
                <button className="ai-export-btn" onClick={() => onOpenAIExport(answer.question)}>
                  <ICONS.export />
                  Export to Excel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="ai-input-row">
          <input
            type="text"
            placeholder="Ask about these results…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery(input)}
          />
          <button className="ai-send" onClick={() => runQuery(input)}>
            <ICONS.send />
          </button>
        </div>
      </div>
    </aside>
  );
}
