// A recipe in full: nutrition per serving, ingredients and steps.
export default function RecipeDetail({ recipe, onBack }) {
  const n = recipe.nutrition;
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
          <ul>{recipe.ingredients.map((x, k) => <li key={k}>{x.qty} {x.unit} {x.item}</li>)}</ul>
        </section>
        <section>
          <h3>Steps</h3>
          <ol>{recipe.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>
        </section>
      </div>
    </article>
  );
}
