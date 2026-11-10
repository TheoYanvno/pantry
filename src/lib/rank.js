// Ranking recipes by how well one serving fits the day's targets. Each meal gets a share of the
// daily calories and protein, and a recipe scores higher the closer it lands to that share.

export const MEAL_SHARE = { breakfast: 0.25, lunch: 0.3, dinner: 0.35, snack: 0.1 };

export function mealTargets(profile, meal) {
  const share = MEAL_SHARE[meal] ?? 0.25;
  return { calories: Math.round(profile.calories * share), protein: Math.round(profile.protein * share) };
}

// 0-100: calories count for 60 points (lost as the serving drifts above or below the target) and
// protein for 40 (lost only when the serving falls short; extra protein isn't penalized).
export function fitScore(recipe, profile) {
  const t = mealTargets(profile, recipe.meal);
  const n = recipe.nutrition;
  const calMiss = Math.min(1, Math.abs(n.calories - t.calories) / t.calories);
  const proteinShort = Math.min(1, Math.max(0, t.protein - n.protein) / t.protein);
  return Math.round(100 - calMiss * 60 - proteinShort * 40);
}

// A short reason a person can read, like "60 cal under your 550-cal lunch target, 9 g more protein".
export function fitReason(recipe, profile) {
  const t = mealTargets(profile, recipe.meal);
  const n = recipe.nutrition;
  const dc = n.calories - t.calories;
  const dp = n.protein - t.protein;
  const cal = Math.abs(dc) <= t.calories * 0.05 ? `right on your ${t.calories}-cal ${recipe.meal} target`
    : `${Math.abs(dc)} cal ${dc > 0 ? 'over' : 'under'} your ${t.calories}-cal ${recipe.meal} target`;
  const pro = dp >= 0 ? `${dp ? `${dp} g more protein than` : 'meets'} the ${t.protein} g goal` : `${-dp} g short of the ${t.protein} g protein goal`;
  return `${cal}; ${pro}`;
}

export function rankRecipes(recipes, profile) {
  return recipes
    .map(r => ({ recipe: r, score: fitScore(r, profile) }))
    .sort((a, b) => b.score - a.score || a.recipe.name.localeCompare(b.recipe.name));
}
