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
