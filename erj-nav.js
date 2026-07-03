/* ═══════════════════════════════════════════════════════
   ERJ UNIFIED NAVIGATION  ·  Cohort 9
   ONE hamburger menu + theme toggle on every page.
   Path-aware: pages in subfolders set window.ERJ_NAV.base = '../'.

   Each page sets, BEFORE this script loads:
     window.ERJ_NAV = {
       active: 'home'|'mastery'|'remote'|'inner'|'pricing'|'jobs'|'blog'|'login',
       base:   ''  (root)  |  '../'  (one folder deep),
       onPage: [ { label:'The 4 Stages', href:'#stages' }, ... ]  // optional
     };
═══════════════════════════════════════════════════════ */
(function () {
  var cfg = window.ERJ_NAV || {};
  var active = cfg.active || '';
  var base = (typeof cfg.base === 'string') ? cfg.base : '';
  var onPage = Array.isArray(cfg.onPage) ? cfg.onPage : [];
  var P = function (href) {
    if (/^(https?:|mailto:|tel:|#|\/)/.test(href)) return href; // leave absolute/anchor
    return base + href;
  };

  // The single, unified primary menu — identical everywhere. Clean-URL folders.
  var MENU = [
    { key: 'home',    label: 'Home',              href: 'index.html' },
    { key: 'mastery', label: 'Mastery Training',  href: 'masterytraining/' },
    { key: 'remote',  label: 'Get a Remote Job',  href: 'howtogetaremotejob/' },
    { key: 'inner',   label: 'Inner Circle',      href: 'innercircle/' },
    { key: 'stories', label: 'Success Stories',   href: 'testimonials.html' },
    { key: 'pricing', label: 'Register',          href: 'register.html' },
    { key: 'blog',    label: 'Blog',              href: 'blog.html' },
    { key: 'login',   label: 'Participant Login', href: 'login.html' }
  ];

  var css = ''
  + 'html{scroll-padding-top:var(--erj-nav-h,64px);}'
  + '.erj-nav,.erj-panel,.erj-scrim{--enInk:var(--ink,var(--text,#1A1814));--enPaper:var(--paper,var(--bg,#FAF8F4));'
  + '--enAccent:var(--accent,#B4541E);--enFaint:var(--ink-faint,var(--muted,#8A8378));'
  + '--enLine:var(--line,var(--border,rgba(26,24,20,0.12)));}'
  + '.erj-nav{font-family:var(--font-body,"DM Sans",system-ui,sans-serif);position:fixed;top:0;left:0;right:0;z-index:1000;'
  + 'width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem;'
  + 'padding:0.7rem clamp(1.1rem,4vw,2.2rem);background:var(--enPaper);'
  + 'border-bottom:1px solid var(--enLine);box-shadow:0 1px 0 var(--enLine),0 6px 24px -18px rgba(0,0,0,0.5);}'
  + '.erj-nav *{box-sizing:border-box;}'
  + '.erj-brand{display:inline-flex;align-items:center;gap:9px;font-family:var(--font-display,"Fraunces",Georgia,serif);'
  + 'font-weight:700;font-size:1rem;color:var(--enInk);letter-spacing:-0.3px;text-decoration:none;flex-shrink:0;}'
  + '.erj-brand img{width:30px;height:30px;display:block;object-fit:contain;background:transparent;}'
  + '.erj-brand b{font-weight:700;}.erj-brand i{font-style:italic;color:var(--enAccent);font-weight:700;margin-left:-0.08em;}'
  + '.erj-right{display:flex;align-items:center;gap:0.55rem;flex-shrink:0;}'
  + '.erj-icon{width:40px;height:40px;flex-shrink:0;border-radius:9px;background:transparent;border:1px solid var(--enLine);'
  + 'color:var(--enInk);font-size:0.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s,background .2s;line-height:1;}'
  + '.erj-icon:hover{border-color:var(--enAccent);}'
  + '.erj-burger svg{width:20px;height:20px;}'
  + '.erj-panel{position:fixed;top:0;right:0;bottom:0;width:min(86vw,360px);z-index:1100;'
  + 'background:var(--enPaper);border-left:1px solid var(--enLine);box-shadow:-16px 0 50px rgba(0,0,0,0.22);'
  + 'padding:0;overflow-y:auto;transform:translateX(100%);transition:transform .32s cubic-bezier(0.22,1,0.36,1);'
  + 'display:flex;flex-direction:column;}'
  + '.erj-panel.open{transform:translateX(0);}'
  + '.erj-panel-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;'
  + 'padding:1.1rem 1.3rem;border-bottom:1px solid var(--enLine);position:sticky;top:0;background:var(--enPaper);z-index:2;}'
  + '.erj-panel-title{font-size:0.66rem;letter-spacing:2.5px;text-transform:uppercase;color:var(--enFaint);font-weight:500;}'
  + '.erj-panel-x{width:34px;height:34px;border-radius:8px;background:transparent;border:1px solid var(--enLine);'
  + 'color:var(--enInk);font-size:1.05rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
  + '.erj-panel-x:hover{border-color:var(--enAccent);}'
  + '.erj-list{display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:0;list-style:none;margin:0;padding:0.6rem 0.8rem 1.4rem;text-align:left;}'
  + '.erj-item{display:block;width:100%;text-align:left;}'
  + '.erj-link{display:flex;align-items:center;justify-content:space-between;gap:0.6rem;width:100%;text-align:left;'
  + 'color:var(--enInk);font-family:var(--font-display,"Fraunces",Georgia,serif);font-size:1.18rem;font-weight:500;'
  + 'letter-spacing:-0.3px;text-decoration:none;padding:0.85rem 0.6rem;border-radius:8px;transition:background .15s,color .15s;}'
  + '.erj-link:hover{background:var(--enLine);}'
  + '.erj-item.is-active > .erj-link{color:var(--enAccent);}'
  + '.erj-item.is-active > .erj-link::after{content:"\u2014 You are here";font-family:var(--font-body,"DM Sans",sans-serif);'
  + 'font-size:0.6rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--enFaint);font-weight:500;}'
  + '.erj-sub{display:flex;flex-direction:column;align-items:stretch;margin:0.1rem 0 0.6rem 0.7rem;padding:0.2rem 0 0.5rem 0.9rem;'
  + 'border-left:2px solid var(--enLine);text-align:left;}'
  + '.erj-sub a{display:block;width:100%;text-align:left;color:var(--enFaint);font-family:var(--font-body,"DM Sans",sans-serif);font-size:0.88rem;font-weight:400;'
  + 'text-decoration:none;padding:0.5rem 0.6rem;border-radius:7px;transition:background .15s,color .15s;}'
  + '.erj-sub a:hover{background:var(--enLine);color:var(--enAccent);}'
  + '.erj-scrim{position:fixed;inset:0;z-index:1090;background:rgba(0,0,0,0.42);opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;}'
  + '.erj-scrim.open{opacity:1;visibility:visible;}'
  + '@media (prefers-reduced-motion:reduce){.erj-panel,.erj-scrim{transition:none;}}';

  var style = document.createElement('style');
  style.id = 'erjNavCSS';
  style.textContent = css;
  document.head.appendChild(style);

  var nav = document.createElement('header');
  nav.className = 'erj-nav';
  nav.innerHTML =
      '<a href="' + P('index.html') + '" class="erj-brand"><img src="' + P('logo.png') + '" alt="ERJ"><b>Everything</b><i>RemoteJob</i></a>'
    + '<div class="erj-right">'
    +   '<button class="erj-icon" data-erj-theme-btn title="Toggle theme" aria-label="Toggle theme">\uD83C\uDF19</button>'
    +   '<button class="erj-icon erj-burger" id="erjBurger" aria-label="Open menu" aria-haspopup="true" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg></button>'
    + '</div>';

  function buildItems() {
    return MENU.map(function (m) {
      var isActive = (m.key === active);
      var sub = '';
      if (isActive && onPage.length) {
        sub = '<div class="erj-sub">'
            + onPage.map(function (i) { return '<a href="' + P(i.href) + '">' + i.label + '</a>'; }).join('')
            + '</div>';
      }
      return '<div class="erj-item' + (isActive ? ' is-active' : '') + '">'
           + '<a class="erj-link" href="' + P(m.href) + '">' + m.label + '</a>'
           + sub
           + '</div>';
    }).join('');
  }

  var scrim = document.createElement('div');
  scrim.className = 'erj-scrim'; scrim.id = 'erjScrim';

  var panel = document.createElement('aside');
  panel.className = 'erj-panel'; panel.id = 'erjPanel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML =
      '<div class="erj-panel-head">'
    +   '<span class="erj-panel-title">Menu</span>'
    +   '<button class="erj-panel-x" id="erjPanelX" aria-label="Close menu">\u2715</button>'
    + '</div>'
    + '<nav class="erj-list" aria-label="Site menu">' + buildItems() + '</nav>';

  function setOffset() {
    var h = nav.offsetHeight || 58;
    // Idempotent: set body padding-top to exactly the nav height (never accumulate).
    document.body.style.paddingTop = h + 'px';
    document.documentElement.style.setProperty('--erj-nav-h', h + 'px');
  }

  function mount() {
    var slot = document.getElementById('erjNavMount');
    if (slot && slot.parentNode) { slot.parentNode.replaceChild(nav, slot); }
    else { document.body.insertBefore(nav, document.body.firstChild); }

    setOffset();
    // Recompute after layout settles, fonts load, and on resize — nav height can change.
    requestAnimationFrame(setOffset);
    window.addEventListener('load', setOffset);
    window.addEventListener('resize', setOffset);
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(setOffset);
    }

    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    wire();
    if (window.erjApplyTheme) { try { window.erjApplyTheme(localStorage.getItem('rjt-theme') || 'system'); } catch (e) {} }
  }

  function wire() {
    var burger = document.getElementById('erjBurger');
    function open() { panel.classList.add('open'); scrim.classList.add('open'); panel.setAttribute('aria-hidden','false'); burger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
    function close() { panel.classList.remove('open'); scrim.classList.remove('open'); panel.setAttribute('aria-hidden','true'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
    if (burger) burger.addEventListener('click', open);
    document.getElementById('erjPanelX').addEventListener('click', close);
    scrim.addEventListener('click', close);
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
