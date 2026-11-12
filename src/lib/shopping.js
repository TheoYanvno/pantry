// The shopping list: every ingredient in the week plan, scaled to the number of people, added up by
// item and unit, and grouped by store aisle.
import { MEALS, findRecipe } from './recipes.js';
import { formatQty, formatUnit } from './servings.js';
import { CATALOG } from './catalog.js';

export const AISLES = ['Produce', 'Meat & seafood', 'Dairy & eggs', 'Refrigerated', 'Frozen', 'Bread & grains', 'Canned & dry goods', 'Spices, oils & sauces', 'Other'];


// Same food written two ways in different recipes.
const ALIASES = { 'celery stalk': 'celery stalks', 'mixed berries': 'berries', 'lettuce leaves': 'lettuce leaves' };

export function itemName(item) {
  const base = item.split(',')[0].trim();
  return ALIASES[base] || base;
}

// Each item's aisle comes from the catalog of everyday Walmart and Aldi items.
export function aisleFor(name) {
  return CATALOG[name]?.aisle ?? 'Other';
}

// [{ aisle, items: [{ name, amounts: [{ qty, unit }], recipes: [names] }] }] in aisle order.
export function shoppingList(plan) {
  const people = plan.people || 1;
  const byName = new Map();
  for (const day of plan.days) {
    for (const meal of MEALS) {
      const r = day[meal] && findRecipe(day[meal]);
      if (!r) continue;
      const factor = people / r.servings;
      for (const ing of r.ingredients) {
        const name = itemName(ing.item);
        const entry = byName.get(name) || { name, amounts: new Map(), recipes: new Set() };
        entry.amounts.set(ing.unit, (entry.amounts.get(ing.unit) || 0) + ing.qty * factor);
        entry.recipes.add(r.name);
        byName.set(name, entry);
      }
    }
  }
  const groups = new Map(AISLES.map(a => [a, []]));
  for (const e of [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    groups.get(aisleFor(e.name)).push({
      name: e.name,
      amounts: mergeUnits([...e.amounts].map(([unit, qty]) => ({ unit, qty }))),
      recipes: [...e.recipes],
    });
  }
  return AISLES.filter(a => groups.get(a).length).map(a => ({ aisle: a, items: groups.get(a) }));
}

// When the same item shows up in teaspoons and tablespoons (or ounces and pounds), add them up in
// the bigger unit so the list reads "2 tbsp olive oil", not "3 tsp + 1 tbsp".
const TO_BIGGER = { tsp: ['tbsp', 1 / 3], oz: ['lb', 1 / 16] };
export function mergeUnits(amounts) {
  const map = new Map(amounts.map(a => [a.unit, a.qty]));
  for (const [small, [big, factor]] of Object.entries(TO_BIGGER)) {
    if (map.has(small) && map.has(big)) {
      map.set(big, map.get(big) + map.get(small) * factor);
      map.delete(small);
    }
  }
  // Less than a tablespoon reads better in teaspoons: "1 tsp ginger", not "⅓ tbsp".
  if (map.has('tbsp') && map.get('tbsp') < 1 && !map.has('tsp')) {
    map.set('tsp', map.get('tbsp') * 3);
    map.delete('tbsp');
  }
  return [...map].map(([unit, qty]) => ({ unit, qty }));
}

// Recipes name some counted items in the plural ("2 carrots"); one of them is singular.
const ONE = { eggs: 'egg', carrots: 'carrot', 'celery stalks': 'celery stalk', 'garlic cloves': 'garlic clove',
  'lettuce leaves': 'lettuce leaf', 'sweet potatoes': 'sweet potato', 'large flour tortillas': 'large flour tortilla',
  'corn tortillas': 'corn tortilla' };

// Counted items read naturally: "2 apples", "1 carrot", "1 can tuna in water".
export function countName(name, qty) {
  const many = qty > 1;
  if (/^cans? /.test(name)) return name.replace(/^cans? /, many ? 'cans ' : 'can ');
  if (!many && ONE[name]) return ONE[name];
  if (!many || /s$/.test(name) || / /.test(name) && !/^(bell pepper|sweet potato)$/.test(name)) return name;
  return /o$/.test(name) && name !== 'avocado' ? `${name}es` : `${name}s`;
}

// "1 ½ cups + 2 tbsp" (count items round up: you can't buy half an avocado)
export function formatAmounts(amounts) {
  return amounts.map(({ qty, unit }) => {
    if (!unit) return String(Math.ceil(qty - 0.01));
    return `${formatQty(qty)} ${formatUnit(unit, qty)}`;
  }).join(' + ');
}

export function listAsText(groups, title = 'Shopping list') {
  const lines = [title, ''];
  for (const g of groups) {
    lines.push(g.aisle.toUpperCase());
    for (const it of g.items) lines.push(`[ ] ${itemLine(it)}`);
    lines.push('');
  }
  return lines.join('\n').trim() + '\n';
}

// One line of the list, e.g. "2 apples" or "1 ½ cups berries".
export function itemLine(it) {
  const only = it.amounts.length === 1 && !it.amounts[0].unit ? Math.ceil(it.amounts[0].qty - 0.01) : 0;
  return `${formatAmounts(it.amounts)} ${only ? countName(it.name, only) : it.name}`;
}
