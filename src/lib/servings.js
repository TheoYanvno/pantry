// Scaling a recipe and writing amounts the way a cook reads them: 1 ½ cups, not 1.5 cup.

const FRACTIONS = [[0, ''], [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'], [1, '']];

// Rounds to the nearest common kitchen fraction. Big amounts (10 and up) are rounded to whole numbers.
export function formatQty(n) {
  if (!Number.isFinite(n) || n <= 0) return '0';
  if (n >= 10) return String(Math.round(n));
  let whole = Math.floor(n);
  const rest = n - whole;
  let best = FRACTIONS[0];
  for (const f of FRACTIONS) if (Math.abs(rest - f[0]) < Math.abs(rest - best[0])) best = f;
  if (best[0] === 1) { whole += 1; best = FRACTIONS[0]; }
  if (whole === 0 && !best[1]) return '⅛';             // never show 0 for something that's in the recipe
  return whole && best[1] ? `${whole} ${best[1]}` : whole ? String(whole) : best[1];
}

const PLURAL = { cup: 'cups', slice: 'slices', lb: 'lb', oz: 'oz', tbsp: 'tbsp', tsp: 'tsp' };

export function formatUnit(unit, qty) {
  if (!unit) return '';
  return qty > 1 ? PLURAL[unit] || `${unit}s` : unit;
}

export function scaleIngredient(ing, factor) {
  return { ...ing, qty: ing.qty * factor };
}

// "1 ½ cups rolled oats", "3 eggs"
export function formatIngredient(ing) {
  const unit = formatUnit(ing.unit, ing.qty);
  return [formatQty(ing.qty), unit, ing.item].filter(Boolean).join(' ');
}

export function scaleRecipe(recipe, servings) {
  const n = Math.max(1, Math.min(24, Math.round(servings)));
  const factor = n / recipe.servings;
  return { servings: n, ingredients: recipe.ingredients.map(i => scaleIngredient(i, factor)) };
}
