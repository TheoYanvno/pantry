// Faith-based ways of eating, worked out from what each recipe is made of (catalog.js). Pantry can only
// leave out ingredients a tradition forbids; it can't certify food. Where a tradition also asks how food
// is produced (halal or kosher meat, for example), the recipe page says so. Practice differs between
// communities, so follow your own tradition and clergy.
import { contents } from './catalog.js';
import { itemName } from './shopping.js';

export const FAITH_DIETS = {
  halal: {
    label: 'Halal',
    rule: 'No pork or alcohol (none of these recipes have either).',
    allows: () => true,
    note: (has) => (has.has('poultry') || has.has('beef') ? 'Buy halal meat (look for a halal label at Walmart, or a halal butcher).' : ''),
  },
  kosher: {
    label: 'Kosher-style',
    rule: 'No pork or shellfish, and no meat and dairy in the same dish.',
    allows: (has) => !has.has('shellfish') && !((has.has('poultry') || has.has('beef')) && has.has('dairy')),
    note: (has) => (has.has('poultry') || has.has('beef') || has.has('dairy') ? 'For kosher, use meat and cheese with a kosher certification.' : ''),
  },
  'no-beef': {
    label: 'No beef (Hindu)',
    rule: 'Leaves out beef. Pick Vegetarian too if you keep a vegetarian diet.',
    allows: (has) => !has.has('beef'),
    note: () => '',
  },
  'orthodox-fast': {
    label: 'Orthodox fasting',
    rule: 'No meat, poultry, fish, dairy or eggs; shellfish is allowed.',
    allows: (has) => !['poultry', 'beef', 'fish', 'dairy', 'eggs'].some((t) => has.has(t)),
    note: (has) => (has.has('oil') ? 'On strict fast days many skip olive oil; leave it out or ask your priest.' : ''),
  },
  lent: {
    label: 'Meatless days (Lent)',
    rule: 'No meat or poultry; fish, dairy and eggs are fine.',
    allows: (has) => !has.has('poultry') && !has.has('beef'),
    note: () => '',
  },
};
export const FAITHS = Object.keys(FAITH_DIETS);

export function fitsFaith(recipe, faiths = []) {
  if (!faiths.length) return true;
  const has = contents(recipe, itemName);
  return faiths.every((f) => FAITH_DIETS[f]?.allows(has) ?? true);
}

/** Notes to show on a recipe for the chosen traditions, like buying halal meat. */
export function faithNotes(recipe, faiths = []) {
  const has = contents(recipe, itemName);
  return faiths.map((f) => FAITH_DIETS[f]?.note(has)).filter(Boolean);
}
