import { useEffect, useState } from 'react';
import { RECIPES, MEALS, findRecipe } from './lib/recipes.js';
import RecipeCard from './components/RecipeCard.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import ProfileForm from './components/ProfileForm.jsx';
import { loadProfile, saveProfile, cleanProfile, visibleRecipes } from './lib/profile.js';

export default function App() {
  const [meal, setMeal] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [profile, setProfile] = useState(loadProfile);
  useEffect(() => { saveProfile(cleanProfile(profile)); }, [profile]);
  const open = openId ? findRecipe(openId) : null;
  const { shown, hiddenForAllergies } = visibleRecipes(RECIPES, cleanProfile(profile), meal);

  return (
    <>
      <header>
        <img src="icon.svg" alt="" width="40" height="40" />
        <div><h1>Pantry</h1><p>Meals that fit your goal, your needs and your allergies</p></div>
      </header>
      <main>
        {open ? <RecipeDetail recipe={open} allergies={cleanProfile(profile).allergies} onBack={() => setOpenId(null)} /> : (
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
            <div className="grid">{shown.map(r => <RecipeCard key={r.id} recipe={r} onOpen={setOpenId} />)}</div>
          </section>
          </div>
        )}
        <p className="note">Nutrition numbers are estimates per serving. Pantry is a planning tool, not medical or dietary advice: read food labels and check with a doctor or dietitian about allergies and nutrition needs.</p>
      </main>
    </>
  );
}
