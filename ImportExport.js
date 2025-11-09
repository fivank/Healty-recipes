// Import/Export helpers: JSON file read and export for full app state payloads.

const FILE_VERSION = 2;

export async function importAppStateFromFile(file) {
  if (!file) return null;
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid format');

  // Prefer the new "state" envelope; fall back to recipes-only payloads.
  if (parsed.state && typeof parsed.state === 'object') return parsed.state;

  if (Array.isArray(parsed.recipes)) {
    return { recipes: parsed.recipes };
  }

  if (Array.isArray(parsed)) {
    return { recipes: parsed };
  }

  throw new Error('Invalid format');
}

export function exportAppStateToFile(state) {
  const safeState = state && typeof state === 'object' ? state : { recipes: [] };
  const payload = {
    app: 'HealthyRecipeApp',
    version: FILE_VERSION,
    exportedAt: new Date().toISOString(),
    state: safeState,
    recipes: Array.isArray(safeState.recipes) ? safeState.recipes : []
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `healthy-state-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
