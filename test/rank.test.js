import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mealTargets, fitScore, fitReason, rankRecipes } from '../src/lib/rank.js';
import { RECIPES } from '../src/lib/recipes.js';

const profile = { calories: 2000, protein: 120, diets: [], allergies: [] };
const make = (meal, calories, protein) => ({ id: 'x', name: 'X', meal, nutrition: { calories, protein } });

test('each meal gets its share of the day', () => {
  assert.deepEqual(mealTargets(profile, 'dinner'), { calories: 700, protein: 42 });
  assert.deepEqual(mealTargets(profile, 'snack'), { calories: 200, protein: 12 });
});

test('a serving right on target scores 100, and missing it costs points', () => {
  assert.equal(fitScore(make('lunch', 600, 36), profile), 100);
  assert.equal(fitScore(make('lunch', 600, 50), profile), 100);    // extra protein is fine
  assert.equal(fitScore(make('lunch', 300, 36), profile), 70);     // half the calories: -30
  assert.equal(fitScore(make('lunch', 600, 18), profile), 80);     // half the protein: -20
  assert.equal(fitScore(make('lunch', 5000, 0), profile), 0);
});

test('reasons say what is over or under', () => {
  assert.equal(fitReason(make('lunch', 540, 45), profile), '60 cal under your 600-cal lunch target; 9 g more protein than the 36 g goal');
  assert.equal(fitReason(make('lunch', 610, 30), profile), 'right on your 600-cal lunch target; 6 g short of the 36 g protein goal');
});

test('ranking puts the best fits first', () => {
  const ranked = rankRecipes(RECIPES, profile);
  assert.equal(ranked.length, RECIPES.length);
  for (let k = 1; k < ranked.length; k++) assert.ok(ranked[k - 1].score >= ranked[k].score);
});
