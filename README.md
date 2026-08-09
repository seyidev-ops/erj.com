<div align="center">

<img src="logo.png" alt="Everything Remote Job" width="88" />

# Everything Remote Job

**The complete blueprint to getting, keeping & thriving in your first dollar-paying remote job — built for Africa, hired globally.**

[![Live Site](https://img.shields.io/badge/live-everythingremotejob.com-FF5722?style=flat-square)](https://everythingremotejob.com)
[![PWA](https://img.shields.io/badge/PWA-installable-000000?style=flat-square)](https://everythingremotejob.com/manifest.json)
[![Cohort](https://img.shields.io/badge/Cohort_9-Enrolling-FF5722?style=flat-square)](https://everythingremotejob.com/register.html)

</div>

---

## What this is

Everything Remote Job (ERJ) is a five-stage remote-career training and placement programme. This repository contains the full production website — a static, installable Progressive Web App served via GitHub Pages on a custom domain.

The programme it powers:

| Stage | Name | What it builds |
|---|---|---|
| **1** | Remote Mindset Blueprint | Deep work, daily KPIs, EOD reporting, workspace discipline |
| **2** | The Digital Toolkit | Zoom / Meet / Teams, Asana / Trello / ClickUp, Google Workspace, Loom, cloud recording & transcription |
| **3** | Async Communication Mastery | Zero-Follow-Up email framework, Slack batch protocol, tone translation, the "Working With Me" manual |
| **4** | Start Your Remote Career | Remote-first ATS CV, digital portfolio, video interview + STAR coaching |
| **5** | How to Get a Remote Job | The Placement Engine — 30+ verified roles weekly, volume applications, accountability until hired |
| **6–12** | The Inner Circle | Private 1:1 mentorship from positioning audit to signed offer |

## Site architecture

```
/
├── index.html                  # Home — Cohort 10 conversion page
├── register.html               # Evergreen enrolment & pricing page
├── testimonials.html           # Social proof + Private Job Board
├── blog.html · blog-admin.html # "Everything Remote" blog + admin
├── howtogetaremotejob/         # Stage 5 — the Placement Engine
├── innercircle/                # Inner Circle mentorship application
├── masterytraining/            # Stages 1–4 programme page
├── products/                   # Canonical product pages
│   ├── remote-job/
│   ├── mastery-training/
│   └── inner-circle/
├── login.html · dashboard.html # Participant LMS portal
├── instructor.html             # Instructor portal
├── admin.html                  # Admin panel
├── jobs.html                   # → redirects to testimonials (Private Job Board)
├── job-world-mastery.html      # → redirect stub (legacy URL)
├── erj-nav.js · erj-theme.js · erj-product.js
├── product.css
├── sw.js                       # Service worker (cache-versioned)
├── manifest.json               # PWA manifest
└── CNAME                       # everythingremotejob.com
```

Legacy URLs are preserved as redirect stubs so old links, indexed pages, and shared WhatsApp messages never break.

## Design system — "RocketAir"

The entire site runs on a single bold, high-contrast dark system:

- **Canvas:** pure black `#000000`
- **Accent:** cosmic orange `#FF5722` — one accent, used sparingly
- **Type:** Space Grotesk (display) + Inter (body)
- **Spacing:** 4px base grid, generous negative space
- **Motion:** quiet scroll reveals, hover row highlights, reduced-motion respected

Every page, OG thumbnail (`preview-*.jpg`), PWA icon, and certificate template derives from these tokens.

## PWA behaviour

- Installable on mobile and desktop (`manifest.json`, maskable icons at 192/512)
- Offline fallback page (`offline.html`)
- `sw.js` uses a versioned cache name (`erj-vNN`). **Bump the version on every deploy that changes cached assets**, or returning visitors will be served stale files.

## Deployment

The site deploys automatically from `main` via GitHub Pages.

1. Commit and push to `main`
2. Bump the service-worker cache version in `sw.js`
3. Verify OG previews with a fresh share (WhatsApp/LinkedIn caches aggressively)

No build step. No framework. Plain HTML/CSS/JS by design — fast on low-bandwidth connections, which is where our participants live.

## Contributing / maintenance notes

- Keep the accent colour usage disciplined — orange is for the single most important action per screen.
- All new pages must load `erj-nav.js` and respect `scroll-padding-top` (nav overlap regression protection).
- Product pages canonically live in `products/`; top-level equivalents are redirect stubs only.
- Pricing shown on any page must match `register.html` (single source of truth).


## The capture layer (added v82)

### Why it exists

The two busiest free assets on this site produced **no reachable people**:

- A WhatsApp **channel** is one-way broadcast. There is no member list, no
  replies, no DMs. It grew an audience nobody could ever answer.
- The **CV self-scan** runs entirely on-device and stores nothing — by design,
  and that promise is worth keeping. But a stranger got a diagnosis and closed
  the tab.

Everything downstream — follow-up, ascension, the second and third touch where
most sales actually happen — is impossible without a name and a number. That was
the primary leak, and it sat at the **Aim** joint of our own pipeline.

The fix does **not** break either promise. It adds one identified action the
visitor *chooses* to take: a prefilled WhatsApp message they send themselves.
They keep their privacy; we get a conversation.

### Files

| File | Role |
| --- | --- |
| `erj-config.js` | **Single source of truth.** WhatsApp number, channel URL, live capacity figures, the evergreen sentence, every message template. Edit here and nowhere else. |
| `erj-capture.ts` → `erj-capture.js` | The layer itself. Compile: `tsc erj-capture.ts --target es2017 --strict --lib es2017,dom` |
| `diagnose/index.html` + `dx.ts` → `dx.js` | "Find Your Leak" — the four-point diagnostic. |

### What the layer does

1. **Scan capture** — injects *"Send me my scored report"* into the CV scan
   result, prefilled with the score and the failed point names. The scan
   re-renders when the job description changes, so injection is driven by a
   `MutationObserver`, not a one-shot call.
2. **Channel bridge** — puts a reply route beside every one-way channel link.
3. **Evergreen doors** — renders a door that opens *today* under every
   `[data-deadline]` countdown. Opt out on a specific panel with
   `data-no-evergreen`.
4. **Honest capacity** — `data-erj-capacity="placement|innercircle"` renders a
   live capacity bar from config. This scarcity is real: the placement promise
   costs human hours per student. When it fills, the answer is a waitlist or a
   higher price — **never a quieter promise**.
5. **Reading CTA** — `data-erj-cta` renders one action (not a menu) at the end
   of long-form reading. Used on every blog post.

### Two things that will bite you if you forget them

- **`blog.html` and `testimonials.html` do not load `product.css`.** They carry
  bespoke stylesheets. That is why the capture components ship their **own CSS**,
  injected by `erj-capture.js` and inheriting whatever tokens the host page
  defines, with literal fallbacks. Do not "tidy" that CSS into `product.css` —
  it will silently unstyle the two highest-traffic pages. Only the `/diagnose/`
  page styles live in `product.css`.
- **Script order matters.** `erj-config.js` must load *before* `erj-capture.js`,
  and both *after* `erj-nav.js` (the layer reads `ERJ_NAV.base` to build correct
  relative links from sub-folder pages). `validate.py` enforces this.

### The diagnostic's tie-break rule

When two joints score equally, the **earliest one in the pipe wins**. A leak
upstream makes every downstream reading unreliable — someone who cannot find
real, eligible roles has no meaningful conversion data yet. Fix upstream first.

### Tooling

```bash
node erjwork/test-dx.js     # 29 checks — diagnostic scoring + capture behaviour
python3 erjwork/validate.py # markup, dead links, sw precache, script order, CSS integrity
```

`validate.py` checks that **every `sw.js` SHELL path exists** — one missing entry
rejects `addAll()` and aborts the *entire* precache, which has broken this site
before.

There is no jsdom in the build environment (registry blocked), so `test-dx.js`
ships a small faithful DOM harness and exercises the real compiled files.

## About

Built and maintained by **Oluwaseyi Ashiru** — Everything Remote Job, under Business Play Limited, Abuja, Nigeria.

- 🌍 [everythingremotejob.com](https://everythingremotejob.com)
- ✉️ Enquiries via the site's WhatsApp channel

> *"We won't let you go until you're hired."*

---

## v88 — 8 August 2026

Three fixes. Cache version bumped `erj-v87` → `erj-v88`.

### 1 · Evergreen doors block sat left of centre on register.html
`.eg-doors` is a flex row, so it ignored the `text-align:center` that
`.reg-hero` was passing down to the kicker and lead above it — the row alone
stayed at `flex-start`.

`erj-capture.js` / `.ts` now reads the host's *computed* `text-align` and adds
`eg-center` only when the host is genuinely centred. Left-aligned hosts (the
Inner Circle countdown) are untouched. Verified: 73.5px gap either side on
register.html, 0.0px centre offset.

Files: `erj-capture.js`, `erj-capture.ts`

### 2 · Home page whited out for 2–5s mid-scroll
Not a paint glitch — the page was reloading itself. Two mechanisms fired on
every service-worker version change:

* `sw.js` called `skipWaiting()` on install, then in `activate` looped every
  open tab calling `client.navigate(c.url)` (the "self-heal" reload).
* Every page listened for `controllerchange` and called `location.reload()`.

Sequence: load → `reg.update()` → new worker installs (55 precached files —
that is the 2–5s) → activates → both reload paths fire. The reload restores
scroll position, which is why it always looked like it happened at "Read This
First" — that is simply how far you had scrolled.

The self-heal was also redundant: the fetch handler is already NETWORK-FIRST
for HTML, so published changes are live on the next page view regardless.

* `skipWaiting()` now runs only on a first-ever install (`!registration.active`)
  — an update waits instead of seizing control of a page someone is reading.
* The `clients.navigate()` loop is deleted.
* The `controllerchange` reload listener is removed from all 16 pages.
* A `message` handler (`'ERJ_SKIP_WAITING'`) is left in place so a polite
  "new version — refresh" affordance can be added later if wanted.

Transition is clean: existing visitors get no farewell flash, because the new
worker waits rather than claiming control.

Files: `sw.js` + 16 HTML pages

### 3 · Four Points subtitles rewritten for the job seeker
Kept the essence, said from the seeker's side of the desk:

| | Old | New |
|---|---|---|
| 01 Supply | Someone must see the opportunity. | You can't apply for a job you never saw. |
| 02 Representation | Your signal must exist and be understood. | If your CV can't be read, you were never really in the running. |
| 03 Aim | The signal must reach the right target. | Applying everywhere isn't the same as applying where you'd get hired. |
| 04 Conversion | Interest must become value. | Interviews don't pay you. A signed offer does. |

Applied to all 24 occurrences: `index.html` (home cards), `diagnose/index.html`
(cards under the diagnostic), `diagnose/dx.js` + `dx.ts` (verdict engine result
cards), `blog.html` (two teaching articles — 4 `<h2>` headings, 4 bold leads).
Zero instances of the old wording remain.

### Also
`validate.py` had a hard-coded absolute ROOT that only worked on one machine —
now resolves against its own location. Runs clean: 0 errors.

### Verification
* `validate.py` — 0 errors, 0 warnings
* Chromium across 9 pages at 390px: 0 horizontal overflow, 0 console errors,
  0 pages still carrying a self-reload listener

---

## v89 — 8 August 2026 · social preview rebuilt

`preview-index-v3.jpg` (1200×630) replaces `preview-index-v2.jpg` as the Open
Graph / Twitter card for the site. `-v2` is left on disk deliberately: links
already shared point at that URL and would otherwise lose their image.

**Real brand fonts.** v2 was set in DejaVu Sans — the generator could not reach
Space Grotesk offline, so every share card used a typeface the site never uses.
The genuine files now live in `og-fonts/` (SIL Open Font Licence, included).
Re-fetch with `npm pack @fontsource/space-grotesk @fontsource/inter`, then
convert the `.woff2` with fontTools (`f.flavor = None; f.save(...)`).

**Other fixes in `make_preview_v3.py`:**
* Negative tracking — the site sets `letter-spacing:-0.02em` on display
  headings; Pillow has no tracking, so `track()` draws glyph by glyph.
* Glyph safety — Space Grotesk has no U+2011 (the non-breaking hyphen the site
  uses in "dollar‑paying"), which rendered a tofu box. `safe()` substitutes and
  now **raises** on any missing glyph rather than shipping tofu to every share.
* Safe area — Twitter re-crops to 2:1, shaving ~15px top and bottom. v2 put the
  domain baseline at y=592, inside that shave. All text now sits in y=60..566.
* Foot spacing — v2 stacked the promise (558) and domain (592) 34px apart at
  21px/19px. Now separated by a hairline with real space either side.
* A soft warm bloom low-right, so a pure-black card does not read as a failed
  image in a crowded WhatsApp thread.

**Also produced:** `github-social-preview.jpg` (1280×640) for the repository's
own social preview card — GitHub **Settings → Social preview**. That is a
separate surface from the site's OG image and takes a different size; it is not
referenced by any page.

Unchanged and deliberate: evergreen (no cohort number, no date), real logo
composited never redrawn, new filename per revision.

Also updated: `og:image:width/height/alt` and `twitter:image:alt` added;
`sw.js` SHELL repointed; cache `erj-v88` → `erj-v89`.

### Known limitation
A square centre-crop (small chat thumbnails) cuts the logo and domain. That is
inherent to any full-bleed 1.91:1 card; surviving it would mean centring
everything small. The 2:1 crop and the 320px thumbnail were both checked and
are clean.

### Still open
`index.html`'s `og:description` and `twitter:description` both end with
"Cohort 10 begins 31 August 2026." Platforms cache OG metadata for months —
this is the same trap as a cohort number baked into the image, and it will read
as stale on every share made after 31 August.

---

## v90 — 9 August 2026 · three class tracks on Mastery Training

New `#tracks` section on `masterytraining/index.html`, placed immediately before
`#pricing` — the schedule choice sits next to the payment decision. Added to the
page's `ERJ_NAV.onPage` list as "Choose your class".

| Track | When | Built for |
|---|---|---|
| 01 · Prospecting Class | Weekdays 7:00–8:00 PM WAT | Undergraduates, entry-level, not yet gainfully employed |
| 02 · Executive Class | Weekdays 8:00–9:00 PM WAT | Typical 9–5 professionals who can train on weekdays |
| 03 · Intensive Class | Weekends 7:00–8:30 PM WAT | 8 AM–8 PM professionals whose weekdays are unavailable |

**Deliberately no "featured" card.** The `.price-card.feature` treatment was not
reused here: the claim is that the tracks are equal and only the hour differs, so
highlighting one would quietly contradict the copy. A `.parity` strip states what
does not change — Stages 1–4, all 16 deliverables, same fee, same certificate, AI
Fluency, LMS access, cohort resources.

Each CTA is a prefilled WhatsApp message naming the chosen track, so enquiries
arrive already segmented.

### DERIVED — confirm before publishing
The weekday tracks are 1 hour × 5 days; the weekend track is 1.5 hours × 2 days.
Those are 5 h/week against 3 h/week, so "same modules" cannot also mean "same
calendar length". The session counts on the cards were derived to hold contact
hours roughly equal, NOT supplied:

* Weekday tracks — 20 sessions × 60 min = **20 hours over 4 weeks** (matches the
  existing "20 training days" claim).
* Intensive — 14 sessions × 90 min = **21 hours over about 7 weekends**.

If the real weekend plan is a different shape, `.track-meta` on card 03 is the
only line to change.

### Known conflict
The hero still reads "hiring-ready in **20 days**" and the stat row still says
"20 Training days". Both are true of the weekday tracks and false of the weekend
one, which runs ~7 weekends. Either qualify the hero ("20 training days · weekend
track runs across 7 weekends") or accept that the track card carries its own
duration. Left unchanged pending a decision — it is hero copy, not a bug.
