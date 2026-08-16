#!/usr/bin/env python3
"""Generate a distinct 1200x630 OG preview for every page.

House style (matches the existing set): pure black, faint dot grid, the
ERJ mark + wordmark top-left, an orange kicker with a rule, a large
grotesk headline with one orange emphasis span, a grey subline above a
hairline, the domain bottom-left and a small tag bottom-right.

Two deliberate decisions:
  * KICKERS ARE EVERGREEN. The old preview-index said "COHORT 9 ·
    ENROLLING NOW" — social platforms cache OG images for months, so a
    cohort number bakes a wrong date into every share. Nothing here
    carries a cohort number or a date.
  * NEW FILENAMES (-v2). WhatsApp/LinkedIn/Facebook cache OG images by
    URL and ignore any server change. Same rule we learned for photos:
    new content, new filename.

Logo: the real white lockup (erj-lockup-white.png), composited — not redrawn.
Font: Space Grotesk is unavailable offline, so DejaVu Sans Bold is used
as the closest structural match (same wide geometric grotesk, single
storey g, straight-tailed y).
"""
from PIL import Image, ImageDraw, ImageFont
import pathlib

ROOT = pathlib.Path("/home/claude/erjwork/erj.com-2-Early-bird")
W, H = 1200, 630
BLACK, WHITE, ORANGE, GREY, DIM = "#000000", "#FFFFFF", "#FF5722", "#9A9A9A", "#3A3A3A"

BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def F(path, size):
    return ImageFont.truetype(path, size)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_runs(draw, x, y, runs, font):
    """Draw a line made of (text, colour) runs, returning the end x."""
    for text, colour in runs:
        draw.text((x, y), text, font=font, fill=colour)
        x += draw.textlength(text, font=font)
    return x


def split_emphasis(line, emph):
    """Split a wrapped line into runs, colouring any emphasis words."""
    if not emph:
        return [(line, WHITE)]
    runs, buf = [], ""
    for word in line.split(" "):
        bare = word.strip(".,—:;!?")
        is_e = any(bare.lower() == e.lower() or bare.lower().startswith(e.lower() + "-")
                   for e in emph)
        colour = ORANGE if is_e else WHITE
        if runs and runs[-1][1] == colour:
            runs[-1] = (runs[-1][0] + " " + word, colour)
        else:
            if runs:
                runs.append((" ", WHITE))
            runs.append((word, colour))
    return runs


LOCKUP = ROOT / "erj-lockup-white.png"


def logo(draw, img, x, y, height=44):
    """Paste the REAL logo lockup.

    An earlier version drew an approximation of the mark — concentric rings
    with spokes — which is not the brand: the actual mark is a globe with
    meridians and a left-pointing arrow through it, and the wordmark is a
    serif "EverythingRemoteJob". Never redraw a logo; composite the file.

    Source is the white variant, extracted to a transparent PNG so it sits
    on the black canvas with no matte edge.
    """
    lock = Image.open(LOCKUP).convert("RGBA")
    w = int(lock.width * (height / lock.height))
    lock = lock.resize((w, height), Image.LANCZOS)
    img.paste(lock, (x, y), lock)


def build(name, kicker, headline, emph, sub, tag):
    img = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(img)

    # faint dot grid
    for gx in range(40, W, 26):
        for gy in range(40, H, 26):
            d.point((gx, gy), fill="#141414")

    logo(d, img, 68, 44, height=62)

    # kicker with its rule
    d.line([70, 214, 100, 214], fill=ORANGE, width=3)
    d.text((116, 202), kicker.upper(), font=F(BOLD, 21), fill=ORANGE)

    # headline — shrink until it fits three lines
    size = 62
    while size > 34:
        f = F(BOLD, size)
        lines = wrap(d, headline, f, W - 150)
        if len(lines) <= 3:
            break
        size -= 3
    f = F(BOLD, size)
    lines = wrap(d, headline, f, W - 150)
    lh = int(size * 1.32)
    y = 262
    for line in lines[:3]:
        draw_runs(d, 70, y, split_emphasis(line, emph), f)
        y += lh

    # hairline + subline, pinned to the bottom so headlines never collide
    d.line([70, 545, W - 70, 545], fill="#262626", width=1)
    d.text((70, 558), sub, font=F(REG, 21), fill=GREY)
    d.text((70, 592), "everythingremotejob.com", font=F(REG, 19), fill=DIM)
    tw = d.textlength(tag, font=F(BOLD, 19))
    d.text((W - 70 - tw, 592), tag, font=F(BOLD, 19), fill=ORANGE)

    out = ROOT / f"preview-{name}-v2.jpg"
    img.save(out, "JPEG", quality=88, optimize=True)
    return out


PAGES = [
    # name, kicker, headline, emphasis words, subline, corner tag
    ("index", "The remote job system",
     "Land a dollar-paying remote job — from right where you are.",
     ["dollar-paying"], "We will not let you go until you're hired.", "USD · EUR · GBP"),

    ("free", "Free · no email required",
     "Five tools that cost nothing and change everything.",
     ["nothing"], "Diagnostic, CV scan, live masterclass, blog, job board.", "ALL FREE"),

    ("starting-line", "Choose your depth",
     "Three routes. You build it, we build it, or we do it with you.",
     ["Three"], "Nobody needs all three — you need the one that fits.", "ONE LADDER"),

    ("diagnose", "Free · 90 seconds",
     "Your job search is leaking at one of four points. Find out which.",
     ["one"], "Four questions. No email. Nothing stored.", "FIND YOUR LEAK"),

    ("cvscan", "Free · runs on your device",
     "Score your CV against 10 points in 90 seconds.",
     ["10"], "Nothing uploads. Nothing is stored. Nothing is logged.", "CV SELF-SCAN"),

    ("masterclass", "Free live class · Zoom",
     "The Global Remote Job Blueprint.",
     ["Blueprint."], "One hour on where remote job searches actually break.", "LIVE · FREE"),

    ("foundationtraining", "You build it · Stages 1–4",
     "Build every career asset yourself — and keep the skill for life.",
     ["yourself"], "Mindset, AI toolkit, async communication, global-ready assets.", "20 DAYS"),

    ("job-application-dfy", "Done for you · Stage 5",
     "We source the roles, apply beside you, and prep every interview.",
     ["beside"], "We will not let you go until you're hired.", "UNTIL HIRED"),

    ("innercircle", "Private residency · 1:1",
     "Seven weeks in the room, until the offer is signed.",
     ["signed."], "Application-first. Deliberately small.", "INNER CIRCLE"),

    ("register", "Start here",
     "Which door is mine? Answer three questions and find out.",
     ["three"], "Honest answers included — sometimes the answer is don't pay yet.", "REGISTER"),

    ("testimonials", "Documented results",
     "Real people. Real offers. Real dollars.",
     ["dollars."], "Nine journeys with the numbers, timelines and exact moves.", "SUCCESS STORIES"),

    ("blog", "Free · new posts weekly",
     "Practical remote-job help, in plain English.",
     ["Practical"], "Scam checks, ATS CVs, interviews, timezones, pay.", "THE BLOG"),

    ("login", "Participants only",
     "Welcome back. Your portal is waiting.",
     ["back."], "Lessons, assignments, certificates and the private job board.", "PARTICIPANT LOGIN"),

    ("earlybird", "One-time offer",
     "Start the four stages with an instalment of any amount.",
     ["any"], "The barrier was never the price. It was the shape of it.", "EARLY BIRD"),
]

if __name__ == "__main__":
    for args in PAGES:
        p = build(*args)
        print(f"  {p.name:34s} {p.stat().st_size // 1024:>4d} KB")
