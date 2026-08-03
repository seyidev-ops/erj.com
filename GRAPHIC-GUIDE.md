# Cohort 10 Surge — Graphic Guide

**Story:** Amara · ₦2.1M/yr ceiling → $38,400/yr · 27.8× in dollar terms
**Window:** Wed 26 August → Mon 31 August 2026, 8:00 PM WAT
**Blog post:** `everythingremotejob.com/blog.html?p=ceiling-to-dollars`

---

## 1. The system these were built in

Everything is drawn from the live ERJ RocketAir tokens in `product.css`. No new colours, no second accent, no invented type.

| Token | Value | Where it appears |
|---|---|---|
| Canvas | `#000000` | Every frame. Pure black, never grey-dark. |
| Notch surface | `#111111` | The two contrast cards on frame 06, the split panels on the feed card. |
| Ink | `#FFFFFF` | Headlines and the numbers that matter. |
| Ink soft | `#A1A1A1` | Body copy, secondary values. |
| Ink faint | `#6B6B6B` | Micro-labels, frame counter, footer URL. |
| Accent | `#FF5722` | One per frame, maximum. Nothing decorative. |
| Hairline | `rgba(255,255,255,.10)` | Rules between rows. Never a heavy border. |
| Display type | Space Grotesk 700 | All numbers and headlines. Tight-tracked. |
| Body type | Inter 300 / 500 | Paragraphs at 300, micro-labels at 500 with wide tracking. |

**The discipline that makes it read as premium:** the number is always the largest object on the frame, and everything else recedes. If two things compete, one of them is wrong.

---

## 2. Specifications

**Stories** — 1080 × 1920 (9:16), PNG. Ten frames, `erj-story-01` … `erj-story-10`.

- Side margin: 96px. Nothing crosses it.
- Top 300px and bottom 380px are kept free of load-bearing content — that is where Instagram, WhatsApp and Facebook put their own UI, your profile bubble, and the reply bar.
- Every frame carries a progress tick bar, a section label in accent, an `NN/10` counter, and the wordmark footer. Verified: closest content to the footer rule is 138px.

**Feed card** — 1080 × 1350 (4:5), PNG. `erj-feed-before-after`. Sized 4:5 because it occupies the maximum vertical space Instagram and Facebook allow in-feed.

---

## 3. The ten frames and what each one is for

| # | Frame | Job it does |
|---|---|---|
| 01 | ₦175,000 a month **was the ceiling** | Stops the scroll with a naira figure the viewer recognises as their own. Monthly, not annual — monthly is what people feel. |
| 02 | The before ledger | Establishes she was competent and still stuck. The four `none` rows do the work. |
| 03 | 90 minutes · 4 days · 54 hours | Removes the single most common objection before it is raised. |
| 04 | What 54 hours were spent on | Proves there is a method, not a miracle. Four named phases. |
| 05 | 14 → 6 → 3 → 1 | The outreach ledger. Small numbers are more credible than big ones. |
| 06 | 312 sprayed vs 14 aimed | The contrast frame. This is the one that gets screenshotted and shared. |
| 07 | $38,400 | The payoff. Held back until frame 07 deliberately — earn it first. |
| 08 | $37,000 ÷ 54 hours ≈ $685/hr | Converts the result into a rate. Makes the price of any tier look small by comparison, without mentioning price. |
| 09 | "They did not disqualify her. They only decided the pace." | The line people quote back at you. No numbers at all — the frame breathes. |
| 10 | Monday 31 August · 8:00 PM WAT | The only frame with a button and a URL. |

**Do not reorder them.** The sequence is: ceiling → constraint → method → evidence → contrast → result → arithmetic → meaning → deadline. Moving the result earlier collapses the whole thing into a brag.

---

## 4. Posting schedule

Full version with captions lives in the Surge Console (**Posting** tab). In short:

- **Wed evening** — blog post live, feed card with the long caption. No stories yet.
- **Thu from 10:00** — frames 01–05, in order, one sitting. Link sticker on 05.
- **Thu after the 7:00 PM masterclass** — frames 06–10. Highest-intent audience of the week.
- **Fri** — repost 01, 07, 10 only. Add one real reply from Thursday as its own frame, name blurred.
- **Sat** — 03 and 09 in the morning; 10 at 8:00 PM as a 24-hour marker.
- **Sun** — 10 only, at 09:00, 17:00 and 19:30, hours edited by hand. On close day the deadline is the only message.

---

## 5. House rules for this story

1. **Never round 27.8× up to 28× or "nearly 30×".** The precision is the credibility.
2. **Always carry the constraint with the result.** `$38,400` alone is a boast. `$38,400 on 90 minutes a day` is an argument.
3. **The honesty line stays on the long captions**: documented journey, published with permission, individual results vary with skill, market and effort. It costs nothing and it is the reason people believe the rest.
4. **Naira-to-dollar conversions reflect rates at the time.** If someone challenges the maths, show them: ₦2.1M/yr ÷ ~₦1,522 ≈ $1,380; $38,400 ÷ $1,380 = 27.8.
5. **Never pair this story with a salary promise.** The site's bands are $500–$2,000/month for Mastery. Amara landed above that band. Say "one documented outcome," not "what you will earn."

---

## 6. Regenerating or restyling

`render_stories.py` builds all eleven images. Tokens sit at the top of the file; change the accent in one place and every frame follows. To adapt this frame system to another story, replace the six `frame()` bodies that carry numbers (01, 02, 05, 07, 08 and the feed card) and leave 03, 04, 09, 10 largely intact — those are structural.

The renderer checks each frame for content within 40px of a side edge and reports the lowest content row so you can confirm nothing collides with the footer before publishing.

**Fonts:** Space Grotesk and Inter variable TTFs. Weight is set through the variation axis, so `700` display and `300` body are true weights, not synthesised bold.
