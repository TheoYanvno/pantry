import { useEffect, useState } from 'react';
import { RECIPES, MEALS, findRecipe } from './lib/recipes.js';
import RecipeCard from './components/RecipeCard.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import ProfileForm from './components/ProfileForm.jsx';
import { fitScore, fitReason, rankRecipes } from './lib/rank.js';
import WeekPlan from './components/WeekPlan.jsx';
import { loadPlan, savePlan, cleanPlan } from './lib/plan.js';
import { loadProfile, saveProfile, cleanProfile, visibleRecipes } from './lib/profile.js';

export default function App() {
  const [meal, setMeal] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [sort, setSort] = useState('fit');
  const [tab, setTab] = useState('recipes');
  const [plan, setPlan] = useState(loadPlan);
  useEffect(() => { savePlan(cleanPlan(plan)); }, [plan]);
  const [profile, setProfile] = useState(loadProfile);
  useEffect(() => { saveProfile(cleanProfile(profile)); }, [profile]);
  const open = openId ? findRecipe(openId) : null;
  const clean = cleanProfile(profile);
  const { shown, hiddenForAllergies } = visibleRecipes(RECIPES, clean, meal);
  const list = sort === 'fit' ? rankRecipes(shown, clean).map(x => x.recipe) : [...shown].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <header>
        <img src="icon.svg" alt="" width="40" height="40" />
        <div><h1>Pantry</h1><p>Meals that fit your goal, your needs and your allergies</p></div>
        <nav aria-label="Pages">
          {[['recipes', 'Recipes'], ['week', 'Week plan']].map(([id, label]) => (
            <button key={id} aria-current={tab === id && !openId ? 'page' : undefined} onClick={() => { setTab(id); setOpenId(null); }}>{label}</button>
          ))}
        </nav>
      </header>
      <main>
        {open ? <RecipeDetail recipe={open} allergies={clean.allergies} onBack={() => setOpenId(null)} />
          : tab === 'week' ? <div className="page"><ProfileForm profile={profile} onChange={setProfile} /><WeekPlan plan={cleanPlan(plan)} profile={clean} onChange={setPlan} onOpen={setOpenId} /></div> : (
          <div className="page">
          <ProfileForm profile={profile} onChange={setProfile} />
          <section aria-labelledby="recipes-title">
            <h2 id="recipes-title">Recipes</h2>
            <div className="tabs" role="group" aria-label="Meal">
              {['all', ...MEALS].map(m => (
                <button key={m} aria-pressed={meal === m} onClick={() => setMeal(m)}>{m === 'all' ? 'All meals' : m[0].toUpperCase() + m.slice(1)}</button>
              ))}
            </div>
            <p className="muted small" role="status">{shown.length} recipe{shown.length === 1 ? '' : 's'}{profile.diets.length ? ` that are ${profile.diets.join(' and ')}` : ''}{hiddenForAllergies ? ` · ${hiddenForAllergies} hidden for your allergies` : ''}</p>
            <label className="sort">Sort by
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="fit">Best fit for your targets</option>
                <option value="name">Name</option>
              </select>
            </label>
            <div className="grid">{list.map(r => (
              <RecipeCard key={r.id} recipe={r} onOpen={setOpenId}>
                <Fit score={fitScore(r, clean)} reason={fitReason(r, clean)} />
              </RecipeCard>
            ))}</div>
          </section>
          </div>
        )}
        <p className="note">Nutrition numbers are estimates per serving. Pantry is a planning tool, not medical or dietary advice: read food labels and check with a doctor or dietitian about allergies and nutrition needs.</p>
      </main>
    </>
  );
}

function Fit({ score, reason }) {
  const level = score >= 80 ? 'great' : score >= 60 ? 'good' : 'low';
  return (
    <span className="fit">
      <span className={`fit-score ${level}`}>{score}% fit</span>
      <span className="fit-bar" aria-hidden="true"><span className={level} style={{ width: `${score}%` }} /></span>
      <span className="fit-reason">{reason}</span>
    </span>
  );
}
