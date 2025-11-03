// Import/Export helpers: JSON file read and export to download.

export async function importRecipesFromFile(file) {
  if (!file) return [];
  const text = await file.text();
  const parsed = JSON.parse(text);
  const items = parsed.recipes || (Array.isArray(parsed) ? parsed : []);
  if (!Array.isArray(items)) throw new Error('Invalid format');
  return items;
}

export function exportRecipesToFile(recipes) {
  const payload = { app: 'HealthyRecipeApp', version: 1, exportedAt: new Date().toISOString(), count: recipes.length, recipes };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recipes-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
