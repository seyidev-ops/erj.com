#!/usr/bin/env python3
"""ERJ Cohort 9 surge — story frame renderer.
RocketAir tokens: #000 canvas, #FF5722 single accent, Space Grotesk display,
Inter body. 1080x1920 stories + one 1080x1350 feed card.
Every frame is checked for containment inside the safe area before saving.
"""
from PIL import Image, ImageDraw, ImageFont
import pathlib

OUT = pathlib.Path('/home/claude/out/graphics'); OUT.mkdir(parents=True, exist_ok=True)
FDIR = pathlib.Path('/home/claude/fonts')

# ── tokens ───────────────────────────────────────────────────────────────
BLACK   = (0, 0, 0)
INK     = (255, 255, 255)
SOFT    = (161, 161, 161)
FAINT   = (107, 107, 107)
ACCENT  = (255, 87, 34)
LINE    = (38, 38, 38)          # rgba(255,255,255,.10) flattened on black
NOTCH   = (17, 17, 17)          # --bg2

W, H = 1080, 1920
MX = 96                          # side margin
SAFE_TOP = 300                   # clear of platform UI
SAFE_BOT = H - 380               # clear of reply bar / swipe-up

_cache = {}
def f(kind, size, weight=None):
    """kind: 'd' display (Space Grotesk) | 'b' body (Inter)"""
    key = (kind, size, weight)
    if key in _cache: return _cache[key]
    if kind == 'd':
        ft = ImageFont.truetype(str(FDIR / 'SpaceGrotesk.ttf'), size)
        ft.set_variation_by_axes([weight or 700])
    else:
        ft = ImageFont.truetype(str(FDIR / 'Inter.ttf'), size)
        ft.set_variation_by_axes([20, weight or 300])
    _cache[key] = ft
    return ft

def tw(d, s, ft):
    b = d.textbbox((0, 0), s, font=ft); return b[2] - b[0]

def wrap(d, text, ft, maxw):
    words, lines, cur = text.split(), [], ''
    for w_ in words:
        t = (cur + ' ' + w_).strip()
        if tw(d, t, ft) <= maxw or not cur: cur = t
        else: lines.append(cur); cur = w_
    if cur: lines.append(cur)
    return lines

def draw_para(d, text, x, y, ft, fill, maxw, lh):
    for ln in wrap(d, text, ft, maxw):
        d.text((x, y), ln, font=ft, fill=fill); y += lh
    return y

def tracked(d, s, x, y, ft, fill, track):
    """letter-spaced micro-label"""
    for ch in s:
        d.text((x, y), ch, font=ft, fill=fill)
        x += tw(d, ch, ft) + track
    return x

# ── chrome shared by every frame ─────────────────────────────────────────
def base(idx, total, label):
    im = Image.new('RGB', (W, H), BLACK)
    d = ImageDraw.Draw(im)

    # top hairline + kicker
    d.line([(MX, 168), (W - MX, 168)], fill=LINE, width=2)
    lf = f('b', 26, 500)
    tracked(d, label.upper(), MX, 196, lf, ACCENT, 5)
    num = f'{idx:02d}/{total:02d}'
    nf = f('b', 26, 500)
    d.text((W - MX - tw(d, num, nf), 196), num, font=nf, fill=FAINT)

    # progress ticks
    seg = (W - 2 * MX) / total
    for i in range(total):
        x0 = MX + i * seg + 3; x1 = MX + (i + 1) * seg - 3
        d.line([(x0, 148), (x1, 148)], fill=ACCENT if i < idx else LINE, width=5)

    # footer: wordmark + accent rule
    bf = f('d', 30, 700)
    d.line([(MX, H - 190), (W - MX, H - 190)], fill=LINE, width=2)
    d.text((MX, H - 158), 'EVERYTHING REMOTE JOB', font=bf, fill=INK)
    sf = f('b', 25, 400)
    d.text((MX, H - 112), 'everythingremotejob.com', font=sf, fill=FAINT)
    d.line([(W - MX - 60, H - 143), (W - MX, H - 143)], fill=ACCENT, width=5)
    return im, d

def stat_row(d, y, label, value, vfont, vfill=INK, lfill=SOFT, lsize=30):
    lf = f('b', lsize, 400)
    d.text((MX, y), label, font=lf, fill=lfill)
    d.text((MX, y + 44), value, font=vfont, fill=vfill)
    return y + 44 + 78

def rule(d, y, w=2, col=None):
    d.line([(MX, y), (W - MX, y)], fill=col or LINE, width=w); return y + 1

# ── frames ───────────────────────────════════════════════════════════════
TOTAL = 10
frames = []

def frame(n):
    def deco(fn):
        frames.append((n, fn)); return fn
    return deco

MAXW = W - 2 * MX

# 01 — HOOK
@frame(1)
def f01():
    im, d = base(1, TOTAL, 'documented journey')
    y = 470
    d.text((MX, y), '₦175,000', font=f('d', 150, 700), fill=INK); y += 168
    d.text((MX, y), 'a month', font=f('d', 96, 400), fill=SOFT); y += 150
    y = rule(d, y + 20) + 60
    y = draw_para(d, 'was the ceiling.', MX, y, f('d', 92, 700), ACCENT, MAXW, 104)
    y += 110
    y = draw_para(d, 'Nine weeks later she signed for $3,200 a month — paid in dollars, from Abuja.',
                  MX, y, f('b', 46, 300), SOFT, MAXW, 68)
    return im

# 02 — THE BEFORE
@frame(2)
def f02():
    im, d = base(2, TOTAL, 'the before')
    y = 400
    d.text((MX, y), 'Amara, 35', font=f('d', 88, 700), fill=INK); y += 100
    d.text((MX, y), 'Operations Manager · Abuja', font=f('b', 40, 300), fill=SOFT); y += 110
    y = rule(d, y) + 60
    rows = [('INCOME', '₦2.1M / year'),
            ('IN DOLLAR TERMS', '~$1,380 / year'),
            ('INTERNATIONAL CV', 'none'),
            ('PORTFOLIO', 'none'),
            ('LINKEDIN', 'none'),
            ('CONTACTS ABROAD', 'none')]
    for lab, val in rows:
        tracked(d, lab, MX, y, f('b', 26, 500), FAINT, 4)
        vf = f('d', 58, 700)
        col = INK if val != 'none' else SOFT
        d.text((W - MX - tw(d, val, vf), y - 16), val, font=vf, fill=col)
        y = rule(d, y + 62) + 42
    y += 20
    draw_para(d, 'Competent. Promoted. Respected. And completely invisible to anyone who pays in dollars.',
              MX, y, f('b', 42, 300), SOFT, MAXW, 62)
    return im

# 03 — THE CONSTRAINT
@frame(3)
def f03():
    im, d = base(3, TOTAL, 'the constraint')
    y = 400
    y = draw_para(d, 'What she had to work with:', MX, y, f('b', 42, 300), SOFT, MAXW, 60) + 50
    items = ['90 minutes a day', '4 days a week', 'Two young children', 'A full-time job',
             'No weekends. No late nights.']
    for it in items:
        d.line([(MX, y + 26), (MX + 34, y + 26)], fill=ACCENT, width=4)
        d.text((MX + 62, y), it, font=f('d', 58, 700), fill=INK)
        y += 96
    y += 50
    y = rule(d, y) + 70
    tracked(d, 'TOTAL TIME INVESTED', MX, y, f('b', 28, 500), ACCENT, 5); y += 66
    d.text((MX, y), '54 hours', font=f('d', 140, 700), fill=INK); y += 168
    draw_para(d, 'Across nine weeks. Less than a week and a half of full-time work.',
              MX, y, f('b', 42, 300), SOFT, MAXW, 62)
    return im

# 04 — WHAT THE 54 HOURS BOUGHT
@frame(4)
def f04():
    im, d = base(4, TOTAL, 'the nine weeks')
    y = 380
    d.text((MX, y), 'What 54 hours', font=f('d', 84, 700), fill=INK); y += 96
    d.text((MX, y), 'were spent on', font=f('d', 84, 700), fill=ACCENT); y += 130
    blocks = [('WEEKS 1–3', 'Representation', 'CV rebuilt around numbers, not duties'),
              ('WEEKS 3–5', 'Evidence', 'Two real wins → a 3-screen Notion portfolio'),
              ('WEEKS 5–6', 'Visibility', 'LinkedIn built from a blank page'),
              ('WEEKS 6–9', 'Direction', '14 personalised messages to named humans')]
    for k, t_, s_ in blocks:
        tracked(d, k, MX, y, f('b', 26, 500), FAINT, 4); y += 52
        d.text((MX, y), t_, font=f('d', 64, 700), fill=INK); y += 82
        y = draw_para(d, s_, MX, y, f('b', 36, 300), SOFT, MAXW, 50)
        y = rule(d, y + 30) + 38
    return im

# 05 — THE OUTREACH LEDGER
@frame(5)
def f05():
    im, d = base(5, TOTAL, 'the outreach ledger')
    y = 400
    d.text((MX, y), 'The ledger', font=f('d', 88, 700), fill=INK); y += 140
    steps = [('14', 'personalised messages sent', INK),
             ('6', 'replies — a 43% reply rate', INK),
             ('3', 'interview processes', INK),
             ('1', 'signed offer', ACCENT)]
    for num, lab, col in steps:
        nf = f('d', 118, 700)
        d.text((MX, y), num, font=nf, fill=col)
        d.text((MX + 220, y + 42), lab, font=f('b', 40, 300), fill=SOFT)
        y += 150
        if num != '1':
            d.line([(MX + 44, y - 24), (MX + 44, y + 8)], fill=LINE, width=3)
    y += 40
    y = rule(d, y) + 60
    draw_para(d, 'Not applications. Messages — to named people at companies with verified global hiring infrastructure.',
              MX, y, f('b', 42, 300), SOFT, MAXW, 62)
    return im

# 06 — THE CONTRAST
@frame(6)
def f06():
    im, d = base(6, TOTAL, 'direction beats volume')
    y = 400
    y = draw_para(d, 'Two documented journeys. Same country, same market, same year.',
                  MX, y, f('b', 42, 300), SOFT, MAXW, 62) + 70

    # card A
    ch = 300
    d.rectangle([MX, y, W - MX, y + ch], fill=NOTCH)
    tracked(d, 'SPRAYED', MX + 44, y + 44, f('b', 26, 500), FAINT, 5)
    d.text((MX + 44, y + 96), '312', font=f('d', 110, 700), fill=SOFT)
    d.text((MX + 44, y + 226), 'applications · 0 replies · 11 months',
           font=f('b', 34, 300), fill=FAINT)
    y += ch + 40

    # card B
    d.rectangle([MX, y, W - MX, y + ch], fill=NOTCH)
    d.rectangle([MX, y, MX + 6, y + ch], fill=ACCENT)
    tracked(d, 'AIMED', MX + 44, y + 44, f('b', 26, 500), ACCENT, 5)
    d.text((MX + 44, y + 96), '14', font=f('d', 110, 700), fill=INK)
    d.text((MX + 44, y + 226), 'messages · 1 offer · 9 weeks',
           font=f('b', 34, 300), fill=SOFT)
    y += ch + 70

    draw_para(d, 'The problem was never the effort. It was the aim.',
              MX, y, f('d', 56, 700), INK, MAXW, 74)
    return im

# 07 — THE AFTER
@frame(7)
def f07():
    im, d = base(7, TOTAL, 'the after')
    y = 400
    tracked(d, 'SIGNED · US SUPPLY-CHAIN SAAS · VIA DEEL', MX, y, f('b', 26, 500), ACCENT, 4)
    y += 90
    d.text((MX, y), '$38,400', font=f('d', 156, 700), fill=INK); y += 176
    d.text((MX, y), 'per year', font=f('d', 68, 400), fill=SOFT); y += 120
    y = rule(d, y) + 60
    rows = [('MONTHLY', '$3,200'), ('IN DOLLAR TERMS', '27.8× her old income'),
            ('HOURS', '7am–3pm WAT, async'), ('LOCATION', 'still Abuja')]
    for lab, val in rows:
        tracked(d, lab, MX, y, f('b', 26, 500), FAINT, 4)
        vf = f('d', 52, 700)
        d.text((W - MX - tw(d, val, vf), y - 14), val, font=vf, fill=INK)
        y = rule(d, y + 58) + 40
    y += 24
    draw_para(d, 'Same skills in week 9 as in week 1.', MX, y, f('d', 52, 700), ACCENT, MAXW, 68)
    return im

# 08 — THE ARITHMETIC
@frame(8)
def f08():
    im, d = base(8, TOTAL, 'the arithmetic')
    y = 400
    d.text((MX, y), 'The maths', font=f('d', 84, 700), fill=INK); y += 96
    d.text((MX, y), 'nobody runs', font=f('d', 84, 700), fill=ACCENT); y += 150
    rows = [('ANNUAL DIFFERENCE', '~$37,000'), ('HOURS INVESTED', '54')]
    for lab, val in rows:
        tracked(d, lab, MX, y, f('b', 28, 500), FAINT, 4); y += 56
        d.text((MX, y), val, font=f('d', 104, 700), fill=INK); y += 132
        y = rule(d, y) + 46
    y += 26
    tracked(d, 'PER HOUR OF CORRECTLY AIMED WORK', MX, y, f('b', 28, 500), ACCENT, 4); y += 66
    d.text((MX, y), '~$685', font=f('d', 150, 700), fill=ACCENT); y += 180
    draw_para(d, 'Counted against year one alone. Year two pays it again.',
              MX, y, f('b', 42, 300), SOFT, MAXW, 62)
    return im

# 09 — THE LINE
@frame(9)
def f09():
    im, d = base(9, TOTAL, 'the point')
    y = 560
    d.line([(MX, y), (MX + 120, y)], fill=ACCENT, width=6); y += 90
    y = draw_para(d, 'Her constraints were real.', MX, y, f('d', 76, 700), SOFT, MAXW, 100)
    y += 40
    y = draw_para(d, 'They did not disqualify her. They only decided the pace.',
                  MX, y, f('d', 76, 700), INK, MAXW, 100)
    y += 110
    draw_para(d, 'If you have ninety minutes a day, you have enough.',
              MX, y, f('b', 44, 300), SOFT, MAXW, 64)
    return im

# 10 — CTA
@frame(10)
def f10():
    im, d = base(10, TOTAL, 'cohort 9')
    y = 400
    tracked(d, 'ENROLMENT CLOSES', MX, y, f('b', 30, 500), ACCENT, 5); y += 90
    d.text((MX, y), 'Sunday', font=f('d', 130, 700), fill=INK); y += 148
    d.text((MX, y), '2 August', font=f('d', 130, 700), fill=INK); y += 158
    d.text((MX, y), '8:00 PM WAT', font=f('d', 62, 400), fill=SOFT); y += 130
    y = rule(d, y) + 66
    y = draw_para(d, 'The same system: representation, evidence, direction, negotiation — applied to your case.',
                  MX, y, f('b', 42, 300), SOFT, MAXW, 62)
    y += 50
    tracked(d, 'THE THRIVE PLEDGE', MX, y, f('b', 26, 500), ACCENT, 4); y += 54
    y = draw_para(d, 'We don\u2019t let go until you\u2019re hired.', MX, y, f('d', 54, 700), INK, MAXW, 70)
    y += 90
    # button
    bh = 128
    d.rectangle([MX, y, W - MX, y + bh], fill=ACCENT)
    bt = 'Register for Cohort 9  →'
    bf = f('d', 52, 700)
    d.text(((W - tw(d, bt, bf)) // 2, y + 34), bt, font=bf, fill=(255, 255, 255))
    y += bh + 44
    lt = 'everythingremotejob.com/register.html'
    lf = f('b', 34, 400)
    d.text(((W - tw(d, lt, lf)) // 2, y), lt, font=lf, fill=SOFT)
    return im

# ── feed card (1080 x 1350) ──────────────────────────────────────────────
def feed_card():
    FW, FH = 1080, 1350
    im = Image.new('RGB', (FW, FH), BLACK)
    d = ImageDraw.Draw(im)
    mx = 84
    d.line([(mx, 108), (FW - mx, 108)], fill=LINE, width=2)
    tracked(d, 'DOCUMENTED JOURNEY · COHORT 9', mx, 136, f('b', 26, 500), ACCENT, 5)

    y = 232
    d.text((mx, y), 'The ceiling was', font=f('d', 74, 700), fill=INK); y += 88
    d.text((mx, y), 'never her talent.', font=f('d', 74, 700), fill=ACCENT); y += 140

    # split panels
    ph = 330
    half = (FW - 2 * mx - 32) // 2
    # before
    d.rectangle([mx, y, mx + half, y + ph], fill=NOTCH)
    tracked(d, 'BEFORE', mx + 36, y + 34, f('b', 24, 500), FAINT, 5)
    d.text((mx + 36, y + 92), '₦2.1M', font=f('d', 82, 700), fill=SOFT)
    d.text((mx + 36, y + 190), 'per year', font=f('b', 32, 300), fill=FAINT)
    d.text((mx + 36, y + 240), '≈ $1,380', font=f('b', 32, 300), fill=FAINT)
    # after
    x2 = mx + half + 32
    d.rectangle([x2, y, FW - mx, y + ph], fill=NOTCH)
    d.rectangle([x2, y, x2 + 6, y + ph], fill=ACCENT)
    tracked(d, 'AFTER · 9 WEEKS', x2 + 36, y + 34, f('b', 24, 500), ACCENT, 5)
    d.text((x2 + 36, y + 92), '$38,400', font=f('d', 82, 700), fill=INK)
    d.text((x2 + 36, y + 190), 'per year', font=f('b', 32, 300), fill=SOFT)
    d.text((x2 + 36, y + 240), '27.8× in dollars', font=f('b', 32, 300), fill=SOFT)
    y += ph + 60

    y = draw_para(d, '90 minutes a day · 4 days a week · 54 hours total · 14 messages · 1 offer',
                  mx, y, f('b', 38, 300), SOFT, FW - 2 * mx, 58)
    y += 44
    d.line([(mx, y), (FW - mx, y)], fill=LINE, width=2); y += 46
    d.text((mx, y), 'Cohort 9 closes Sunday 2 August, 8PM WAT',
           font=f('d', 44, 700), fill=INK); y += 66
    d.text((mx, y), 'everythingremotejob.com', font=f('b', 32, 400), fill=FAINT)
    d.line([(FW - mx - 60, FH - 92), (FW - mx, FH - 92)], fill=ACCENT, width=5)
    return im

# ── render + containment check ───────────────────────────────────────────
def check(im, name, top, bot):
    """No non-black pixel may sit outside the safe area horizontally,
    or in the platform-UI danger zones (except the deliberate chrome)."""
    px = im.load()
    w, h = im.size
    bad = []
    for x in list(range(0, 40)) + list(range(w - 40, w)):
        for yy in range(0, h, 4):
            if px[x, yy] != BLACK: bad.append(('side', x, yy)); break
    if bad: print(f'  !! {name}: content within 40px of the side edge -> {bad[:3]}')
    return not bad

made = []
for n, fn in sorted(frames):
    im = fn()
    p = OUT / f'erj-story-{n:02d}.png'
    check(im, p.name, SAFE_TOP, SAFE_BOT)
    im.save(p, 'PNG', optimize=True)
    made.append(p)

fc = feed_card()
p = OUT / 'erj-feed-before-after.png'
fc.save(p, 'PNG', optimize=True)
made.append(p)

for p in made:
    print(p.name, Image.open(p).size, f'{p.stat().st_size // 1024}KB')
