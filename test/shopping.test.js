import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shoppingList, formatAmounts, listAsText, aisleFor, itemName, AISLES, mergeUnits, countName, itemLine } from '../src/lib/shopping.js';
import { emptyPlan, setMeal } from '../src/lib/plan.js';
import { RECIPES } from '../src/lib/recipes.js';

const find = (groups, name) => groups.flatMap(g => g.items).find(i => i.name === name);

test('amounts add up across the week and scale to the number of people', () => {
  let p = setMeal(emptyPlan(), 0, 'breakfast', 'overnight-oats');       // ½ cup oats, serves 1
  p = setMeal(p, 1, 'breakfast', 'overnight-oats');
  p = { ...p, people: 2 };
  const oats = find(shoppingList(p), 'rolled oats');
  assert.deepEqual(oats.amounts, [{ unit: 'cup', qty: 2 }]);
  assert.equal(formatAmounts(oats.amounts), '2 cups');
});

test('recipes made for more servings are scaled down to what is eaten', () => {
  const p = setMeal(emptyPlan(), 0, 'lunch', 'lentil-soup');             // serves 4: 1 cup lentils
  assert.equal(formatAmounts(find(shoppingList(p), 'dry lentils').amounts), '¼ cup');
});

test('the same food from different recipes lands on one line, by unit', () => {
  let p = setMeal(emptyPlan(), 0, 'lunch', 'chickpea-wrap');             // "celery stalk, diced"
  p = setMeal(p, 1, 'lunch', 'lentil-soup');                             // "celery stalks, diced"
  const celery = find(shoppingList(p), 'celery stalks');
  assert.equal(celery.recipes.length, 2);
  assert.equal(itemName('bell pepper, sliced'), 'bell pepper');
});

test('counted items round up and everything has an aisle', () => {
  assert.equal(formatAmounts([{ unit: '', qty: 1.5 }]), '2');
  assert.equal(formatAmounts([{ unit: '', qty: 2 }]), '2');
  assert.equal(aisleFor('salmon fillet'), 'Meat & seafood');
  assert.equal(aisleFor('plain Greek yogurt'), 'Dairy & eggs');
  for (const r of RECIPES) for (const i of r.ingredients) assert.notEqual(aisleFor(itemName(i.item)), 'Other', i.item);
});

test('groups come in aisle order and the text version has a checkbox per item', () => {
  let p = setMeal(emptyPlan(), 0, 'dinner', 'salmon-rice');
  p = setMeal(p, 0, 'breakfast', 'veggie-scramble');
  const groups = shoppingList(p);
  const order = groups.map(g => AISLES.indexOf(g.aisle));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  const text = listAsText(groups);
  assert.match(text, /\[ \] .*salmon fillet/);
  assert.match(text, /^Shopping list/);
});

test('teaspoons fold into tablespoons, ounces into pounds, and counts read naturally', () => {
  assert.deepEqual(mergeUnits([{ unit: 'tsp', qty: 3 }, { unit: 'tbsp', qty: 4 }]), [{ unit: 'tbsp', qty: 5 }]);
  assert.deepEqual(mergeUnits([{ unit: 'oz', qty: 8 }, { unit: 'lb', qty: 1 }]), [{ unit: 'lb', qty: 1.5 }]);
  assert.deepEqual(mergeUnits([{ unit: 'tsp', qty: 1 }]), [{ unit: 'tsp', qty: 1 }]);
  assert.equal(countName('apple', 2), 'apples');
  assert.equal(countName('apple', 1), 'apple');
  assert.equal(countName('cans tuna in water', 1), 'can tuna in water');
  assert.equal(countName('bell pepper', 2), 'bell peppers');
  assert.equal(countName('garlic cloves', 3), 'garlic cloves');
  assert.equal(itemLine({ name: 'lemon', amounts: [{ unit: '', qty: 1.5 }] }), '2 lemons');
  assert.equal(aisleFor('green beans'), 'Produce');
});
