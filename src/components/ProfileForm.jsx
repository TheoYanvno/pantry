import { useState } from 'react';
import { GOALS, LIMITS, withGoal, profileSummary } from '../lib/profile.js';
import { BUDGETS } from '../lib/prices.js';
import { FAITH_DIETS, FAITHS } from '../lib/diets.js';
import { DIETS, ALLERGENS } from '../lib/recipes.js';

// The profile form: goal, daily targets and diets. Changes save as you go. On small screens it starts
// folded to one summary line, so the recipes are on the first screen.
const small = () => Boolean(globalThis.matchMedia?.('(max-width: 800px)').matches);

export default function ProfileForm({ profile, onChange }) {
  const [open, setOpen] = useState(() => !small());
  function toggle(key, value) {
    const list = profile[key];
    onChange({ ...profile, [key]: list.includes(value) ? list.filter(x => x !== value) : [...list, value] });
  }
  return (
    <section className="profile" aria-labelledby="profile-title">
      <div className="profile-head">
        <h2 id="profile-title">Your profile</h2>
        <button type="button" className="profile-toggle" aria-expanded={open} aria-controls="profile-body"
          onClick={() => setOpen(o => !o)}>{open ? 'Done' : 'Edit'}</button>
      </div>
      <p className="profile-summary muted small">{profileSummary(profile)}</p>
      <div id="profile-body" className="profile-body" hidden={!open}>
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
      <label className="budget">Budget per serving
        <select value={profile.budget || 0} onChange={e => onChange({ ...profile, budget: Number(e.target.value) })}>
          {BUDGETS.map(b => <option key={b} value={b}>{b ? `Up to $${b}` : 'Any price'}</option>)}
        </select>
      </label>
      <fieldset>
        <legend>Diet</legend>
        <div className="checks">
          {DIETS.map(d => (
            <label key={d}><input type="checkbox" checked={profile.diets.includes(d)} onChange={() => toggle('diets', d)} /> {d}</label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Faith-based</legend>
        <div className="checks faith">
          {FAITHS.map(f => (
            <label key={f} title={FAITH_DIETS[f].rule}><input type="checkbox" checked={(profile.faiths || []).includes(f)} onChange={() => toggle('faiths', f)} /> {FAITH_DIETS[f].label}
              <span className="muted small rule">{FAITH_DIETS[f].rule}</span></label>
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
      </div>
    </section>
  );
}
