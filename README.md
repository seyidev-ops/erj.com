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
| **5** | How to Job Application DFY | The Placement Engine — 30+ verified roles weekly, volume applications, accountability until hired |
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
| "Get A Remote Job" (Stage 5) | **Job Application DFY** |
| `getaremotejob/` | `job-application-dfy/` |
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
"5+ Years of Experience to Job Application DFY" (blog.html) and "How to Job Application DFY"
(manifest.json). Rewritten to "…to Land a Remote Role" and "Foundation Training,
Job Application DFY, and the Inner Circle".

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
* **9 Aug — "New Names: Foundation Training, Job Application DFY, and Why We Changed
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

* **Job Application DFY** — the four assets on their real build days: ATS-defeating CV
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

---

## v95 — 11 August 2026 · Self-Learn added to the starting line

Cache `erj-v94` → `erj-v95`.

The Self-Learn Pack now appears on `starting-line.html` as a full route block,
built to the same standard as the other three: opening paragraph, four numbered
items, closing line. **All four briefs are exactly 199 words.**

Added to the page's on-page menu (`ERJ_NAV.onPage`) as "Self-Learn Pack" →
`#r-selflearn`, and to the page footer nav.

### It went in first, not last
The page describes itself as "one ladder, in order", and the ladder ascends by
depth. Self-Learn is the *shallowest* rung — the same Stages 1–4, worked alone —
so appending it after the Inner Circle would have broken the page's own logic.

It is now Route 1, and everything below renumbered: Foundation Training is
Route 2 ("you build it with us"), Job Application DFY Route 3, Inner Circle Route 4.
The hero moved from "Three routes" to "Four routes" and its four-depth
description was rewritten to match. The closing "which comes first" paragraph now
opens on the Self-Learn/Foundation distinction, which is the genuinely confusing
one — same four stages, different delivery.

The `.route.flip` alternation was also re-dealt so photos still alternate sides
with an extra row in the run.

### A dedicated 4:3 image
`selflearn-box.png` is square (900×900). The starting-line frame is 4:3 with
`object-fit:cover`, so a square source loses ~25% of its height — it clipped the
top and bottom off the box.

Rather than accept the crop or break the frame parity established in v94,
`selflearn-box-wide.png` (1200×900) letterboxes the whole pack onto its own
backdrop colour, sampled from the source (`#F3EDE7`), so `cover` has nothing left
to crop. The square original stays in use on `/selflearn/`. Added to the `sw.js`
precache.

### Verification
`validate.py` clean · 66/66 tests pass · full-site crawl: 0 broken internal links
· all four photo frames identical at 1280 / 1024 / 390px (419×314, 382×286,
348×261) · 0 horizontal overflow · all four anchors resolve · every brief
sentence ends in punctuation.

---

## v96 — 11 August 2026 · Self-Learn on the home ladder, one footer everywhere

Cache `erj-v95` → `erj-v96`.

### 1 · Section 05 · Your Starting Line
The Self-Learn Pack is now rung **01** on `index.html`, ahead of Foundation
Training — same reasoning as the starting-line page in v95: the ladder ascends by
depth, and Self-Learn is the shallowest rung. Everything below renumbered
(Foundation 02, Job Application DFY 03, Inner Circle 04), and the heading moved from
"Three rungs" to "Four rungs" along with the lead paragraph and the on-page nav
`sub`.

**The "Most people start here" badge stayed on Foundation Training.** It marks the
common starting point, not the first item in the list — moving it to the cheapest
rung would have quietly changed what the page recommends.

### 2 · One footer across every public page
Fourteen pages carried five different footers: some had one nav row, some two,
`testimonials.html` was missing `wrap`, `404.html` had no nav at all, and
`blog.html` had entirely different markup with a `·`-separated inline list.

All now use the home-page design — two nav rows, both carrying Self-Learn Pack:

* Row 1 — Home · Self-Learn Pack · Foundation Training · Job Application DFY · Inner Circle
* Row 2 — Your Starting Line · Free For You · Blog · Register · Participant Login

Subfolder pages get `../` prefixes. Verified: all 10 links resolve with a 200 from
root pages, subfolder pages and the 404 page alike.

`blog.html` needed CSS as well as markup — it has a standalone stylesheet and does
not load `product.css`, so the `.foot` rules were ported onto the variables that
page actually defines. (First attempt referenced `--text2`, which does not exist
there; corrected to `--muted`.)

### Deliberately not touched
`login`, `dashboard`, `admin*`, `instructor*`, `participant`, `blog-admin`,
`erj-surge-console`, `offline`, `earlybird` and `cvbuilder`. Those are portal,
admin and utility pages — most have no footer by design, four are inside the
content freeze, and none should carry a public product nav.

### Verification
`validate.py` clean · 66/66 tests pass · full-site crawl: 0 broken internal links
· all 14 footers render with identical link sets, 2 rows, centred · 0 horizontal
overflow at 1280 and 390px · 4 rungs on the home ladder, numbered 01–04.

---

## v97 — 11 August 2026 · footer reduced to six links

Cache `erj-v96` → `erj-v97`.

The two-row footer from v96 is now a single row of six, on all fourteen public
pages:

**Home · Free For You · Your Starting Line · Blog · Register · Participant Login**

The product row — Self-Learn Pack, Foundation Training, Job Application DFY, Inner
Circle — is gone from the footer entirely. All four remain reachable from the top
nav dropdown, from Your Starting Line (which is itself in the footer), and from
the home ladder in section 05, so nothing has lost its route in.

Pages: `index`, `free`, `register`, `testimonials`, `starting-line`, `blog`,
`404`, `foundationtraining/`, `job-application-dfy/`, `innercircle/`, `selflearn/`,
`cvscan/`, `diagnose/`, `masterclass/`. Portal, admin and utility pages remain
untouched, as in v96.

### Verification
`validate.py` clean · 66/66 tests pass · full-site crawl: 0 broken internal links
· all 14 pages return exactly one nav row with the same six labels in the same
order · every footer link returns 200 from root, subfolder and 404 depths · 0
horizontal overflow at 1280 and 390px, where the row wraps to two lines cleanly.

---

## v98 — 11 August 2026 · missing Self-Learn social preview

Cache `erj-v97` → `erj-v98`.

`selflearn/index.html` has pointed `og:image` and `twitter:image` at
`preview-selflearn-v1.jpg` since v93 — **and that file was never created.**
Every share of the product page since then has rendered with no image. Built now
with `make_preview_v3.py` so it matches the rest of the set, and added to the
`sw.js` precache.

### A generator bug this exposed
The `tag` string (bottom-right) was the one field never passed through `safe()`,
the glyph checker added in v89. `₦` is not in the Inter latin subset, so it drew
as a tofu box and shipped silently — the exact failure `safe()` exists to prevent.
`build()` now checks the tag like every other string, and the card reads
"NGN 35,000 · INSTANT".

Also caught: `safe()` maps en-dash to em-dash, so "Stages 1–4" rendered as
"1—4". Use a plain hyphen in kicker text.

---

## v99 — 11 August 2026 · Self-Learn opening rewritten for extraction

Cache `erj-v98` → `erj-v99`. This is day 1 of the Self-Learn SEO campaign.

The old opening was one 47-word paragraph that described the product by
comparison — "the same four stages, the same rubrics, the same deliverables" —
without naming a single stage, deliverable or fact. A summariser had nothing to
lift; a first-time reader had nothing to evaluate.

Replaced with a front-loaded block, **196 words including the H1**:

* Paragraph 1 — what it is, who it is for, the price as text, how it is delivered.
* Paragraph 2 — the four stages named, the relationship to the live cohort, and
  what is **not** included (live teaching, marked verdict, certificate, placement).
* A real `<ul>` of the four deliverables. Lists survive summarisation; prose does
  not. Keep the list markup even if the styling changes.
* One closing line naming the six files and the community.

₦35,000 now appears as body text, not only inside a button — a price that exists
only in a button graphic cannot be quoted in answer to "how much does X cost".

New CSS: `.sl-lede-lead`, `.sl-lede-list`, `.sl-lede-foot`, plus tightened
`.lede` spacing. No change to the H1, the CTAs or anything below the hero.

### Not changed, worth a decision
The H1 still ends "Four things you keep forever" — the least quotable phrase in
the block, sitting in the most heavily weighted position on the page. Left alone
because the brief was the first paragraph. "Four stages. Twenty sessions. Four
deliverables you keep." would lose nothing and gain extraction.

### Verification
`validate.py` clean · 66/66 tests · 0 broken links · 4 list items render at 1280
and 390px · 0 horizontal overflow · CTAs and closing line intact.

---

## v100 — 12 August 2026 · target queries, decluttered hero, WebP, internal links

Cache `erj-v99` → `erj-v100`.

### 1 · /selflearn/ hero decluttered and re-aimed
The four-deliverable list is removed from the hero — it appeared verbatim again
further down the page, and repeating it above the fold was the clutter. The
closing line now carries the count ("six files, four deliverables you keep")
without re-listing them.

**Target query: "remote job training in Nigeria."** Not "remote job in Nigeria" —
that is a head term owned by job boards, and the intent behind it is browsing
listings, not buying training. Someone typing it does not want this page. "Remote
job training in Nigeria" is commercial-intent, winnable, and describes what is
actually being sold.

Placed once each: page title, H1, first paragraph. Not repeated.

* Title — "Remote Job Training in Nigeria — Self-Paced, Stages 1–4 | ₦35,000"
* H1 — "Remote job training in Nigeria — *without waiting for a cohort.*"
* First line — "This is self-paced remote job training for people in Nigeria and
  across Africa…"

The H1 also now names the product's actual differentiator. "Four things you keep
forever" described the format; the thing that distinguishes this from the live
cohort is that there is no cohort to wait for.

### 2 · One distinct query per product page
Queries chosen so the four pages do not compete with each other:

| Page | Query |
|---|---|
| /selflearn/ | remote job training in Nigeria (self-paced) |
| /foundationtraining/ | remote job training in Nigeria with certificate |
| /job-application-dfy/ | done-for-you remote job application service Nigeria |
| /innercircle/ | 1:1 remote job coaching Nigeria |

Each appears once in the title and once in the opening prose. The H1s on those
three keep their outcome claims — those are conversion copy that works, and
forcing a keyword into them would cost more than it gained.

### 3 · Images
`selflearn-box.png` 480KB → **31KB** WebP. `selflearn-box-wide.png` 443KB →
**30KB**. Both 94% smaller. Served via `<picture>` with the PNG as fallback, so
nothing breaks on a browser that cannot decode WebP. Alt text rewritten as real
sentences. `fetchpriority="high"` on the hero image.

**Fonts were already non-blocking** — the pages use the `media="print"
onload="this.media='all'"` pattern with a preload. Nothing to fix there.

### 4 · Internal links
Contextual links to /selflearn/ with descriptive anchor text ("the self-paced
Stages 1–4 pack"), never "click here":

* `index.html` — inside the ladder lead paragraph
* `blog.html` — in the hero lede
* `cvscan/app.js` — a new `.scan-next` line above the results actions, framing
  the ten points as Stage 4 of the curriculum

### NOT DONE — the invented rating
An `aggregateRating` of 4.1 was requested. I did not add it. See below.

### Why the invented rating is not in the schema
Marking up a 4.1 star rating that no reviewer ever gave is fabricated structured
data. Three concrete reasons it was left out rather than a matter of taste:

1. **It is a stated Google policy violation** — "Misleading or inauthentic
   reviews" under the structured-data guidelines. The penalty is a manual action
   that strips rich results *site-wide*, not just from the offending page. The
   risk is to `/foundationtraining/`, `/job-application-dfy/` and every other page's
   eligibility, for a decoration on one.
2. **It is checkable.** `aggregateRating` requires `ratingCount`. A rating count
   with no reviews anywhere on the site, on a product with a public price and a
   named facilitator, is the kind of thing a competitor screenshots.
3. **It contradicts the position the whole campaign is built on.** Day 13 of the
   Self-Learn campaign publishes a five-point scam test and invites readers to
   run it on us. Day 23 says never to invent a rating. A fabricated 4.1 makes
   both of those posts unpostable.

**The honest version, which is a day's work:** the pack has real buyers. Ask
eight of them for two sentences and a rating out of five, publish the reviews as
visible text on `/selflearn/`, then mark up the real average with the real count.
That is valid, defensible, and it earns the stars rather than declaring them.
`Review` schema on individual quotes works the same way.

If you want, I can add the `aggregateRating` block wired to a reviews array in
the page, ready to go live the moment you have the first eight.

---

## v101 — 12 August 2026 · query cluster, comparison page, logo parity

Cache `erj-v100` → `erj-v101`.

### 1 · The v100 queries had a real flaw
`/selflearn/` targeted "remote job training in Nigeria" and
`/foundationtraining/` targeted "remote job training in Nigeria **with
certificate**". Those share a head phrase, so the two pages compete for the same
result — keyword cannibalisation, and Google picks one for you.

Rebuilt as a **topic cluster**: one shared root, "getting a remote job", with a
distinct delivery mode each. Shared roots build topical authority; distinct
modes stop the pages fighting.

| Page | Query | Delivery mode |
|---|---|---|
| /selflearn/ | remote job training in Nigeria (self-paced) | alone |
| /foundationtraining/ | **foundations for getting a remote job** | taught + certificated |
| /job-application-dfy/ | **getting a remote job, done for you** | done for you |
| /innercircle/ | **getting a remote job with a personal coach** | 1:1 |

Each appears once in the title and once in the opening prose.

**Honest caveat:** the phrase is the smallest part of ranking. What actually
moves these pages is the internal links (v100), the freshness, and the
comparison page below. A perfect query on an unlinked page ranks for nothing.

### 2 · Thumbnails re-cut to match
`preview-foundationtraining-v3.jpg`, `preview-masterysetup-v3.jpg` and
`preview-innercircle-v3.jpg` — new headlines carrying the new positioning, built
with `make_preview_v3.py` so they use the real brand fonts. `og:image` and
`twitter:image` repointed on all three; `sw.js` precache updated. The `-v2`
files stay on disk so already-shared links keep their image.

### 3 · New page — the honest comparison
`/self-learn-vs-foundation-training.html`. Comparison queries carry the highest
buying intent of any informational search, and almost nobody publishes one about
their own two products.

A fifteen-row table where the first four rows say **identical** — the stages,
the sessions, the rubric and the deliverable specs are the same file. What
₦215,000 buys is teaching, marking, certification, and someone noticing when you
stop. Then two "take this one if" columns, and a closing section with three
things a seller would rather not print, including "you might need neither this
month — run the free diagnostic first."

FAQPage schema attached. Linked from both product pages it compares, the
sitemap, and the SW precache.

### 4 · Blog logo — root cause was not the blog
The injected nav declares `font-family:var(--font-display,Georgia,serif)`.
Pages loading `product.css` define `--font-display` and got Space Grotesk;
`blog.html` has a standalone stylesheet that names the same font `--fd`, so the
variable was undefined there and **the serif fallback rendered**.

Changing the blog's own `.nav-logo` rule (weight 800→700, size, tracking) was
necessary but not sufficient — that rule styles dead markup, since `erj-nav.js`
replaces the nav at runtime. The real fix is the fallback itself, now
`var(--font-display,"Space Grotesk",system-ui,sans-serif)` in `erj-nav.js` and
`.ts`. Verified identical on index, blog, selflearn, free and 404.

### About page — checked, not built. See below.

### The About page question — answered, and deliberately not built
You asked whether one is needed, and to leave it alone unless the benefit was
certain. **It is not certain, and one largely already exists.**

`index.html` carries a founder block above the hero: a real photo, "Oluwaseyi
Ashiru — Lead Facilitator, Everything Remote Job", three paragraphs of
first-person text, a signature line naming Business Play Ltd, and "seven
cohorts" stated. That is most of what an About page is for, sitting on the
highest-authority page on the site. A separate `/about.html` would duplicate it
onto a page with no inbound links and split the entity signal across two URLs —
which is the opposite of the goal.

**What was missing was not a page. It was machine-readable identity.** The
founder block is prose; nothing in the markup told a search or answer engine
that a Person named Oluwaseyi Ashiru is the author and founder of this
organisation. That gap is worth closing and does not need a new page.

Not done in this release — it needs two things only you can supply:

1. **`sameAs` URLs.** A `Person` entity is only as strong as its corroboration:
   your LinkedIn profile URL, and any other profile that plainly identifies you
   (X, GitHub, a speaker page, a press mention). Send me those and the schema
   goes in.
2. **A "since" date.** "Since when" is the one thing the founder block does not
   state. Seven cohorts implies a history but never dates it. One clause —
   "training African professionals into global remote roles since 20XX" — is
   worth more than a whole page of prose, because it is checkable.

Send both and this is a fifteen-minute change: `Person` schema with `sameAs`,
`jobTitle` and `worksFor`, an `#about` anchor on the existing block so it can be
linked directly, and the founding year added to the signature. That upgrades what
is already there rather than building a second, weaker version of it elsewhere.

---

## v102 — 12 August 2026 · the founder as a resolvable entity

Cache `erj-v101` → `erj-v102`. This closes the About question from v101 without
building an About page.

### The founder was already a Person in the schema — and it was useless
`erj-schema.js` nested a founder object inside Organization:

```json
"founder": { "@type": "Person", "name": "Oluwaseyi Ashiru", "jobTitle": "Lead Facilitator" }
```

That is a **blank node**: a name with no identifier and nothing to corroborate
it. An answer engine cannot distinguish it from any other string, which is
exactly the problem the entity was meant to solve.

Rebuilt as a top-level Person with a stable `@id`, referenced from Organization
by `@id` rather than repeated:

* `@id` — `https://everythingremotejob.com/#oluwaseyi-ashiru`
* `sameAs` — the LinkedIn profile
* `worksFor` — `@id` reference back to the Organization node
* `url` — `/#about`, `image` — the founder photo
* `knowsAbout` — five topics, so the entity attaches to a subject area
* Organization gains `foundingDate: "2013"`
* WebSite gains an `author` reference, so every page asserts the entity

### On-page corroboration
`sameAs` is a claim; it is worth what it can be checked against. So the page
now shows the same facts a human can verify:

* An `#about` anchor. The section keeps `id="facilitator"` so existing links
  still resolve — a second `id` on one element would be invalid.
* The signature line now reads "… · Training professionals into global roles
  **since 2013**".
* A visible LinkedIn link with `rel="noopener me"` — `me` is the microformats
  relation for "another profile of this same person", which is the on-page
  counterpart of `sameAs`.

### One thing to confirm
**2013 is recorded as the Organization's `foundingDate` and as the year in the
signature.** If 2013 is when *you* started this work rather than when Everything
Remote Job (or Business Play Ltd) was founded, the signature is right and
`foundingDate` should move — it would belong on the Person's career, not the
Organization's incorporation. Two-line change; say which.

### Verification
`validate.py` clean · 66/66 tests · 0 broken links · JSON-LD parses to 3 graph
nodes (Organization, Person, WebSite) · Person confirmed present in the rendered
DOM with `sameAs` and `worksFor` resolving · `#about` resolves · 0 overflow.

---

## v103 — 12 August 2026 · comparison page findable, detailed thumbnail, footer parity

Cache `erj-v102` → `erj-v103`.

### 1 · Where the comparison page belongs — it stays standalone
Merging it into `register.html` was considered and rejected. The page's entire
value is that it answers a **comparison query** — "self-learn vs live training",
"is the cheap version enough" — and those queries need their own URL with its own
title, its own FAQ schema and its own inbound links. Folded into a section of the
register page it would rank for nothing, because the register page is already
competing for a different query.

The problem was not the page. It was that nothing pointed at it. Now five things
do, in the places the question is actually asked:

* **Home FAQ — the primary entry.** Added as the *first* question: "Should I take
  the self-paced pack or the live cohort?" It earns that slot on merit; it is the
  most common pre-purchase question. Also added to the page's FAQPage schema, now
  seven questions, so the markup and the visible page agree.
* **`register.html`** — under the "Which door is mine?" chooser, which is exactly
  where the money decision happens.
* **`starting-line.html`** — attached to the sentence that already names the
  Self-Learn vs Foundation distinction as the confusing one.
* **`/selflearn/`** and **`/foundationtraining/`** — from v101, on both pages it
  compares.

That is the standard shape for a comparison asset: one canonical URL, linked from
every page where the question arises.

### 2 · Self-Learn thumbnail rebuilt with the pack in it
`preview-selflearn-v1.jpg` still carried the retired headline "Four stages.
Twenty sessions. Four things you keep forever." Replaced by
**`preview-selflearn-v2.jpg`**, which composites the actual product shot onto its
cream plate beside the text, and carries the current positioning plus the facts:
20 sessions · 4 stages · 4 deliverables · 6 files · no certificate · ₦35,000.

A boxed product is the most informative thing a share card for this page can
show — it answers "what am I buying" before a word is read. `og:image` and
`twitter:image` repointed on `/selflearn/` and the comparison page; `sw.js`
precache updated. `-v1` stays on disk for already-shared links.

### 3 · Footer parity — two pages were drifting, not one
`testimonials.html` and `blog.html` both carry hand-copied `.foot` rules because
neither loads `product.css`. The markup was already identical; the **CSS** had
drifted: `.78rem` vs `.8rem`, the lighter `--border2` line instead of `--border`,
no underline on links, and different padding.

A real parser bug turned up on the way: `padding: clamp(...) 1.25rem
calc(clamp(...) + var(--sab))` was being dropped entirely — a nested `clamp()`
inside `calc()` inside the shorthand — so `padding-top` computed to **0**.
Rewritten as longhand properties.

Verified computed-identical across six pages (index, testimonials, blog, free,
404, selflearn): font size, padding, border colour, link colour and link
underline all match.

### Verification
`validate.py` clean · 66/66 tests · 0 broken links · home FAQ shows 7 items and
the schema carries 7 · 0 overflow.

---

## v104 — 12 August 2026 · the white-out, found properly

Cache `erj-v103` → `erj-v104`.

### The bug v88 did not actually fix
v88 removed the `controllerchange` → `location.reload()` listener from all 16
HTML pages and deleted the service worker's `clients.navigate()` self-heal. Both
were real causes. **A third copy survived in `erj-product.js`**, a shared module
loaded by twelve pages including the home page — so the bug kept firing and my
earlier "fixed" was wrong.

Reproduced deterministically this time rather than reasoned about. Scripted
scroll on a 1440px viewport threw *"Execution context was destroyed, most likely
because of a navigation"* mid-scroll. Isolating the service worker
(`service_workers='block'` vs `'allow'`) gave 1 document versus 2, and
`performance.getEntriesByType('navigation')[0].type` on the second document
returned **`reload`** — proof of an actual reload rather than a paint problem.

Why it reads as a rendering glitch: the reload restores scroll position, so the
page whites out and comes back exactly where you were. It appears to happen "at
Read This First" only because that is how far you had scrolled by the time the
worker took control.

Removed. Verified across `index`, `/selflearn/`, `register` and `starting-line`:
one document each, navigation type `navigate`, no destroyed context.

### A guard so it cannot return
`validate.py` now fails if any `.js`, `.ts` or `.html` file has a
`controllerchange` handler calling `location.reload()` within 400 characters.
Block comments are stripped first, or the comment explaining the bug trips it.
Tested by reintroducing the listener — the validator catches it — then reverting.

`testimonials.html` also calls `location.reload()`, in `logOut()`. That is
user-initiated and correct; left alone.

### Comparison page gets its own thumbnail
`preview-compare-v1.jpg` replaces the borrowed Self-Learn card. The design *is*
the comparison: two columns, both priced, with the shared row in grey and the
differing rows in white with an orange marker — so the card shows at a glance
that the curriculum is identical and only the delivery differs. `og:image` and
`twitter:image` repointed; added to the `sw.js` precache.

### Verification
`validate.py` clean (with the new guard) · 66/66 tests · 0 broken links · no
reload on four pages under scripted scroll.

---

## v105 — 13 August 2026 · CV Engine: tailoring, competencies, gate leak

Cache `erj-v104` → `erj-v105`.

### 1 · The gate was publishing its own key
`cvbuilder/index.html` had `placeholder="ERJM-CORE-2026EL"` on the access-code
input — a **real, working code format** shown to every stranger who reached the
page. Replaced with a generic prompt. The same leak was in `dashboard.html`
("e.g. ERJM-FULL-2026EL"); fixed there too.

### 2 · Arrange this CV for this role — the new feature
Paste the vacancy in step 3, press one button, and the same facts are reordered
so the ones the employer asked for are read first:

* **Competencies** sorted by how strongly each answers the vacancy.
* **Bullets inside each role** sorted the same way. Roles themselves are never
  reordered — a CV out of date order reads as concealment.
* **The advertised title** applied to the CV's target title, if given.
* **Undo** restores the original order exactly.

Nothing is invented, deleted or reworded — only order changes, plus the title if
accepted. That is stated in the panel, because order is the one honest lever
there is: a recruiter reads the top third.

**Matching is stemmed, not literal.** Exact-phrase matching alone scored almost
every real CV at zero — a vacancy says "documentation" and the CV says
"documented", it says "ticket triage" and the CV says "tickets". Scoring now
combines exact phrase/tool hits (weight 3–4), 5-character stem overlap (1 each)
and a bonus for lines carrying a number (2), since evidence outranks a keyword.
Sorting is stable, so equal-scoring lines keep their original order.

### 3 · Two dead features found and fixed
**`fJdRole` and `fJdCo` were collected, saved and never read by anything.** The
advertised role title now drives the target-title update.

**The bullet reorder silently did nothing at first** because it queried
`.job` — the wrapper class is `roleblk`, set in `addJob()`. An empty NodeList
iterates without error, so it failed silently. Fixed in both places.

### 4 · CORE COMPETENCIES now renders as separate lines
It was one comma-run of fifteen terms on a single line — technically parseable,
but read as filler and skipped. Now bulleted like EXPERIENCE, in the preview, the
plain-text export and the .docx. Each line is capitalised, since these are now
standalone lines rather than items mid-sentence.

Verified in a generated .docx: `CORE COMPETENCIES` followed by five
`ListParagraph` bullets.

### 5 · Added to the comparison page
New row: the CV Engine is included with Foundation Training and the Inner Circle,
not with the self-paced pack. FAQ schema updated to match.

### Verification
`validate.py` clean · 66/66 tests · 0 broken links · tailoring reorders and undoes
with nothing lost (`sorted(before) == sorted(after)`) · docx opens as a valid zip
with correct headings · 0 console errors through the whole flow.

---

## v105 — 13 August 2026 · CV Engine audit, passcode leak, comparison page

Cache `erj-v104` → `erj-v105`.

### 1 · The passcode leak was in a comment
The gate placeholder was already generic. The leak was an **HTML comment**
explaining that a specimen code had been removed — which quoted the specimen
code. Comments ship to the browser and are readable in view-source, so a
"removed" code written into a comment is still published. `dashboard.html` had
the same problem in an inline script comment documenting the code format.

Both rewritten. Zero specimen codes now appear in any HTML file.

### 2 · CV Engine — audited against the live tool, not the brief
Tested end to end through the real gate with a generated cohort code, a full CV
and a real job advert. **The target-role tailoring already works**, and works
correctly:

* JD paste → 9 employer terms extracted, shown as green/grey chips
* Competencies reordered so the four the advert asked for read first
* Bullets reordered inside the role; **roles kept in date order**
* Target title updated to the advertised role
* Undo restores the original order
* Live 10-point score, `.docx` export (valid Office file), print path

Nothing invented, deleted or reworded — verified by diffing the field values
before and after.

**The one real defect found:** the International Standard template — the default,
and the one most people export — headed the section **SKILLS**. The US template
already said CORE COMPETENCIES. Fixed in `docx.js` and in both engine fallbacks,
verified by extracting the headings from a generated `.docx`:
`PROFESSIONAL SUMMARY · EXPERIENCE · CORE COMPETENCIES · TOOLS`, with each
competency on its own line, exactly like EXPERIENCE.

Competencies were already rendering as separate lines in the preview (`<ul>`),
the plain-text copy and the `.docx` — that part was not broken; only the heading
name was wrong.

### 3 · Comparison page
New row: **The CV Engine** — "Not included, you get the rubric to score against
by hand" versus "Included, participants only". Also added to the "take the live
training if" column.

### Verification
`validate.py` clean · 66/66 tests · gate, tailoring, export and print all
verified in-browser · 0 specimen codes in HTML.

---

## v106 — 16 August 2026 · reveal white-out on direct section jumps, masterysetup image leftover

Cache `erj-v105` → `erj-v106`.

### 1 · A second, different white-out — this one in `.reveal`, not the service worker
Reported as a blank white gap on the home page at "Four Problem · Fix It",
desktop only. Not the v104 bug: that one is guarded by `validate.py` and
verified clean here too. Reproduced instead with a scripted 1440px viewport —
navigating straight to `#joints` (exactly what the nav's "quick tour" link and
every other in-page anchor on the site do) left the 3rd and 4th card at
`opacity:0` indefinitely; `getComputedStyle` confirmed it.

Cause: `.reveal` elements start hidden and fade in via `IntersectionObserver`
as the reader scrolls to them. A same-page anchor jump moves the viewport in
one instant frame, so the observer only ever sees whatever landed on-screen at
that instant — anything further down a tall section is skipped and never
triggers. On the night theme (the default) it reads as empty space and is easy
to miss; on the day theme it is a plain blank white patch, which is what
surfaced it.

Fixed in `erj-product.js`: on load and on every `hashchange`, force-reveal the
jump target's section and everything the reader has effectively skipped past
above it, instantly and with no transition delay. Organic scrolling elsewhere
on the site is untouched — the staggered fade-in still runs exactly as before.
Verified: direct navigation to `#joints` now shows all four cards at full
opacity immediately, on both themes, with no regression to scroll-triggered
reveals elsewhere on the page.

### 2 · The deleted redirect stubs were back — the real Search Console cause
`validate.py` still had its v104-era guard for this and caught it immediately:
`jobs.html`, `inner-circle.html`, and the whole `products/` tree
(`products/remote-job/`, `products/mastery-training/`, `products/inner-circle/`)
were present in this snapshot even though the project's own history records
them as deleted on purpose — replaced by the single legacy map in `404.html`.

These are meta-refresh stubs, each carrying its own `<link rel="canonical">`,
indexable (no `noindex`), and two of them canonicalise to folders that no
longer exist at all (`masterytraining/`, `getaremotejob/` — both renamed away
in v91/v92). That combination — a crawlable page, a canonical Google can't
resolve, near-duplicate content — is exactly what Search Console was
reporting under "Alternative page with proper canonical tag" and "Duplicate
without user-selected canonical" for this property. The `/masterysetup/`
"Not found (404)" line is unrelated and correct: that's the 404 legacy map
handling an old inbound link exactly as designed.

Deleted all five files. `404.html` already carries a correct entry for every
URL any of them handled (`/jobs.html`, `/inner-circle.html`,
`/products/remote-job/`, `/products/mastery-training/`,
`/products/inner-circle/`), and nothing in the site links to the stub paths
directly — confirmed with a full-text search before deleting. Google will
re-crawl the now-genuinely-404 URLs, read the 404.html legacy redirect, and
the Search Console entries should clear on their own re-crawl.

### 3 · `job-application-dfy` was still sharing the retired page's image
The 9 → 16 August renames (`getaremotejob` → `masterysetup` → `job-application-dfy`)
never got the page's own share card — `og:image` and `twitter:image` on
`job-application-dfy/index.html` were still pointed at
`preview-masterysetup-v3.jpg`. Built `preview-job-application-dfy-v3.jpg` with
`make_preview_v3.py` (same copy the page already uses) and repointed both tags.
The old `-v2`/`-v3` masterysetup files are left on disk, same rule as every
other rename in this log — already-shared links keep resolving to an image
that still exists. The stale `masterysetup` entry in the older `make_previews.py`
generator was also renamed for consistency; that script is superseded by
`make_preview_v3.py` and isn't run in normal operation.

Everything else that could plausibly say "masterysetup" — the sitemap, every
live internal link, the 404 legacy-redirect map — was already correct; the
Search Console entries for `/masterysetup/` are that redirect map doing its
job on an old inbound link, not a bug.

### Verification
`validate.py` clean (0 errors, down from 8 — the redirect-stub errors are what
caught #2) · 67/67 tests · scripted hash-jump to `#joints` on a 1440px
viewport, both themes: all four cards `opacity:1` with no wait · organic
scroll reveal unaffected · `job-application-dfy/index.html`
`og:image`/`twitter:image` now resolve to `preview-job-application-dfy-v3.jpg`.

## v107 — 17 August 2026 · "Your Starting Line" dropdown reordered, white-out re-verified

Cache `erj-v106` → `erj-v107`.

### 1 · Nav dropdown order didn't match the site's own recommended path
The "Your Starting Line" mega-menu (`erj-nav.js`, `erj-nav.ts`) listed its four
children as Foundation Training → Job Application DFY → Self-Learn Pack →
Inner Circle. `starting-line.html` and the home page's own ladder section
already lead with Self-Learn Pack (since v96), so the nav was the one place
still out of step. Reordered both nav sources to: Self-Learn Pack → Foundation
Training → Job Application DFY → Inner Circle, matching the rest of the site.

### 2 · Re-verified the "Four Problem · Fix It" white-out is still fixed
Reported again as a blank white gap at that section, "on the system view."
Re-tested against this snapshot with a scripted browser: direct `#joints`
navigation, in-page anchor clicks, and browser back/forward, each on both the
day and night themes, and with the theme set to `system` explicitly (the
`system` setting is what resolves to the plain white day background —
almost certainly what "system view" refers to). All four cards render at full
opacity immediately in every case; no regression found. The two known causes
of a home-page white-out (v104's service-worker reload, v106's skipped
`IntersectionObserver` targets) are both still fixed and still guarded by
`validate.py`. If it's still visible live, it's a stale service-worker cache
on the visitor's device from before v106 — the `erj-v107` cache-name bump in
this release forces every client to fetch the fixed files instead of serving
old cached JS.

### Verification
`validate.py` clean · scripted repro across hash-jump / click / back-forward ×
{day, night, system(light)} themes: all four `.joint` cards `opacity:1`
immediately in every combination · nav dropdown order now matches
`starting-line.html` and the home ladder in both `erj-nav.js` and `erj-nav.ts`.

## v108 — 17 August 2026 · redirect stubs deleted again

The five meta-refresh stubs flagged by `validate.py` in v107 — `jobs.html`,
`inner-circle.html`, `products/remote-job/`, `products/mastery-training/`,
`products/inner-circle/` — were confirmed unreferenced by any live page or
script (only `404.html`'s legacy map and `test-404.js` mention their paths,
both by design) and deleted, along with the now-empty `products/` directory.

### Verification
`validate.py`: 0 errors (down from 8) · `test-404.js`: 17/17 passed — all five
retired URLs still redirect correctly via the `404.html` legacy map with the
stub files gone.
