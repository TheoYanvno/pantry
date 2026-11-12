// Rough prices for budgeting: typical store-brand (Great Value at Walmart, Aldi's own labels) shelf
// prices around Orlando, FL, in fall 2026, worked out per unit used in the recipes. Real prices change
// by store and week, so treat totals as a guide, not a quote.
//
// Each entry: [dollars, per unit]. Volume units (tsp, tbsp, cup) convert into each other, and so do
// weights (oz, lb); '' means each.
import { MEALS, findRecipe } from './recipes.js';
import { itemName } from './shopping.js';

export const PRICES = {
  'rolled oats': [0.23, 'cup'], milk: [0.22, 'cup'], 'plain Greek yogurt': [1.12, 'cup'], berries: [0.9, 'cup'],
  'chia seeds': [0.15, 'tbsp'], honey: [0.08, 'tsp'], eggs: [0.25, ''], 'baby spinach': [0.4, 'cup'],
  'bell pepper': [1.0, ''], 'shredded cheddar': [0.08, 'tbsp'], 'olive oil': [0.18, 'tbsp'],
  'whole wheat bread': [0.1, 'slice'], 'peanut butter': [0.09, 'tbsp'], banana: [0.25, ''], cinnamon: [0.04, 'tsp'],
  'firm tofu': [0.14, 'oz'], 'large flour tortillas': [0.31, ''], 'black beans': [0.6, 'cup'], 'can black beans': [0.06, 'oz'],
  salsa: [1.25, 'cup'], turmeric: [0.05, 'tsp'], 'chicken breast': [3.0, 'lb'], 'dry quinoa': [1.6, 'cup'],
  'broccoli florets': [0.5, 'cup'], lemon: [0.5, ''], 'can chickpeas': [0.06, 'oz'], hummus: [2.4, 'cup'],
  'celery stalks': [0.2, ''], lettuce: [0.3, 'cup'], 'lettuce leaves': [0.1, ''], 'sliced turkey': [0.45, 'oz'],
  avocado: [1.0, ''], tomato: [0.1, 'slice'], 'dry lentils': [0.67, 'cup'], carrots: [0.15, ''], onion: [0.6, ''],
  'low-sodium vegetable broth': [0.5, 'cup'], 'ground cumin': [0.05, 'tsp'], 'cans tuna in water': [1.0, ''],
  'salmon fillet': [9.0, 'lb'], 'dry brown rice': [0.45, 'cup'], 'green beans': [0.43, 'cup'], 'garlic cloves': [0.05, ''],
  'sirloin steak': [8.0, 'lb'], 'soy sauce': [0.07, 'tbsp'], 'ground ginger': [0.06, 'tsp'], 'dry white rice': [0.35, 'cup'],
  'corn tortillas': [0.07, ''], lime: [0.35, ''], pasta: [0.08, 'oz'], shrimp: [0.5, 'oz'], zucchini: [0.9, ''],
  'cherry tomatoes': [1.25, 'cup'], 'grated parmesan': [1.4, 'cup'], 'boneless chicken thighs': [2.5, 'lb'],
  'sweet potatoes': [0.9, ''], 'smoked paprika': [0.06, 'tsp'], granola: [1.0, 'cup'], 'sliced almonds': [0.13, 'tbsp'],
  cucumber: [0.7, ''], apple: [0.6, ''], 'almond butter': [0.24, 'tbsp'], 'shelled edamame': [1.0, 'cup'], 'sea salt': [0.01, 'tsp'],
};

const TO_TSP = { tsp: 1, tbsp: 3, cup: 48 };
const TO_OZ = { oz: 1, lb: 16 };

/** Dollars for qty of an ingredient in a recipe's unit, or null if the units can't be compared. */
export function priceOf(name, qty, unit) {
  const p = PRICES[name];
  if (!p) return null;
  const [dollars, per] = p;
  if (unit === per) return dollars * qty;
  if (TO_TSP[unit] && TO_TSP[per]) return dollars * qty * TO_TSP[unit] / TO_TSP[per];
  if (TO_OZ[unit] && TO_OZ[per]) return dollars * qty * TO_OZ[unit] / TO_OZ[per];
  return null;
}

/** { total, perServing } in dollars for a whole recipe as written. */
export function recipeCost(recipe) {
  const total = recipe.ingredients.reduce((sum, ing) => sum + (priceOf(itemName(ing.item), ing.qty, ing.unit) ?? 0), 0);
  return { total, perServing: total / recipe.servings };
}

/** The week plan's food cost: one serving per person for every planned meal. */
export function planCost(plan) {
  let total = 0;
  for (const day of plan.days) for (const m of MEALS) {
    const r = day[m] && findRecipe(day[m]);
    if (r) total += recipeCost(r).perServing * plan.people;
  }
  return total;
}

export const money = (n) => `$${n.toFixed(2)}`;

// Budget choices for the profile: the most a serving may cost (0 means any price).
export const BUDGETS = [0, 2, 3, 4, 5];
export const fitsBudget = (recipe, budget) => !budget || recipeCost(recipe).perServing <= budget;
