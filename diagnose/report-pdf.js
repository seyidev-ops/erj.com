/* Everything Remote Job · client-side diagnostic PDF export.
   No third-party library and no data leaves the browser. */
(function () {
  'use strict';

  function ascii(value) {
    return String(value == null ? '' : value)
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/\u00A0/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '');
  }

  function pdfEsc(value) {
    return ascii(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  function wrap(text, max) {
    var words = ascii(text).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    var lines = [], line = '';
    words.forEach(function (word) {
      var next = line ? line + ' ' + word : word;
      if (next.length > max && line) { lines.push(line); line = word; }
      else line = next;
    });
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  function buildPages(report) {
    var pages = [[]];
    var page = pages[0];
    var y = 790;
    var bottom = 58;

    function newPage() {
      pages.push([]); page = pages[pages.length - 1]; y = 790;
      header(false);
    }
    function ensure(height) { if (y - height < bottom) newPage(); }
    function line(text, opts) {
      opts = opts || {};
      var size = opts.size || 10;
      var leading = opts.leading || (size + 4);
      var max = opts.max || 84;
      var lines = wrap(text, max);
      ensure(lines.length * leading + (opts.after || 0));
      lines.forEach(function (t) {
        page.push({ type: 'text', text: t, x: opts.x || 54, y: y, size: size, bold: !!opts.bold, orange: !!opts.orange });
        y -= leading;
      });
      y -= opts.after || 0;
    }
    function rule() {
      ensure(14);
      page.push({ type: 'rule', y: y - 2 });
      y -= 18;
    }
    function header(first) {
      page.push({ type: 'brand', y: 806 });
      if (!first) {
        page.push({ type: 'text', text: 'JOB SEARCH DIAGNOSTIC REPORT - continued', x: 54, y: 776, size: 8, bold: true, orange: true });
        y = 752;
      }
    }

    header(true);
    line('JOB SEARCH DIAGNOSTIC REPORT', { size: 19, bold: true, max: 50, after: 4 });
    line('Find your leak. Fix the earliest failing point first.', { size: 10, orange: true, max: 70, after: 12 });
    rule();
    line('PRIMARY LEAK', { size: 8, bold: true, orange: true, after: 3 });
    line((report.number ? report.number + ' - ' : '') + report.joint, { size: 22, bold: true, max: 40, after: 2 });
    line(report.law, { size: 11, bold: true, max: 78, after: 10 });
    line(report.verdict, { size: 10, max: 88, after: 12 });

    line('HOW YOUR ANSWERS FELL', { size: 8, bold: true, orange: true, after: 5 });
    (report.scores || []).forEach(function (s) {
      line(s.name + ': ' + s.pct + '%', { size: 10, bold: s.name === report.joint, max: 40, after: 1 });
    });
    line('A close second is normal. Fix the earliest leak first; an upstream failure can make later readings unreliable.', { size: 8, max: 95, after: 12 });

    line('ONE USEFUL STEP YOU CAN TAKE NOW', { size: 8, bold: true, orange: true, after: 5 });
    line((report.actions && report.actions[0]) || 'Review the result and fix the earliest failing point before increasing application volume.', { size: 10, max: 88, after: 12 });

    line('GET A FREE HUMAN REVIEW', { size: 8, bold: true, orange: true, after: 5 });
    line('The quiz identifies the joint. A human review can tell you what to fix first in your actual search.', { size: 10, max: 88, after: 5 });
    line('Message ERJ with the word AUDIT and include: target role, applications in the last 30 days, interviews in the last 30 days, and your CV or LinkedIn profile.', { size: 10, bold: true, max: 88, after: 12 });

    rule();
    line('Everything Remote Job', { size: 11, bold: true, after: 1 });
    line('Work Beyond Borders.', { size: 9, orange: true, after: 1 });
    line('WhatsApp: +234 803 292 5957  |  everythingremotejob.com/diagnose/', { size: 8, max: 100, after: 2 });
    line('Generated: ' + (report.date || new Date().toLocaleDateString('en-GB')), { size: 8, max: 70 });
    return pages;
  }

  function contentFor(items, pageNo, total) {
    var c = [];
    items.forEach(function (it) {
      if (it.type === 'brand') {
        c.push('1 0.341 0.133 rg 54 ' + (it.y - 2) + ' 34 5 re f');
        c.push('0 0 0 rg BT /F2 10 Tf 96 ' + it.y + ' Td (EVERYTHING REMOTE JOB) Tj ET');
        c.push('0.38 0.38 0.38 rg BT /F1 7 Tf 96 ' + (it.y - 12) + ' Td (WORK BEYOND BORDERS.) Tj ET');
      } else if (it.type === 'rule') {
        c.push('0.86 0.86 0.86 RG 0.8 w 54 ' + it.y + ' m 541 ' + it.y + ' l S');
      } else if (it.type === 'text') {
        c.push((it.orange ? '1 0.341 0.133' : '0.08 0.07 0.055') + ' rg BT /' + (it.bold ? 'F2' : 'F1') + ' ' + it.size + ' Tf ' + it.x + ' ' + it.y + ' Td (' + pdfEsc(it.text) + ') Tj ET');
      }
    });
    c.push('0.45 0.45 0.45 rg BT /F1 7 Tf 500 30 Td (' + pageNo + ' / ' + total + ') Tj ET');
    return c.join('\n') + '\n';
  }

  function makePdf(report) {
    var pages = buildPages(report);
    var objects = [];
    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

    var kids = [];
    var next = 5;
    pages.forEach(function (items, idx) {
      var pageObj = next++, contentObj = next++;
      kids.push(pageObj + ' 0 R');
      var stream = contentFor(items, idx + 1, pages.length);
      objects[pageObj] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + contentObj + ' 0 R >>';
      objects[contentObj] = '<< /Length ' + stream.length + ' >>\nstream\n' + stream + 'endstream';
    });
    objects[2] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + kids.length + ' >>';

    var pdf = '%PDF-1.4\n%ERJ\n';
    var offsets = [0];
    for (var i = 1; i < objects.length; i++) {
      offsets[i] = pdf.length;
      pdf += i + ' 0 obj\n' + objects[i] + '\nendobj\n';
    }
    var xref = pdf.length;
    pdf += 'xref\n0 ' + objects.length + '\n';
    pdf += '0000000000 65535 f \n';
    for (var j = 1; j < objects.length; j++) {
      pdf += String(offsets[j]).padStart(10, '0') + ' 00000 n \n';
    }
    pdf += 'trailer\n<< /Size ' + objects.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
    return pdf;
  }

  function download(report) {
    var pdf = makePdf(report);
    var blob = new Blob([pdf], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ERJ-Job-Search-Diagnostic-' + ascii(report.joint || 'Report').replace(/\s+/g, '-') + '.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); }, 1200);
  }

  window.ERJDiagnosticPDF = { download: download, makePdf: makePdf };
})();
