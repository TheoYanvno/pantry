// Finding the nearest Walmart or Aldi. Pantry has no server and keeps no store list of its own, so it
// opens a map search near you: with your location (only when you tap the button, and only sent to the
// map), with a ZIP code you type, or plain "near me". Each chain's own store finder is linked too.
export const CHAINS = {
  Walmart: { finder: 'https://www.walmart.com/store-finder' },
  Aldi: { finder: 'https://www.aldi.us/store-locator' },
};

const MAPS = 'https://www.google.com/maps/search/';

/** A map search for a chain: near a point { lat, lng }, near a 5-digit ZIP, or "near me". */
export function mapSearch(chain, near) {
  if (near && Number.isFinite(near.lat) && Number.isFinite(near.lng)) {
    return `${MAPS}${encodeURIComponent(chain)}/@${near.lat.toFixed(3)},${near.lng.toFixed(3)},12z`;
  }
  if (typeof near === 'string' && /^\d{5}$/.test(near.trim())) return `${MAPS}${encodeURIComponent(`${chain} near ${near.trim()}`)}`;
  return `${MAPS}${encodeURIComponent(`${chain} near me`)}`;
}

const KEY = 'pantry:store';
export function loadStore(storage = globalThis.localStorage) {
  try { const s = JSON.parse(storage?.getItem(KEY) || 'null'); return s && CHAINS[s.chain] ? { chain: s.chain, zip: /^\d{5}$/.test(s.zip || '') ? s.zip : '' } : { chain: '', zip: '' }; } catch { return { chain: '', zip: '' }; }
}
export function saveStore(store, storage = globalThis.localStorage) {
  try { storage?.setItem(KEY, JSON.stringify(store)); return true; } catch { return false; }
}
