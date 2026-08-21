#!/usr/bin/env python3
"""
make-brand-assets.py — rebuild every image on this site that carries the logo.

RUN IT AFTER ANY CHANGE TO THE LOGO:

    python3 make-brand-assets.py

WHAT IT BUILDS, FROM FOUR MASTERS
    erj-mark-dark.png     the reaching figure, white + orange, for dark surfaces
    erj-mark-light.png    the same geometry, near-black + orange, for light ones
    erj-lockup-dark.png   mark + wordmark + strapline, for dark surfaces
    erj-lockup-light.png  the same, for light ones

  → logo-dark.png / logo-light.png     the nav mark, swapped by data-theme
  → favicon32.png / favicon32-dark.png swapped by prefers-color-scheme
  → appletouchicon.png                 iOS home screen, needs its own opaque tile
  → icon192 / icon512 (+ maskable)     the PWA set
  → preview-*-v4.jpg                   every social share card
  → github-social-preview.jpg          GitHub's own repo card, a different size

WHY THE LIGHT AND DARK MARKS ARE THE SAME GEOMETRY
They swap on a theme toggle, in place, at the same size. Any difference in
outline, weight or padding would read as the logo twitching when someone flips
the switch. They are generated from one master so that cannot drift.

WHY EVERY SHARE CARD IS -v4
WhatsApp, LinkedIn and Facebook cache an OG image by URL and will not re-fetch
it because the bytes at that path changed. A new logo therefore needs new
filenames or every existing share keeps showing the old mark for months.
"""
import pathlib
import shutil

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent
MASTERS = ROOT / "logo-masters"      # the four files everything else comes from
FONTS = ROOT / "og-fonts"

BLACK = (0, 0, 0)
PAPER = (250, 248, 244)
WHITE = "#FFFFFF"
ORANGE = "#FF5722"
GREY = "#9A9A9A"
DIM = "#4A4A4A"
RULE = "#242424"

DISPLAY = FONTS / "SpaceGrotesk-Bold.ttf"
BODY = FONTS / "Inter-Regular.ttf"
BODY_MED = FONTS / "Inter-Medium.ttf"


def F(p, s):
    return ImageFont.truetype(str(p), s)


def fit(im, box, pad=0.0):
    """Scale to fit a square box, centred, with optional padding."""
    inner = int(box * (1 - pad * 2))
    w, h = im.size
    k = min(inner / w, inner / h)
    im = im.resize((max(1, int(w * k)), max(1, int(h * k))), Image.LANCZOS)
    canvas = Image.new("RGBA", (box, box), (0, 0, 0, 0))
    canvas.alpha_composite(im, ((box - im.width) // 2, (box - im.height) // 2))
    return canvas


def on(im, colour):
    flat = Image.new("RGBA", im.size, colour + (255,))
    flat.alpha_composite(im)
    return flat.convert("RGB")


# ── 1 · the four masters, copied in at a sane working size ───────────────
def masters():
    out = {}
    for src, name, height in [
        ("mark-dark.png", "erj-mark-dark.png", 1024),
        ("mark-light.png", "erj-mark-light.png", 1024),
        ("lockup-dark.png", "erj-lockup-dark.png", 320),
        ("lockup-light.png", "erj-lockup-light.png", 320),
    ]:
        im = Image.open(MASTERS / src).convert("RGBA")
        w = int(im.width * (height / im.height))
        im = im.resize((w, height), Image.LANCZOS)
        p = ROOT / name
        im.save(p, "PNG", optimize=True)
        out[name] = im
        print(f"  {name:26s} {str(im.size):12s} {p.stat().st_size // 1024:>4d} KB")
    return out


# ── 2 · icons ────────────────────────────────────────────────────────────
def icons(m):
    mark_d = m["erj-mark-dark.png"]
    mark_l = m["erj-mark-light.png"]

    def save(im, name, quantise=True):
        p = ROOT / name
        if quantise and im.mode == "RGBA":
            im = im.quantize(colors=128, method=Image.FASTOCTREE)
        im.save(p, "PNG", optimize=True)
        print(f"  {name:26s} {str(im.size):12s} {p.stat().st_size // 1024:>4d} KB")

    # nav mark — transparent, so it sits on whatever the nav bar is
    save(fit(mark_l, 128), "logo-light.png")
    save(fit(mark_d, 128), "logo-dark.png")

    # favicons — a tab is small, so the mark gets the whole square
    save(fit(mark_l, 64), "favicon32.png")
    save(fit(mark_d, 64), "favicon32-dark.png")

    # iOS home screen: never transparent. iOS composites onto white and the
    # white figure would vanish, so this tile carries its own black ground.
    save(on(fit(mark_d, 180, pad=0.14), BLACK), "appletouchicon.png", quantise=False)

    # PWA: "any" icons may be shown on any surface, so give them a ground too.
    for size in (192, 512):
        save(on(fit(mark_d, size, pad=0.13), BLACK), f"icon{size}.png", quantise=False)
        # maskable is cropped to a circle by the launcher — 20% safe-area inset
        save(on(fit(mark_d, size, pad=0.22), BLACK), f"icon{size}maskable.png", quantise=False)


# ── 3 · social cards ─────────────────────────────────────────────────────
def track_len(d, t, f, tr):
    return sum(d.textlength(c, font=f) + tr for c in t) - (tr if t else 0)


def track(d, x, y, t, f, fill, tr):
    for c in t:
        d.text((x, y), c, font=f, fill=fill)
        x += d.textlength(c, font=f) + tr
    return x


def safe(text, font_path=DISPLAY):
    from fontTools.ttLib import TTFont
    cmap = TTFont(str(font_path)).getBestCmap()
    subs = {"‑": "-", "–": "—", " ": " "}
    out = "".join(subs.get(c, c) for c in text)
    missing = sorted({c for c in out if ord(c) not in cmap and c != " "})
    if missing:
        raise SystemExit(f"no glyph in {font_path.name} for: {missing!r}")
    return out


def wrap(d, text, f, max_w, tr):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if track_len(d, t, f, tr) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def emphasise(d, x, y, line, emph, f, tr):
    parts = line.split(" ")
    for i, word in enumerate(parts):
        bare = word.strip(".,—:;!?‑-")
        hit = any(bare.lower() == e.lower() or bare.lower().startswith(e.lower() + "-")
                  or bare.lower().startswith(e.lower() + "‑") for e in emph)
        x = track(d, x, y, word, f, ORANGE if hit else WHITE, tr)
        if i != len(parts) - 1:
            x += d.textlength(" ", font=f) + tr


def card(name, kicker, headline, emph, sub, tag, size=(1200, 630)):
    W, H = size
    PAD = 72
    img = Image.new("RGB", (W, H), BLACK)

    # one soft warm bloom low-right, so a pure-black card does not read as a
    # rendering failure in a crowded WhatsApp thread
    glow = Image.new("RGB", (W, H), BLACK)
    ImageDraw.Draw(glow).ellipse([W - 380, H - 250, W + 260, H + 260], fill=(58, 20, 7))
    img.paste(Image.blend(img, glow.filter(ImageFilter.GaussianBlur(150)), 0.62), (0, 0))
    d = ImageDraw.Draw(img)
    for gx in range(PAD // 2, W, 27):
        for gy in range(PAD // 2, H, 27):
            d.point((gx, gy), fill="#171717")

    # the logo, composited — never redrawn from primitives
    # The old lockup was mark + wordmark only and sat at 58px. This one also
    # carries the strapline, so it needs more height for the wordmark to read
    # at the same size it did before.
    lock = Image.open(ROOT / "erj-lockup-dark.png").convert("RGBA")
    lh = 96
    lw = int(lock.width * (lh / lock.height))
    lock = lock.resize((lw, lh), Image.LANCZOS)
    img.paste(lock, (PAD, 40), lock)
    d = ImageDraw.Draw(img)

    ky = 196
    d.line([PAD, ky + 11, PAD + 30, ky + 11], fill=ORANGE, width=3)
    track(d, PAD + 46, ky, safe(kicker.upper(), BODY_MED), F(BODY_MED, 19), ORANGE, 2.6)

    for pt in range(66, 33, -2):
        f = F(DISPLAY, pt)
        tr = -pt * 0.02
        lines = wrap(d, safe(headline), f, W - PAD * 2, tr)
        if len(lines) <= 3:
            break
    y = 250
    for line in lines[:3]:
        emphasise(d, PAD, y, line, emph, f, tr)
        y += int(pt * 1.24)

    d.text((PAD, H - 160), safe(sub, BODY), font=F(BODY, 21), fill=GREY)
    d.line([PAD, H - 110, W - PAD, H - 110], fill=RULE, width=1)
    track(d, PAD, H - 88, "everythingremotejob.com", F(BODY_MED, 19), DIM, 1.2)
    tf = F(BODY_MED, 19)
    tg = safe(tag.upper(), BODY_MED)
    track(d, W - PAD - track_len(d, tg, tf, 2.4), H - 88, tg, tf, ORANGE, 2.4)

    p = ROOT / name
    img.save(p, "JPEG", quality=92, optimize=True, subsampling=0)
    print(f"  {name:34s} {p.stat().st_size // 1024:>4d} KB")
    return p


CARDS = [
    ("preview-index-v4.jpg", "The remote job system",
     "Land a dollar‑paying remote job — from right where you are.",
     ["dollar-paying"], "We will not let you go until you're hired.", "USD · EUR · GBP"),
    ("preview-register-v4.jpg", "Enrolment",
     "Pick the rung you can actually work — and start there.",
     ["rung"], "Secure Paystack checkout. Cards, transfer and USSD.", "Register"),
    ("preview-testimonials-v4.jpg", "Documented results",
     "Real people. Real offers. Real dollars.",
     ["dollars"], "Numbers, timelines, and the exact moves that changed them.", "Success stories"),
    ("preview-free-v4.jpg", "Costs nothing",
     "Everything we give away, in one place.",
     ["away"], "The scan, the diagnostic, the job board and the blog.", "Free"),
    ("preview-blog-v4.jpg", "The remote career blog",
     "Guides, stories and strategy for working globally from Africa.",
     ["globally"], "One new article every day. All of it free.", "Read"),
    ("preview-starting-line-v4.jpg", "Start here",
     "Four routes in. One of them is yours.",
     ["yours"], "Find the honest next step for where you actually are.", "Your starting line"),
    ("preview-earlybird-v4.jpg", "Instalment offer",
     "Foundation Training, paid across two instalments.",
     ["two"], "The same twenty training days, spread over two payments.", "Early bird"),
    ("preview-compare-v4.jpg", "An honest comparison",
     "Self‑Learn or the live cohort — which one should you buy?",
     ["Self-Learn"], "Same four stages. One is watched; one is not.", "Compare"),
    ("preview-login-v4.jpg", "Participant portal",
     "Your stages, your progress, your deliverables.",
     ["your", "yours"], "Sign in with the code issued at enrolment.", "Login"),
    ("preview-selflearn-v4.jpg", "Self‑paced · instant download",
     "Remote job training, without waiting for a cohort.",
     ["without"], "Twenty sessions. Four assets you keep. NGN 35,000.", "Stages 1-4"),
    ("preview-foundationtraining-v4.jpg", "Live cohort",
     "The full build, with someone marking your work.",
     ["marking"], "Twenty training days, a verdict, and a certificate.", "Stages 1-4"),
    ("preview-jobapplication-v4.jpg", "Done for you",
     "We run the hunt and the applications for you.",
     ["for", "you"], "Verified roles sourced, tailored and submitted.", "Stage 5"),
    ("preview-innercircle-v4.jpg", "By invitation",
     "One to one, until the offer letter lands.",
     ["one"], "Co-applying, dry-runs, and live negotiation review.", "Stages 6-12"),
    ("preview-cvscan-v4.jpg", "Free · runs on your device",
     "Score your CV against ten points in seconds.",
     ["ten"], "Nothing is uploaded. Nothing is stored.", "CV self-scan"),
    ("preview-diagnose-v4.jpg", "Four questions",
     "Your job search fails at one joint. Find out which.",
     ["one"], "Fix that one instead of guessing at all four.", "Find your leak"),
    ("preview-masterclass-v4.jpg", "Free live masterclass",
     "The global remote job blueprint, live on Zoom.",
     ["live"], "How to land a USD remote role in the next ninety days.", "Masterclass"),
    ("preview-cvpass-v4.jpg", "New · 30‑day pass",
     "Rent the CV Engine for a month. NGN 5,000.",
     ["month"], "Thirty days from first use, not from payment.", "CV Engine pass"),
    ("preview-portal-v4.jpg", "Everything Remote Job",
     "A private page on the Everything Remote Job platform.",
     ["private"], "You need an account to see what is behind this.", "Portal"),
]


if __name__ == "__main__":
    print("\n── masters ──")
    m = masters()
    print("\n── icons ──")
    icons(m)
    print("\n── social cards ──")
    for c in CARDS:
        card(*c)
    # GitHub wants its own size for the repo social preview
    card("github-social-preview.jpg", *CARDS[0][1:], size=(1280, 640))
    print("\ndone.")
