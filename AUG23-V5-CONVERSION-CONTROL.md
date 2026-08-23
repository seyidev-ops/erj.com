# ERJ Conversion Control v5 — 23 August 2026

This build removes the permanent public-navigation bridge copy "Jobs are the feed. Diagnosis is the next step." The sentence remains an internal campaign operating principle only. AUDIT continues where it belongs: job-post footers, campaign copy, the diagnostic result and other explicit conversion moments.

Additional changes in this build:
- `erj-capture.js` / source TS: channelBridge is intentionally a no-op so no AUDIT campaign copy is inserted inside the Global Job Board navigation accordion.
- `erj-track.js`: explicitly tracks AUDIT, CLINIC reminder opt-in and COHORT FIT WhatsApp starts.
- `sw.js`: cache bumped to `erj-v128-aug23-internal-bridge` so the removed bridge does not persist from an older service worker cache.
- Surge Console: duplicate reservation explanation cleaned up.

Verified in this build:
- Diagnosis export remains available.
- Paid Private Job Board remains retired; the free WhatsApp job Channel remains.
- Zoom Application Clinic registration flow remains wired to the confirmed 29 August registration URL.
- Cohort 10 fit-checked ₦50,000 reservation construct remains public without exposing a reservation payment link.

Owner actions not solvable by website code:
- Create the private official ₦50,000 reservation Paystack page/link.
- Write the participant-requested cancellation/refund term before accepting the first reservation.
- Confirm Zoom automatic approval, qualification questions, confirmation email and ERJ branding.
- Create/apply WhatsApp Business pipeline labels and execute the 24h / 3h / 30m reminders.
- Replace narrative testimonial evidence with genuine consented artefacts where available.
- Run the daily AUDIT/clinic/sales scoreboard and follow-up process.


## 23 Aug commercial update
- Inner Circle is now ₦250,000 once, private 1:1, rolling/application-first. The ₦135,000 × 2 option and Inner Circle countdown are retired.
- Cohort 10 reservation remains ₦50,000 after fit; payment is by direct transfer to Business Play Ltd / GTBank 0761646755. Bank details are kept out of public pages and sent privately after fit.
- Reservation may move to the next cohort or be refunded on request, less applicable bank/payment service charges.
