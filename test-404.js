/* The 404 legacy map is now the ONLY thing standing between an old
   inbound link and a dead end, so it gets its own tests. */
const fs = require('fs');
let pass = 0, fail = 0;
const ok = (n, c, x) => c ? (pass++, console.log('  \u2713 ' + n))
                          : (fail++, console.log('  \u2717 ' + n + (x ? ' \u2014 ' + x : '')));

const html = fs.readFileSync('erj.com-2-Early-bird/404.html', 'utf8');
const script = html.split('<script>')[1].split('</script>')[0];

function visit(pathname, hash) {
  let replaced = null, lost = false;
  const location = {
    pathname, hash: hash || '',
    replace: u => { replaced = u; },
  };
  const document = {
    documentElement: { setAttribute: (k, v) => { if (k === 'data-lost') lost = true; } },
  };
  new Function('location', 'document', script)(location, document);
  return { replaced, lost };
}

console.log('\nLEGACY URL MAP');
const cases = [
  ['/howtogetaremotejob/',        '/getaremotejob/'],
  ['/howtogetaremotejob/index.html', '/getaremotejob/'],
  ['/howtogetaremotejob',         '/getaremotejob/'],       // no trailing slash
  ['/products/remote-job/',       '/getaremotejob/'],
  ['/products/mastery-training/', '/masterytraining/'],
  ['/products/inner-circle/',     '/innercircle/'],
  ['/products/inner-circle/index.html', '/innercircle/'],
  ['/job-world-mastery.html',     '/masterytraining/'],
  ['/inner-circle.html',          '/innercircle/'],
  ['/jobs.html',                  '/testimonials.html#jobboard'],
];
cases.forEach(([from, to]) => {
  const r = visit(from);
  ok(`${from} \u2192 ${to}`, r.replaced === to, 'got ' + r.replaced);
});

console.log('\nBEHAVIOUR');
ok('a genuinely unknown URL shows the page instead of looping',
   (() => { const r = visit('/no-such-page.html'); return r.replaced === null && r.lost; })());
ok('the hash a visitor arrived with is preserved',
   visit('/products/remote-job/', '#pricing').replaced === '/getaremotejob/#pricing');
ok('a mapped target that already has its own hash is not double-hashed',
   visit('/jobs.html', '#top').replaced === '/testimonials.html#jobboard');

console.log('\nPAGE ITSELF');
ok('404 page is noindex', /name="robots" content="noindex/.test(html));
ok('404 page stays blank while a mapped URL jumps',
   /html:not\(\[data-lost\]\) \.nf\{visibility:hidden/.test(html));
ok('404 page offers real doors for unmapped URLs',
   (html.match(/class="nf-door"/g) || []).length >= 5);

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
process.exit(fail ? 1 : 0);
