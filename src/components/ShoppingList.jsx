import { useState } from 'react';
import { shoppingList, listAsText, itemLine } from '../lib/shopping.js';
import { CATALOG } from '../lib/catalog.js';
import { planCost, money } from '../lib/prices.js';

// The week's shopping list by aisle, with boxes to tick off in the store, a copy button and a
// print-friendly layout.
export default function ShoppingList({ plan }) {
  const groups = shoppingList(plan);
  const [got, setGot] = useState(() => new Set());
  const [copied, setCopied] = useState('');
  const count = groups.reduce((n, g) => n + g.items.length, 0);

  async function copy() {
    try {
      await navigator.clipboard.writeText(listAsText(groups, `Shopping list for ${plan.people} ${plan.people === 1 ? 'person' : 'people'}`));
      setCopied('Copied. Paste it into a note or a message.');
    } catch {
      setCopied("Your browser didn't allow copying. Use Print instead.");
    }
  }

  function toggle(name) {
    setGot(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });
  }

  if (!count) return <section className="shopping"><h2>Shopping list</h2><p className="muted">Plan some meals in the Week plan and the list appears here.</p></section>;
  return (
    <section className="shopping" aria-labelledby="shop-title">
      <div className="row spread">
        <h2 id="shop-title">Shopping list <span className="muted small">({count} items, {plan.people} {plan.people === 1 ? 'person' : 'people'})</span></h2>
        <div className="row no-print">
          <button onClick={copy}>Copy as text</button>
          <button onClick={() => window.print()}>Print</button>
          {got.size > 0 && <button onClick={() => setGot(new Set())}>Untick all</button>}
        </div>
      </div>
      <p className="muted small">Everything on this list is an everyday item at Walmart and at Aldi, so one trip to either store covers the week. The food you'll use comes to <strong>about {money(planCost(plan))}</strong> at typical store-brand prices; the receipt runs higher the first week because you buy whole packages, and lower after, as staples like oil and spices carry over.</p>
      <p className="muted small no-print" role="status">{copied}</p>
      <div className="aisles">
        {groups.map(g => (
          <section key={g.aisle} className="aisle" aria-label={g.aisle}>
            <h3>{g.aisle}</h3>
            <ul>
              {g.items.map(it => (
                <li key={it.name} className={got.has(it.name) ? 'got' : ''}>
                  <label>
                    <input type="checkbox" checked={got.has(it.name)} onChange={() => toggle(it.name)} />
                    <span>{itemLine(it)}</span>
                  </label>
                  <span className="for muted">for {it.recipes.join(', ')}{CATALOG[it.name]?.note ? ` · ${CATALOG[it.name].note}` : ''}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="muted small">Amounts cover one serving per person for each planned meal. Round up to package sizes and check what's already in your pantry.</p>
    </section>
  );
}
