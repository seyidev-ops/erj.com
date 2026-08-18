/* ═══════════════════════════════════════════════════════════════
   EVERYTHING REMOTE JOB · CAPTURE CONFIG
   Single source of truth for everything the capture layer needs.
   Edit HERE only — erj-capture.js reads from this and nothing else
   hard-codes a number, a link, or a capacity figure.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  window.ERJ_CONFIG = {

    /* ── The one WhatsApp line. Every capture lands here. ─────── */
    whatsapp: '2348032925957',
    whatsappDisplay: '+234 803 292 5957',

    /* ── The free broadcast channel (one-way: cannot receive replies,
          which is exactly why every mention of it needs a bridge). ── */
    channel: 'https://whatsapp.com/channel/0029Vaym4DE3mFY2wCrC713S',

    /* ── Placement capacity. Real hours, not marketing scarcity.
          Update `taken` as engagements start and finish. ────────── */
    capacity: {
      placementTotal: 8,     // Job Application DFY engagements we can run at once
      placementTaken: 5,
      innerCircleTotal: 12,  // Inner Circle residency seats per intake
      innerCircleTaken: 7
    },

    /* ── The evergreen sentence. Shown under every countdown so a
          person who becomes ready mid-cycle is never told to wait. ── */
    evergreen: {
      lead: 'A cohort has a date. Your job hunt doesn\u2019t.',
      body: 'These doors open the day you walk through them \u2014 no gate, no waiting list.',
      doors: [
        { label: 'Job Application DFY \u2014 done with you, starts this week', href: 'jobapplication/' },
        { label: 'The free stack \u2014 CV scan, blog, job board, masterclass', href: 'free.html' }
      ]
    },

    /* ── Prefilled message templates. {tokens} are filled at runtime. ── */
    messages: {
      scan: 'Hello ERJ \u2014 I just scored {score}/10 on the free CV self-scan.\n\nThe points I did not clear: {defaults}\n\nPlease send me the fix list for my score.',
      scanClear: 'Hello ERJ \u2014 I scored {score}/10 on the free CV self-scan and cleared all ten points.\n\nMy CV is not the reason I am not getting interviews. Where should I look next?',
      channel: 'Hello ERJ \u2014 I am on the free job board channel. Which of this week\u2019s roles should I actually apply to, and why those ones?',
      diagnose: 'Hello ERJ \u2014 I did the four-point diagnostic.\n\nMy leak is {joint} \u2014 {law}\n\nWhat I said: {answer}\n\nPlease send me the fastest fix for this one.',
      blog: 'Hello ERJ \u2014 I have been reading the blog and I want to sort out my job hunt properly. Where do I start?',
      capacity: 'Hello ERJ \u2014 I would like one of the placement engagements. Are there still places open this month?'
    }
  };
})();
