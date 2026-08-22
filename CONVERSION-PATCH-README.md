# ERJ Cohort 10 Conversion Patch — v3 corrective build

This corrective build addresses the issues found during live review on 22 August 2026.

## Verified corrections

- **Diagnose PDF export** is now a visible `Download my diagnostic PDF` action immediately after the result verdict.
- The PDF is a true browser-generated A4 PDF, uses the supplied **official Everything Remote Job light logo**, and has been rendered/tested for layout.
- The Supply diagnosis no longer sells or links to the retired Private Job Board. It routes to **Done-For-You Application**.
- The participant dashboard no longer exposes a Private Job Board product; the resource area now explains and links to **Done-For-You Application**.
- The retired Private Job Board payment/quick-reply entry was removed from the sales console. Legacy admin controls are hidden and marked retired for historical data only.
- Testimonials no longer contain the generic "what proof should include" instruction block. Each of the 9 success stories now has its own evidence trail with its published timeline, before/after positioning, interview/offer milestone, ERJ intervention, and participant statement.
- No fake invitation screenshots, calendar dates, CV screenshots or message screenshots were invented. The page explicitly limits itself to facts already published in the case studies; verified source artefacts can be inserted when supplied.
- The **Inner Circle hero statistics block is removed entirely**.
- Foundation Training uses animated counters for **446+ trained · 382+ placed · 16 assets built live · 100% hiring focus**, with final-number fallback if JavaScript is unavailable.
- Heading hyphenation is disabled so words such as `assets` and `employers` are not automatically split across lines.
- Sticky mobile enrolment CTAs are two readable text lines with a compact **Register now** button.
- `Secure my place` was replaced with **Register now** for consistency.
- `Refined after every cohort` is used instead of an artificial fixed "cohorts refined" statistic.
- Install-App UI is removed from the testimonials page.
- Service-worker cache is bumped to `erj-v126-conversion-fix` and updates activate immediately, while critical diagnostic assets are cache-busted with `?v=126`.

## Validation

- Site validation: no errors.
- Diagnostic engine/capture tests: 31 passed, 0 failed.
- PDF syntax: valid PDF 1.4, A4, one page.
- PDF rendering manually inspected after generation.

## Deployment note

Deploy the entire ZIP over the current site. Because the previous build may be held by an older service worker, refresh the site once after deployment. The v126 worker then takes control immediately and clears prior ERJ caches.
