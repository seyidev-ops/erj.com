/* ═══════════════════════════════════════════════════════════════
   FIND YOUR LEAK · four-point diagnostic  (dx.ts)
   Compile: tsc diagnose/dx.ts --target es2017 --strict --lib es2017,dom

   Four questions, weighted. Each answer adds to one or two joints;
   the highest total wins, with an explicit tie-break that prefers
   the EARLIEST joint in the pipe — because a leak upstream makes
   every downstream reading unreliable. Someone who cannot find
   real roles has no meaningful conversion data yet.

   Nothing is stored. No email field, no analytics, no cookies.
   The only exit is a WhatsApp message the person chooses to send.
   ═══════════════════════════════════════════════════════════════ */

type JointKey = 'supply' | 'representation' | 'aim' | 'conversion';

interface Answer { label: string; note?: string; weight: Partial<Record<JointKey, number>>; }
interface Question { q: string; why: string; answers: Answer[]; }

interface Joint {
  n: string; name: string; law: string; verdict: string;
  free: { text: string; href: string; label: string };
  paid: { text: string; href: string; label: string };
  tonight: string[];
}

interface Window {
  ERJ_CAPTURE?: { waLink: (t: string, v?: Record<string, string>) => string; refresh?: () => void };
  ERJ_CONFIG?: { whatsapp: string;[k: string]: unknown };
}

(function () {
  'use strict';

  const QUESTIONS: Question[] = [
    {
      q: 'In the last month, how many remote roles have you found that you were genuinely eligible for?',
      why: 'Eligible means the company can actually pay someone in your country \u2014 not just that the advert said \u201Cremote\u201D.',
      answers: [
        { label: 'Almost none \u2014 I can barely find real ones', note: 'or everything looks like a scam', weight: { supply: 3 } },
        { label: 'A few, but I am not sure they were real', weight: { supply: 2 } },
        { label: 'Plenty \u2014 finding them is not my problem', weight: { aim: 1, representation: 1 } },
        { label: 'I have a steady feed I trust', weight: { aim: 1, conversion: 1 } }
      ]
    },
    {
      q: 'Of your last twenty applications, how many got any reply at all \u2014 even a rejection?',
      why: 'Total silence and a stream of rejections mean completely different things. Silence usually means you were never read.',
      answers: [
        { label: 'Zero \u2014 complete silence', weight: { representation: 3 } },
        { label: 'One or two', weight: { representation: 2, aim: 1 } },
        { label: 'A handful, mostly rejections', weight: { aim: 2 } },
        { label: 'Several, including interviews', weight: { conversion: 3 } }
      ]
    },
    {
      q: 'How do you choose which roles to apply to?',
      why: 'This separates effort from aim. A good document sent in the wrong direction produces exactly the same silence as a bad one.',
      answers: [
        { label: 'I apply to whatever reaches me', note: 'forwarded links, adverts, whatever appears', weight: { supply: 2, aim: 2 } },
        { label: 'I apply to as many as I can, quickly', weight: { aim: 3 } },
        { label: 'I check the company first, then tailor', weight: { conversion: 1 } },
        { label: 'I have not been applying much lately', note: 'honest answer, very common', weight: { aim: 2, supply: 1 } }
      ]
    },
    {
      q: 'When you get in front of a human \u2014 a call, an interview, a real conversation \u2014 what usually happens?',
      why: 'A CV cannot hire you. It buys about twenty minutes. What happens in those minutes is a separate, learnable skill.',
      answers: [
        { label: 'I never get that far', weight: { representation: 2, aim: 1 } },
        { label: 'It goes well, then they go quiet', weight: { conversion: 3 } },
        { label: 'I freeze on the money question', weight: { conversion: 3 } },
        { label: 'I get offers \u2014 they are just too small', weight: { conversion: 2, aim: 1 } }
      ]
    }
  ];

  const ORDER: JointKey[] = ['supply', 'representation', 'aim', 'conversion'];

  const JOINTS: Record<JointKey, Joint> = {
    supply: {
      n: '01', name: 'Supply', law: 'You can\u2019t apply for a job you never saw.',
      verdict: 'You are not seeing enough real, eligible roles to have a job search yet. Everything downstream \u2014 your CV, your aim, your interviews \u2014 is being judged on far too little evidence. Fix this one first and the rest becomes measurable.',
      free: {
        text: 'Join the free Global Remote Job Board on WhatsApp. Verified roles, open to Africans, posted continuously \u2014 and the blog\u2019s scam-check guides so you can tell a live listing from a fossil.',
        href: 'https://whatsapp.com/channel/0029Vaym4DE3mFY2wCrC713S', label: 'Join the free job board'
      },
      paid: {
        text: 'Sourcing properly is about six hours a week \u2014 twenty-four hours a month, unpaid, before you write a single application. The Private Job Board is that work already done: verified, scam-filtered, checked for cross-border hiring.',
        href: '../register.html', label: 'See the Private Job Board'
      },
      tonight: [
        'Check the age of the last five listings you applied to. Anything over two weeks old was probably decided already.',
        'For each company, find one piece of evidence they have paid someone outside their own country.',
        'Put two fixed hours in your calendar this week for sourcing. Motivation collapses; appointments survive.'
      ]
    },
    representation: {
      n: '02', name: 'Representation', law: 'If your CV can\u2019t be read, you were never really in the running.',
      verdict: 'You are real and competent, and the document representing you is not readable \u2014 by software first, by a stranger second. Total silence almost always means you were never actually read. This is the fastest of the four to fix.',
      free: {
        text: 'Run the free 10-Point CV Self-Scan. It takes ninety seconds, runs entirely on your own device, and shows exactly which points you default on.',
        href: '../cvscan/', label: 'Score my CV free'
      },
      paid: {
        text: 'Mastery Training rebuilds every asset with you \u2014 ATS-readable CV, searchable LinkedIn, proof of work, async writing \u2014 and you keep the skill for the rest of your career.',
        href: '../masterytraining/', label: 'See Mastery Training'
      },
      tonight: [
        'Count how many bullets on your CV contain an actual number. Under half is the usual problem.',
        'Rewrite your LinkedIn headline: the role you want, three searchable skills, one proof number. No \u201Cpassionate\u201D, no \u201Caspiring\u201D.',
        'Open your CV and ask: is anything important trapped inside a table, a text box or a second column?'
      ]
    },
    aim: {
      n: '03', name: 'Aim', law: 'Applying everywhere isn\u2019t the same as applying where you\u2019d get hired.',
      verdict: 'Your effort is not the problem \u2014 your direction is. Applications sent is a measure of effort, not of aim, and a big number with no replies is evidence of a problem rather than proof of trying. There is no feedback loop in job hunting, so the lesson never arrives on its own.',
      free: {
        text: 'Start a one-page tracker tonight: date, company, role, source, whether they can hire across borders, what you tailored, what came back. After thirty rows, patterns appear that no advice could have given you.',
        href: '../blog.html', label: 'Read the targeting guides'
      },
      paid: {
        text: 'Mastery Training installs a weekly targeting and application system. Or have the aiming carried entirely: the placement engine sources roles, tailors with you, and applies alongside you until an offer lands.',
        href: '../getaremotejob/', label: 'See the placement engine'
      },
      tonight: [
        'Try ten aimed applications this week instead of forty hopeful ones. Each one checked, each one tailored.',
        'Put the advert\u2019s exact job title in the top three lines of your CV before you send it.',
        'Sort your last twenty applications by outcome. One role type or one source is almost certainly outperforming the rest.'
      ]
    },
    conversion: {
      n: '04', name: 'Conversion', law: 'Interviews don\u2019t pay you. A signed offer does.',
      verdict: 'Here is the good news hiding in your answers: your CV is working and your aim is close enough to get you into rooms. The hard joints are already fixed. What is leaking is the twenty minutes after the document \u2014 and that is the most learnable part of the whole process.',
      free: {
        text: 'Write your answer to the question that ends most remote interviews \u2014 \u201Chow do you work when nobody is watching?\u201D \u2014 as a description of your system, not a list of adjectives. Four sentences, tonight, before anyone asks.',
        href: '../blog.html', label: 'Read the interview guides'
      },
      paid: {
        text: 'Interview rehearsal and salary negotiation sit inside Mastery Training, and go furthest in the Inner Circle residency \u2014 where the room prepares with you in real time. One improved answer to the money question often outweighs the entire fee.',
        href: '../innercircle/', label: 'See the Inner Circle'
      },
      tonight: [
        'Send the follow-up you did not send. Restate their problem, name what you would do about it in month one, thank them without grovelling.',
        'Never answer the salary question first. Ask what range they budgeted \u2014 they always have one.',
        'Plan what you would deliver in week one of the job. People who have planned it interview differently from people hoping to survive it.'
      ]
    }
  };

  /* ── state ───────────────────────────────────────────────── */
  const scores: Record<JointKey, number> = { supply: 0, representation: 0, aim: 0, conversion: 0 };
  const chosen: string[] = [];
  let step = 0;

  const stepEl = document.getElementById('dxStep');
  const barEl = document.getElementById('dxBar');
  const resultEl = document.getElementById('dxResult');
  const boxEl = document.getElementById('dxBox');
  if (!stepEl || !barEl || !resultEl || !boxEl) return;

  function esc(s: string): string {
    return s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[m]);
  }

  function renderStep(): void {
    const q = QUESTIONS[step];
    barEl!.style.width = Math.round((step / QUESTIONS.length) * 100) + '%';

    stepEl!.innerHTML =
      '<div class="dx-count">Question ' + (step + 1) + ' of ' + QUESTIONS.length + '</div>' +
      '<h3 class="dx-q">' + esc(q.q) + '</h3>' +
      '<p class="dx-why">' + esc(q.why) + '</p>' +
      '<div class="dx-answers">' +
      q.answers.map((a, i) =>
        '<button type="button" class="dx-a" data-i="' + i + '">' +
        '<span class="dx-a-t">' + esc(a.label) + '</span>' +
        (a.note ? '<span class="dx-a-n">' + esc(a.note) + '</span>' : '') +
        '<span class="dx-a-x">\u2192</span></button>'
      ).join('') +
      '</div>' +
      (step > 0 ? '<button type="button" class="dx-back" id="dxBack">\u2190 Previous question</button>' : '');

    Array.from(stepEl!.querySelectorAll<HTMLButtonElement>('.dx-a')).forEach(btn => {
      btn.addEventListener('click', () => {
        const a = QUESTIONS[step].answers[Number(btn.dataset.i)];
        (Object.keys(a.weight) as JointKey[]).forEach(k => {
          scores[k] += a.weight[k] || 0;
        });
        chosen[step] = a.label;
        step++;
        if (step >= QUESTIONS.length) { renderResult(); }
        else { renderStep(); stepEl!.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      });
    });

    const back = document.getElementById('dxBack');
    if (back) {
      back.addEventListener('click', () => {
        step--;
        const prev = QUESTIONS[step].answers.find(a => a.label === chosen[step]);
        if (prev) {
          (Object.keys(prev.weight) as JointKey[]).forEach(k => {
            scores[k] -= prev.weight[k] || 0;
          });
        }
        renderStep();
      });
    }
  }

  function winner(): JointKey {
    // highest score; ties resolve UPSTREAM — an early leak makes
    // every later reading unreliable, so fix the earliest one first.
    let best: JointKey = 'supply';
    let bestScore = -1;
    ORDER.forEach(k => {
      if (scores[k] > bestScore) { bestScore = scores[k]; best = k; }
    });
    return best;
  }

  function renderResult(): void {
    barEl!.style.width = '100%';
    const key = winner();
    const j = JOINTS[key];

    const total = ORDER.reduce((s, k) => s + scores[k], 0) || 1;
    const bars = ORDER.map(k => {
      const pct = Math.round((scores[k] / total) * 100);
      return '<div class="dxs-row' + (k === key ? ' is-win' : '') + '">' +
        '<span class="dxs-l">' + JOINTS[k].name + '</span>' +
        '<span class="dxs-t"><span style="width:' + pct + '%"></span></span>' +
        '<span class="dxs-p">' + pct + '%</span></div>';
    }).join('');

    const waHref = (window.ERJ_CAPTURE && window.ERJ_CAPTURE.waLink)
      ? window.ERJ_CAPTURE.waLink('diagnose', {
          joint: j.name, law: j.law, answer: chosen.filter(Boolean).join(' | ')
        })
      : 'https://wa.me/' + ((window.ERJ_CONFIG && window.ERJ_CONFIG.whatsapp) || '2348032925957');

    boxEl!.setAttribute('hidden', '');
    resultEl!.removeAttribute('hidden');
    resultEl!.innerHTML =
      '<div class="dxr-head">' +
        '<div class="dxr-n">' + j.n + '</div>' +
        '<div>' +
          '<div class="section-label"><span class="mark"></span>Your leak</div>' +
          '<h2 class="dxr-name">' + j.name + '</h2>' +
          '<p class="dxr-law">' + esc(j.law) + '</p>' +
        '</div>' +
      '</div>' +

      '<p class="dxr-verdict">' + esc(j.verdict) + '</p>' +

      '<div class="dxr-scores"><div class="dxs-k">How your answers fell</div>' + bars +
      '<p class="dxs-note">A second point close behind is normal \u2014 fix the top one first anyway. Repairing all four at once is how most people finish none.</p></div>' +

      '<div class="dxr-tonight"><div class="dxr-k">Three things you can do tonight, free</div><ol>' +
        j.tonight.map(x => '<li>' + esc(x) + '</li>').join('') +
      '</ol></div>' +

      '<div class="dxr-doors">' +
        '<div class="dxr-door"><div class="dxr-door-k">Free, start now</div><p>' + esc(j.free.text) + '</p>' +
          '<a class="btn-more" href="' + j.free.href + '"' + (j.free.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + esc(j.free.label) + ' \u2192</a></div>' +
        '<div class="dxr-door"><div class="dxr-door-k">When you want it carried</div><p>' + esc(j.paid.text) + '</p>' +
          '<a class="btn-more" href="' + j.paid.href + '">' + esc(j.paid.label) + ' \u2192</a></div>' +
      '</div>' +

      '<div class="cap-read dxr-send">' +
        '<div class="cr-k">Want the fix list for this one?</div>' +
        '<p>Send me your result and I will reply personally with the shortest route out of it. ' +
        'No form, no email address \u2014 the message is already written, you just tap send.</p>' +
        '<div class="cr-actions">' +
          '<a class="cap-btn" href="' + waHref + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>' +
          '<span>Send my result and get the fix list</span></a>' +
          '<button type="button" class="cap-btn ghost" id="dxRedo">Start again</button>' +
        '</div>' +
      '</div>';

    resultEl!.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const redo = document.getElementById('dxRedo');
    if (redo) {
      redo.addEventListener('click', () => {
        ORDER.forEach(k => { scores[k] = 0; });
        chosen.length = 0;
        step = 0;
        resultEl!.setAttribute('hidden', '');
        resultEl!.innerHTML = '';
        boxEl!.removeAttribute('hidden');
        renderStep();
        boxEl!.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  renderStep();
})();
