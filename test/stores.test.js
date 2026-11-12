import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapSearch, loadStore, saveStore, CHAINS } from '../src/lib/stores.js';

test('map searches near a point, a ZIP code, or near me', () => {
  assert.equal(mapSearch('Aldi', { lat: 28.56939, lng: -81.54401 }), 'https://www.google.com/maps/search/Aldi/@28.569,-81.544,12z');
  assert.equal(mapSearch('Walmart', '34761'), 'https://www.google.com/maps/search/Walmart%20near%2034761');
  assert.equal(mapSearch('Walmart', '3476'), 'https://www.google.com/maps/search/Walmart%20near%20me');
  assert.equal(mapSearch('Aldi'), 'https://www.google.com/maps/search/Aldi%20near%20me');
  assert.deepEqual(Object.keys(CHAINS), ['Walmart', 'Aldi']);
});

test('the store choice and ZIP save, and bad saved data is ignored', () => {
  const m = new Map(); const s = { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
  saveStore({ chain: 'Aldi', zip: '34761' }, s);
  assert.deepEqual(loadStore(s), { chain: 'Aldi', zip: '34761' });
  m.set('pantry:store', JSON.stringify({ chain: 'Target', zip: 'x' })); assert.deepEqual(loadStore(s), { chain: '', zip: '' });
  m.set('pantry:store', '{bad'); assert.deepEqual(loadStore(s), { chain: '', zip: '' });
});
