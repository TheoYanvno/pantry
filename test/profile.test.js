import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanProfile, defaultProfile, withGoal, loadProfile, saveProfile, fitsDiets, GOALS } from '../src/lib/profile.js';
import { findRecipe } from '../src/lib/recipes.js';

function memory(initial) {
  const m = new Map(initial ? [['pantry:profile', initial]] : []);
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('a profile saves and loads back', () => {
  const store = memory();
  const p = { ...withGoal(defaultProfile(), 'gain'), diets: ['vegetarian'], allergies: ['peanuts'] };
  assert.equal(saveProfile(p, store), true);
  assert.deepEqual(loadProfile(store), p);
});

test('bad saved data is cleaned instead of breaking the app', () => {
  assert.deepEqual(loadProfile(memory('{oops')), defaultProfile());
  const p = cleanProfile({ goal: 'fly', calories: 99999, protein: 'lots', diets: ['vegan', 'keto'], allergies: ['gluten', 'soy'] });
  assert.equal(p.goal, 'maintain');
  assert.equal(p.calories, 4500);
  assert.equal(p.protein, GOALS.maintain.protein);
  assert.deepEqual(p.diets, ['vegan']);
  assert.deepEqual(p.allergies, ['soy']);
});

test('choosing a goal fills in its example targets', () => {
  const p = withGoal(defaultProfile(), 'lose');
  assert.equal(p.calories, GOALS.lose.calories);
  assert.equal(p.protein, GOALS.lose.protein);
});

test('a recipe must carry every chosen diet', () => {
  assert.equal(fitsDiets(findRecipe('lentil-soup'), ['vegan', 'gluten-free']), true);
  assert.equal(fitsDiets(findRecipe('overnight-oats'), ['vegan']), false);
  assert.equal(fitsDiets(findRecipe('turkey-avocado'), []), true);
});
