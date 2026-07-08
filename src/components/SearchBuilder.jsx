import { Fragment } from 'react';

export default function SearchBuilder({ open, conditions, setConditions, onRunSearch, onClear }) {
  // Cycles AND -> OR -> NOT -> AND. NOT reads as "AND NOT" in the criteria summary,
  // i.e. it excludes rows matching this condition rather than requiring them.
  const toggleJoin = (index) => {
    setConditions((prev) =>
      prev.map((c, i) => {
        if (i !== index) return c;
        const next = c.join === 'AND' ? 'OR' : c.join === 'OR' ? 'NOT' : 'AND';
        return { ...c, join: next };
      })
    );
  };

  const removeCondition = (index) => {
    setConditions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next[0]) delete next[0].join;
      return next;
    });
  };

  const addBlankCondition = () => {
    setConditions((prev) => [
      ...prev,
      { field: 'Country', op: '=', value: 'United States', join: prev.length ? 'AND' : undefined },
    ]);
  };

  const clearAll = () => {
    setConditions([]);
    onClear?.();
  };

  const joinClass = (join) => (join === 'OR' ? 'or' : join === 'NOT' ? 'not' : '');

  return (
    <div className={`qbuilder ${open ? 'open' : ''}`}>
      <div className="qbuilder-head">
        <h3>Search builder</h3>
        <button className="btn btn-ghost btn-sm" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <div className="qchain">
        {conditions.map((c, i) => (
          <Fragment key={`${c.field}-${i}`}>
            {i > 0 && (
              <div className="qbond">
                <span
                  className={`qbond-tag ${joinClass(c.join)}`}
                  onClick={() => toggleJoin(i)}
                  title="Click to cycle AND / OR / NOT"
                >
                  {c.join}
                </span>
              </div>
            )}
            <div className="qnode">
              <span className="qseg qfield">{c.field}</span>
              <span className="qseg qop">{c.op}</span>
              <span className="qseg qval">{c.value}</span>
              <button className="qnode-remove" onClick={() => removeCondition(i)}>
                ✕
              </button>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="qbuilder-actions">
        <button className="qadd" onClick={addBlankCondition}>
          + Add condition
        </button>
        <button className="btn btn-primary btn-sm" onClick={onRunSearch}>
          Run search
        </button>
      </div>
    </div>
  );
}
