#!/usr/bin/env python3
"""
inline-css.py — fold product.css into the pages that use it.

WHY THIS EXISTS
---------------
product.css was a separate stylesheet, which means the browser could not
paint a single pixel until it had opened a second connection, asked for
the file, and waited for it to come back. On a Nigerian mobile connection
that round trip measured 332 ms of pure waiting — a third of a second of
black screen, on every first visit, before anything appeared.

Inlining removes the round trip entirely. Measured on a throttled phone:
    external product.css   First Contentful Paint  1200 ms
    inlined  product.css   First Contentful Paint   868 ms

THE RULE
--------
product.css REMAINS THE SOURCE OF TRUTH. Edit product.css, never the
inlined copies. Then run:

    python3 inline-css.py

and every page is rewritten from the current product.css. The script is
idempotent — running it twice changes nothing — and it is safe to run
before every deploy.

If you ever want to go back to a linked stylesheet:

    python3 inline-css.py --restore
"""
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
CSS = ROOT / "product.css"

BEGIN = "<!-- BEGIN product.css (inlined by inline-css.py — edit product.css, not this) -->"
END = "<!-- END product.css -->"
LINK = '<link rel="stylesheet" href="product.css">'

BLOCK_RE = re.compile(
    re.escape(BEGIN) + r".*?" + re.escape(END),
    re.S,
)


def pages():
    """Every page that carries product.css, however it currently carries it."""
    out = []
    for p in sorted(ROOT.glob("*.html")) + sorted(ROOT.glob("*/index.html")):
        t = p.read_text(encoding="utf-8")
        if LINK in t or BEGIN in t:
            out.append(p)
    return out


def inline():
    css = CSS.read_text(encoding="utf-8")
    block = f"{BEGIN}\n<style>{css}</style>\n{END}"
    n = 0
    for p in pages():
        t = p.read_text(encoding="utf-8")
        if BEGIN in t:
            new = BLOCK_RE.sub(lambda _: block, t)
        else:
            new = t.replace(LINK, block)
        if new != t:
            p.write_text(new, encoding="utf-8")
            n += 1
        print(f"  {'updated' if new != t else 'current'}  {p.relative_to(ROOT)}")
    print(f"\n{n} page(s) rewritten from product.css ({len(css):,} bytes)")


def restore():
    n = 0
    for p in pages():
        t = p.read_text(encoding="utf-8")
        new = BLOCK_RE.sub(lambda _: LINK, t)
        if new != t:
            p.write_text(new, encoding="utf-8")
            n += 1
    print(f"{n} page(s) restored to <link rel=stylesheet href=product.css>")


if __name__ == "__main__":
    if not CSS.exists():
        sys.exit("product.css not found — run this from the site root.")
    if "--restore" in sys.argv:
        restore()
    else:
        inline()
