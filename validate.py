#!/usr/bin/env python3
"""Site validator for everythingremotejob.com.

Checks the things that have actually broken this site before:
  · unbalanced block markup after an edit
  · internal links and src= paths that point at nothing
  · every sw.js SHELL path existing (a missing one aborts the WHOLE precache)
  · erj-config.js loading BEFORE erj-capture.js, and both after erj-nav.js
  · one WhatsApp number site-wide
  · no page referencing a stale cache-busted image name
"""
import re, pathlib, sys, json

# Resolve against this file's own location so the validator runs from any
# checkout — the previous absolute path only worked on one machine.
ROOT = pathlib.Path(__file__).resolve().parent
errors, warnings, notes = [], [], []

HTML = sorted(p for p in ROOT.rglob("*.html") if "node_modules" not in str(p))

# ── 1 · block markup balance ──────────────────────────────────────────
for f in HTML:
    s = f.read_text(encoding="utf-8", errors="ignore")
    for tag in ("section", "main", "footer", "html", "body"):
        o = len(re.findall(r"<%s\b" % tag, s, re.I))
        c = len(re.findall(r"</%s>" % tag, s, re.I))
        if o != c:
            errors.append(f"{f.relative_to(ROOT)}: <{tag}> {o} open / {c} close")

# ── 2 · internal links + assets resolve ───────────────────────────────
def resolve(page: pathlib.Path, href: str):
    href = href.split("#")[0].split("?")[0]
    if not href or href.startswith(("http", "mailto:", "tel:", "javascript:", "data:", "//")):
        return None
    if "${" in href or "{{" in href:
        return None          # JS template literal, resolved at runtime
    if href.startswith("/"):
        target = (ROOT / href.lstrip("/")).resolve()   # root-relative
    else:
        target = (page.parent / href).resolve()
    if target.is_dir():
        target = target / "index.html"
    if str(target).endswith("/"):
        target = pathlib.Path(str(target) + "index.html")
    return target

for f in HTML:
    s = f.read_text(encoding="utf-8", errors="ignore")
    for attr in ("href", "src"):
        for m in re.finditer(r'%s="([^"]+)"' % attr, s):
            t = resolve(f, m.group(1))
            if t is None:
                continue
            if not t.exists():
                # links inside JS template strings are checked loosely
                errors.append(f"{f.relative_to(ROOT)}: dead {attr} \u2192 {m.group(1)}")

# ── 3 · service-worker precache integrity ─────────────────────────────
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
shell = re.findall(r"'(/[^']+)'", sw.split("const SHELL")[1].split("];")[0])
for path in shell:
    p = ROOT / path.lstrip("/")
    if not p.exists():
        errors.append(f"sw.js: SHELL lists {path} which does not exist "
                      f"(this aborts the ENTIRE precache)")
cache = re.search(r"const CACHE\s*=\s*'([^']+)'", sw)
notes.append(f"service worker cache: {cache.group(1) if cache else '??'}")

# ── 4 · capture layer script order ────────────────────────────────────
for f in HTML:
    s = f.read_text(encoding="utf-8", errors="ignore")
    if "erj-capture.js" not in s:
        continue
    def tag_pos(name):
        m = re.search(r'<script[^>]+src="[^"]*%s"' % re.escape(name), s)
        return m.start() if m else -1
    i_cfg = tag_pos("erj-config.js")
    i_cap = tag_pos("erj-capture.js")
    i_nav = tag_pos("erj-nav.js")
    if i_cfg == -1:
        errors.append(f"{f.relative_to(ROOT)}: loads erj-capture.js without erj-config.js")
    elif i_cfg > i_cap:
        errors.append(f"{f.relative_to(ROOT)}: erj-config.js must load BEFORE erj-capture.js")
    if i_nav != -1 and i_nav > i_cap:
        warnings.append(f"{f.relative_to(ROOT)}: erj-nav.js loads after capture "
                        f"(ERJ_NAV.base may be undefined \u2014 relative links could break)")

# ── 5 · one WhatsApp number ───────────────────────────────────────────
nums = set()
for f in HTML + [ROOT / "erj-config.js", ROOT / "erj-capture.js"]:
    s = f.read_text(encoding="utf-8", errors="ignore")
    nums.update(re.findall(r"wa\.me/(\d+)", s))
    nums.update(re.findall(r"whatsapp\.com/send\?phone=(\d+)", s))
if len(nums) > 1:
    errors.append(f"more than one WhatsApp number in use: {sorted(nums)}")
else:
    notes.append(f"WhatsApp number: {sorted(nums)[0] if nums else 'none found'}")

# ── 6 · new pages are reachable and indexed ───────────────────────────
sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
if "/diagnose/" not in sitemap:
    errors.append("sitemap.xml missing /diagnose/")
inbound = sum(1 for f in HTML
              if "diagnose/" in f.read_text(encoding="utf-8", errors="ignore")
              and f.name != "index.html" or
              (f.name == "index.html" and "diagnose/" in f.read_text(encoding="utf-8", errors="ignore")))
if inbound == 0:
    errors.append("/diagnose/ has no inbound links \u2014 it is orphaned")
else:
    notes.append(f"/diagnose/ inbound link sources: {inbound}")

# ── 7 · capture coverage report ───────────────────────────────────────
covered = [str(f.relative_to(ROOT)) for f in HTML
           if "erj-capture.js" in f.read_text(encoding="utf-8", errors="ignore")]
notes.append(f"capture layer live on {len(covered)} pages")

# ── 8 · config sanity ─────────────────────────────────────────────────
cfg = (ROOT / "erj-config.js").read_text(encoding="utf-8")
for key in ("whatsapp", "channel", "capacity", "evergreen", "messages"):
    if key + ":" not in cfg:
        errors.append(f"erj-config.js missing '{key}'")
for tok in ("{score}", "{defaults}", "{joint}"):
    if tok not in cfg:
        warnings.append(f"erj-config.js: template token {tok} not present")


# ── 9 · capture components are styled wherever they render ────────────
cap_js = (ROOT / "erj-capture.js").read_text(encoding="utf-8")
emitted = set(re.findall(r"class=\\?[\"']([a-z][a-z0-9 _-]*)", cap_js))
emitted = {c for group in emitted for c in group.split() if c.startswith(("cap-", "eg-", "cb-", "cr-"))}
styled = set(re.findall(r"\.([a-z][a-z0-9-]*)", cap_js.split("const CSS")[1].split("`;")[0])) if "const CSS" in cap_js else set()
missing = sorted(c for c in emitted if c not in styled)
if missing:
    warnings.append("capture layer emits unstyled classes: " + ", ".join(missing))
else:
    notes.append(f"all {len(emitted)} capture classes carry their own CSS")


# ── 10 · SEO integrity ────────────────────────────────────────────────
PUBLIC_INDEXABLE = ["index.html","free.html","starting-line.html","register.html",
    "testimonials.html","blog.html","diagnose/index.html","cvscan/index.html",
    "masterclass/index.html","masterytraining/index.html","getaremotejob/index.html",
    "innercircle/index.html"]

for page in PUBLIC_INDEXABLE:
    s2 = (ROOT / page).read_text(encoding="utf-8", errors="ignore")
    if 'rel="canonical"' not in s2:
        errors.append(f"SEO: {page} has no canonical")
    if 'name="robots"' not in s2:
        errors.append(f"SEO: {page} has no robots meta")
    m = re.search(r'rel="canonical" href="([^"]+)"', s2)
    if m and "#" in m.group(1):
        errors.append(f"SEO: {page} canonical contains a fragment (Google discards it)")
    m = re.search(r'og:image" content="([^"]+)"', s2)
    if not m:
        errors.append(f"SEO: {page} has no og:image")
    else:
        img = ROOT / m.group(1).replace("https://everythingremotejob.com/", "")
        if not img.exists():
            errors.append(f"SEO: {page} og:image points at a missing file ({img.name})")

# every og:image must be unique — a shared preview makes pages look duplicate
seen_imgs = {}
for page in PUBLIC_INDEXABLE:
    s2 = (ROOT / page).read_text(encoding="utf-8", errors="ignore")
    m = re.search(r'og:image" content="([^"]+)"', s2)
    if m:
        seen_imgs.setdefault(m.group(1), []).append(page)
for img, pages in seen_imgs.items():
    if len(pages) > 1:
        warnings.append(f"SEO: {len(pages)} pages share one og:image ({img.split('/')[-1]}): {pages}")

# redirect stubs must be crawlable AND noindex, or they report as duplicates
for stub in ROOT.rglob("*.html"):
    txt = stub.read_text(encoding="utf-8", errors="ignore")
    if "http-equiv=\"refresh\"" in txt:
        rel = stub.relative_to(ROOT)
        if 'content="noindex' not in txt:
            errors.append(f"SEO: redirect stub {rel} is indexable (causes 'duplicate without canonical')")

# sitemap must list only URLs that exist and are indexable
sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
for loc in re.findall(r"<loc>https://everythingremotejob\.com/([^<]*)</loc>", sm):
    target = ROOT / (loc if loc else "index.html")
    if target.is_dir():
        target = target / "index.html"
    if not target.exists():
        errors.append(f"SEO: sitemap lists /{loc} which does not exist")
notes.append(f"sitemap: {len(re.findall(r'<loc>', sm))} URLs, all resolve")


# ── 11 · retired URLs stay retired ────────────────────────────────────
# The stubs are gone; 404.html is the single mechanism. Guard against a
# future edit quietly reintroducing scattered redirect files.
nf = ROOT / "404.html"
if not nf.exists():
    errors.append("404.html is missing — every retired URL now depends on it")
else:
    txt = nf.read_text(encoding="utf-8")
    if 'content="noindex' not in txt:
        errors.append("404.html must be noindex")
    mapped = re.findall(r"'(/[^']*)':\s*'([^']*)'", txt)
    notes.append(f"404 legacy map: {len(mapped)} retired URLs handled in one place")
    for _, target in mapped:
        t = ROOT / target.split("#")[0]
        if t.is_dir():
            t = t / "index.html"
        if not t.exists():
            errors.append(f"404 map points at {target}, which does not exist")

for gone in ["products", "howtogetaremotejob"]:
    if (ROOT / gone).exists():
        errors.append(f"/{gone}/ was deleted on purpose — it is back")

stubs = [f.relative_to(ROOT) for f in ROOT.rglob("*.html")
         if 'http-equiv="refresh"' in f.read_text(encoding="utf-8", errors="ignore")]
if stubs:
    warnings.append("redirect stubs are back outside 404.html: "
                    + ", ".join(str(x) for x in stubs))

# ── report ────────────────────────────────────────────────────────────
print("\n── NOTES ──")
for n in notes:
    print("  \u00b7 " + n)
if warnings:
    print("\n── WARNINGS ──")
    for w in warnings:
        print("  ! " + w)
print("\n── ERRORS ──")
if errors:
    for e in errors:
        print("  \u2717 " + e)
    print(f"\n{len(errors)} error(s)\n")
    sys.exit(1)
print("  none \u2014 site validates clean\n")
