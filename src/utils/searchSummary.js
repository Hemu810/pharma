// Turns the search-builder's condition chain into a single readable line,
// e.g. "Indication = Oncology AND Phase = III AND NOT Trial Status = Withdrawn".
// Used for the confirmation banner shown after "Run search".
export function buildCriteriaSummary(conditions) {
  if (!conditions.length) return '';
  return conditions
    .map((c, i) => {
      const prefix = i === 0 ? '' : c.join === 'NOT' ? 'AND NOT ' : `${c.join} `;
      return `${prefix}${c.field} ${c.op} ${c.value}`;
    })
    .join(' ');
}
