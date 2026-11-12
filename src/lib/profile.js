// The profile: a goal, daily calorie and protein targets, diet choices and allergies, saved in the
// browser. Starting targets are general examples only; people should set their own, ideally with a
// doctor or dietitian.
import { DIETS, ALLERGENS } from './recipes.js';
import { BUDGETS, fitsBudget } from './prices.js';
import { FAITHS, fitsFaith, FAITH_DIETS } from './diets.js';

const KEY = 'pantry:profile';

export const GOALS = {
  lose: { label: 'Lose weight', calories: 1800, protein: 120 },
  maintain: { label: 'Maintain', calories: 2200, protein: 110 },
  gain: { label: 'Gain muscle', calories: 2700, protein: 150 },
};

export const LIMITS = { calories: [1200, 4500], protein: [40, 300] };

export function defaultProfile() {
  return { goal: 'maintain', calories: GOALS.maintain.calories, protein: GOALS.maintain.protein, diets: [], faiths: [], allergies: [], budget: 0 };
}

function clamp(n, [lo, hi], fallback) {
  const v = Math.round(Number(n));
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback;
}

// Clean up anything saved or typed: unknown goals, diets and allergens are dropped, numbers kept in range.
export function cleanProfile(raw) {
  const d = defaultProfile();
  if (!raw || typeof raw !== 'object') return d;
  return {
    goal: GOALS[raw.goal] ? raw.goal : d.goal,
    calories: clamp(raw.calories, LIMITS.calories, d.calories),
    protein: clamp(raw.protein, LIMITS.protein, d.protein),
    diets: Array.isArray(raw.diets) ? DIETS.filter(x => raw.diets.includes(x)) : [],
    faiths: Array.isArray(raw.faiths) ? FAITHS.filter(x => raw.faiths.includes(x)) : [],
    allergies: Array.isArray(raw.allergies) ? ALLERGENS.filter(x => raw.allergies.includes(x)) : [],
    budget: BUDGETS.includes(Number(raw.budget)) ? Number(raw.budget) : 0,
  };
}

// Picking a goal fills in its example targets.
export function withGoal(profile, goal) {
  return GOALS[goal] ? { ...profile, goal, calories: GOALS[goal].calories, protein: GOALS[goal].protein } : profile;
}

export function loadProfile(storage = globalThis.localStorage) {
  try { return cleanProfile(JSON.parse(storage?.getItem(KEY) || 'null')); } catch { return defaultProfile(); }
}

export function saveProfile(profile, storage = globalThis.localStorage) {
  try { storage?.setItem(KEY, JSON.stringify(profile)); return true; } catch { return false; }
}

// A recipe fits the chosen diets only when it carries every one of them.
export function fitsDiets(recipe, diets) {
  return diets.every(d => recipe.diets.includes(d));
}

// A recipe is safe only when it contains none of the person's allergens.
export function isSafe(recipe, allergies) {
  return !recipe.allergens.some(a => allergies.includes(a));
}

// The recipes to show, plus how many were hidden for allergies (so the page can say so).
export function visibleRecipes(recipes, profile, meal = 'all') {
  const pool = recipes.filter(r => (meal === 'all' || r.meal === meal) && fitsDiets(r, profile.diets) && fitsFaith(r, profile.faiths) && fitsBudget(r, profile.budget));
  const shown = pool.filter(r => isSafe(r, profile.allergies));
  return { shown, hiddenForAllergies: pool.length - shown.length };
}

// Search by recipe name or ingredient (all words must match), and an optional time limit in minutes.
export function matchesSearch(recipe, words = '', maxMinutes = 0) {
  if (maxMinutes && recipe.minutes > maxMinutes) return false;
  const terms = words.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const text = [recipe.name, ...recipe.ingredients.map(i => i.item), recipe.meal, ...recipe.diets].join(' ').toLowerCase();
  return terms.every(t => text.includes(t));
}

// One line for the folded profile on small screens: "Maintain · 2,200 cal · 110 g protein · no milk or eggs".
export function profileSummary(profile) {
  const p = cleanProfile(profile);
  const parts = [GOALS[p.goal]?.label || 'Custom', `${p.calories.toLocaleString('en-US')} cal`, `${p.protein} g protein`];
  if (p.diets.length) parts.push(p.diets.join(', '));
  if (p.faiths.length) parts.push(p.faiths.map(f => FAITH_DIETS[f].label.toLowerCase()).join(', '));
  if (p.budget) parts.push(`up to $${p.budget} a serving`);
  if (p.allergies.length) {
    const a = p.allergies;
    parts.push(`no ${a.length === 1 ? a[0] : `${a.slice(0, -1).join(', ')} or ${a[a.length - 1]}`}`);
  }
  return parts.join(' · ');
}
