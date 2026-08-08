#!/usr/bin/env python3
"""Regenerate the two PWA install screenshots referenced by manifest.json.

Both carried "COHORT 9 · ENROLLING NOW" and the old drawn mark. They are
relevant — Android/Chrome show them in the install prompt — so they are
fixed, not deleted:

  * evergreen kicker (no cohort number; these are cached by the OS and by
    the app-install UI for as long as the app stays installed)
  * the REAL logo lockup composited from erj-lockup-white.png
  * NEW filenames, because manifest icons and screenshots are cached hard

Wide  1920x1080 (form_factor: wide)
Mobile 1080x1920 (form_factor: narrow)
"""
from PIL import Image, ImageDraw, ImageFont
import pathlib

ROOT = pathlib.Path("/home/claude/erjwork/erj.com-2-Early-bird")
BLACK, WHITE, ORANGE, GREY, DIM = "#000000", "#FFFFFF", "#FF5722", "#9A9A9A", "#3A3A3A"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
LOCKUP = ROOT / "erj-lockup-white.png"

F = lambda p, s: ImageFont.truetype(p, s)


def wrap(d, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def runs_for(line, emph):
    out = []
    for word in line.split(" "):
        colour = ORANGE if any(word.strip(".,—").lower() == e.lower() for e in emph) else WHITE
        if out and out[-1][1] == colour:
            out[-1] = (out[-1][0] + " " + word, colour)
        else:
            if out:
                out.append((" ", WHITE))
            out.append((word, colour))
    return out


def draw_runs(d, x, y, runs, font, centre_w=None):
    if centre_w:
        total = sum(d.textlength(t, font=font) for t, _ in runs)
        x = (centre_w - total) / 2
    for text, colour in runs:
        d.text((x, y), text, font=font, fill=colour)
        x += d.textlength(text, font=font)


def paste_lockup(img, x, y, height, centre_w=None):
    lock = Image.open(LOCKUP).convert("RGBA")
    w = int(lock.width * (height / lock.height))
    lock = lock.resize((w, height), Image.LANCZOS)
    if centre_w:
        x = (centre_w - w) // 2
    img.paste(lock, (int(x), int(y)), lock)


HEADLINE = "Land a dollar-paying remote job — from right where you are."
EMPH = ["dollar-paying"]
KICKER = "THE REMOTE JOB SYSTEM"
SUB = "The system that gets African professionals hired into USD, EUR & GBP roles."


def wide():
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(img)
    for gx in range(60, W, 40):
        for gy in range(60, H, 40):
            d.point((gx, gy), fill="#141414")

    paste_lockup(img, 110, 78, 96)

    d.line([112, 316, 168, 316], fill=ORANGE, width=4)
    d.text((190, 298), KICKER, font=F(BOLD, 30), fill=ORANGE)

    f = F(BOLD, 96)
    y = 386
    for line in wrap(d, HEADLINE, f, W - 240):
        draw_runs(d, 112, y, runs_for(line, EMPH), f)
        y += 126

    d.line([112, H - 168, W - 112, H - 168], fill="#262626", width=1)
    d.text((112, H - 148), SUB, font=F(REG, 32), fill=GREY)
    d.text((112, H - 92), "everythingremotejob.com", font=F(REG, 28), fill=DIM)
    tag = "USD · EUR · GBP"
    tw = d.textlength(tag, font=F(BOLD, 28))
    d.text((W - 112 - tw, H - 92), tag, font=F(BOLD, 28), fill=ORANGE)

    out = ROOT / "screenshot-wide-v2.png"
    img.save(out, "PNG", optimize=True)
    return out


def mobile():
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(img)
    for gx in range(50, W, 40):
        for gy in range(50, H, 40):
            d.point((gx, gy), fill="#141414")

    paste_lockup(img, 0, 210, 92, centre_w=W)

    k = KICKER
    kw = d.textlength(k, font=F(BOLD, 30))
    d.text(((W - kw) / 2, 372), k, font=F(BOLD, 30), fill=ORANGE)

    f = F(BOLD, 92)
    lines = wrap(d, HEADLINE, f, W - 150)
    y = 640
    for line in lines:
        draw_runs(d, 0, y, runs_for(line, EMPH), f, centre_w=W)
        y += 122

    for i, s in enumerate(["USD · EUR · GBP salaries.", "A system, not luck."]):
        sw = d.textlength(s, font=F(REG, 40))
        d.text(((W - sw) / 2, y + 46 + i * 62), s, font=F(REG, 40), fill=GREY)

    d.line([90, H - 150, W - 90, H - 150], fill="#262626", width=1)
    u = "everythingremotejob.com"
    uw = d.textlength(u, font=F(REG, 32))
    d.text(((W - uw) / 2, H - 116), u, font=F(REG, 32), fill=DIM)

    out = ROOT / "screenshot-mobile-v2.png"
    img.save(out, "PNG", optimize=True)
    return out


if __name__ == "__main__":
    for p in (wide(), mobile()):
        print(f"  {p.name:28s} {p.stat().st_size // 1024:>5d} KB")
