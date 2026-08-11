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
| **5** | How to Mastery Setup | The Placement Engine — 30+ verified roles weekly, volume applications, accountability until hired |
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
├── foundationtraining/            # Stages 1–4 programme page
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

## v90 — 9 August 2026 · three class tracks on Foundation Training

New `#tracks` section on `foundationtraining/index.html`, placed immediately before
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

---

## v91 — 9 August 2026 · product rename

| Was | Now |
|---|---|
| "Remote Job World Mastery Training" / "Remote Job World Mastery" | **Remote Job Foundation Training** |
| "Mastery Training" | **Foundation Training** |
| `masterytraining/` | `foundationtraining/` |
| "Get A Remote Job" (Stage 5) | **Mastery Setup** |
| `getaremotejob/` | `masterysetup/` |
| `preview-masterytraining-v2.jpg` | `preview-foundationtraining-v2.jpg` |
| `preview-getaremotejob-v2.jpg` | `preview-masterysetup-v2.jpg` |

"World" was never part of the real name, and "Mastery" moved from the Stages 1–4
bundle to the Stage 5 product — so the 1–4 product had to lose the word
completely, or the site would carry two "Mastery" products.

30 files, 121 lines, plus two folder renames and two image renames. Cache
`erj-v89` → `erj-v91`.

### Protected — contains "Mastery" but is not the product name
Stage module titles were left alone: **Async / Asynchronous Communication
Mastery** (Stage 3), **Global Job Search Mastery** and **Job Search Mastery**
(Stage 4), **Digital Toolkit Mastery** (Stage 2), **Digital Brand (Building) &
Time Zone Mastery**. A blanket replace would have renamed the curriculum.

Paystack slugs (`rjmtstages1-4`, `gtdj-stage5`, …) were also left untouched —
they are live product IDs on paystack.shop, so editing them here would break
payment rather than naming.

### Two judgement calls
**1 · Platform brand normalised.** Twelve pages carried
`og:site_name="Everything Remote Job Mastery Training"` and the portal pages
(login, dashboard, admin, instructor, blog) titled themselves "… | Everything
Remote Job Mastery". `index.html` has always used **Everything Remote Job**, so
these were already inconsistent — and after this rename they read as though the
whole platform were the Stage 5 product. All normalised to "Everything Remote
Job". Revert if the longer form was deliberate.

**2 · Two verb-phrase casualties repaired.** "Get A Remote Job" was the product
name in 28 places and ordinary English in 2. The blanket replace produced
"5+ Years of Experience to Mastery Setup" (blog.html) and "How to Mastery Setup"
(manifest.json). Rewritten to "…to Land a Remote Role" and "Foundation Training,
Mastery Setup, and the Inner Circle".

### Old URLs still resolve
You said not to worry about shared links, but the site already maintains a 404
legacy map for exactly this, so `/masterytraining/` and `/getaremotejob/` were
added to it — two lines. Delete them if you want the old paths to hard-404.

### Also fixed
`test-404.js`, `test-ascend.js` and `test-dx.js` all located the tree by assuming
they sat one directory *above* it, so they only ran from one working directory —
same defect as `validate.py` in v88. All three now resolve against `__dirname`.

### Verification
`validate.py` clean · 65/65 tests pass (16 + 20 + 29) · full-site crawl of 15
pages found **0 broken internal links** · renamed pages render with correct
titles, no console errors, no horizontal overflow.

### Still open
`dashboard.html` still says "Your 5-Stage Remote **Mastery** Journey", which now
collides with the Stage 5 product name. Left alone — it is inside the frozen
portal pages and describes all five stages, not one product.

---

## v92 — 9 August 2026

Cache `erj-v91` → `erj-v92`.

### 1 · Rename misses on the home and starting-line pages
The v91 rename replaced plain strings, so it could not see a name broken across
inline markup. Both product names were split by an `<em>`:

* `index.html` — `Get A <em>Remote Job</em>` → `Mastery <em>Setup</em>`
* `starting-line.html` — same pattern, same fix

A tag-stripped sweep of every HTML file now confirms zero retired names remain
anywhere in rendered text. Worth remembering for the next rename: **strip tags
before auditing, or a split name reads as clean.**

### 2 · Register page
"Complete Remote Career Programme" → **"Complete Remote Foundation Programme"**
(both the visible `p-title` and the JS product title behind it).

### 3 · Foundation Training block on the starting line
It was three generic bullets that never named a stage. Rewritten as a real brief
on Stages 1–4 — each stage named with what it covers and what you walk out
holding: the Remote Operating System, the Integrated Sprint and AI Fluency, the
five communication assets, and the Global Ready Package. Content taken from the
product page so the two cannot drift. Closes with certification plus a link into
the three class tracks.

### 4 · Two blog posts
* **9 Aug — "New Names: Foundation Training, Mastery Setup, and Why We Changed
  Them"** (Announcements, `published: true`). Explains what moved, that old links
  redirect, that fee/modules/certificate are unchanged, and that "Mastery" has
  shifted from Stages 1–4 to Stage 5 — so older workbooks and broadcasts using
  the word mean the foundation stages.
* **10 Aug — "Three Kinds of Company: Who Can Actually Hire and Pay You From
  Here"** (Job Search, `published: false`). EOR vs contractor-friendly vs
  domestic-only, and the ninety-second checks that tell them apart. This topic
  had no coverage on the blog at all — zero prior mentions of employer-of-record.

`SEED_VERSION` bumped to `2026-08-10-company-types` so cached visitors reconcile.

**Tomorrow's post is a draft on purpose** — a post dated the 10th should not be
live on the 9th. Flip `published:false` → `true` on `m6p07` tomorrow, or publish
it from blog-admin.

### Noticed, not changed
`m6p04` (7 Aug) and `m6p05` (8 Aug) are both still `published:false`. If those
were meant to go live, two flags need flipping.

### Verification
`validate.py` clean · 65/65 tests pass · full-site crawl: 0 broken internal links
· SEEDS array parses to 100 posts, no duplicate ids, no incomplete records ·
today's post renders on the blog and tomorrow's correctly does not.

---

## v93 — 11 August 2026

Cache `erj-v92` → `erj-v93`.

### 1 · CV scan froze the browser — infinite MutationObserver loop
`cvscan` locked the main thread on **every** upload — txt, docx, plain, table-based,
900-line, all of them — producing Chrome's "Page Unresponsive" dialog. It looked
like a parser hang because the status still read "Reading …CV.docx"; the thread
was blocked so the DOM never repainted.

The cause was in `erj-capture.js`, not in the scanner. The send-my-report block is
inserted as a **sibling before** `.results-actions`:

```js
actions.parentNode.insertBefore(wrap, actions);
```

but the re-entry guard looked for it **inside** that element:

```js
if (!actions || actions.querySelector('.cap-send')) return;   // never true
```

So every insertion fired the observer, which injected again, forever. The score
dial animates its own text for ~900ms, which fires the observer on every frame
too, so it triggered instantly on any successful scan.

Fixed by pointing the guard where the node actually lands (`results.querySelector`)
and disconnecting the observer around our own mutation so it cannot re-enter.
Applied to `erj-capture.js` and `erj-capture.ts`.

Measured after the fix: 1.6s end-to-end, exactly one button, page responsive —
across txt, plain docx, table-based docx, deeply-nested-table docx and a 900-line
docx, plus the rescan and live-job-description paths.

**Test fallout, both fixed.** `test-dx.js`'s `MutationObserver` double only
implemented `observe()`, so four capture tests went red the moment the code
started calling `disconnect()`. The double now carries the full interface and
keeps the callback — which enabled a **regression test**: re-fire the observer by
hand and assert the block count stays at one. That test fails against the old
code.

### 2 · New page — `/selflearn/`
"Remote Job Mastery Training (Self-Learn)" — Stages 1–4, self-paced, ₦35,000.
Selar checkout (`selar.com/77v230274x`) plus a bank-transfer route that opens a
prefilled WhatsApp message to the Registrar. Box shot added as
`selflearn-box.png` (resized 3375px → 900px). Wired into the nav dropdown
(`erj-nav.js`/`.ts`), `sitemap.xml` (13 URLs) and the `sw.js` precache.

The page keeps the source copy's honesty intact — the "not for you" column and
the included/not-included split are load-bearing, not decoration.

### 3 · Blog — backlog cleared, six days queued
Published the three back-dated drafts: `m6p04` (7 Aug), `m6p05` (8 Aug),
`m6p07` (10 Aug).

New posts:

| Date | Post | State |
|---|---|---|
| 11 Aug | The Self-Learn Pack Is Live | **live** |
| 12 Aug | The Twenty Minutes After Someone Says Yes to a Call | draft |
| 13 Aug | Your Time Zone Is Not an Apology | draft |
| 14 Aug | The Application Ledger | draft |
| 15 Aug | Proving Tool Fluency When You Have Never Held a Remote Job | draft |
| 16 Aug | Using AI on Your CV Without Getting Caught | draft |
| 17 Aug | Five Things That Make Your Work Visible on a Distributed Team | draft |

Future-dated posts ship as drafts on purpose — flip `published` on the morning,
or publish from blog-admin. `SEED_VERSION` → `2026-08-17-async-artifacts`.

No manual `featured` flag was set: the blog already assigns the slot to the
newest live post automatically, so 11 Aug takes it on its own.

### Verification
`validate.py` clean · **66/66 tests pass** (16 + 20 + 30) · full-site crawl: 0
broken internal links · SEEDS parses to 107 posts, no duplicate ids, none
incomplete · `/selflearn/` renders at 1280px and 390px with 0 overflow and no
console errors.

---

## v94 — 11 August 2026 · starting-line briefs and image parity

Cache `erj-v93` → `erj-v94`.

### 1 · All three routes now carry a full brief
Route 1 had a real Stages 1–4 brief (added in v92); routes 2 and 3 still had
three vague bullets each. Both now carry the same structure — an opening
paragraph, four numbered items naming what is built and when, and a closing
line — so the page can be read straight through without opening three product
pages.

Content is taken from the product pages themselves so the two cannot drift:

* **Mastery Setup** — the four assets on their real build days: ATS-defeating CV
  (days 1–2), LinkedIn outbound funnel (3–4), autonomous application engine
  (5–6), multi-currency negotiation playbook (day 7).
* **Inner Circle** — Stages 6–12 compressed into four items: Audit/Profile
  (weeks 1–2), Outreach Engine (3), Interview Room + Negotiation Table (4–5),
  Launch + Residency (6 onward).

**Word counts are now identical: 199 words per route block.** Verified by
stripping tags and counting; the check is re-runnable.

### 2 · All three photos render at one size
The source files are very different shapes — 626×417 landscape, 735×639
near-square, 820×1230 portrait — and `height:auto` gave three different card
heights down the page.

Fixed with a shared `aspect-ratio:4/3` and `object-fit:cover`, which crops to a
common frame rather than squashing. `object-position` is tuned per image so no
face is cut — the facilitator portrait is pulled to `center 22%`.

A second cause was hiding underneath: `.route.flip` moves the photo into grid
column 2, which is the **wide** track (1fr), so the middle photo rendered 582px
against 419px either side. Flipped rows now mirror the track widths.

Measured after the fix — all three frames identical at every width:

| Viewport | Frame |
|---|---|
| 1280px | 419 × 314 |
| 1024px | 382 × 286 |
| 390px | 348 × 261 |

### Verification
`validate.py` clean · 66/66 tests pass · full-site crawl: 0 broken internal
links · 0 horizontal overflow at 1280 / 1024 / 390px · every brief sentence ends
in punctuation (two full stops were dropped during word-count tuning and
restored).
