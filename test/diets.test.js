import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES, findRecipe } from '../src/lib/recipes.js';
import { fitsFaith, faithNotes, FAITHS } from '../src/lib/diets.js';
import { loadFavorites, saveFavorites, toggleFavorite, tryNew } from '../src/lib/favorites.js';
import { cleanProfile, visibleRecipes, defaultProfile, profileSummary } from '../src/lib/profile.js';
import { emptyPlan, setMeal, conflicts } from '../src/lib/plan.js';

const ids = (faiths) => RECIPES.filter(r => fitsFaith(r, faiths)).map(r => r.id);

test('Orthodox fasting leaves out meat, fish, dairy and eggs but keeps shellfish-free vegan meals', () => {
  const fast = ids(['orthodox-fast']);
  for (const id of ['lentil-soup', 'black-bean-tacos', 'tofu-burrito', 'hummus-veggies']) assert.ok(fast.includes(id), id);
  for (const id of ['salmon-rice', 'veggie-scramble', 'overnight-oats', 'chicken-quinoa-bowl', 'shrimp-primavera']) assert.ok(!fast.includes(id), id);
  assert.deepEqual(faithNotes(findRecipe('tofu-burrito'), ['orthodox-fast']), ['On strict fast days many skip olive oil; leave it out or ask your priest.']);
});

test('kosher-style drops shellfish and meat with dairy; halal notes the meat; no beef and Lent', () => {
  const k = ids(['kosher']);
  assert.ok(!k.includes('shrimp-primavera'));
  assert.ok(k.includes('salmon-rice') && k.includes('chicken-sweet-potato'));
  assert.ok(ids(['halal']).length === RECIPES.length);
  assert.match(faithNotes(findRecipe('beef-broccoli'), ['halal'])[0], /halal meat/);
  assert.deepEqual(faithNotes(findRecipe('lentil-soup'), ['halal']), []);
  assert.ok(!ids(['no-beef']).includes('beef-broccoli'));
  const lent = ids(['lent']);
  assert.ok(lent.includes('salmon-rice') && lent.includes('veggie-scramble') && !lent.includes('turkey-avocado'));
});

test('faith choices are saved with the profile, filter recipes and flag planned meals', () => {
  const p = cleanProfile({ ...defaultProfile(), faiths: ['orthodox-fast', 'nope'] });
  assert.deepEqual(p.faiths, ['orthodox-fast']);
  assert.ok(visibleRecipes(RECIPES, p).shown.every(r => fitsFaith(r, ['orthodox-fast'])));
  assert.match(profileSummary(p), /orthodox fasting/);
  const plan = setMeal(emptyPlan(), 0, 'dinner', 'salmon-rice');
  assert.deepEqual(conflicts(plan, p)[0].diets, ['orthodox fasting']);
  assert.equal(FAITHS.length, 5);
});

test('favorites save, toggle and ignore unknown ids; new things to try skip favorites and planned meals', () => {
  const m = new Map();
  const store = { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  saveFavorites(toggleFavorite(toggleFavorite([], 'lentil-soup'), 'edamame'), store);
  assert.deepEqual(loadFavorites(store), ['lentil-soup', 'edamame']);
  assert.deepEqual(toggleFavorite(['lentil-soup'], 'lentil-soup'), []);
  m.set('pantry:favorites', JSON.stringify(['nope', 'edamame'])); assert.deepEqual(loadFavorites(store), ['edamame']);
  const plan = setMeal(emptyPlan(), 0, 'lunch', 'chicken-quinoa-bowl');
  const picks = tryNew(RECIPES, defaultProfile(), plan, ['edamame'], 3, 1);
  assert.equal(picks.length, 3);
  assert.ok(picks.every(r => r.id !== 'edamame' && r.id !== 'chicken-quinoa-bowl'));
  assert.notDeepEqual(picks.map(r => r.id), tryNew(RECIPES, defaultProfile(), plan, ['edamame'], 3, 2).map(r => r.id));
});
