import { MEALS, RECIPES, findRecipe } from '../lib/recipes.js';
import { DAYS, setMeal, suggestWeek, dayTotals, conflicts, emptyPlan } from '../lib/plan.js';
import { visibleRecipes } from '../lib/profile.js';
import { planCost, money } from '../lib/prices.js';

const cap = s => s[0].toUpperCase() + s.slice(1);

// The week plan: a recipe for each meal of each day, with each day's calories and protein next to
// the targets. Only recipes that fit the profile's diets and allergies are offered.
export default function WeekPlan({ plan, profile, onChange, onOpen }) {
  const options = Object.fromEntries(MEALS.map(m => [m, visibleRecipes(RECIPES, profile, m).shown]));
  const issues = conflicts(plan, profile);
  return (
    <section className="week" aria-labelledby="week-title">
      <div className="row spread">
        <h2 id="week-title">Week plan</h2>
        <div className="row">
          <label className="people">People
            <input type="number" min="1" max="12" value={plan.people} onChange={e => onChange({ ...plan, people: Number(e.target.value) || 1 })} />
          </label>
          <button className="primary" onClick={() => onChange(suggestWeek(plan, RECIPES, profile))}>Fill empty meals with best fits</button>
          <button onClick={() => onChange(suggestWeek(plan, RECIPES, profile, { overwrite: true }))}>Replan the week</button>
          <button onClick={() => onChange({ ...emptyPlan(), people: plan.people })}>Clear</button>
        </div>
      </div>
      {issues.length > 0 && (
        <div className="warning" role="alert">
          {issues.length} planned meal{issues.length === 1 ? '' : 's'} no longer fit your profile:
          <ul>{issues.map((c, k) => <li key={k}>{c.day} {c.meal}: {c.recipe}{c.allergens.length ? ` (contains ${c.allergens.join(', ')})` : ''}{c.diets.length ? ` (not ${c.diets.join(', ')})` : ''}</li>)}</ul>
        </div>
      )}
      <div className="days">
        {plan.days.map((day, i) => {
          const t = dayTotals(day);
          const calPct = Math.min(100, Math.round((t.calories / profile.calories) * 100));
          return (
            <article key={DAYS[i]} className="day" aria-labelledby={`day-${i}`}>
              <h3 id={`day-${i}`}>{DAYS[i]}</h3>
              {MEALS.map(m => {
                const r = day[m] && findRecipe(day[m]);
                return (
                  <div key={m} className="slot">
                    <label>{cap(m)}
                      <select value={day[m] || ''} onChange={e => onChange(setMeal(plan, i, m, e.target.value))}>
                        <option value="">Nothing planned</option>
                        {r && !options[m].includes(r) && <option value={r.id}>{r.name} (doesn't fit)</option>}
                        {options[m].map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </label>
                    {r && <button className="link" onClick={() => onOpen(r.id)}>View recipe</button>}
                  </div>
                );
              })}
              <div className="totals">
                <span>{t.calories} / {profile.calories} cal</span>
                <span className="fit-bar" aria-hidden="true"><span className={calPct > 110 ? 'low' : calPct >= 85 ? 'great' : 'good'} style={{ width: `${calPct}%` }} /></span>
                <span>{t.protein} / {profile.protein} g protein</span>
              </div>
            </article>
          );
        })}
      </div>
      {planCost(plan) > 0 && <p className="cost"><strong>About {money(planCost(plan))}</strong> for the week's food for {plan.people} {plan.people === 1 ? 'person' : 'people'} ({money(planCost(plan) / 7 / plan.people)} a day each), at typical Walmart and Aldi store-brand prices.</p>}
      <p className="muted small">Totals are for one person eating one serving of each planned meal.</p>
    </section>
  );
}
