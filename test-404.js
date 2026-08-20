/* The 404 page used to carry a map of retired URLs and jump visitors from an
   old address to the new one. That machinery is gone on purpose: the renamed
   pages are treated as if they never existed, so an old address is simply an
   address the site does not have.

   What is left to test is that the page still does its one job well — it says
   what happened, it is readable without JavaScript, and it offers real ways
   forward instead of a dead end. Plus one guard so the redirect machinery
   cannot quietly come back. */
const fs = require('fs');
const path = require('path');
let pass = 0, fail = 0;
const ok = (n, c, x) => c ? (pass++, console.log('  ✓ ' + n))
                          : (fail++, console.log('  ✗ ' + n + (x ? ' — ' + x : '')));

const html = fs.readFileSync(path.join(__dirname, '404.html'), 'utf8');

console.log('\nTHE PAGE ITSELF');
ok('404 page is noindex', /name="robots" content="noindex/.test(html));
ok('404 page offers real doors forward',
   (html.match(/class="nf-door"/g) || []).length >= 5);
ok('404 content is visible without JavaScript — nothing hides it first',
   !/visibility:hidden/.test(html.replace(/style="display:none;visibility:hidden"/g, '')));
ok('404 page carries the site navigation', /erj-nav\.js/.test(html));

console.log('\nNO REDIRECT MACHINERY');
ok('no legacy URL map', !/LEGACY/.test(html));
ok('no location.replace jump', !/location\.replace/.test(html));
ok('no data-lost visibility gate', !/data-lost/.test(html));
ok('no meta refresh', !/http-equiv="refresh"/i.test(html));

console.log('\nRETIRED PATHS STAY GONE');
const gone = ['products', 'howtogetaremotejob', 'getaremotejob', 'masterytraining',
              'masterysetup', 'job-application-dfy', 'jobs.html', 'inner-circle.html',
              'job-world-mastery.html'];
gone.forEach(p => ok(`/${p} does not exist`, !fs.existsSync(path.join(__dirname, p))));

console.log('\nTHE PAGES THEY WERE RENAMED TO ARE LIVE');
['jobapplication', 'foundationtraining', 'innercircle', 'selflearn'].forEach(p =>
  ok(`/${p}/ is live`, fs.existsSync(path.join(__dirname, p, 'index.html'))));

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
process.exit(fail ? 1 : 0);
