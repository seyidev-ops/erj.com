# ERJ · 23 August 2026 conversion update

## Blog publishing
- The dynamic blog now gates every post against the **Africa/Lagos** calendar date, even if a browser has an old `published:true` copy in localStorage.
- The archive page starts today at **23 August / 113 published articles**. The 24 August article is present in the schedule but hidden until 24 August WAT, when the archive script reveals it automatically and updates the counts.
- Archive Day / System / Night theming now has a real day palette.
- The shared navigation now uses the official `erj-mark-dark.png` / `erj-mark-light.png` masters.

## Application Clinic
Registration URL:
https://us06web.zoom.us/meeting/register/Ca4SH87JS3OZtL2hZrwj1g

Website flow:
1. Register on Zoom.
2. Zoom confirmation email supplies the personal join information and Add to Calendar.
3. Registrant taps the ERJ WhatsApp reminder CTA and sends `CLINIC` so the team can apply the `CLINIC — Registered` label and send reminders.

The website no longer promises that ERJ manually sends the Zoom link.

## Cohort 10 reservation
Foundation Training remains **₦250,000**.

Approved timing bridge:
- Reservation: **₦50,000**, only after Registrar fit check.
- Reservation is credited fully to tuition.
- Balance: **₦200,000 by 6:00 PM WAT, Sunday 30 August**.
- The public website does not expose a reservation payment URL. The Registrar sends the private payment link after fit is confirmed.
- This is presented as payment timing, not a discount or long-term instalment plan.

## Zoom settings the account owner must do manually
In the Zoom web portal for the 29 August meeting:
- Set registration to **Automatically Approve**.
- Add the ERJ qualification questions (target role, applications in last 30 days, interviews in last 30 days, biggest problem, optional live CV review permission).
- Add ERJ's WhatsApp reminder instruction to the Registrant Confirmation Email.
- Optional: use the official light-background ERJ lockup in Zoom Registration > Branding.

## Cache
Service worker cache is now `erj-v127-aug23-zoom-reservation`.
The blog/archive load cache-busted theme/navigation assets for the 23 August repair.
