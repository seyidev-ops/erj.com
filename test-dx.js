/* Headless test harness for the ERJ capture layer + diagnostic.
   No jsdom available in this environment, so this implements just
   enough DOM to exercise the real compiled files end to end. */

const fs = require('fs');
const path = require('path');
const ROOT = __dirname;   // the tests live inside the tree they test

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  \u2713 ' + name); }
  else { fail++; console.log('  \u2717 ' + name + (extra ? '  \u2014 ' + extra : '')); }
}

/* ── tiny DOM ─────────────────────────────────────────────── */
function makeEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    children: [], attrs: {}, dataset: {}, style: {}, classList: null,
    _classes: new Set(), _html: '', handlers: {},
    get id() { return this.attrs.id || ''; },
    set id(v) { this.attrs.id = String(v); },
    get className() { return [...this._classes].join(' '); },
    set className(v) { this._classes = new Set(String(v).split(/\s+/).filter(Boolean)); },
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); this.children = parseKids(this._html, this); },
    get textContent() { return this._html.replace(/<[^>]*>/g, ''); },
    set textContent(v) { this._html = String(v); },
    setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'class') this.className = v; },
    getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
    removeAttribute(k) { delete this.attrs[k]; },
    hasAttribute(k) { return k in this.attrs; },
    appendChild(c) { this.children.push(c); c.parentNode = this;
      this._html += '<' + c.tagName.toLowerCase() + ' class="' + c.className + '">'
                  + c._html + '</' + c.tagName.toLowerCase() + '>';
      return c; },
    insertBefore(n, ref) { this.children.push(n); n.parentNode = this; return n; },
    closest() { return null; },
    scrollIntoView() { },
    addEventListener(ev, fn) { (this.handlers[ev] = this.handlers[ev] || []).push(fn); },
    click() { (this.handlers.click || []).forEach(fn => fn({ preventDefault() { } })); },
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) { return queryIn(this, sel); },
  };
  el.classList = {
    add: (...c) => c.forEach(x => el._classes.add(x)),
    remove: (...c) => c.forEach(x => el._classes.delete(x)),
    contains: c => el._classes.has(c),
  };
  el.parentNode = null;
  return el;
}

/* parse the subset of HTML the code actually emits: we only need to
   find buttons/anchors with classes and data attributes. */
function parseKids(html, parent) {
  /* Proper recursive descent so ancestry is real — a flat parse made
     descendant selectors like '.default-list li' silently fail. */
  const kids = [];
  const TAGS = 'button|a|div|span|li|ol|ul|p|svg|path|h2|h3|b';
  const open = new RegExp('<(' + TAGS + ')\\b([^>]*?)(/?)>', 'g');
  let m;
  while ((m = open.exec(html))) {
    const tag = m[1], attrs = m[2], selfClose = m[3] === '/';
    const el = makeEl(tag);
    el.parentNode = parent;
    const ar = /([\w:-]+)\s*=\s*"([^"]*)"/g;
    let a;
    while ((a = ar.exec(attrs))) {
      el.attrs[a[1]] = a[2];
      if (a[1] === 'class') el.className = a[2];
      if (a[1] === 'href') el.href = a[2];
      if (a[1].startsWith('data-')) {
        const key = a[1].slice(5).replace(/-([a-z])/g, (s2, c) => c.toUpperCase());
        el.dataset[key] = a[2];
      }
    }
    if (!selfClose) {
      // find the matching close tag, honouring nesting of the same tag
      let depth = 1, idx = open.lastIndex, close = -1;
      const scan = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'g');
      scan.lastIndex = open.lastIndex;
      let t;
      while ((t = scan.exec(html))) {
        depth += t[1] === '/' ? -1 : 1;
        if (depth === 0) { close = t.index; idx = scan.lastIndex; break; }
      }
      if (close > -1) {
        el._html = html.slice(open.lastIndex, close);
        el.children = parseKids(el._html, el);
        open.lastIndex = idx;
      }
    }
    kids.push(el);
  }
  return kids;
}

function queryIn(root, sel) {
  const out = [];
  const walk = n => {
    (n.children || []).forEach(c => {
      if (matches(c, sel)) out.push(c);
      walk(c);
    });
  };
  walk(root);
  return out;
}
function matches(el, sel) {
  return sel.split(',').map(s => s.trim()).some(s => {
    // descendant combinator: match the last part, then verify an ancestor
    if (s.includes(' ') && !s.includes('[')) {
      const parts = s.split(/\s+/);
      const last = parts.pop();
      if (!matches(el, last)) return false;
      let p = el.parentNode;
      while (p) { if (matches(p, parts.join(' '))) return true; p = p.parentNode; }
      return false;
    }
    if (s.startsWith('.')) return el._classes.has(s.slice(1));
    if (s.startsWith('#')) return el.attrs.id === s.slice(1);
    if (s.startsWith('[') && s.endsWith(']')) {
      const inner = s.slice(1, -1);
      if (inner.includes('*=')) {
        const [k, v] = inner.split('*=');
        return (el.attrs[k] || '').includes(v.replace(/["']/g, ''));
      }
      return inner in el.attrs;
    }
    if (s.includes('[')) {
      const [tag, rest] = s.split('[');
      const inner = rest.replace(']', '');
      if (el.tagName !== tag.toUpperCase()) return false;
      if (inner.includes('*=')) {
        const [k, v] = inner.split('*=');
        return (el.attrs[k] || '').includes(v.replace(/["']/g, ''));
      }
      return inner in el.attrs;
    }
    return el.tagName === s.toUpperCase();
  });
}

function makeDoc(ids) {
  const body = makeEl('body');
  const store = {};
  Object.keys(ids).forEach(id => {
    const el = makeEl(ids[id] || 'div');
    el.attrs.id = id;
    store[id] = el;
    body.appendChild(el);
  });
  const head = makeEl('head');
  return {
    head,
    body,
    readyState: 'complete',
    getElementById: id => {
      if (store[id]) return store[id];
      // ids created at runtime, anywhere in the document
      return queryIn(body, '#' + id)[0] || queryIn(head, '#' + id)[0] || null;
    },
    querySelector: s => queryIn(body, s)[0] || null,
    querySelectorAll: s => queryIn(body, s),
    createElement: t => makeEl(t),
    addEventListener() { },
    title: '',
  };
}

/* ── 1 · diagnostic scoring ──────────────────────────────── */
console.log('\nDIAGNOSTIC ENGINE');

function runDx(answerIndexes) {
  const doc = makeDoc({ dxStep: 'div', dxBar: 'span', dxResult: 'div', dxBox: 'div' });
  const win = {
    ERJ_CAPTURE: { waLink: (t, v) => 'https://wa.me/234?text=' + encodeURIComponent(JSON.stringify(v)) },
    ERJ_CONFIG: { whatsapp: '2348032925957' },
  };
  const code = fs.readFileSync(path.join(ROOT, 'diagnose/dx.js'), 'utf8');
  const fn = new Function('window', 'document', 'MutationObserver', code);
  fn(win, doc, function () { this.observe = () => { }; });

  const step = doc.getElementById('dxStep');
  for (const idx of answerIndexes) {
    const btns = step.querySelectorAll('.dx-a');
    if (!btns[idx]) throw new Error('no answer button ' + idx);
    btns[idx].click();
  }
  return doc.getElementById('dxResult')._html;
}

// pure supply profile: can't find roles, applies to what reaches them, never gets far
let out = runDx([0, 0, 0, 0]);
ok('cannot-find-roles profile diagnoses Supply', /dxr-name">Supply</.test(out), out.slice(0, 200));

// classic representation: plenty of roles, zero replies, tailors, never gets far
out = runDx([2, 0, 2, 0]);
ok('plenty of roles + total silence diagnoses Representation', /dxr-name">Representation</.test(out));

// classic aim: plenty of roles, few rejections, applies fast at volume
out = runDx([2, 2, 1, 0]);
ok('volume-without-direction diagnoses Aim', /dxr-name">Aim</.test(out));

// classic conversion: steady feed, interviews, goes quiet after
out = runDx([3, 3, 2, 1]);
ok('interviews-but-no-offers diagnoses Conversion', /dxr-name">Conversion</.test(out));

// money-question freeze is a conversion leak even with a good feed
out = runDx([3, 3, 2, 2]);
ok('freezing on salary diagnoses Conversion', /dxr-name">Conversion</.test(out));

// result must always carry: verdict, three free actions, both doors, capture
out = runDx([0, 0, 0, 0]);
ok('result carries a verdict', /dxr-verdict/.test(out));
ok('result carries three free tonight-actions', (out.match(/<li>/g) || []).length >= 3);
ok('result carries a free door and a paid door', (out.match(/dxr-door-k/g) || []).length === 2);
ok('result carries the WhatsApp capture', /wa\.me|cap-btn/.test(out));
ok('result shows the score breakdown for all four', (out.match(/dxs-row/g) || []).length === 4);
ok('exactly one joint marked as the winner', (out.match(/dxs-row is-win/g) || []).length === 1);

// back button must not corrupt the score
(function () {
  const doc = makeDoc({ dxStep: 'div', dxBar: 'span', dxResult: 'div', dxBox: 'div' });
  const win = { ERJ_CAPTURE: { waLink: () => 'x' } };
  const code = fs.readFileSync(path.join(ROOT, 'diagnose/dx.js'), 'utf8');
  new Function('window', 'document', code)(win, doc);
  const step = doc.getElementById('dxStep');
  step.querySelectorAll('.dx-a')[3].click();          // answer q1 wrongly
  step.querySelectorAll('.dx-back')[0].click();        // go back
  step.querySelectorAll('.dx-a')[0].click();           // answer q1 correctly
  step.querySelectorAll('.dx-a')[0].click();
  step.querySelectorAll('.dx-a')[0].click();
  step.querySelectorAll('.dx-a')[0].click();
  const res = doc.getElementById('dxResult')._html;
  ok('back button un-scores the previous answer', /dxr-name">Supply</.test(res));
})();

/* ── 2 · capture layer ───────────────────────────────────── */
console.log('\nCAPTURE LAYER');

function loadCapture(doc, extra) {
  const cfg = {};
  new Function('window', fs.readFileSync(path.join(ROOT, 'erj-config.js'), 'utf8'))(cfg);
  const win = Object.assign({ ERJ_CONFIG: cfg.ERJ_CONFIG, ERJ_NAV: { base: '' } }, extra || {});
  const code = fs.readFileSync(path.join(ROOT, 'erj-capture.js'), 'utf8');
  new Function('window', 'document', 'MutationObserver', code)(
    win, doc, function () { this.observe = () => { }; }
  );
  return win;
}

// scan capture injects a prefilled message carrying score + failed points
(function () {
  const doc = makeDoc({ results: 'div' });
  const results = doc.getElementById('results');
  results.innerHTML =
    '<span class="dial-num" data-target="4"></span>' +
    '<ol class="default-list"><li><span>02</span>The "Remote-Ready" Summary</li>' +
    '<li><span>05</span>Quantifiable Metrics</li></ol>' +
    '<div class="results-actions"><button class="btn-yes"></button></div>';
  loadCapture(doc);
  const send = doc.querySelector('.cap-send');
  ok('CV scan gets a send-my-report block', !!send);
  const html = send ? send._html : '';
  ok('prefilled message carries the score', /4%2F10|4\/10/.test(decodeURIComponent(html)));
  ok('prefilled message names the failed points',
    decodeURIComponent(html).includes('Quantifiable Metrics'));
  ok('privacy promise restated beside the button', /stays on this device/.test(html));
})();

// clean sweep uses the other template, not a broken defaults list
(function () {
  const doc = makeDoc({ results: 'div' });
  doc.getElementById('results').innerHTML =
    '<span class="dial-num" data-target="10"></span>' +
    '<div class="results-actions"></div>';
  loadCapture(doc);
  const html = decodeURIComponent(doc.querySelector('.cap-send')._html);
  ok('all-clear score uses the no-defaults message', /cleared all ten points/.test(html));
})();

// evergreen doors appear under a countdown
(function () {
  const doc = makeDoc({});
  const panel = makeEl('div');
  panel.setAttribute('data-deadline', '2026-08-30T20:00:00+01:00');
  doc.body.appendChild(panel);
  loadCapture(doc);
  const eg = doc.querySelector('.evergreen');
  ok('countdown gets an evergreen door block', !!eg);
  ok('evergreen names a door that is open today', eg && /masterysetup/.test(eg._html));
})();

// capacity renders from config only
(function () {
  const doc = makeDoc({});
  const node = makeEl('div');
  node.setAttribute('data-erj-capacity', 'placement');
  node.dataset.erjCapacity = 'placement';
  doc.body.appendChild(node);
  const win = loadCapture(doc);
  const c = win.ERJ_CONFIG.capacity;
  const open = c.placementTotal - c.placementTaken;
  ok('capacity bar renders open places from config',
    node._html.includes('<b>' + open + '</b> of ' + c.placementTotal));
  ok('capacity bar states why the number is real', /not a marketing figure/.test(node._html));
})();

// reading CTA
(function () {
  const doc = makeDoc({});
  const node = makeEl('div');
  node.setAttribute('data-erj-cta', '');
  doc.body.appendChild(node);
  loadCapture(doc);
  ok('reading CTA renders one action block', /cap-read/.test(node._html));
  ok('reading CTA points at the free scan', /cvscan/.test(node._html));
})();

// self-contained styling for blog.html / testimonials.html
(function () {
  const doc = makeDoc({});
  const node = makeEl('div');
  node.setAttribute('data-erj-cta', '');
  doc.body.appendChild(node);
  loadCapture(doc);
  const style = doc.head.children[0];
  ok('capture layer injects its own stylesheet', !!style && style.tagName === 'STYLE');
  const css = style ? style._html : '';
  ok('injected CSS styles every component',
    ['.cap-btn', '.cap-send', '.cap-bridge', '.evergreen', '.cap-bar', '.cap-read']
      .every(c => css.includes(c)));
  ok('injected CSS falls back when no design tokens exist',
    /var\(--accent,#FF5722\)/.test(css));
  ok('injected CSS honours prefers-reduced-motion',
    /prefers-reduced-motion/.test(css));
  // second boot must not duplicate the stylesheet
  loadCapture(doc);
  ok('stylesheet is injected once, not per boot', doc.head.children.length === 1);
})();

// never throws when nothing on the page matches
(function () {
  const doc = makeDoc({});
  let threw = false;
  try { loadCapture(doc); } catch (e) { threw = true; }
  ok('capture layer is inert on pages with none of its hooks', !threw);
})();

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
process.exit(fail ? 1 : 0);
