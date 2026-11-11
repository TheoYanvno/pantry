// The profile: a goal, daily calorie and protein targets, diet choices and allergies, saved in the
// browser. Starting targets are general examples only; people should set their own, ideally with a
// doctor or dietitian.
import { DIETS, ALLERGENS } from './recipes.js';

const KEY = 'pantry:profile';

export const GOALS = {
  lose: { label: 'Lose weight', calories: 1800, protein: 120 },
  maintain: { label: 'Maintain', calories: 2200, protein: 110 },
  gain: { label: 'Gain muscle', calories: 2700, protein: 150 },
};

export const LIMITS = { calories: [1200, 4500], protein: [40, 300] };

export function defaultProfile() {
  return { goal: 'maintain', calories: GOALS.maintain.calories, protein: GOALS.maintain.protein, diets: [], allergies: [] };
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
    allergies: Array.isArray(raw.allergies) ? ALLERGENS.filter(x => raw.allergies.includes(x)) : [],
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
  const pool = recipes.filter(r => (meal === 'all' || r.meal === meal) && fitsDiets(r, profile.diets));
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
