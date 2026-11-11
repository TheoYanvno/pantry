// The week plan: one recipe (or nothing) for each meal of each day, how many people it's for, saved in
// the browser. "Fill with best fits" picks the best-ranked safe recipe for each meal, rotating through
// the top choices so the same dish doesn't land on two days in a row.
import { MEALS, findRecipe } from './recipes.js';
import { rankRecipes } from './rank.js';
import { visibleRecipes } from './profile.js';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const KEY = 'pantry:plan';

export function emptyPlan() {
  return { people: 1, days: DAYS.map(() => Object.fromEntries(MEALS.map(m => [m, null]))) };
}

// Unknown recipes, meals or bad numbers are dropped, so a damaged save never breaks the page.
export function cleanPlan(raw) {
  const plan = emptyPlan();
  if (!raw || typeof raw !== 'object') return plan;
  const people = Math.round(Number(raw.people));
  plan.people = Number.isFinite(people) ? Math.min(12, Math.max(1, people)) : 1;
  if (Array.isArray(raw.days)) {
    raw.days.slice(0, 7).forEach((day, i) => {
      for (const m of MEALS) {
        const id = day && day[m];
        const r = typeof id === 'string' ? findRecipe(id) : null;
        plan.days[i][m] = r && r.meal === m ? id : null;
      }
    });
  }
  return plan;
}

export function loadPlan(storage = globalThis.localStorage) {
  try { return cleanPlan(JSON.parse(storage?.getItem(KEY) || 'null')); } catch { return emptyPlan(); }
}

export function savePlan(plan, storage = globalThis.localStorage) {
  try { storage?.setItem(KEY, JSON.stringify(plan)); return true; } catch { return false; }
}

export function setMeal(plan, dayIndex, meal, recipeId) {
  const days = plan.days.map((d, i) => (i === dayIndex ? { ...d, [meal]: recipeId || null } : d));
  return { ...plan, days };
}

// Fills every empty slot (or every slot with overwrite) with safe, diet-matching recipes, best first.
export function suggestWeek(plan, recipes, profile, { overwrite = false } = {}) {
  const days = plan.days.map(d => ({ ...d }));
  for (const meal of MEALS) {
    const ranked = rankRecipes(visibleRecipes(recipes, profile, meal).shown, profile).map(x => x.recipe.id);
    if (!ranked.length) continue;
    const top = ranked.slice(0, Math.max(2, Math.min(4, ranked.length)));
    days.forEach((d, i) => {
      if (overwrite || !d[meal]) d[meal] = top[i % top.length];
    });
  }
  return { ...plan, days };
}

// Calories and protein for one person for each day, from one serving of each planned meal.
export function dayTotals(day) {
  let calories = 0, protein = 0, meals = 0;
  for (const m of MEALS) {
    const r = day[m] && findRecipe(day[m]);
    if (r) { calories += r.nutrition.calories; protein += r.nutrition.protein; meals++; }
  }
  return { calories, protein, meals };
}

// Planned recipes that the current profile would now hide (for example after adding an allergy).
export function conflicts(plan, profile) {
  const out = [];
  plan.days.forEach((d, i) => {
    for (const m of MEALS) {
      const r = d[m] && findRecipe(d[m]);
      if (!r) continue;
      const clash = r.allergens.filter(a => profile.allergies.includes(a));
      const diet = profile.diets.filter(x => !r.diets.includes(x));
      if (clash.length || diet.length) out.push({ day: DAYS[i], meal: m, recipe: r.name, allergens: clash, diets: diet });
    }
  });
  return out;
}
