/* ═══════════════════════════════════════════════════════════════════
   ERJ COHORT PASSCODES  ·  single source of truth
   ═══════════════════════════════════════════════════════════════════

   FORMAT      ERJM-<TIER>-<YYYY><HH>

     TIER      CORE  = Stages 1–4  (Complete Remote Career Programme)
               FULL  = Stages 1–5  (Get Your Dream Job Offer)

     YYYY      Gregorian year in which the cohort BEGINS
     HH        Two-letter Hebrew month abbreviation for the Hebrew month
               in which the cohort BEGINS

   EXAMPLES    ERJM-FULL-2026AV   cohort of 3–30 August 2026      (Av)
               ERJM-CORE-2026AV   same cohort, Stages 1–4 only
               ERJM-FULL-2026EL   cohort of 31 Aug – 26 Sept 2026 (Elul)

   THE RULE FOR ADDING A COHORT
   Take the date the cohort begins, find the Hebrew month that date falls
   in, use its abbreviation, and pair it with the Gregorian year of that
   same start date. Then add a row to COHORTS below. Nothing else needs
   editing — the dashboard and the admin panel both read this file.

   IMPORTANT — WHAT THIS IS AND IS NOT
   These codes run in the browser, so anyone who opens developer tools can
   read them. They are a convenience gate and an attribution trail, not
   security. They stop a casual visitor wandering into paid stages and they
   record who redeemed what. They do NOT stop a determined person, and they
   should not be relied on as if they did. If real access control is ever
   needed, validation has to move to a server.
═══════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  /* Hebrew months, ecclesiastical order, with the abbreviations used in codes */
  var HEBREW_MONTHS = {
    NI: 'Nisan',   IY: 'Iyar',     SI: 'Sivan',    TA: 'Tammuz',
    AV: 'Av',      EL: 'Elul',     TI: 'Tishrei',  CH: 'Cheshvan',
    KI: 'Kislev',  TE: 'Tevet',    SH: 'Shevat',   AD: 'Adar',
    A2: 'Adar II'
  };

  /* ── COHORTS ──────────────────────────────────────────────────────
     starts / ends are inclusive, ISO, and describe the COHORT window
     (not the enrolment window). `confirmed:false` rows are projected
     forward for convenience — check the Hebrew month before announcing
     one of them, then flip the flag.
  ─────────────────────────────────────────────────────────────────── */
  var COHORTS = [
    { n: 9,  starts: '2026-08-03', ends: '2026-08-30', year: 2026, hm: 'AV', confirmed: true  },
    { n: 10, starts: '2026-08-31', ends: '2026-09-26', year: 2026, hm: 'EL', confirmed: true  },
    { n: 11, starts: '2026-09-27', ends: '2026-10-24', year: 2026, hm: 'TI', confirmed: false },
    { n: 12, starts: '2026-10-25', ends: '2026-11-21', year: 2026, hm: 'CH', confirmed: false },
    { n: 13, starts: '2026-11-22', ends: '2026-12-19', year: 2026, hm: 'KI', confirmed: false },
    { n: 14, starts: '2026-12-20', ends: '2027-01-16', year: 2026, hm: 'TE', confirmed: false }
  ];

  var TIERS = {
    CORE: { label: 'Stages 1–4 · Complete Remote Career Programme',
            stages: ['stage1', 'stage2', 'stage3', 'stage4'] },
    FULL: { label: 'Stages 1–5 · Get Your Dream Job Offer',
            stages: ['stage1', 'stage2', 'stage3', 'stage4', 'stage5'] }
  };

  /* ── LEGACY CODES ─────────────────────────────────────────────────
     Codes already issued to earlier cohorts. They must keep working —
     a participant holding one of these paid for it. Do not remove.
  ─────────────────────────────────────────────────────────────────── */
  var LEGACY = {
    'ERJM-FULL-2026': 'FULL',
    'ERJM-S4-2026':   'CORE',
    'ERJM-S3-2026':   null,   /* partial — handled below */
    'ERJM-S2-2026':   null,
    'ERJM-S1-2026':   null,
    'ERJ-ALL-ACCESS': 'FULL',
    'COHORT7-FULL':   'FULL'
  };
  var LEGACY_PARTIAL = {
    'ERJM-S1-2026': ['stage1'],
    'ERJM-S2-2026': ['stage1', 'stage2'],
    'ERJM-S3-2026': ['stage1', 'stage2', 'stage3']
  };

  function suffix(c) { return String(c.year) + c.hm; }

  function codeFor(cohort, tier) {
    return 'ERJM-' + tier + '-' + suffix(cohort);
  }

  /* Normalise anything a human might type or paste: case, spaces,
     smart dashes, missing dashes. */
  function normalise(raw) {
    return String(raw || '')
      .toUpperCase()
      .replace(/[\u2010-\u2015\u2212]/g, '-')   /* en/em dashes → hyphen */
      .replace(/\s+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function cohortByNumber(n) {
    for (var i = 0; i < COHORTS.length; i++) if (COHORTS[i].n === n) return COHORTS[i];
    return null;
  }

  /* The cohort whose window contains `date` (default: today).
     If today falls between cohorts, returns the next one starting. */
  function currentCohort(date) {
    var d = (date ? new Date(date) : new Date());
    var iso = d.toISOString().slice(0, 10);
    var i;
    for (i = 0; i < COHORTS.length; i++) {
      if (iso >= COHORTS[i].starts && iso <= COHORTS[i].ends) return COHORTS[i];
    }
    for (i = 0; i < COHORTS.length; i++) {
      if (iso < COHORTS[i].starts) return COHORTS[i];
    }
    return COHORTS[COHORTS.length - 1];
  }

  /* Validate a typed code.
     → { ok:true, tier, stages, cohort, code, legacy, expired }
     → { ok:false, reason } */
  function validate(raw) {
    var code = normalise(raw);
    if (!code) return { ok: false, reason: 'empty' };

    /* current-format codes. Also accept the code with the hyphens missing
       or replaced by spaces, which is what happens when it is pasted out of
       a WhatsApp message or retyped from a screenshot. */
    var m = code.match(/^ERJM-(CORE|FULL)-(\d{4})([A-Z0-9]{2})$/) ||
            code.replace(/[^A-Z0-9]/g, '')
                .match(/^ERJM(CORE|FULL)(\d{4})([A-Z0-9]{2})$/);
    if (m) {
      var tier = m[1], year = parseInt(m[2], 10), hm = m[3];
      for (var i = 0; i < COHORTS.length; i++) {
        var c = COHORTS[i];
        if (c.year === year && c.hm === hm) {
          var today = new Date().toISOString().slice(0, 10);
          return {
            ok: true, code: code, tier: tier,
            stages: TIERS[tier].stages.slice(),
            label: TIERS[tier].label,
            cohort: c, legacy: false,
            expired: today > c.ends
          };
        }
      }
      if (HEBREW_MONTHS[hm]) return { ok: false, reason: 'unknown-cohort' };
      return { ok: false, reason: 'bad-month' };
    }

    /* legacy codes — still honoured */
    if (Object.prototype.hasOwnProperty.call(LEGACY, code)) {
      if (LEGACY_PARTIAL[code]) {
        return { ok: true, code: code, tier: 'LEGACY',
                 stages: LEGACY_PARTIAL[code].slice(),
                 label: 'Legacy code · ' + LEGACY_PARTIAL[code].length + ' stage(s)',
                 cohort: null, legacy: true, expired: false };
      }
      var t = LEGACY[code];
      return { ok: true, code: code, tier: t, stages: TIERS[t].stages.slice(),
               label: 'Legacy code · ' + TIERS[t].label,
               cohort: null, legacy: true, expired: false };
    }

    return { ok: false, reason: 'invalid' };
  }

  root.ERJPasscode = {
    HEBREW_MONTHS: HEBREW_MONTHS,
    COHORTS: COHORTS,
    TIERS: TIERS,
    normalise: normalise,
    suffix: suffix,
    codeFor: codeFor,
    currentCohort: currentCohort,
    cohortByNumber: cohortByNumber,
    validate: validate,
    /* Both codes for a cohort, ready to display or send. */
    codesFor: function (cohort) {
      var c = (typeof cohort === 'number') ? cohortByNumber(cohort) : (cohort || currentCohort());
      if (!c) return null;
      return {
        cohort: c,
        core: codeFor(c, 'CORE'),
        full: codeFor(c, 'FULL'),
        month: HEBREW_MONTHS[c.hm] || c.hm,
        window: c.starts + ' \u2192 ' + c.ends
      };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
