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
├── index.html                  # Home — Cohort 9 conversion page
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

## About

Built and maintained by **Oluwaseyi Ashiru** — Everything Remote Job, under Business Play Limited, Abuja, Nigeria.

- 🌍 [everythingremotejob.com](https://everythingremotejob.com)
- ✉️ Enquiries via the site's WhatsApp channel

> *"We won't let you go until you're hired."*
