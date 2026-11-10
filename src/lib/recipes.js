// Pantry's recipes. Nutrition is per serving and is an estimate worked out from typical values for
// each ingredient; it is a planning guide, not a lab measurement. Allergens use the nine major food
// allergens named by the FDA; check the labels on what you buy, since brands differ.

export const ALLERGENS = ['milk', 'eggs', 'fish', 'shellfish', 'tree nuts', 'peanuts', 'wheat', 'soy', 'sesame'];
export const DIETS = ['vegetarian', 'vegan', 'gluten-free', 'low sodium'];
export const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];
export const LOW_SODIUM_MG = 600;   // per serving, for the "low sodium" tag used here

// qty is a number (0.5 = ½); unit is '' for counted items like "2 eggs".
const i = (qty, unit, item) => ({ qty, unit, item });

export const RECIPES = [
  {
    id: 'overnight-oats', name: 'Overnight Oats with Berries', meal: 'breakfast', servings: 1, minutes: 5,
    nutrition: { calories: 380, protein: 18, carbs: 55, fat: 10, sodium: 110 },
    allergens: ['milk'], diets: ['vegetarian', 'low sodium'],
    ingredients: [i(0.5, 'cup', 'rolled oats'), i(0.75, 'cup', 'milk'), i(0.25, 'cup', 'plain Greek yogurt'), i(0.5, 'cup', 'mixed berries'), i(1, 'tbsp', 'chia seeds'), i(1, 'tsp', 'honey')],
    steps: ['Stir the oats, milk, yogurt, chia seeds and honey together in a jar.', 'Cover and chill overnight, or at least 4 hours.', 'Top with the berries before eating.'],
  },
  {
    id: 'veggie-scramble', name: 'Veggie Egg Scramble', meal: 'breakfast', servings: 1, minutes: 10,
    nutrition: { calories: 330, protein: 23, carbs: 6, fat: 24, sodium: 380 },
    allergens: ['eggs', 'milk'], diets: ['vegetarian', 'gluten-free', 'low sodium'],
    ingredients: [i(3, '', 'eggs'), i(1, 'cup', 'baby spinach'), i(0.5, '', 'bell pepper, diced'), i(2, 'tbsp', 'shredded cheddar'), i(1, 'tsp', 'olive oil')],
    steps: ['Warm the oil in a pan over medium heat and soften the pepper for 2 minutes.', 'Add the spinach until it wilts.', 'Pour in the beaten eggs and stir gently until just set, then top with the cheese.'],
  },
  {
    id: 'pb-banana-toast', name: 'Peanut Butter Banana Toast', meal: 'breakfast', servings: 1, minutes: 5,
    nutrition: { calories: 470, protein: 16, carbs: 62, fat: 19, sodium: 420 },
    allergens: ['peanuts', 'wheat'], diets: ['vegetarian', 'vegan', 'low sodium'],
    ingredients: [i(2, 'slice', 'whole wheat bread'), i(2, 'tbsp', 'peanut butter'), i(1, '', 'banana, sliced'), i(0.25, 'tsp', 'cinnamon')],
    steps: ['Toast the bread.', 'Spread with peanut butter, add the banana slices and a pinch of cinnamon.'],
  },
  {
    id: 'tofu-burrito', name: 'Tofu Breakfast Burrito', meal: 'breakfast', servings: 2, minutes: 15,
    nutrition: { calories: 420, protein: 24, carbs: 42, fat: 17, sodium: 650 },
    allergens: ['soy', 'wheat'], diets: ['vegetarian', 'vegan'],
    ingredients: [i(14, 'oz', 'firm tofu, crumbled'), i(2, '', 'large flour tortillas'), i(0.5, 'cup', 'black beans, rinsed'), i(0.25, 'cup', 'salsa'), i(0.5, 'tsp', 'turmeric'), i(1, 'tsp', 'olive oil')],
    steps: ['Cook the tofu in the oil with the turmeric for 6 to 8 minutes.', 'Warm the beans.', 'Fill each tortilla with tofu, beans and salsa, then roll it up.'],
  },
  {
    id: 'chicken-quinoa-bowl', name: 'Chicken Quinoa Bowl', meal: 'lunch', servings: 2, minutes: 30,
    nutrition: { calories: 520, protein: 42, carbs: 50, fat: 15, sodium: 320 },
    allergens: [], diets: ['gluten-free', 'low sodium'],
    ingredients: [i(8, 'oz', 'chicken breast'), i(1, 'cup', 'dry quinoa'), i(2, 'cup', 'broccoli florets'), i(1, 'tbsp', 'olive oil'), i(1, '', 'lemon')],
    steps: ['Cook the quinoa in 2 cups of water for 15 minutes.', 'Season and cook the chicken in half the oil until it reaches 165°F, then slice it.', 'Steam the broccoli and divide everything into two bowls with the rest of the oil and a squeeze of lemon.'],
  },
  {
    id: 'chickpea-wrap', name: 'Chickpea Salad Wrap', meal: 'lunch', servings: 2, minutes: 10,
    nutrition: { calories: 450, protein: 17, carbs: 62, fat: 15, sodium: 690 },
    allergens: ['sesame', 'wheat'], diets: ['vegetarian', 'vegan'],
    ingredients: [i(15, 'oz', 'can chickpeas, rinsed'), i(2, 'tbsp', 'tahini'), i(1, '', 'celery stalk, diced'), i(1, '', 'lemon'), i(2, '', 'large flour tortillas'), i(1, 'cup', 'lettuce')],
    steps: ['Mash the chickpeas with the tahini, lemon juice and celery.', 'Spread over the tortillas, add lettuce and roll up.'],
  },
  {
    id: 'turkey-avocado', name: 'Turkey Avocado Sandwich', meal: 'lunch', servings: 1, minutes: 5,
    nutrition: { calories: 430, protein: 28, carbs: 40, fat: 18, sodium: 900 },
    allergens: ['wheat'], diets: [],
    ingredients: [i(2, 'slice', 'whole wheat bread'), i(3, 'oz', 'sliced turkey'), i(0.5, '', 'avocado'), i(2, 'slice', 'tomato')],
    steps: ['Mash the avocado onto one slice of bread.', 'Layer the turkey and tomato and close the sandwich.'],
  },
  {
    id: 'lentil-soup', name: 'Lentil Soup', meal: 'lunch', servings: 4, minutes: 40,
    nutrition: { calories: 260, protein: 16, carbs: 42, fat: 3, sodium: 250 },
    allergens: [], diets: ['vegetarian', 'vegan', 'gluten-free', 'low sodium'],
    ingredients: [i(1, 'cup', 'dry lentils'), i(2, '', 'carrots, diced'), i(1, '', 'onion, diced'), i(2, '', 'celery stalks, diced'), i(4, 'cup', 'low-sodium vegetable broth'), i(1, 'tsp', 'ground cumin')],
    steps: ['Soften the onion, carrots and celery in a pot for 5 minutes.', 'Add the lentils, broth and cumin and simmer for 25 to 30 minutes until the lentils are tender.'],
  },
  {
    id: 'tuna-lettuce-cups', name: 'Tuna Salad Lettuce Cups', meal: 'lunch', servings: 2, minutes: 10,
    nutrition: { calories: 210, protein: 32, carbs: 6, fat: 6, sodium: 480 },
    allergens: ['fish', 'milk'], diets: ['gluten-free', 'low sodium'],
    ingredients: [i(2, '', 'cans tuna in water, drained'), i(0.25, 'cup', 'plain Greek yogurt'), i(1, '', 'celery stalk, diced'), i(8, '', 'lettuce leaves')],
    steps: ['Mix the tuna, yogurt and celery.', 'Spoon into the lettuce leaves.'],
  },
  {
    id: 'salmon-rice', name: 'Salmon with Rice and Green Beans', meal: 'dinner', servings: 2, minutes: 35,
    nutrition: { calories: 610, protein: 40, carbs: 62, fat: 21, sodium: 180 },
    allergens: ['fish'], diets: ['gluten-free', 'low sodium'],
    ingredients: [i(12, 'oz', 'salmon fillet'), i(1, 'cup', 'dry brown rice'), i(2, 'cup', 'green beans'), i(1, 'tbsp', 'olive oil'), i(2, '', 'garlic cloves')],
    steps: ['Cook the rice.', 'Roast the salmon at 400°F for 12 to 15 minutes until it reaches 145°F.', 'Sauté the green beans with the garlic in the oil and serve together.'],
  },
  {
    id: 'beef-broccoli', name: 'Beef and Broccoli Stir-Fry', meal: 'dinner', servings: 3, minutes: 25,
    nutrition: { calories: 520, protein: 38, carbs: 52, fat: 16, sodium: 980 },
    allergens: ['soy', 'wheat'], diets: [],
    ingredients: [i(1, 'lb', 'flank steak, thinly sliced'), i(4, 'cup', 'broccoli florets'), i(3, 'tbsp', 'soy sauce'), i(2, '', 'garlic cloves'), i(1, 'tbsp', 'fresh ginger, grated'), i(1, 'cup', 'dry white rice')],
    steps: ['Cook the rice.', 'Sear the steak in a hot pan in batches and set aside.', 'Stir-fry the broccoli, garlic and ginger, return the beef, add the soy sauce and toss.'],
  },
  {
    id: 'black-bean-tacos', name: 'Black Bean Tacos', meal: 'dinner', servings: 2, minutes: 15,
    nutrition: { calories: 480, protein: 17, carbs: 76, fat: 14, sodium: 720 },
    allergens: [], diets: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [i(15, 'oz', 'can black beans, rinsed'), i(6, '', 'corn tortillas'), i(0.5, 'cup', 'salsa'), i(1, '', 'avocado'), i(1, '', 'lime')],
    steps: ['Warm the beans with half the salsa.', 'Heat the tortillas in a dry pan.', 'Fill with beans, avocado, the rest of the salsa and a squeeze of lime.'],
  },
  {
    id: 'shrimp-primavera', name: 'Shrimp Pasta Primavera', meal: 'dinner', servings: 3, minutes: 25,
    nutrition: { calories: 560, protein: 36, carbs: 66, fat: 16, sodium: 640 },
    allergens: ['shellfish', 'wheat', 'milk'], diets: [],
    ingredients: [i(8, 'oz', 'pasta'), i(12, 'oz', 'shrimp, peeled'), i(1, '', 'zucchini, sliced'), i(1, 'cup', 'cherry tomatoes'), i(0.25, 'cup', 'grated parmesan'), i(1.5, 'tbsp', 'olive oil')],
    steps: ['Cook the pasta.', 'Cook the shrimp in the oil for 2 to 3 minutes a side, then add the zucchini and tomatoes.', 'Toss with the pasta and parmesan.'],
  },
  {
    id: 'chicken-sweet-potato', name: 'Baked Chicken Thighs with Sweet Potato', meal: 'dinner', servings: 2, minutes: 45,
    nutrition: { calories: 590, protein: 44, carbs: 40, fat: 27, sodium: 300 },
    allergens: [], diets: ['gluten-free', 'low sodium'],
    ingredients: [i(1, 'lb', 'boneless chicken thighs'), i(2, '', 'sweet potatoes, cubed'), i(1, 'tbsp', 'olive oil'), i(1, 'tsp', 'smoked paprika')],
    steps: ['Toss the sweet potatoes with half the oil and roast at 425°F for 15 minutes.', 'Add the chicken rubbed with paprika and the rest of the oil and roast 20 to 25 minutes more, until it reaches 165°F.'],
  },
  {
    id: 'yogurt-parfait', name: 'Greek Yogurt Parfait', meal: 'snack', servings: 1, minutes: 5,
    nutrition: { calories: 330, protein: 24, carbs: 38, fat: 9, sodium: 110 },
    allergens: ['milk', 'tree nuts'], diets: ['vegetarian', 'low sodium'],
    ingredients: [i(1, 'cup', 'plain Greek yogurt'), i(0.25, 'cup', 'granola'), i(0.5, 'cup', 'berries'), i(1, 'tbsp', 'sliced almonds')],
    steps: ['Layer the yogurt, berries, granola and almonds in a glass.'],
  },
  {
    id: 'hummus-veggies', name: 'Hummus and Veggies', meal: 'snack', servings: 2, minutes: 5,
    nutrition: { calories: 160, protein: 5, carbs: 16, fat: 9, sodium: 300 },
    allergens: ['sesame'], diets: ['vegetarian', 'vegan', 'gluten-free', 'low sodium'],
    ingredients: [i(0.5, 'cup', 'hummus'), i(2, '', 'carrots, cut in sticks'), i(1, '', 'cucumber, sliced'), i(1, '', 'bell pepper, sliced')],
    steps: ['Cut the vegetables and serve with the hummus.'],
  },
  {
    id: 'apple-almond-butter', name: 'Apple with Almond Butter', meal: 'snack', servings: 1, minutes: 2,
    nutrition: { calories: 290, protein: 7, carbs: 31, fat: 18, sodium: 5 },
    allergens: ['tree nuts'], diets: ['vegetarian', 'vegan', 'gluten-free', 'low sodium'],
    ingredients: [i(1, '', 'apple, sliced'), i(2, 'tbsp', 'almond butter')],
    steps: ['Slice the apple and dip in the almond butter.'],
  },
  {
    id: 'edamame', name: 'Salted Edamame', meal: 'snack', servings: 2, minutes: 5,
    nutrition: { calories: 190, protein: 17, carbs: 14, fat: 8, sodium: 160 },
    allergens: ['soy'], diets: ['vegetarian', 'vegan', 'gluten-free', 'low sodium'],
    ingredients: [i(2, 'cup', 'shelled edamame'), i(0.25, 'tsp', 'flaky salt')],
    steps: ['Steam or microwave the edamame for 3 to 4 minutes.', 'Sprinkle with the salt.'],
  },
];

export function findRecipe(id) {
  return RECIPES.find(r => r.id === id) || null;
}
