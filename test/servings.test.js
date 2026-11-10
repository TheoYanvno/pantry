import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatQty, formatIngredient, scaleRecipe } from '../src/lib/servings.js';
import { findRecipe } from '../src/lib/recipes.js';

test('amounts become kitchen fractions', () => {
  assert.equal(formatQty(1.5), '1 ½');
  assert.equal(formatQty(0.25), '¼');
  assert.equal(formatQty(0.33), '⅓');
  assert.equal(formatQty(2), '2');
  assert.equal(formatQty(0.97), '1');
  assert.equal(formatQty(2.74), '2 ¾');
  assert.equal(formatQty(0.02), '⅛');
  assert.equal(formatQty(14.4), '14');
});

test('units turn plural above one', () => {
  assert.equal(formatIngredient({ qty: 1.5, unit: 'cup', item: 'rolled oats' }), '1 ½ cups rolled oats');
  assert.equal(formatIngredient({ qty: 0.5, unit: 'cup', item: 'milk' }), '½ cup milk');
  assert.equal(formatIngredient({ qty: 3, unit: '', item: 'eggs' }), '3 eggs');
});

test('scaling a recipe multiplies every ingredient', () => {
  const soup = findRecipe('lentil-soup');                // serves 4
  const half = scaleRecipe(soup, 2);
  assert.equal(half.servings, 2);
  assert.equal(formatIngredient(half.ingredients[0]), '½ cup dry lentils');
  assert.equal(scaleRecipe(soup, 0).servings, 1);
  assert.equal(scaleRecipe(soup, 99).servings, 24);
});
