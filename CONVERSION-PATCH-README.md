# ERJ Conversion Patch — 22 August 2026

This patch is designed for the Cohort 10 rescue window. It preserves the existing ERJ product architecture and brand assets while changing the path from free attention to a private sales conversation.

## What changed

### 1. `/diagnose/` now converts diagnosis into a human review
- The result is still free and instant.
- The primary result is shown first.
- The first CTA is now **Send AUDIT to ERJ**.
- The WhatsApp message asks for target role, applications in the last 30 days, interviews in the last 30 days, and CV/LinkedIn.
- Only one immediate free action is shown before the lower recommendation doors.
- The result can be exported as a branded A4 PDF using `diagnose/report-pdf.js`.
- PDF generation is local in the browser and uses no external library.

### 2. WhatsApp channel bridges now use `AUDIT`
Where the site links to the free WhatsApp job channel, the capture layer now asks job seekers who are applying without interviews to move into a private diagnosis conversation.

### 3. The free masterclass is now a practical Application Clinic
`/masterclass/` is repositioned for 29 August as the **Remote Job Application Clinic**:
- bring a CV + one real job advert;
- Four-Point diagnosis;
- live CV/ATS teardown;
- job-advert fit check;
- application positioning;
- honest product routing after diagnosis.

The old animated 72% seat-fill meter and the related 100-seat marketing language were removed.

Registration now collects name, WhatsApp, email, occupation, target role, current problem, applications in the last 30 days and interviews in the last 30 days, then prepares a WhatsApp registration message. Nothing is stored by the static page; the user must tap **Send** in WhatsApp to complete registration.

An Add-to-Calendar `.ics` file is available after starting registration.

### 4. Homepage / Foundation Training trust corrections
- Seven-cohort references were reconciled to nine completed cohorts before Cohort 10.
- 370+ references were reconciled to 382+ where found.
- Foundation Training metadata now uses 31 August 2026.
- Homepage and Foundation Training copy were tightened around readiness/representation rather than implying ERJ controls hiring timing.
- The artificial "every cohort fills" line was removed.
- Diagnosis is now the clear fallback when a visitor is unsure whether Cohort 10 is their door.

### 5. Funnel measurement events
`erj-track.js` now supports these custom events:
- `diagnosis_complete`
- `audit_started`
- `diagnostic_report_downloaded`
- `product_recommendation_click`
- `masterclass_registration_started`
- `cohort_checkout_started`

Existing WhatsApp Lead and Paystack/Selar InitiateCheckout events remain intact.

### 6. Internal surge console
`erj-surge-console.html` now contains an `/audit` quick reply and the current 29 August Application Clinic copy.

## Deployment

Deploy the contents of this ZIP exactly as you deploy the current ERJ static site. Do not upload the enclosing folder as an extra directory if your host expects `index.html` at the site root.

The service-worker cache is bumped to `erj-v123-conversion`. Existing users may need to close all ERJ tabs once before the new worker fully takes control; HTML is already network-first, so page copy should update on the next page view.

## Verification performed

- JavaScript syntax checks passed for modified JS files.
- Inline JavaScript syntax checks passed on the modified public pages.
- `test-dx.js`: 31 passed, 0 failed.
- `validate.py`: no errors; sitemap URLs resolve within the project tree.
- Generated diagnostic PDF was validated as PDF 1.4, A4, one page in the test case.

## Important operational note

The static website cannot know whether a visitor actually tapped **Send** inside WhatsApp. A click to WhatsApp is therefore tracked as a lead/start signal; the WhatsApp conversation itself remains the source of truth for a completed AUDIT or clinic registration.
