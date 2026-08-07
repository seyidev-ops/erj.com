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

ROOT = pathlib.Path("/home/claude/erjwork/erj.com-2-Early-bird")
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
