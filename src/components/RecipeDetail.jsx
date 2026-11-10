import { useState } from 'react';
import { scaleRecipe, formatIngredient } from '../lib/servings.js';

// A recipe in full: nutrition per serving, ingredients and steps.
export default function RecipeDetail({ recipe, onBack, allergies = [] }) {
  const n = recipe.nutrition;
  const clash = recipe.allergens.filter(a => allergies.includes(a));
  const [servings, setServings] = useState(recipe.servings);
  const scaled = scaleRecipe(recipe, servings);
  return (
    <article className="detail" aria-labelledby="recipe-title">
      <button onClick={onBack}>← All recipes</button>
      <p className="meta"><span className="meal">{recipe.meal}</span> · {recipe.minutes} min · serves {recipe.servings}</p>
      <h2 id="recipe-title">{recipe.name}</h2>
      <div className="chips">
        {recipe.diets.map(d => <span key={d} className="chip">{d}</span>)}
        {recipe.allergens.length
          ? recipe.allergens.map(a => <span key={a} className="chip allergen">contains {a}</span>)
          : <span className="chip">none of the 9 major allergens</span>}
      </div>
      {clash.length > 0 && <p className="warning" role="alert">This recipe contains {clash.join(' and ')}, which you listed as an allergy.</p>}
      <div className="nutrition" aria-label="Nutrition per serving">
        <div><strong>{n.calories}</strong>calories</div>
        <div><strong>{n.protein} g</strong>protein</div>
        <div><strong>{n.carbs} g</strong>carbs</div>
        <div><strong>{n.fat} g</strong>fat</div>
        <div><strong>{n.sodium} mg</strong>sodium</div>
      </div>
      <div className="cols">
        <section>
          <h3>Ingredients</h3>
          <div className="stepper" role="group" aria-label="Servings">
            <button aria-label="Fewer servings" disabled={scaled.servings <= 1} onClick={() => setServings(scaled.servings - 1)}>−</button>
            <span aria-live="polite"><strong>{scaled.servings}</strong> serving{scaled.servings === 1 ? '' : 's'}</span>
            <button aria-label="More servings" disabled={scaled.servings >= 24} onClick={() => setServings(scaled.servings + 1)}>+</button>
          </div>
          <ul>{scaled.ingredients.map((x, k) => <li key={k}>{formatIngredient(x)}</li>)}</ul>
          <p className="muted small">About {n.calories * scaled.servings} calories and {n.protein * scaled.servings} g protein in all.</p>
        </section>
        <section>
          <h3>Steps</h3>
          <ol>{recipe.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>
        </section>
      </div>
    </article>
  );
}
