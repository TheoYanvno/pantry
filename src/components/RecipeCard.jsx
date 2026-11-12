import { recipeCost, money } from '../lib/prices.js';

// One recipe in the list: meal, name, time, calories and protein per serving, diets and allergens.
export default function RecipeCard({ recipe, onOpen, children }) {
  const n = recipe.nutrition;
  return (
    <button className="recipe" onClick={() => onOpen(recipe.id)}>
      <span className="meal">{recipe.meal}</span>
      <h3>{recipe.name}</h3>
      <span className="facts"><span>{recipe.minutes} min</span><span>{n.calories} cal</span><span>{n.protein} g protein</span><span>~{money(recipeCost(recipe).perServing)} a serving</span></span>
      {children}
      <span className="chips">
        {recipe.diets.map(d => <span key={d} className="chip">{d}</span>)}
        {recipe.allergens.map(a => <span key={a} className="chip allergen">contains {a}</span>)}
      </span>
    </button>
  );
}
