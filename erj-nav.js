"use strict";
/* ═══════════════════════════════════════════════════════
   ERJ UNIFIED NAVIGATION · v3 (TypeScript source)
   Compile: tsc erj-nav.ts --target es2017 --outFile erj-nav.js

   FIVE top-level items, everywhere:
     Home · Free For You ▾ · Your Starting Line ▾ ·
     Success Stories · Register
   Categories expand as accordions. The page you are ON is
   never listed as a plain standalone link — it renders as a
   "You are here" block carrying that page's section anchors,
   inside its own category.

   Each page sets, BEFORE this script loads:
     window.ERJ_NAV = {
       active: 'home'|'mastery'|'remote'|'inner'|'pricing'|
               'stories'|'blog'|'cvscan'|'masterclass'|'login'|…,
       base:   '' (root) | '../' (one folder deep),
       portal: true          // admin/instructor surfaces only
       onPage: [{label,href,sub?}, …]   // optional anchors
     };
═══════════════════════════════════════════════════════ */
(() => {
    const cfg = window.ERJ_NAV || {};
    const active = cfg.active || '';
    const base = typeof cfg.base === 'string' ? cfg.base : '';
    const onPage = Array.isArray(cfg.onPage) ? cfg.onPage : [];
    const P = (href) => /^(https?:|mailto:|tel:|#|\/)/.test(href) ? href : base + href;
    const WA_CHANNEL = 'https://whatsapp.com/channel/0029Vaym4DE3mFY2wCrC713S';
    /* ── The five items. Sub-menus carry everything else. ── */
    const MENU = [
        { key: 'home', label: 'Home', href: 'index.html', keys: ['home'] },
        {
            key: 'g-free', label: 'Free For You', children: [
                { label: '10-Point CV Self-Scan', href: 'cvscan/', keys: ['cvscan'],
                    desc: 'Score your CV for remote readiness — instant, on your device' },
                { label: 'Free Live Masterclass', href: 'masterclass/', keys: ['masterclass'],
                    desc: 'The Global Remote Job Blueprint, live on Zoom' },
                { label: 'Remote Career Blog', href: 'blog.html', keys: ['blog'],
                    desc: 'Plain-English guidance, published daily' },
                { label: 'Global Job Board · WhatsApp', href: WA_CHANNEL, external: true,
                    desc: 'Real, verified remote roles — free channel' }
            ]
        },
        {
            key: 'g-start', label: 'Your Starting Line', children: [
                { label: 'Four Joints · One Leak', href: 'index.html#joints',
                    desc: 'The model: Supply → Representation → Aim → Conversion. Find your leak.', learnMore: true },
                { label: 'Mastery Training · Stages 1–4', href: 'masterytraining/', keys: ['mastery'],
                    desc: '20 days, every asset built by you: CV, LinkedIn, portfolio, interviews', learnMore: true },
                { label: 'Get A Remote Job · Done-For-You', href: 'getaremotejob/', keys: ['remote'],
                    desc: 'Our team builds your assets and aims your applications in 7 days', learnMore: true },
                { label: 'Inner Circle · Residency', href: 'innercircle/', keys: ['inner'],
                    desc: 'Closest to the fire — held with you until the offer is signed', learnMore: true }
            ]
        },
        { key: 'stories', label: 'Success Stories', href: 'testimonials.html', keys: ['stories', 'jobs'] },
        { key: 'pricing', label: 'Register', href: 'register.html', keys: ['pricing'] }
    ];
    /* Admin-side menu: the surfaces NOT open to the public live here,
       and only here — Surge Console, the gated CV Engine, the consoles. */
    const PORTAL_MENU = [
        { label: 'Participant Dashboard', href: 'dashboard.html' },
        { label: 'Admin Console', href: 'admin.html' },
        { label: 'Instructor Console', href: 'instructor.html' },
        { label: 'Blog Admin', href: 'blog-admin.html' },
        { label: 'Surge Console', href: 'erj-surge-console.html' },
        { label: 'CV Engine · gated', href: 'cvbuilder/' },
        { label: 'CV Self-Scan · public tool', href: 'cvscan/' },
        { label: 'Back to Website', href: 'index.html' }
    ];
    const IS_PORTAL = !!cfg.portal;
    const matches = (keys) => !!active && !!keys && keys.indexOf(active) !== -1;
    /* ── styles (injected once) ── */
    const css = [
        'html{scroll-padding-top:var(--erj-nav-h,64px);overflow-x:clip;}',
        '.erj-nav,.erj-panel,.erj-scrim{--enInk:var(--ink,#fff);--enPaper:var(--paper,#000);',
        '--enAccent:var(--accent,#FF5722);--enFaint:var(--ink-faint,#8a8a8a);--enSoft:var(--ink-soft,#a1a1a1);',
        '--enLine:var(--line,rgba(255,255,255,0.10));}',
        '.erj-nav{font-family:var(--font-body,system-ui,sans-serif);position:fixed;top:0;left:0;right:0;z-index:1000;',
        'display:flex;align-items:center;justify-content:space-between;gap:1rem;',
        'padding:0.7rem clamp(1.1rem,4vw,2.2rem);background:var(--enPaper);',
        'border-bottom:1px solid var(--enLine);box-shadow:0 1px 0 var(--enLine),0 6px 24px -18px rgba(0,0,0,0.5);}',
        '.erj-nav *{box-sizing:border-box;}',
        '.erj-brand{display:inline-flex;align-items:center;gap:9px;font-family:var(--font-display,Georgia,serif);',
        'font-weight:700;font-size:1rem;color:var(--enInk);letter-spacing:-0.3px;text-decoration:none;flex-shrink:0;}',
        '.erj-brand img{width:30px;height:30px;display:block;object-fit:contain;}',
        '.erj-brand b{font-weight:700;}.erj-brand i{font-style:italic;color:var(--enAccent);font-weight:700;margin-left:-0.08em;}',
        '.erj-right{display:flex;align-items:center;gap:0.55rem;flex-shrink:0;}',
        '.erj-icon{width:40px;height:40px;flex-shrink:0;border-radius:9px;background:transparent;border:1px solid var(--enLine);',
        'color:var(--enInk);font-size:0.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;',
        'transition:border-color .2s;line-height:1;}',
        '.erj-icon:hover{border-color:var(--enAccent);}',
        '.erj-burger svg{width:20px;height:20px;}',
        '.erj-panel{position:fixed;top:0;right:0;bottom:0;width:min(86vw,380px);z-index:1100;',
        'background:var(--enPaper);border-left:1px solid var(--enLine);box-shadow:-16px 0 50px rgba(0,0,0,0.22);',
        'overflow-y:auto;transform:translateX(100%);transition:transform .32s cubic-bezier(0.22,1,0.36,1);',
        'display:flex;flex-direction:column;visibility:hidden;}',
        '.erj-panel.open{transform:translateX(0);visibility:visible;}',
        '.erj-panel-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;',
        'padding:1.1rem 1.3rem;border-bottom:1px solid var(--enLine);position:sticky;top:0;background:var(--enPaper);z-index:2;}',
        '.erj-panel-title{font-size:0.66rem;letter-spacing:2.5px;text-transform:uppercase;color:var(--enFaint);font-weight:500;}',
        '.erj-panel-x{width:34px;height:34px;border-radius:8px;background:transparent;border:1px solid var(--enLine);',
        'color:var(--enInk);font-size:1.05rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
        '.erj-panel-x:hover{border-color:var(--enAccent);}',
        '.erj-list{display:flex;flex-direction:column;gap:0;list-style:none;margin:0;padding:0.6rem 0.8rem 1.5rem;}',
        '.erj-link,.erj-glabel{display:flex;align-items:center;justify-content:space-between;gap:0.6rem;width:100%;',
        'text-align:left;color:var(--enInk);font-family:var(--font-display,Georgia,serif);font-size:1.14rem;font-weight:600;',
        'letter-spacing:-0.3px;text-decoration:none;padding:0.85rem 0.6rem;border-radius:8px;',
        'background:transparent;border:0;cursor:pointer;transition:background .15s,color .15s;}',
        '.erj-link:hover,.erj-glabel:hover{background:var(--enLine);}',
        '.erj-glabel .chev{font-size:0.72rem;color:var(--enFaint);transition:transform .25s;}',
        '.erj-group.open .erj-glabel .chev{transform:rotate(180deg);color:var(--enAccent);}',
        '.erj-gkids{display:none;padding:0.1rem 0 0.5rem 0.55rem;margin-left:0.35rem;border-left:2px solid var(--enLine);}',
        '.erj-group.open .erj-gkids{display:block;}',
        '.erj-sub-item{display:block;text-decoration:none;padding:0.6rem 0.65rem;border-radius:8px;transition:background .15s;}',
        '.erj-sub-item:hover{background:var(--enLine);}',
        '.erj-sub-item .t{display:block;color:var(--enInk);font-size:0.92rem;font-weight:600;font-family:var(--font-body,sans-serif);}',
        '.erj-sub-item small{display:block;color:var(--enFaint);font-size:0.76rem;line-height:1.5;margin-top:0.15rem;font-weight:400;}',
        '.erj-sub-item .lm{display:inline-block;margin-top:0.35rem;font-size:0.72rem;font-weight:700;color:var(--enAccent);',
        'letter-spacing:0.04em;}',
        '.erj-sub-item:hover .lm{text-decoration:underline;}',
        '.erj-here{padding:0.55rem 0.65rem 0.2rem;}',
        '.erj-here-t{font-size:0.64rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--enAccent);font-weight:700;}',
        '.erj-here-l{display:block;color:var(--enInk);font-family:var(--font-display,Georgia,serif);font-size:1.02rem;font-weight:700;margin-top:0.15rem;}',
        '.erj-anchors{display:flex;flex-direction:column;padding:0.2rem 0 0.4rem;}',
        '.erj-anchors a{display:block;color:var(--enSoft);font-size:0.84rem;text-decoration:none;padding:0.42rem 0.65rem;',
        'border-radius:7px;transition:background .15s,color .15s;}',
        '.erj-anchors a:hover{background:var(--enLine);color:var(--enAccent);}',
        '.erj-item.is-here>.erj-link,.erj-anchors a.is-here{color:var(--enAccent);}',
        '.f-stop.is-here .no{opacity:1;}.f-stop.is-here .lbl{color:var(--enAccent);}',
        '.erj-scrim{position:fixed;inset:0;z-index:1090;background:rgba(0,0,0,0.42);opacity:0;visibility:hidden;',
        'transition:opacity .3s,visibility .3s;}',
        '.erj-scrim.open{opacity:1;visibility:visible;}',
        '@media(max-width:400px){.erj-nav{gap:0.5rem;padding-left:0.85rem;padding-right:0.85rem;}',
        '.erj-brand{flex-shrink:1;min-width:0;font-size:0.9rem;gap:7px;overflow:hidden;white-space:nowrap;}',
        '.erj-brand img{width:26px;height:26px;}.erj-right{gap:0.3rem;}.erj-icon{width:36px;height:36px;}}',
        '@media(prefers-reduced-motion:reduce){.erj-panel,.erj-scrim,.erj-glabel .chev{transition:none;}}'
    ].join('');
    const style = document.createElement('style');
    style.id = 'erjNavCSS';
    style.textContent = css;
    document.head.appendChild(style);
    /* ── top bar ── */
    const nav = document.createElement('header');
    nav.className = 'erj-nav';
    nav.innerHTML =
        '<a href="' + P('index.html') + '" class="erj-brand"><img src="' + P('logo.png') + '" alt="ERJ">' +
            '<b>Everything</b><i>RemoteJob</i></a>' +
            '<div class="erj-right">' +
            '<button class="erj-icon" data-erj-theme-btn title="Toggle theme" aria-label="Toggle theme">\uD83C\uDF19</button>' +
            '<button class="erj-icon erj-burger" id="erjBurger" aria-label="Open menu" aria-haspopup="true" aria-expanded="false">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
            '<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>' +
            '</button></div>';
    /* ── drawer content ── */
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    function hereBlock(label) {
        let h = '<div class="erj-here"><span class="erj-here-t">You are here</span>' +
            '<span class="erj-here-l">' + esc(label) + '</span></div>';
        if (onPage.length) {
            h += '<div class="erj-anchors">' +
                onPage.map(s => '<a href="' + P(s.href) + '">' + esc(s.label) + '</a>').join('') +
                '</div>';
        }
        return h;
    }
    function childRow(c) {
        if (matches(c.keys))
            return hereBlock(c.label); // current page: anchors, not a duplicate link
        const ext = c.external ? ' target="_blank" rel="noopener"' : '';
        return '<a class="erj-sub-item" href="' + P(c.href) + '"' + ext + '>' +
            '<span class="t">' + esc(c.label) + '</span>' +
            (c.desc ? '<small>' + esc(c.desc) + '</small>' : '') +
            (c.learnMore ? '<span class="lm">Learn more \u2192</span>' : '') +
            '</a>';
    }
    function buildItems() {
        if (IS_PORTAL) {
            return '<div class="erj-group open"><div class="erj-gkids" style="border:0;margin:0;padding-left:0;">' +
                PORTAL_MENU.map(childRow).join('') + '</div></div>';
        }
        return MENU.map(top => {
            if (!top.children) {
                if (matches(top.keys)) {
                    return '<div class="erj-item is-here">' + hereBlock(top.label) + '</div>';
                }
                return '<div class="erj-item"><a class="erj-link" href="' + P(top.href || '#') + '">' +
                    esc(top.label) + '</a></div>';
            }
            const containsActive = top.children.some(c => matches(c.keys));
            return '<div class="erj-group' + (containsActive ? ' open' : '') + '" data-group="' + top.key + '">' +
                '<button type="button" class="erj-glabel" aria-expanded="' + (containsActive ? 'true' : 'false') + '">' +
                esc(top.label) + '<span class="chev">\u25BC</span></button>' +
                '<div class="erj-gkids">' + top.children.map(childRow).join('') + '</div>' +
                '</div>';
        }).join('');
    }
    const scrim = document.createElement('div');
    scrim.className = 'erj-scrim';
    scrim.id = 'erjScrim';
    const panel = document.createElement('aside');
    panel.className = 'erj-panel';
    panel.id = 'erjPanel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
        '<div class="erj-panel-head"><span class="erj-panel-title">Menu</span>' +
            '<button class="erj-panel-x" id="erjPanelX" aria-label="Close menu">\u2715</button></div>' +
            '<nav class="erj-list" aria-label="Site menu">' + buildItems() + '</nav>';
    function setOffset() {
        const h = nav.offsetHeight || 58;
        document.body.style.paddingTop = h + 'px';
        document.documentElement.style.setProperty('--erj-nav-h', h + 'px');
    }
    function wire() {
        const burger = document.getElementById('erjBurger');
        const open = () => {
            panel.classList.add('open');
            scrim.classList.add('open');
            panel.setAttribute('aria-hidden', 'false');
            if (burger)
                burger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };
        const close = () => {
            panel.classList.remove('open');
            scrim.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
            if (burger)
                burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };
        if (burger)
            burger.addEventListener('click', open);
        const x = document.getElementById('erjPanelX');
        if (x)
            x.addEventListener('click', close);
        scrim.addEventListener('click', close);
        panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
        panel.querySelectorAll('.erj-glabel').forEach(btn => {
            btn.addEventListener('click', () => {
                const g = btn.parentElement;
                if (!g)
                    return;
                const on = g.classList.toggle('open');
                btn.setAttribute('aria-expanded', on ? 'true' : 'false');
            });
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape')
            close(); });
    }
    function mount() {
        const slot = document.getElementById('erjNavMount');
        if (slot && slot.parentNode)
            slot.parentNode.replaceChild(nav, slot);
        else
            document.body.insertBefore(nav, document.body.firstChild);
        setOffset();
        requestAnimationFrame(setOffset);
        window.addEventListener('load', setOffset);
        window.addEventListener('resize', setOffset);
        if (document.fonts && document.fonts.ready)
            document.fonts.ready.then(setOffset);
        document.body.appendChild(scrim);
        document.body.appendChild(panel);
        wire();
        if (window.erjApplyTheme) {
            try {
                window.erjApplyTheme(localStorage.getItem('rjt-theme') || 'system');
            }
            catch (e) { /* noop */ }
        }
    }
    /* ── in-page tour, rendered from the SAME onPage array ── */
    function mountTour() {
        const hosts = document.querySelectorAll('[data-erj-tour]');
        if (!hosts.length || !onPage.length)
            return;
        const title = cfg.tourTitle || 'On this page';
        let html = '<div class="f-tour-t">' + title + '</div><div class="f-stops">';
        onPage.forEach((st, i) => {
            const no = i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1);
            html += '<a class="f-stop" href="' + st.href + '" data-tour-target="' + st.href + '">' +
                '<span class="no">' + no + '</span><span class="lbl">' + st.label +
                (st.sub ? '<small>' + st.sub + '</small>' : '') +
                '</span><span class="go">\u2192</span></a>';
        });
        html += '</div>';
        if (cfg.tourSkip) {
            html += '<a class="f-tour-skip" href="' + cfg.tourSkip.href + '">' +
                cfg.tourSkip.label + ' <span>\u2192</span></a>';
        }
        hosts.forEach(h => { h.innerHTML = html; });
        spyTour();
    }
    /* Highlight the section the reader is inside — tour + drawer anchors. */
    function spyTour() {
        const els = [];
        const seen = {};
        onPage.forEach(s => {
            const h = s.href;
            if (!h || h.charAt(0) !== '#' || seen[h])
                return;
            const el = document.getElementById(h.slice(1));
            if (el) {
                el.setAttribute('data-tour-id', h);
                els.push(el);
                seen[h] = 1;
            }
        });
        if (!els.length || !('IntersectionObserver' in window))
            return;
        const visible = {};
        const paint = () => {
            let cur = null;
            for (const el of els) {
                const h = el.getAttribute('data-tour-id') || '';
                if (visible[h]) {
                    cur = h;
                    break;
                }
            }
            if (!cur)
                return;
            document.querySelectorAll('[data-tour-target],.erj-anchors a').forEach(a => {
                const href = a.getAttribute('data-tour-target') || a.getAttribute('href');
                if (href === cur)
                    a.classList.add('is-here');
                else
                    a.classList.remove('is-here');
            });
        };
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => { visible[en.target.getAttribute('data-tour-id') || ''] = en.isIntersecting; });
            paint();
        }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
        els.forEach(el => io.observe(el));
    }
    const mountAll = () => { mount(); try {
        mountTour();
    }
    catch (e) { /* noop */ } };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', mountAll);
    else
        mountAll();
})();
/* ── Tour navigator: floating up/down arrows stepping through
      ERJ_NAV.onPage anchors. Mounts on pages with 2+ stops. ── */
(() => {
    function mount() {
        const nav = window.ERJ_NAV;
        if (!nav || nav.portal || !Array.isArray(nav.onPage))
            return;
        const stops = nav.onPage
            .filter(s => s && s.href && s.href.charAt(0) === '#')
            .map(s => document.querySelector(s.href))
            .filter((el) => !!el);
        if (stops.length < 2)
            return;
        const css = document.createElement('style');
        css.textContent =
            '.erj-tournav{position:fixed;left:clamp(0.6rem,1.6vw,1.1rem);top:50%;transform:translateY(-50%);' +
                'display:flex;flex-direction:column;gap:0.45rem;z-index:190;}' +
                '.erj-tournav button{width:38px;height:38px;border-radius:50%;border:1px solid var(--card-line,rgba(128,128,128,.28));' +
                'background:var(--card,#111);color:var(--ink,#fff);cursor:pointer;display:flex;align-items:center;justify-content:center;' +
                'box-shadow:0 6px 20px rgba(0,0,0,.28);transition:transform .25s,border-color .25s,opacity .3s;padding:0;opacity:.55;}' +
                '.erj-tournav:hover button,.erj-tournav button:focus-visible{opacity:1;}' +
                '.erj-tournav button:hover{transform:scale(1.08);border-color:var(--accent,#FF5722);opacity:1;}' +
                '.erj-tournav button:focus-visible{outline:2px solid var(--accent,#FF5722);outline-offset:2px;}' +
                '.erj-tournav button svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}' +
                '.erj-tournav button[disabled]{opacity:.16;cursor:default;transform:none;}' +
                '@media(max-width:768px){.erj-tournav{gap:0.4rem;left:0.5rem;}' +
                '.erj-tournav button{width:33px;height:33px;box-shadow:0 4px 14px rgba(0,0,0,.24);}' +
                '.erj-tournav button svg{width:13px;height:13px;}}' +
                '@media(max-width:380px){.erj-tournav{display:none;}}';
        document.head.appendChild(css);
        const box = document.createElement('div');
        box.className = 'erj-tournav';
        box.setAttribute('aria-label', 'Tour navigation');
        box.innerHTML =
            '<button type="button" data-dir="-1" aria-label="Previous section" title="Previous section">' +
                '<svg viewBox="0 0 24 24"><polyline points="6 15 12 9 18 15"></polyline></svg></button>' +
                '<button type="button" data-dir="1" aria-label="Next section" title="Next section">' +
                '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></button>';
        document.body.appendChild(box);
        const upBtn = box.children[0];
        const downBtn = box.children[1];
        const OFFSET = 84;
        const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        const tops = () => stops.map(el => el.getBoundingClientRect().top + window.pageYOffset - OFFSET);
        const currentIndex = () => {
            const y = window.pageYOffset;
            const t = tops();
            let idx = -1;
            for (let i = 0; i < t.length; i++)
                if (y >= t[i] - 4)
                    idx = i;
            return idx;
        };
        const sync = () => {
            const idx = currentIndex();
            upBtn.disabled = window.pageYOffset < 8;
            downBtn.disabled = idx >= stops.length - 1;
        };
        const go = (dir) => {
            const idx = currentIndex();
            let next = Math.min(stops.length - 1, Math.max(0, idx + dir));
            if (idx === -1 && dir === 1)
                next = 0;
            if (idx === -1 && dir === -1) {
                window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
                return;
            }
            if (idx === 0 && dir === -1) {
                window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
                sync();
                return;
            }
            window.scrollTo({ top: tops()[next], behavior: reduced ? 'auto' : 'smooth' });
            setTimeout(sync, 350);
        };
        upBtn.addEventListener('click', () => go(-1));
        downBtn.addEventListener('click', () => go(1));
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(() => { sync(); ticking = false; });
        }, { passive: true });
        sync();
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', mount);
    else
        mount();
})();
