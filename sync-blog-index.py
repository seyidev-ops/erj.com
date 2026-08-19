#!/usr/bin/env python3
"""
sync-blog-index.py — point blog.html and sitemap.xml at the pages on disk.

gen-blog.js works out each article's permanent address; build-posts.js writes
the page. Two more things have to agree with that, or an article publishes to
nowhere:

  1. POST_SLUGS inside blog.html — the map every article card uses to build
     its link. An id missing from this map falls back to blog.html?p=<id>,
     which robots.txt blocks Google from crawling. That is exactly how six
     articles nearly published invisibly.

  2. The blog section of sitemap.xml, with each article's own publication
     date as lastmod. A sitemap where every entry changed on the same day
     reads as machine noise and gets discounted.

Run through rebuild-blog.sh, not on its own.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
SITE = "https://everythingremotejob.com"

posts = json.loads((ROOT / "posts.json").read_text(encoding="utf-8"))

# ── 1 · POST_SLUGS ────────────────────────────────────────────────────
slugs = {p["id"]: p["slug"] for p in posts}
blog = (ROOT / "blog.html").read_text(encoding="utf-8")
replacement = "const POST_SLUGS=" + json.dumps(slugs, ensure_ascii=False) + ";"
blog2, n = re.subn(
    r"const POST_SLUGS=\{.*?\};", lambda _: replacement, blog, count=1, flags=re.S
)
if not n:
    raise SystemExit("could not find POST_SLUGS in blog.html — has it been renamed?")
(ROOT / "blog.html").write_text(blog2, encoding="utf-8")
print(f"  POST_SLUGS  {len(slugs)} articles mapped")

# ── 2 · sitemap ───────────────────────────────────────────────────────
sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
# drop every existing article entry, keep the archive index and everything else
sm = re.sub(
    r"  <url>\s*<loc>" + re.escape(SITE) + r"/blog/[^<]+/</loc>.*?</url>\n",
    "",
    sm,
    flags=re.S,
)
entries = "".join(
    f"""  <url>
    <loc>{SITE}/blog/{p['slug']}/</loc>
    <lastmod>{p['date']}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
"""
    for p in posts
)
sm = sm.replace("</urlset>", entries + "</urlset>")
(ROOT / "sitemap.xml").write_text(sm, encoding="utf-8")
print(f"  sitemap     {sm.count('<loc>')} URLs")
