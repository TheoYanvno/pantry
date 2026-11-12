// Saved favorite recipes (in the browser), and new recipes to try: ones that fit the profile that you
// haven't saved or planned yet, best fit first, with the pick turning over each day.
import { RECIPES, MEALS } from './recipes.js';
import { rankRecipes } from './rank.js';

const KEY = 'pantry:favorites';
const IDS = new Set(RECIPES.map((r) => r.id));

export function loadFavorites(storage = globalThis.localStorage) {
  try {
    const raw = JSON.parse(storage?.getItem(KEY) || '[]');
    return Array.isArray(raw) ? [...new Set(raw.filter((id) => IDS.has(id)))] : [];
  } catch { return []; }
}

export function saveFavorites(ids, storage = globalThis.localStorage) {
  try { storage?.setItem(KEY, JSON.stringify(ids)); return true; } catch { return false; }
}

export function toggleFavorite(ids, id) {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

/** Up to n recipes to try: from the ones shown, not favorites and not in the week plan. */
export function tryNew(shown, profile, plan, favorites, n = 3, day = Math.floor(Date.now() / 864e5)) {
  const planned = new Set(plan.days.flatMap((d) => MEALS.map((m) => d[m]).filter(Boolean)));
  const fresh = rankRecipes(shown.filter((r) => !favorites.includes(r.id) && !planned.has(r.id)), profile).map((x) => x.recipe);
  if (fresh.length <= n) return fresh;
  const top = fresh.slice(0, Math.max(n * 2, 6));
  const start = day % top.length;
  return Array.from({ length: n }, (_, k) => top[(start + k) % top.length]);
}
