import { useState } from 'react';
import { scaleRecipe, formatIngredient } from '../lib/servings.js';
import { DAYS } from '../lib/plan.js';
import { recipeCost, money } from '../lib/prices.js';

// A recipe in full: nutrition per serving, ingredients and steps.
export default function RecipeDetail({ recipe, onBack, allergies = [], plan, onAddToPlan }) {
  const n = recipe.nutrition;
  const clash = recipe.allergens.filter(a => allergies.includes(a));
  const [servings, setServings] = useState(recipe.servings);
  const scaled = scaleRecipe(recipe, servings);
  const firstFree = plan ? Math.max(0, plan.days.findIndex(d => !d[recipe.meal])) : 0;
  const [day, setDay] = useState(firstFree);
  const [added, setAdded] = useState('');
  const planned = plan ? DAYS.filter((_, i) => plan.days[i][recipe.meal] === recipe.id) : [];
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
      {onAddToPlan && (
        <div className="row add-plan">
          <label>Add to
            <select value={day} onChange={e => { setDay(Number(e.target.value)); setAdded(''); }}>
              {DAYS.map((d, i) => <option key={d} value={i}>{d}{plan.days[i][recipe.meal] ? ' (replaces a meal)' : ''}</option>)}
            </select>
          </label>
          <button className="primary" onClick={() => { onAddToPlan(day, recipe.meal, recipe.id); setAdded(`Added to ${DAYS[day]} ${recipe.meal}.`); }}>Add to week plan</button>
          <span className="muted small" role="status">{added || (planned.length ? `Planned for ${planned.join(', ')}.` : '')}</span>
        </div>
      )}
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
          <p className="muted small">About {money(recipeCost(recipe).perServing * scaled.servings)} for {scaled.servings} serving{scaled.servings === 1 ? '' : 's'} ({money(recipeCost(recipe).perServing)} each) at typical store-brand prices.</p>
          <p className="muted small">Every ingredient is an everyday item at Walmart and Aldi; store brands work fine.</p>
        </section>
        <section>
          <h3>Steps</h3>
          <ol>{recipe.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>
        </section>
      </div>
    </article>
  );
}
