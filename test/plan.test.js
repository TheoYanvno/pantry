import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyPlan, cleanPlan, loadPlan, savePlan, setMeal, suggestWeek, dayTotals, conflicts, DAYS } from '../src/lib/plan.js';
import { RECIPES, MEALS, findRecipe } from '../src/lib/recipes.js';
import { defaultProfile } from '../src/lib/profile.js';

function memory(initial) {
  const m = new Map(initial ? [['pantry:plan', initial]] : []);
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('a plan has 7 days of 4 meals and saves and loads back', () => {
  const p = setMeal(emptyPlan(), 2, 'dinner', 'salmon-rice');
  assert.equal(p.days.length, 7);
  assert.deepEqual(Object.keys(p.days[0]), MEALS);
  const store = memory();
  savePlan(p, store);
  assert.deepEqual(loadPlan(store), p);
});

test('damaged or wrong saved plans are cleaned', () => {
  assert.deepEqual(loadPlan(memory('nope')), emptyPlan());
  const p = cleanPlan({ people: 99, days: [{ breakfast: 'salmon-rice', dinner: 'salmon-rice', lunch: 'made-up' }] });
  assert.equal(p.people, 12);
  assert.equal(p.days[0].breakfast, null);        // a dinner recipe can't sit in breakfast
  assert.equal(p.days[0].dinner, 'salmon-rice');
  assert.equal(p.days[0].lunch, null);
});

test('best fits fill every slot, respect allergies and diets, and vary day to day', () => {
  const profile = { ...defaultProfile(), diets: ['vegetarian'], allergies: ['peanuts'] };
  const p = suggestWeek(emptyPlan(), RECIPES, profile);
  for (const day of p.days) {
    for (const m of MEALS) {
      const r = findRecipe(day[m]);
      assert.ok(r, `${m} filled`);
      assert.ok(r.diets.includes('vegetarian') && !r.allergens.includes('peanuts'), r.id);
    }
  }
  const open = suggestWeek(emptyPlan(), RECIPES, defaultProfile());     // with several dinners to pick from
  for (let i = 1; i < 7; i++) assert.notEqual(open.days[i].dinner, open.days[i - 1].dinner);
});

test('filling keeps meals already chosen unless asked to replace them', () => {
  const start = setMeal(emptyPlan(), 0, 'lunch', 'lentil-soup');
  assert.equal(suggestWeek(start, RECIPES, defaultProfile()).days[0].lunch, 'lentil-soup');
});

test('day totals add one serving of each meal', () => {
  const d = { breakfast: 'overnight-oats', lunch: 'lentil-soup', dinner: null, snack: 'edamame' };
  assert.deepEqual(dayTotals(d), { calories: 380 + 260 + 190, protein: 18 + 16 + 17, meals: 3 });
});

test('planned meals that clash with a new allergy are listed', () => {
  const p = setMeal(emptyPlan(), 4, 'snack', 'apple-almond-butter');
  const c = conflicts(p, { ...defaultProfile(), allergies: ['tree nuts'] });
  assert.equal(c.length, 1);
  assert.equal(c[0].day, DAYS[4]);
});
