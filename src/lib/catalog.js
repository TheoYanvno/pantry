// Every ingredient Pantry uses, as you'd find it on the shelf. Recipes only use everyday items that
// Walmart and Aldi both normally stock (store brands like Great Value at Walmart and Aldi's own labels
// work fine), so a week's shopping fits one trip to either store. What each store carries can vary by
// location and season, so check your store's app if something is missing.
//
// Each entry: the store aisle, and what the ingredient is, for diet rules (see diets.js):
//   poultry, beef, fish (fish with fins and scales), shellfish, dairy, eggs, honey, oil

export const CATALOG = {
  'rolled oats': { aisle: 'Bread & grains' },
  milk: { aisle: 'Dairy & eggs', is: ['dairy'] },
  'plain Greek yogurt': { aisle: 'Dairy & eggs', is: ['dairy'] },
  berries: { aisle: 'Frozen', note: 'frozen mixed berries keep longest' },
  'chia seeds': { aisle: 'Canned & dry goods' },
  honey: { aisle: 'Canned & dry goods', is: ['honey'] },
  eggs: { aisle: 'Dairy & eggs', is: ['eggs'] },
  'baby spinach': { aisle: 'Produce' },
  'bell pepper': { aisle: 'Produce' },
  'shredded cheddar': { aisle: 'Dairy & eggs', is: ['dairy'] },
  'olive oil': { aisle: 'Spices, oils & sauces', is: ['oil'] },
  'whole wheat bread': { aisle: 'Bread & grains' },
  'peanut butter': { aisle: 'Canned & dry goods' },
  banana: { aisle: 'Produce' },
  cinnamon: { aisle: 'Spices, oils & sauces' },
  'firm tofu': { aisle: 'Refrigerated' },
  'large flour tortillas': { aisle: 'Bread & grains' },
  'black beans': { aisle: 'Canned & dry goods' },
  'can black beans': { aisle: 'Canned & dry goods' },
  salsa: { aisle: 'Canned & dry goods' },
  turmeric: { aisle: 'Spices, oils & sauces' },
  'chicken breast': { aisle: 'Meat & seafood', is: ['poultry'] },
  'dry quinoa': { aisle: 'Bread & grains' },
  'broccoli florets': { aisle: 'Produce' },
  lemon: { aisle: 'Produce' },
  'can chickpeas': { aisle: 'Canned & dry goods' },
  hummus: { aisle: 'Refrigerated' },
  'celery stalks': { aisle: 'Produce' },
  lettuce: { aisle: 'Produce' },
  'lettuce leaves': { aisle: 'Produce' },
  'sliced turkey': { aisle: 'Meat & seafood', is: ['poultry'] },
  avocado: { aisle: 'Produce' },
  tomato: { aisle: 'Produce' },
  'dry lentils': { aisle: 'Canned & dry goods' },
  carrots: { aisle: 'Produce' },
  onion: { aisle: 'Produce' },
  'low-sodium vegetable broth': { aisle: 'Canned & dry goods' },
  'ground cumin': { aisle: 'Spices, oils & sauces' },
  'cans tuna in water': { aisle: 'Canned & dry goods', is: ['fish'] },
  'salmon fillet': { aisle: 'Meat & seafood', is: ['fish'], note: 'fresh or frozen' },
  'dry brown rice': { aisle: 'Bread & grains' },
  'green beans': { aisle: 'Produce', note: 'fresh or frozen' },
  'garlic cloves': { aisle: 'Produce' },
  'sirloin steak': { aisle: 'Meat & seafood', is: ['beef'] },
  'soy sauce': { aisle: 'Spices, oils & sauces' },
  'ground ginger': { aisle: 'Spices, oils & sauces' },
  'dry white rice': { aisle: 'Bread & grains' },
  'corn tortillas': { aisle: 'Bread & grains' },
  lime: { aisle: 'Produce' },
  pasta: { aisle: 'Bread & grains' },
  shrimp: { aisle: 'Frozen', is: ['shellfish'], note: 'frozen, peeled and deveined' },
  zucchini: { aisle: 'Produce' },
  'cherry tomatoes': { aisle: 'Produce' },
  'grated parmesan': { aisle: 'Dairy & eggs', is: ['dairy'] },
  'boneless chicken thighs': { aisle: 'Meat & seafood', is: ['poultry'] },
  'sweet potatoes': { aisle: 'Produce' },
  'smoked paprika': { aisle: 'Spices, oils & sauces' },
  granola: { aisle: 'Bread & grains' },
  'sliced almonds': { aisle: 'Canned & dry goods' },
  cucumber: { aisle: 'Produce' },
  apple: { aisle: 'Produce' },
  'almond butter': { aisle: 'Canned & dry goods' },
  'shelled edamame': { aisle: 'Frozen' },
  'sea salt': { aisle: 'Spices, oils & sauces' },
};

export const STORES = ['Walmart', 'Aldi'];

/** What a recipe's ingredients are (poultry, dairy, ...), for diet rules. */
export function contents(recipe, nameOf) {
  const out = new Set();
  for (const ing of recipe.ingredients) for (const t of CATALOG[nameOf(ing.item)]?.is ?? []) out.add(t);
  return out;
}
