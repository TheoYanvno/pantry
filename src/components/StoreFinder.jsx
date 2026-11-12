import { useState } from 'react';
import { CHAINS, mapSearch, loadStore, saveStore } from '../lib/stores.js';

// Find the nearest Walmart or Aldi: by location (asked only when you tap), by ZIP code, or "near me".
// Your pick of store and ZIP are saved in this browser; your location is never saved.
export default function StoreFinder() {
  const [store, setStore] = useState(loadStore);
  const [near, setNear] = useState(null);
  const [status, setStatus] = useState('');
  const update = (s) => { setStore(s); saveStore(s); };

  function locate() {
    if (!navigator.geolocation) return setStatus('This browser can\'t share a location. Type a ZIP code instead.');
    setStatus('Finding you…');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setNear({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setStatus('Found you. Pick a store below to see the closest ones on a map.'); },
      () => setStatus('Location wasn\'t shared. Type a ZIP code instead, or use the near-me links.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  const where = near || store.zip;
  return (
    <section className="stores no-print" aria-labelledby="stores-title">
      <h3 id="stores-title">Nearest store</h3>
      <div className="row">
        <button onClick={locate}>📍 Use my location</button>
        <label>or ZIP <input inputMode="numeric" maxLength="5" value={store.zip} placeholder="ZIP code"
          onChange={(e) => update({ ...store, zip: e.target.value.replace(/\D/g, '').slice(0, 5) })} /></label>
        <label>My store
          <select value={store.chain} onChange={(e) => update({ ...store, chain: e.target.value })}>
            <option value="">Either</option>
            {Object.keys(CHAINS).map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <p className="muted small" role="status">{status}</p>
      <div className="row">
        {Object.entries(CHAINS).filter(([c]) => !store.chain || store.chain === c).map(([c, info]) => (
          <span key={c} className="store-links">
            <a className="button primary" href={mapSearch(c, where)} target="_blank" rel="noreferrer">Nearest {c} on the map ↗</a>
            <a href={info.finder} target="_blank" rel="noreferrer">{c} store finder ↗</a>
          </span>
        ))}
      </div>
      <p className="muted small">Your location is only used when you tap Use my location, only goes to the map you open, and isn't saved.</p>
    </section>
  );
}
