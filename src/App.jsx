import { useEffect, useState } from 'react';
import { RECIPES, MEALS, findRecipe } from './lib/recipes.js';
import RecipeCard from './components/RecipeCard.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import ProfileForm from './components/ProfileForm.jsx';
import { fitScore, fitReason, rankRecipes } from './lib/rank.js';
import { recipeCost } from './lib/prices.js';
import { loadFavorites, saveFavorites, toggleFavorite, tryNew } from './lib/favorites.js';
import WeekPlan from './components/WeekPlan.jsx';
import ShoppingList from './components/ShoppingList.jsx';
import { loadPlan, savePlan, cleanPlan, setMeal } from './lib/plan.js';
import { loadProfile, saveProfile, cleanProfile, visibleRecipes, matchesSearch } from './lib/profile.js';

export default function App() {
  const [meal, setMeal] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [sort, setSort] = useState('fit');
  const [words, setWords] = useState('');
  const [quick, setQuick] = useState(0);
  const [tab, setTab] = useState('recipes');
  const [plan, setPlan] = useState(loadPlan);
  useEffect(() => { savePlan(cleanPlan(plan)); }, [plan]);
  const [favorites, setFavorites] = useState(loadFavorites);
  useEffect(() => { saveFavorites(favorites); }, [favorites]);
  const fav = id => setFavorites(f => toggleFavorite(f, id));
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [profile, setProfile] = useState(loadProfile);
  useEffect(() => { saveProfile(cleanProfile(profile)); }, [profile]);
  const open = openId ? findRecipe(openId) : null;
  const clean = cleanProfile(profile);
  const visible = visibleRecipes(RECIPES, clean, meal);
  const hiddenForAllergies = visible.hiddenForAllergies;
  const shown = visible.shown.filter(r => matchesSearch(r, words, quick) && (!onlyFavorites || favorites.includes(r.id)));
  const toTry = tryNew(visible.shown, clean, cleanPlan(plan), favorites);
  const list = sort === 'fit' ? rankRecipes(shown, clean).map(x => x.recipe)
    : sort === 'cost' ? [...shown].sort((a, b) => recipeCost(a).perServing - recipeCost(b).perServing)
    : [...shown].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <header>
        <img src="icon.svg" alt="" width="40" height="40" />
        <div><h1>Pantry</h1><p>Meals that fit your goal, your needs and your allergies</p></div>
        <nav aria-label="Pages">
          {[['recipes', 'Recipes'], ['week', 'Week plan'], ['shop', 'Shopping list']].map(([id, label]) => (
            <button key={id} aria-current={tab === id && !openId ? 'page' : undefined} onClick={() => { setTab(id); setOpenId(null); }}>{label}</button>
          ))}
        </nav>
      </header>
      <main>
        {open ? <RecipeDetail key={open.id} recipe={open} allergies={clean.allergies} faiths={clean.faiths} plan={cleanPlan(plan)} favorite={favorites.includes(open.id)} onFavorite={fav}
            onAddToPlan={(d, m, id) => setPlan(p => setMeal(cleanPlan(p), d, m, id))} onBack={() => setOpenId(null)} />
          : tab === 'shop' ? <ShoppingList plan={cleanPlan(plan)} />
          : tab === 'week' ? <div className="page"><ProfileForm profile={profile} onChange={setProfile} /><WeekPlan plan={cleanPlan(plan)} profile={clean} onChange={setPlan} onOpen={setOpenId} /></div> : (
          <div className="page">
          <ProfileForm profile={profile} onChange={setProfile} />
          <section aria-labelledby="recipes-title">
            <h2 id="recipes-title">Recipes</h2>
            {toTry.length > 0 && !words && !onlyFavorites && (
              <div className="try-new" aria-labelledby="try-title">
                <h3 id="try-title">Try something new</h3>
                <p className="muted small">Fits your profile, and you haven't saved or planned it yet.</p>
                <div className="try-list">{toTry.map(r => <button key={r.id} className="try" onClick={() => setOpenId(r.id)}><span className="meal">{r.meal}</span> {r.name}</button>)}</div>
              </div>
            )}
            <div className="tabs" role="group" aria-label="Meal">
              {['all', ...MEALS].map(m => (
                <button key={m} aria-pressed={meal === m} onClick={() => setMeal(m)}>{m === 'all' ? 'All meals' : m[0].toUpperCase() + m.slice(1)}</button>
              ))}
              <button aria-pressed={onlyFavorites} onClick={() => setOnlyFavorites(v => !v)}>★ Favorites ({favorites.length})</button>
            </div>
            <p className="muted small" role="status">{shown.length} recipe{shown.length === 1 ? '' : 's'}{profile.diets.length ? ` that are ${profile.diets.join(' and ')}` : ''}{clean.faiths.length ? ` for ${clean.faiths.length === 1 ? 'your faith-based choice' : 'your faith-based choices'}` : ''}{clean.budget ? ` at up to $${clean.budget} a serving` : ''}{hiddenForAllergies ? ` · ${hiddenForAllergies} hidden for your allergies` : ''}</p>
            <div className="row search">
              <label>Search<input type="search" value={words} onChange={e => setWords(e.target.value)} placeholder="name or ingredient, like salmon or oats" /></label>
              <label>Time
                <select value={quick} onChange={e => setQuick(Number(e.target.value))}>
                  <option value={0}>Any</option><option value={10}>10 min or less</option><option value={20}>20 min or less</option><option value={30}>30 min or less</option>
                </select>
              </label>
            </div>
            <label className="sort">Sort by
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="fit">Best fit for your targets</option>
                <option value="cost">Lowest cost per serving</option>
                <option value="name">Name</option>
              </select>
            </label>
            {list.length === 0 && onlyFavorites && !favorites.length && <p className="muted">No favorites yet. Tap ☆ on a recipe to save it here.</p>}
            {list.length === 0 && !(onlyFavorites && !favorites.length) && <p className="muted">No recipes match. Try other words, a longer time, a bigger budget or fewer diet choices.</p>}
            <div className="grid">{list.map(r => (
              <RecipeCard key={r.id} recipe={r} onOpen={setOpenId} favorite={favorites.includes(r.id)} onFavorite={fav}>
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
