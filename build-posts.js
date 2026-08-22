const fs=require('fs'), path=require('path');
const posts=JSON.parse(fs.readFileSync('./posts.json','utf8'));
const SITE='https://everythingremotejob.com';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const strip=s=>String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const fmt=d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});

const CSS=`*{box-sizing:border-box}
:root{--bg:#000;--card:#0B0906;--text:#fff;--muted:#A1A1A1;--muted2:#858585;--accent:#FF5722;--accent-btn:#C9400E;--line:rgba(255,255,255,.12);
--fd:'Space Grotesk',ui-sans-serif,system-ui,sans-serif;--fb:'Inter',ui-sans-serif,system-ui,sans-serif}
html{scroll-behavior:smooth}
body{padding-top:63px}@media(min-width:980px){body{padding-top:65px}}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--fb);font-size:17px;line-height:1.78;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.wrap{max-width:720px;margin:0 auto;padding:0 clamp(1.1rem,5vw,1.6rem)}
article{padding:clamp(2.2rem,7vw,4rem) 0 3rem}
.crumb{font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted2);margin-bottom:1.4rem}
.crumb a{color:var(--accent);text-decoration:none}
.cat{display:inline-block;font-size:.64rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);border:1px solid rgba(255,87,34,.35);border-radius:100px;padding:4px 11px;margin-bottom:1.1rem}
h1{font-family:var(--fd);font-size:clamp(1.75rem,5.2vw,2.7rem);line-height:1.14;letter-spacing:-.025em;font-weight:800;margin:0 0 1rem}
.excerpt{font-size:1.06rem;color:var(--muted);line-height:1.7;margin:0 0 1.6rem}
.meta{display:flex;flex-wrap:wrap;gap:.5rem 1.2rem;font-size:.8rem;color:var(--muted2);padding-bottom:1.6rem;border-bottom:1px solid var(--line);margin-bottom:2.2rem}
.body h2{font-family:var(--fd);font-size:clamp(1.2rem,3.4vw,1.55rem);line-height:1.25;letter-spacing:-.015em;font-weight:700;color:#fff;margin:2.6rem 0 .7rem}
.body h3{font-family:var(--fd);font-size:1.06rem;font-weight:700;color:#fff;margin:1.9rem 0 .5rem}
.body p{margin:0 0 1.15rem;color:#E8E4DF}
.body ul,.body ol{margin:0 0 1.2rem;padding-left:1.3rem;color:#E8E4DF}
.body li{margin-bottom:.5rem}
.body strong{color:#fff;font-weight:600}
.body em{font-style:italic}
.body a{color:var(--accent)}
.body blockquote{margin:1.8rem 0;padding:1.1rem 1.3rem;background:rgba(255,87,34,.07);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;color:#E8E4DF}
.body blockquote p:last-child{margin-bottom:0}
.tags{display:flex;flex-wrap:wrap;gap:.45rem;margin:2.4rem 0 0}
.tags span{font-size:.72rem;color:var(--muted2);border:1px solid var(--line);border-radius:100px;padding:3px 10px}
.cta{margin:3rem 0 0;padding:1.6rem;background:var(--card);border:1px solid rgba(255,87,34,.3);border-radius:16px}
.cta h2{font-family:var(--fd);font-size:1.15rem;font-weight:800;color:#fff;margin:0 0 .5rem}
.cta p{color:var(--muted);font-size:.92rem;margin:0 0 1.1rem}
.cta a{display:inline-block;background:var(--accent-btn);color:#fff;text-decoration:none;font-family:var(--fd);font-weight:700;font-size:.92rem;padding:.8rem 1.4rem;border-radius:100px}
.more{margin:3rem 0 0;padding-top:1.8rem;border-top:1px solid var(--line)}
.more h2{font-family:var(--fd);font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted2);font-weight:700;margin:0 0 1rem}
.more ul{list-style:none;padding:0;margin:0}
.more li{margin-bottom:.75rem}
.more a{color:#fff;text-decoration:none;font-size:.95rem;line-height:1.45;display:block}
.more a:hover{color:var(--accent)}
.more .d{display:block;font-size:.72rem;color:var(--muted2);margin-top:2px}
footer{border-top:1px solid var(--line);padding:2rem 0 3rem;font-size:.82rem;color:var(--muted2);text-align:center}
footer nav{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem 1.1rem;margin-top:.6rem}
footer a{color:var(--muted);text-decoration:none}
@media(max-width:520px){body{font-size:16px}}`;

let made=0;
posts.forEach((p,i)=>{
  const dir=path.join('blog',p.slug);
  fs.mkdirSync(dir,{recursive:true});
  const url=`${SITE}/blog/${p.slug}/`;
  const desc=strip(p.excerpt).slice(0,155);
  const related=[posts[(i+1)%posts.length],posts[(i+2)%posts.length],posts[(i+3)%posts.length]].filter(r=>r.slug!==p.slug);
  const schema={"@context":"https://schema.org","@type":"BlogPosting","headline":p.title,"description":desc,
    "datePublished":p.date,"dateModified":p.date,"inLanguage":"en",
    "author":{"@type":"Person","name":p.author},
    "publisher":{"@type":"Organization","name":"Everything Remote Job","url":SITE+"/","@id":SITE+"/#organization"},
    "mainEntityOfPage":{"@type":"WebPage","@id":url},
    "url":url,"articleSection":p.category,"keywords":(p.tags||[]).join(', ')};
  const crumbs={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":SITE+"/"},
    {"@type":"ListItem","position":2,"name":"Blog","item":SITE+"/blog.html"},
    {"@type":"ListItem","position":3,"name":p.title,"item":url}]};

  /* In-post links were authored relative to the site root (href="register.html").
     From /blog/<slug>/ they would resolve to /blog/<slug>/register.html and 404.
     Rewrite every root-relative href to climb two folders. */
  const body = p.content.replace(/href="(?!https?:|\/\/|#|mailto:|tel:|\/)([^"]+)"/g, 'href="../../$1"');

  const out=`<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
<meta charset="UTF-8">
<!-- Meta Pixel + Google Tag Manager -->
<script src="../../erj-track.js" async></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)} | Everything Remote Job</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="author" content="${esc(p.author)}">
<link rel="icon" type="image/png" sizes="64x64" href="../../favicon32.png" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" sizes="64x64" href="../../favicon32-dark.png" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="64x64" href="../../favicon32.png">
<link rel="apple-touch-icon" href="../../appletouchicon.png">
<link rel="manifest" href="../../manifest.json">
<meta name="theme-color" content="#000000" id="metaThemeColor">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Everything Remote Job">
<meta property="og:locale" content="en_NG">
<meta property="og:image" content="${SITE}/preview-blog-v5.jpg">
<meta property="article:published_time" content="${p.date}">
<meta property="article:section" content="${esc(p.category)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/preview-blog-v5.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"></noscript>
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NMFHS59B"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div id="erjNavMount"></div>
<script>window.ERJ_NAV={active:'blog',base:'../../'};</script>

<main>
<article class="wrap">
  <nav class="crumb"><a href="../../">Home</a> · <a href="../../blog.html">Blog</a></nav>
  <span class="cat">${esc(p.category)}</span>
  <h1>${esc(p.title)}</h1>
  <p class="excerpt">${esc(strip(p.excerpt))}</p>
  <div class="meta">
    <span>${esc(p.author)}</span>
    <span>${fmt(p.date)}</span>
    <span>${p.readTime} min read</span>
  </div>
  <div class="body">${body}</div>
  ${(p.tags&&p.tags.length)?`<div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}

  <aside class="cta">
    <h2>Work the whole system, at your own pace</h2>
    <p>Twenty sessions across four stages — remote mindset, the digital toolkit and AI fluency, async communication, and the global job search. Four finished assets you keep. ₦35,000, one payment, instant download.</p>
    <a href="../../selflearn/">See the Self-Learn Pack →</a>
  </aside>

  <nav class="more">
    <h2>Read next</h2>
    <ul>${related.map(r=>`<li><a href="../${r.slug}/">${esc(r.title)}<span class="d">${fmt(r.date)} · ${r.readTime} min</span></a></li>`).join('')}</ul>
  </nav>
</article>
</main>

<footer class="wrap">
  &copy; 2026 Everything Remote Job
  <nav><a href="../../">Home</a><a href="../../blog.html">Blog</a><a href="../">Blog Archive</a><a href="../../selflearn/">Self-Learn Pack</a><a href="../../register.html">Register</a><a href="../../free.html">Free For You</a></nav>
</footer>

<script src="../../erj-theme.js" defer></script>
<script src="../../erj-nav.js" defer></script>
</body></html>`;
  fs.writeFileSync(path.join(dir,'index.html'),out);
  made++;
});
console.log('generated',made,'static blog pages');
