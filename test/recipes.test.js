import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES, ALLERGENS, DIETS, MEALS, LOW_SODIUM_MG, findRecipe } from '../src/lib/recipes.js';

test('every recipe is complete and uses known meals, allergens and diets', () => {
  const ids = new Set();
  for (const r of RECIPES) {
    assert.ok(!ids.has(r.id), `duplicate ${r.id}`);
    ids.add(r.id);
    assert.ok(MEALS.includes(r.meal), r.id);
    assert.ok(r.servings >= 1 && r.minutes > 0, r.id);
    assert.ok(r.ingredients.length && r.steps.length, r.id);
    for (const a of r.allergens) assert.ok(ALLERGENS.includes(a), `${r.id}: ${a}`);
    for (const d of r.diets) assert.ok(DIETS.includes(d), `${r.id}: ${d}`);
    for (const k of ['calories', 'protein', 'carbs', 'fat', 'sodium']) assert.ok(Number.isFinite(r.nutrition[k]), `${r.id}: ${k}`);
  }
  for (const m of MEALS) assert.ok(RECIPES.some(r => r.meal === m), m);
});

test('calories roughly match protein, carbs and fat (4/4/9 per gram)', () => {
  for (const r of RECIPES) {
    const { calories, protein, carbs, fat } = r.nutrition;
    const fromMacros = protein * 4 + carbs * 4 + fat * 9;
    assert.ok(Math.abs(fromMacros - calories) / calories < 0.15, `${r.id}: ${calories} vs ${fromMacros}`);
  }
});

test('diet tags agree with the allergens and sodium', () => {
  const animal = /chicken|beef|steak|turkey|salmon|tuna|shrimp|honey|yogurt|milk|cheddar|parmesan|egg/i;
  for (const r of RECIPES) {
    const text = r.ingredients.map(x => x.item).join(' ');
    if (r.diets.includes('vegan')) {
      assert.ok(!r.allergens.some(a => ['milk', 'eggs', 'fish', 'shellfish'].includes(a)), r.id);
      assert.ok(!animal.test(text), `${r.id} is tagged vegan but has ${text.match(animal)}`);
      assert.ok(r.diets.includes('vegetarian'), r.id);
    }
    if (r.diets.includes('vegetarian')) assert.ok(!/chicken|beef|steak|turkey|salmon|tuna|shrimp/i.test(text), r.id);
    if (r.diets.includes('gluten-free')) assert.ok(!r.allergens.includes('wheat') && !/oats|bread|pasta|flour|soy sauce|granola/i.test(text), r.id);
    assert.equal(r.diets.includes('low sodium'), r.nutrition.sodium <= LOW_SODIUM_MG, r.id);
  }
});

test('findRecipe looks recipes up by id', () => {
  assert.equal(findRecipe('lentil-soup').name, 'Lentil Soup');
  assert.equal(findRecipe('nope'), null);
});
