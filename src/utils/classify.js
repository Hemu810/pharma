// Maps a status-ish string to a semantic badge tone.
// Kept as simple keyword lists so product/data folks can extend it without touching components.
const GOOD = ['Approved', 'Active', 'Recruiting', 'Met', 'Marketed', 'Fast Track', 'Low', 'Yes', 'On track', 'In-house'];
const WARN = ['Pending', 'Under Review', 'Ongoing', 'Moderate', 'Planned', 'Filed', 'Priority Review', 'Formulation change'];
const BAD = ['Discontinued', 'Not Met', 'High', 'Withdrawn', 'Serious', 'Terminated', 'Suspended'];

export function classifyBadge(value) {
  if (GOOD.some((g) => value.includes(g))) return 'good';
  if (BAD.some((b) => value.includes(b))) return 'bad';
  if (WARN.some((w) => value.includes(w))) return 'warn';
  return 'neutral';
}

// A cell is "numeric-looking" if, after stripping any currency symbol/commas/%, it's just digits.
export function looksNumeric(value) {
  return /^[$€£¥]?[\d,.]+%?$/.test(String(value).trim());
}
