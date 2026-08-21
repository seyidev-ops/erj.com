const fs=require('fs');
const posts=JSON.parse(fs.readFileSync('./posts.json','utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const sorted=posts.slice().sort((a,b)=>b.date.localeCompare(a.date));
const fmt=d=>{const [y,m,dd]=d.split('-').map(Number);
  return `${dd} ${['January','February','March','April','May','June','July','August','September','October','November','December'][m-1]} ${y}`;};
/* group by year-month, newest first */
const groups=[];
for(const p of sorted){const k=p.date.slice(0,7);
  if(!groups.length||groups[groups.length-1].k!==k) groups.push({k,items:[]});
  groups[groups.length-1].items.push(p);}
const monthName=k=>{const [y,m]=k.split('-');
  return `${['January','February','March','April','May','June','July','August','September','October','November','December'][+m-1]} ${y}`;};
const cats=[...new Set(sorted.map(p=>p.category))].sort();

const list=groups.map(g=>`  <section class="mon">
    <h2 id="m${g.k}">${monthName(g.k)}<span class="n">${g.items.length} article${g.items.length===1?'':'s'}</span></h2>
    <ul>
${g.items.map(p=>`      <li><a href="${p.slug}/"><span class="t">${esc(p.title)}</span><span class="d">${fmt(p.date)} · ${p.category} · ${p.readTime} min read</span></a></li>`).join('\n')}
    </ul>
  </section>`).join('\n');

const itemList={"@context":"https://schema.org","@type":"CollectionPage",
 "name":"Everything Remote Job — Blog Archive",
 "description":`Every article Everything Remote Job has published — ${sorted.length} pieces on landing and keeping a dollar-paying remote job from Africa.`,
 "url":"https://everythingremotejob.com/blog/",
 "isPartOf":{"@type":"WebSite","name":"Everything Remote Job","url":"https://everythingremotejob.com/"},
 "mainEntity":{"@type":"ItemList","numberOfItems":sorted.length,
  "itemListElement":sorted.map((p,i)=>({"@type":"ListItem","position":i+1,
    "url":`https://everythingremotejob.com/blog/${p.slug}/`,"name":p.title}))}};
const crumbs={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Home","item":"https://everythingremotejob.com/"},
 {"@type":"ListItem","position":2,"name":"Blog","item":"https://everythingremotejob.com/blog.html"},
 {"@type":"ListItem","position":3,"name":"Archive","item":"https://everythingremotejob.com/blog/"}]};

const html=`<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
<meta charset="UTF-8">
<!-- Meta Pixel + Google Tag Manager -->
<script src="../erj-track.js" async><\/script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog Archive — every article, ${sorted.length} and counting | Everything Remote Job</title>
<meta name="description" content="The complete Everything Remote Job archive: ${sorted.length} articles on CVs that pass ATS, interviews, salary, getting paid from abroad, and holding a remote job once you have it. Plain list, newest first.">
<link rel="canonical" href="https://everythingremotejob.com/blog/">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="icon" type="image/png" sizes="64x64" href="../favicon32.png" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" sizes="64x64" href="../favicon32-dark.png" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/png" sizes="64x64" href="../favicon32.png">
<link rel="apple-touch-icon" href="../appletouchicon.png">
<link rel="manifest" href="../manifest.json">
<meta name="theme-color" content="#000000" id="metaThemeColor">
<meta property="og:type" content="website">
<meta property="og:title" content="Blog Archive — every article Everything Remote Job has published">
<meta property="og:description" content="${sorted.length} articles on landing and keeping a dollar-paying remote job from Africa. Newest first.">
<meta property="og:url" content="https://everythingremotejob.com/blog/">
<meta property="og:site_name" content="Everything Remote Job">
<meta property="og:image" content="https://everythingremotejob.com/preview-blog-v4.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Blog Archive — every article Everything Remote Job has published">
<meta name="twitter:description" content="${sorted.length} articles on landing and keeping a dollar-paying remote job from Africa.">
<meta name="twitter:image" content="https://everythingremotejob.com/preview-blog-v4.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"></noscript>
<style>*{box-sizing:border-box}
:root{--bg:#000;--card:#0B0906;--text:#fff;--muted:#A1A1A1;--muted2:#858585;--accent:#FF5722;--line:rgba(255,255,255,.12);
--fd:'Space Grotesk',ui-sans-serif,system-ui,sans-serif;--fb:'Inter',ui-sans-serif,system-ui,sans-serif}
html{scroll-behavior:smooth}
body{margin:0;padding-top:59px;background:var(--bg);color:var(--text);font-family:var(--fb);font-size:17px;line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden}
@media(min-width:900px){body{padding-top:65px}}
.wrap{max-width:780px;margin:0 auto;padding:0 clamp(1.1rem,5vw,1.6rem)}
header.top{padding:clamp(2.2rem,7vw,3.6rem) 0 1.4rem}
.crumb{font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted2);margin-bottom:1.2rem}
.crumb a{color:var(--accent);text-decoration:none}
h1{font-family:var(--fd);font-size:clamp(1.8rem,5.4vw,2.7rem);line-height:1.12;letter-spacing:-.025em;font-weight:800;margin:0 0 .8rem}
.lede{font-size:1.04rem;color:var(--muted);margin:0 0 1.6rem;max-width:60ch}
.jump{display:flex;flex-wrap:wrap;gap:.4rem;padding-bottom:1.8rem;border-bottom:1px solid var(--line)}
.jump a{font-size:.76rem;color:var(--muted);text-decoration:none;border:1px solid var(--line);border-radius:100px;padding:5px 12px}
.jump a:hover{color:#fff;border-color:var(--accent)}
.mon{padding:2.1rem 0 .4rem}
.mon h2{font-family:var(--fd);font-size:1.18rem;font-weight:700;letter-spacing:-.01em;margin:0 0 1rem;display:flex;align-items:baseline;gap:.7rem}
.mon h2 .n{font-family:var(--fb);font-size:.72rem;font-weight:400;color:var(--muted2);letter-spacing:.06em}
.mon ul{list-style:none;margin:0;padding:0}
.mon li{border-top:1px solid var(--line)}
.mon li a{display:block;padding:.85rem 0;text-decoration:none;color:inherit}
.mon li a:hover .t{color:var(--accent)}
.t{display:block;font-family:var(--fd);font-size:1.02rem;font-weight:700;line-height:1.35;letter-spacing:-.01em;color:#fff}
.d{display:block;font-size:.78rem;color:var(--muted2);margin-top:.25rem}
aside.cta{margin:3rem 0 1rem;padding:1.5rem;background:rgba(255,87,34,.07);border:1px solid rgba(255,87,34,.28);border-radius:14px}
aside.cta h2{font-family:var(--fd);font-size:1.15rem;font-weight:800;margin:0 0 .5rem}
aside.cta p{color:var(--muted);margin:0 0 1rem;font-size:.95rem}
aside.cta a{display:inline-block;background:var(--accent);color:#fff;font-weight:700;font-size:1.18rem;text-decoration:none;padding:.7rem 1.4rem;border-radius:100px}
footer{padding:2.6rem 0 3.4rem;border-top:1px solid var(--line);margin-top:2.4rem;color:var(--muted2);font-size:.85rem}
footer nav{display:flex;flex-wrap:wrap;gap:1rem;margin-top:.7rem}
footer nav a{color:var(--muted);text-decoration:none}
footer nav a:hover{color:var(--accent)}
.skip{position:absolute;left:-9999px}
.skip:focus{left:1rem;top:1rem;background:var(--accent);color:#fff;padding:.6rem 1rem;border-radius:8px;z-index:9999}
</style>
<script type="application/ld+json">${JSON.stringify(itemList)}<\/script>
<script type="application/ld+json">${JSON.stringify(crumbs)}<\/script>
</head>
<body>
<a class="skip" href="#archive">Skip to the archive</a>
<div id="erjNavMount"></div>
<script>window.ERJ_NAV={active:'blog',base:'../'};<\/script>

<main class="wrap">
<header class="top">
  <div class="crumb"><a href="../">Home</a> / <a href="../blog.html">Blog</a> / Archive</div>
  <h1>Every article we have published</h1>
  <p class="lede">${sorted.length} pieces, newest first — CVs that survive an ATS, interviews, salary questions asked from Lagos, getting paid from abroad, and what the first ninety days of a remote job actually demand. No filtering, no pagination: the whole shelf on one page.</p>
  <nav class="jump" aria-label="Jump to month">
${groups.map(g=>`    <a href="#m${g.k}">${monthName(g.k)}</a>`).join('\n')}
  </nav>
</header>

<div id="archive">
${list}
</div>

<aside class="cta">
  <h2>Reading is the free half</h2>
  <p>The other half is the work. Twenty sessions across four stages, four finished assets you keep, at your own speed — ₦35,000, one payment.</p>
  <a href="../selflearn/">See the Self-Learn Pack →</a>
</aside>
</main>

<footer class="wrap">
  &copy; 2026 Everything Remote Job · Business Play Limited
  <nav><a href="../">Home</a><a href="../blog.html">Blog</a><a href="../selflearn/">Self-Learn Pack</a><a href="../register.html">Register</a><a href="../free.html">Free For You</a><a href="../testimonials.html">Testimonials</a></nav>
</footer>

<script src="../erj-theme.js" defer><\/script>
<script src="../erj-nav.js" defer><\/script>
</body></html>
`;
fs.mkdirSync('blog',{recursive:true});
fs.writeFileSync('blog/index.html',html);
console.log('wrote blog/index.html —',html.length,'bytes,',sorted.length,'links,',groups.length,'month groups');
