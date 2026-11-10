import { GOALS, LIMITS, withGoal } from '../lib/profile.js';
import { DIETS, ALLERGENS } from '../lib/recipes.js';

// The profile form: goal, daily targets and diets. Changes save as you go.
export default function ProfileForm({ profile, onChange }) {
  function toggle(key, value) {
    const list = profile[key];
    onChange({ ...profile, [key]: list.includes(value) ? list.filter(x => x !== value) : [...list, value] });
  }
  return (
    <section className="profile" aria-labelledby="profile-title">
      <h2 id="profile-title">Your profile</h2>
      <fieldset>
        <legend>Goal</legend>
        <div className="tabs">
          {Object.entries(GOALS).map(([id, g]) => (
            <button key={id} type="button" aria-pressed={profile.goal === id} onClick={() => onChange(withGoal(profile, id))}>{g.label}</button>
          ))}
        </div>
      </fieldset>
      <div className="targets">
        <label>Calories a day
          <input type="number" min={LIMITS.calories[0]} max={LIMITS.calories[1]} step="50" value={profile.calories}
            onChange={e => onChange({ ...profile, calories: Number(e.target.value) })} />
        </label>
        <label>Protein a day (g)
          <input type="number" min={LIMITS.protein[0]} max={LIMITS.protein[1]} step="5" value={profile.protein}
            onChange={e => onChange({ ...profile, protein: Number(e.target.value) })} />
        </label>
      </div>
      <p className="muted small">Goals fill in example targets. Change them to the numbers you and your doctor or dietitian chose.</p>
      <fieldset>
        <legend>Diet</legend>
        <div className="checks">
          {DIETS.map(d => (
            <label key={d}><input type="checkbox" checked={profile.diets.includes(d)} onChange={() => toggle('diets', d)} /> {d}</label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Allergies and intolerances</legend>
        <p className="muted small">Recipes with any of these are hidden.</p>
        <div className="checks two">
          {ALLERGENS.map(a => (
            <label key={a}><input type="checkbox" checked={profile.allergies.includes(a)} onChange={() => toggle('allergies', a)} /> {a}</label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
