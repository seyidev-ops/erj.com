/* Tier logic tests for erj-ascend.js — the rule that matters is that a
   participant is NEVER offered something they already own. */
const fs = require('fs');
let pass = 0, fail = 0;
const ok = (n, c, x) => c ? (pass++, console.log('  \u2713 ' + n))
                          : (fail++, console.log('  \u2717 ' + n + (x ? ' — ' + x : '')));

const win = { ERJ_CONFIG: { whatsapp: '2348032925957' } };
const head = { children: [], appendChild(c) { this.children.push(c); } };
const doc = {
  head,
  getElementById: id => id === 'erj-ascend-css' ? (head.children[0] || null) : slot,
  createElement: () => ({ id: '', textContent: '' }),
};
let slot = { innerHTML: '' };
new Function('window', 'document', fs.readFileSync(
  require('path').join(__dirname, 'erj-ascend.js'), 'utf8'))(win, doc);
const A = win.ERJ_ASCEND;

console.log('\nTIER DECISION');
ok('nothing owned \u2192 sell nothing', A.decide([]) === null);
ok('mid-ladder (1\u20132) \u2192 sell nothing', A.decide([1, 2]) === null);
ok('mid-ladder (1\u20133) \u2192 sell nothing', A.decide([1, 2, 3]) === null);
ok('owns 1\u20134 \u2192 Stage 5', A.decide([1, 2, 3, 4]).key === 'stage5');
ok('owns 1\u20135 \u2192 Stages 6\u201312', A.decide([1, 2, 3, 4, 5]).key === 'stages612');
ok('owns 1\u20136 \u2192 Ambassador', A.decide([1, 2, 3, 4, 5, 6]).key === 'ambassador');
ok('owns 1\u201312 \u2192 Ambassador', A.decide([1,2,3,4,5,6,7,8,9,10,11,12]).key === 'ambassador');
ok('out-of-order ownership still resolves', A.decide([5, 3, 1, 4, 2]).key === 'stages612');
ok('gap in the ladder (1,2,4,5) sells nothing',
   A.decide([1, 2, 4, 5]) === null, 'incomplete core must not trigger an upsell');

console.log('\nNEVER SELLS WHAT THEY OWN');
[[ [1,2,3,4], 'stage5', 5 ], [ [1,2,3,4,5], 'stages612', 6 ]].forEach(([owned, key]) => {
  const r = A.decide(owned);
  ok(`owner of ${owned.join('')} is not offered a stage they hold`,
     r.key === key && !owned.some(n => r.kicker.includes('Stage ' + n + ' ·')));
});

console.log('\nRENDER');
slot = { innerHTML: '' };
A.render(slot, [1, 2, 3, 4]);
ok('renders a card for a qualifying tier', /class="asc"/.test(slot.innerHTML));
ok('card carries the price', slot.innerHTML.includes('300,000'));
ok('card carries a WhatsApp fallback', /wa\.me\/2348032925957/.test(slot.innerHTML));
ok('stylesheet injected once', head.children.length === 1);

slot = { innerHTML: 'stale' };
A.render(slot, [1, 2]);
ok('clears the slot when there is nothing to sell', slot.innerHTML === '');

slot = { innerHTML: '' };
A.render(slot, [1,2,3,4,5]);
ok('waitlist rung offers no purchase link', !/href="[^"]*job-application-dfy/.test(slot.innerHTML));
ok('waitlist rung is labelled in development', /In development/.test(slot.innerHTML));

slot = { innerHTML: '' };
A.render(slot, [1,2,3,4,5,6]);
const amb = slot.innerHTML;
ok('ambassador rung states foreign-currency payout',
   /currency they paid in/.test(amb));
ok('ambassador rung is free to join', /Free to join/.test(amb));

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
process.exit(fail ? 1 : 0);
