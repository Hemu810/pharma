// Data-access layer for the app. Every function here does a real network
// fetch() against a JSON file today. Swapping to a live backend later means
// changing the URL (and maybe response shape) inside these functions only —
// no changes needed in components.

const BASE_URL = '/data';

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Request failed: ${path} (${res.status})`);
  }
  return res.json();
}

export function fetchModule(moduleKey) {
  return fetchJSON(`${BASE_URL}/${moduleKey}.json`);
}

export async function fetchAllModules(moduleKeys) {
  const entries = await Promise.all(
    moduleKeys.map(async (key) => [key, await fetchModule(key)])
  );
  return Object.fromEntries(entries);
}

export function fetchSavedSearches() {
  return fetchJSON(`${BASE_URL}/saved-searches.json`);
}
