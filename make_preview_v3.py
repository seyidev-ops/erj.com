#!/usr/bin/env python3
"""Generate the site's social preview card (v3).

WHAT CHANGED FROM v2
  * REAL BRAND FONTS. v2 fell back to DejaVu Sans because Space Grotesk was
    not available offline, so every share card was set in a font the site
    never uses. The genuine files now live in ./og-fonts/ — Space Grotesk
    for display, Inter for body, matching the <link> in every page head.
    Re-fetch them with:
        npm pack @fontsource/space-grotesk @fontsource/inter
    then convert the .woff2 files with fontTools (f.flavor = None; f.save()).
  * NEGATIVE TRACKING. The site sets letter-spacing:-0.02em on every display
    heading. Pillow has no tracking, so track() draws glyph by glyph.
  * SAFE AREA. Platforms re-crop OG images. Twitter's summary_large_image is
    2:1, which shaves ~15px off the top and bottom of a 1200x630. v2 put the
    domain baseline at y=592 — inside that shave. All text now sits within
    y = 60..566, so nothing is clipped by a 2:1 crop.
  * BREATHING ROOM AT THE FOOT. v2 stacked subline (558) and domain (592)
    34px apart at 21px and 19px — visually colliding. Now separated by a
    hairline with real space either side.

UNCHANGED, DELIBERATELY
  * EVERGREEN. No cohort number, no date. Social platforms cache OG images
    for months; a cohort number bakes a wrong date into every past share.
  * REAL LOGO, COMPOSITED. erj-lockup-white.png is pasted, never redrawn.
    The mark is a globe with meridians and a left-pointing arrow — an
    approximation drawn with primitives is not the brand.
  * NEW FILENAME PER REVISION (-v3). WhatsApp/LinkedIn/Facebook cache OG
    images by URL and ignore server-side changes at the same path. Same rule
    as photos: new content, new filename. The old -v2 file is left on disk so
    links already shared keep resolving.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
FONTS = ROOT / "og-fonts"

W, H = 1200, 630
PAD = 72                      # left/right inset
BLACK = (0, 0, 0)
WHITE = "#FFFFFF"
ORANGE = "#FF5722"
GREY = "#9A9A9A"
DIM = "#4A4A4A"
RULE = "#242424"

DISPLAY = FONTS / "SpaceGrotesk-Bold.ttf"
BODY = FONTS / "Inter-Regular.ttf"
BODY_MED = FONTS / "Inter-Medium.ttf"


def F(path, size):
    return ImageFont.truetype(str(path), size)


def safe(text, font_path=DISPLAY):
    """Swap characters the brand fonts have no glyph for.

    The site uses U+2011 (non-breaking hyphen) so "dollar-paying" never breaks
    mid-word. Space Grotesk has no U+2011, so Pillow drew a tofu box. wrap()
    keeps the token whole anyway, so a plain hyphen is safe here — but check
    rather than assume, because a silent tofu ships to every share.
    """
    from fontTools.ttLib import TTFont
    cmap = TTFont(str(font_path)).getBestCmap()
    subs = {"\u2011": "-", "\u2013": "\u2014", "\u00a0": " "}
    out = "".join(subs.get(c, c) for c in text)
    missing = sorted({c for c in out if ord(c) not in cmap and c != " "})
    if missing:
        raise SystemExit("no glyph in %s for: %r" % (font_path.name, missing))
    return out


def track_len(draw, text, font, tracking):
    """Width of text drawn with per-glyph tracking."""
    return sum(draw.textlength(c, font=font) + tracking for c in text) - (tracking if text else 0)


def track(draw, x, y, text, font, fill, tracking):
    """Draw text glyph by glyph so negative tracking is possible."""
    for c in text:
        draw.text((x, y), c, font=font, fill=fill)
        x += draw.textlength(c, font=font) + tracking
    return x


def wrap(draw, text, font, max_w, tracking):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if track_len(draw, t, font, tracking) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_emphasis(draw, x, y, line, emph, font, tracking):
    """Draw one wrapped line, colouring emphasis words orange."""
    for i, word in enumerate(line.split(" ")):
        bare = word.strip(".,\u2014:;!?\u2011-")
        hit = any(bare.lower() == e.lower() or bare.lower().startswith(e.lower() + "-")
                  or bare.lower().startswith(e.lower() + "\u2011")
                  for e in emph)
        x = track(draw, x, y, word, font, ORANGE if hit else WHITE, tracking)
        if i != len(line.split(" ")) - 1:
            x += draw.textlength(" ", font=font) + tracking


def background(img):
    """Black, a faint dot grid, and one soft warm bloom low-right.

    The bloom is what stops a pure-black card reading as a rendering failure
    in a crowded WhatsApp thread — it gives the panel a light source without
    introducing a second colour.
    """
    d = ImageDraw.Draw(img)
    glow = Image.new("RGB", (W, H), BLACK)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W - 380, H - 250, W + 260, H + 260], fill=(58, 20, 7))
    glow = glow.filter(ImageFilter.GaussianBlur(150))
    img.paste(Image.blend(img, glow, 0.62), (0, 0))

    d = ImageDraw.Draw(img)
    for gx in range(PAD // 2, W, 27):
        for gy in range(PAD // 2, H, 27):
            d.point((gx, gy), fill="#171717")
    return d


def logo(img, x, y, height=58):
    lock = Image.open(ROOT / "erj-lockup-white.png").convert("RGBA")
    w = int(lock.width * (height / lock.height))
    img.paste(lock.resize((w, height), Image.LANCZOS), (x, y), lock.resize((w, height), Image.LANCZOS))


def build(name, kicker, headline, emph, sub, tag, out_name=None, size=(W, H)):
    global W, H
    W, H = size
    img = Image.new("RGB", (W, H), BLACK)
    d = background(img)

    logo(img, PAD, 56, height=58)
    d = ImageDraw.Draw(img)

    # kicker: short rule, then tracked uppercase
    ky = 196
    d.line([PAD, ky + 11, PAD + 30, ky + 11], fill=ORANGE, width=3)
    track(d, PAD + 46, ky, safe(kicker.upper(), BODY_MED), F(BODY_MED, 19), ORANGE, 2.6)

    # headline: largest size that still fits three lines
    tracking = None
    for size_pt in range(66, 33, -2):
        f = F(DISPLAY, size_pt)
        tracking = -size_pt * 0.02          # matches letter-spacing:-0.02em
        lines = wrap(d, safe(headline), f, W - PAD * 2, tracking)
        if len(lines) <= 3:
            break
    lh = int(size_pt * 1.24)
    y = 250
    for line in lines[:3]:
        draw_emphasis(d, PAD, y, line, emph, f, tracking)
        y += lh

    # foot: hairline, promise, then domain / tag on one baseline
    d.text((PAD, H - 160), safe(sub, BODY), font=F(BODY, 21), fill=GREY)
    d.line([PAD, H - 110, W - PAD, H - 110], fill=RULE, width=1)
    track(d, PAD, H - 88, "everythingremotejob.com", F(BODY_MED, 19), DIM, 1.2)
    tf = F(BODY_MED, 19)
    tag_s = safe(tag.upper(), BODY_MED)   # never skip this — see the ₦ tofu bug
    tw = track_len(d, tag_s, tf, 2.4)
    track(d, W - PAD - tw, H - 88, tag_s, tf, ORANGE, 2.4)

    out = ROOT / (out_name or f"preview-{name}-v3.jpg")
    img.save(out, "JPEG", quality=92, optimize=True, subsampling=0)
    return out


HOME = dict(
    name="index",
    kicker="The remote job system",
    headline="Land a dollar\u2011paying remote job \u2014 from right where you are.",
    emph=["dollar-paying"],
    sub="We will not let you go until you're hired.",
    tag="USD · EUR · GBP",
)

if __name__ == "__main__":
    # 1200x630 — the Open Graph card every share of the site pulls.
    p = build(**HOME)
    print(f"  {p.name:30s} {p.stat().st_size // 1024:>4d} KB")
    # 1280x640 — GitHub's own repo social preview (Settings > Social preview),
    # a different surface with a different required size.
    g = build(out_name="github-social-preview.jpg", size=(1280, 640), **HOME)
    print(f"  {g.name:30s} {g.stat().st_size // 1024:>4d} KB")
