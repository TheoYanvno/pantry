import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES, findRecipe } from '../src/lib/recipes.js';
import { PRICES, priceOf, recipeCost, planCost, fitsBudget, money } from '../src/lib/prices.js';
import { CATALOG } from '../src/lib/catalog.js';
import { itemName } from '../src/lib/shopping.js';
import { emptyPlan, setMeal } from '../src/lib/plan.js';
import { cleanProfile, visibleRecipes, profileSummary, defaultProfile } from '../src/lib/profile.js';

test('every catalog item has a price, and every recipe amount can be priced', () => {
  assert.deepEqual(Object.keys(PRICES).sort(), Object.keys(CATALOG).sort());
  for (const r of RECIPES) for (const ing of r.ingredients) assert.notEqual(priceOf(itemName(ing.item), ing.qty, ing.unit), null, `${r.id}: ${ing.item}`);
});

test('units convert: teaspoons and tablespoons, ounces and pounds', () => {
  assert.ok(Math.abs(priceOf('olive oil', 3, 'tsp') - priceOf('olive oil', 1, 'tbsp')) < 1e-9);
  assert.equal(priceOf('chicken breast', 8, 'oz'), 1.5);
  assert.equal(priceOf('eggs', 2, 'cup'), null);
});

test('cost per serving, a week plan, and budgets', () => {
  const soup = recipeCost(findRecipe('lentil-soup'));
  assert.ok(Math.abs(soup.total - 4.0) < 0.05 && Math.abs(soup.perServing - 1.0) < 0.02, money(soup.total));
  let plan = setMeal(emptyPlan(), 0, 'lunch', 'lentil-soup');
  plan = { ...setMeal(plan, 1, 'lunch', 'lentil-soup'), people: 2 };
  assert.ok(Math.abs(planCost(plan) - 4 * soup.perServing) < 1e-9);
  assert.equal(fitsBudget(findRecipe('salmon-rice'), 3), false);
  assert.equal(fitsBudget(findRecipe('salmon-rice'), 0), true);
  const cheap = visibleRecipes(RECIPES, cleanProfile({ ...defaultProfile(), budget: 2 })).shown;
  assert.ok(cheap.length > 5 && cheap.every(r => recipeCost(r).perServing <= 2));
  assert.equal(cleanProfile({ budget: 7 }).budget, 0);
  assert.match(profileSummary({ ...defaultProfile(), budget: 3 }), /up to \$3 a serving/);
});
