(function () {
  'use strict';

  const APPLICANTS = {
    UK: { flag: '\uD83C\uDDEC\uD83C\uDDE7', city: 'London, UK', name: 'Adaeze Okafor', initials: 'AO', purpose: 'Verifying for a \u20A645M back-home mortgage', score: 742, band: 'Low Risk', bandClass: 'chip-ok', ontime: 96, exposure: '\u20A68.2M', dti: 28, income: '\u20A61.85M', obligations: '\u20A6520k', afford: 'Strong' },
    US: { flag: '\uD83C\uDDFA\uD83C\uDDF8', city: 'Houston, USA', name: 'Tunde Bello', initials: 'TB', purpose: 'Verifying for a \u20A612M SME facility', score: 689, band: 'Moderate', bandClass: 'chip-warn', ontime: 91, exposure: '\u20A614.6M', dti: 37, income: '\u20A62.40M', obligations: '\u20A6890k', afford: 'Adequate' },
    UAE: { flag: '\uD83C\uDDE6\uD83C\uDDEA', city: 'Dubai, UAE', name: 'Ngozi Eze', initials: 'NE', purpose: 'Verifying for an auto-loan guarantee', score: 771, band: 'Low Risk', bandClass: 'chip-ok', ontime: 99, exposure: '\u20A63.4M', dti: 19, income: '\u20A62.10M', obligations: '\u20A6400k', afford: 'Excellent' },
  };
  const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const HISTORY = {
    UK: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'late', 'ok', 'ok', 'ok', 'ok', 'ok'],
    US: ['ok', 'ok', 'late', 'ok', 'ok', 'ok', 'ok', 'late', 'ok', 'ok', 'ok', 'ok'],
    UAE: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'],
  };
  const FACILITIES = {
    UK: [
      { n: 'GTBank Personal Loan', m: 'Opened Mar 2023 \u00b7 36mo', b: '\u20A63.1M', s: 'On track', chip: 'chip-ok' },
      { n: 'Carbon Credit Line', m: 'Revolving \u00b7 \u20A6500k limit', b: '\u20A6480k', s: 'Current', chip: 'chip-ok' },
      { n: 'Renmoney Installment', m: 'Opened Jan 2024 \u00b7 24mo', b: '\u20A64.6M', s: '1 late payment', chip: 'chip-warn' },
      { n: 'FairMoney Loan', m: 'Closed Dec 2023', b: '\u20A60', s: 'Settled in full', chip: 'chip-ok' },
    ],
    US: [
      { n: 'Access Bank SME Loan', m: 'Opened Jun 2022 \u00b7 48mo', b: '\u20A69.2M', s: '2 late payments', chip: 'chip-warn' },
      { n: 'Moniepoint Facility', m: 'Revolving \u00b7 \u20A66M limit', b: '\u20A65.4M', s: 'Current', chip: 'chip-ok' },
      { n: 'Kuda Overdraft', m: 'Closed Aug 2023', b: '\u20A60', s: 'Settled in full', chip: 'chip-ok' },
    ],
    UAE: [
      { n: 'Zenith Auto Loan', m: 'Opened Feb 2024 \u00b7 36mo', b: '\u20A63.4M', s: 'On track', chip: 'chip-ok' },
      { n: 'PiggyVest Credit', m: 'Revolving \u00b7 \u20A61M limit', b: '\u20A60', s: 'Never delinquent', chip: 'chip-ok' },
    ],
  };

  let reportRegion = 'UK';
  let reportTab = 'Overview';

  function gaugeSvg(score, color) {
    const max = 850, min = 300, r = 78, C = 2 * Math.PI * r, arc = 0.75, dash = C * arc;
    const filled = dash * (score - min) / (max - min);
    return `<div class="gauge">
      <svg viewBox="0 0 180 180" style="transform:rotate(135deg)">
        <circle cx="90" cy="90" r="${r}" fill="none" stroke="var(--panel-2)" stroke-width="13" stroke-linecap="round" stroke-dasharray="${dash} ${C}"/>
        <circle cx="90" cy="90" r="${r}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" stroke-dasharray="${filled} ${C}"/>
      </svg>
      <div class="val"><div class="n">${score}</div><div class="o">out of 850</div></div>
    </div>`;
  }

  function scoreColor(band) {
    return band === 'Moderate' ? 'var(--warn)' : 'var(--good)';
  }

  function renderOverview(a) {
    const rows = [['Repayment history', a.ontime], ['Affordability headroom', 100 - a.dti], ['Facility mix & age', 74], ['Identity & fraud signal', 99]];
    return `<div>
      <div class="metric-row">
        <div class="metric"><div class="mlbl">On-time repayment</div><div class="mval" style="color:var(--good)">${a.ontime}%</div><div class="msub muted">last 24 months</div></div>
        <div class="metric"><div class="mlbl">Total exposure</div><div class="mval">${a.exposure}</div><div class="msub muted">across active facilities</div></div>
        <div class="metric"><div class="mlbl">Debt-to-income</div><div class="mval">${a.dti}%</div><div class="msub" style="color:${a.dti < 35 ? 'var(--good)' : 'var(--warn)'}">${a.dti < 35 ? 'Healthy' : 'Elevated'}</div></div>
      </div>
      <div class="metric" style="margin-top:12px">
        <div class="mlbl">Score breakdown</div>
        ${rows.map(([l, v]) => `<div style="margin-top:12px">
          <div style="display:flex;justify-content:space-between;font-size:12.5px"><span class="muted">${l}</span><strong>${v}%</strong></div>
          <div class="bar"><i style="width:${v}%"></i></div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  function renderHistory(region) {
    const hist = HISTORY[region];
    return `<div>
      <p class="muted" style="font-size:13.5px;margin-bottom:14px">Month-by-month repayment status across all reporting facilities, last 12 months.</p>
      <div class="timeline">${hist.map((s, i) => `<div class="tl-cell ${s}" title="${s === 'ok' ? 'On time' : 'Late'}">${MONTHS[i]}</div>`).join('')}</div>
      <div style="display:flex;gap:18px;margin-top:16px;font-size:12px">
        <span class="muted"><b style="color:var(--good)">\u25cf</b> On time</span>
        <span class="muted"><b style="color:var(--warn)">\u25cf</b> Late (1\u201330d)</span>
        <span class="muted"><b style="color:var(--bad)">\u25cf</b> Missed</span>
      </div>
      <div class="metric" style="margin-top:18px">
        <div class="mlbl">Repayment summary</div>
        <div style="display:flex;gap:28px;margin-top:8px;flex-wrap:wrap">
          <div><div class="mval" style="font-size:18px">${hist.filter((s) => s === 'ok').length}/12</div><div class="msub muted">months on-time</div></div>
          <div><div class="mval" style="font-size:18px">0</div><div class="msub muted">defaults on record</div></div>
          <div><div class="mval" style="font-size:18px">3.2 yrs</div><div class="msub muted">credit history depth</div></div>
        </div>
      </div>
    </div>`;
  }

  function renderFacilities(region) {
    return `<div>${FACILITIES[region].map((f) => `<div class="facility">
      <span class="fl">${iconWallet()}</span>
      <div><div class="fname">${f.n}</div><div class="fmeta">${f.m}</div></div>
      <div class="fbal"><div class="b">${f.b}</div><span class="status-chip ${f.chip}">${f.s}</span></div>
    </div>`).join('')}</div>`;
  }

  function renderAffordability(a) {
    const affordColor = a.afford === 'Adequate' ? 'var(--warn)' : 'var(--good)';
    return `<div>
      <div class="metric-row">
        <div class="metric"><div class="mlbl">Verified monthly income</div><div class="mval">${a.income}</div><div class="msub muted">equiv., diaspora-adjusted</div></div>
        <div class="metric"><div class="mlbl">Monthly obligations</div><div class="mval">${a.obligations}</div><div class="msub muted">existing facilities</div></div>
        <div class="metric"><div class="mlbl">Affordability</div><div class="mval" style="color:${affordColor}">${a.afford}</div><div class="msub muted">for new credit</div></div>
      </div>
      <div class="metric" style="margin-top:12px">
        <div style="display:flex;justify-content:space-between;font-size:13px"><span class="muted">Debt-to-income ratio</span><strong>${a.dti}% used \u00b7 ${100 - a.dti}% headroom</strong></div>
        <div class="bar" style="height:12px;margin-top:10px"><i style="width:${a.dti}%;background:${a.dti < 35 ? 'var(--good)' : 'var(--warn)'}"></i></div>
        <p class="muted" style="font-size:12.5px;margin-top:12px">Lenders typically approve new facilities when DTI stays below 40%. This applicant has room for additional structured credit.</p>
      </div>
    </div>`;
  }

  function renderReportPanel() {
    const a = APPLICANTS[reportRegion];
    const tabs = ['Overview', 'Loan History', 'Active Facilities', 'Affordability'];
    let panel = '';
    if (reportTab === 'Overview') panel = renderOverview(a);
    else if (reportTab === 'Loan History') panel = renderHistory(reportRegion);
    else if (reportTab === 'Active Facilities') panel = renderFacilities(reportRegion);
    else panel = renderAffordability(a);

    return `<div class="report-card" id="sample-report">
      <div class="report-head">
        <div class="ava">${a.initials}</div>
        <div class="who" style="flex:1">
          <h4>${a.name} <span style="font-size:16px">${a.flag}</span></h4>
          <div class="meta"><span>${a.city}</span><span style="opacity:.4">\u2022</span><span>${a.purpose}</span></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span class="verified">${iconCheck()} BVN Verified</span>
          <span class="verified">${iconCheck()} ID Matched</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;padding:14px 24px 0;align-items:center;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--text-3);margin-right:4px">Applicant in:</span>
        ${Object.keys(APPLICANTS).map((k) => `<button type="button" class="rtab region-btn${reportRegion === k ? ' on' : ''}" data-region="${k}">${APPLICANTS[k].flag} ${k}</button>`).join('')}
      </div>
      <div class="report-body">
        <div class="report-score">
          <div style="font-size:12px;color:var(--text-2);font-weight:600;letter-spacing:.08em;text-transform:uppercase">Scrub Score</div>
          ${gaugeSvg(a.score, scoreColor(a.band))}
          <span class="risk-tag ${a.bandClass}">${iconShield()} ${a.band}</span>
          <p class="score-foot">Composite of repayment behavior, exposure, facility mix and affordability \u2014 fraud-screened by Scrub.</p>
        </div>
        <div class="report-detail">
          <div class="rtabs">${tabs.map((t) => `<button type="button" class="rtab tab-btn${reportTab === t ? ' on' : ''}" data-tab="${t}">${t}</button>`).join('')}</div>
          <div class="rpanel">${panel}</div>
        </div>
      </div>
    </div>`;
  }

  function mountReport() {
    const el = document.getElementById('report-mount');
    if (!el) return;
    el.innerHTML = renderReportPanel();
    el.querySelectorAll('.region-btn').forEach((btn) => {
      btn.addEventListener('click', () => { reportRegion = btn.dataset.region; mountReport(); });
    });
    el.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => { reportTab = btn.dataset.tab; mountReport(); });
    });
  }

  function initTheme() {
    const ST = window.ScrubTheme;
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    if (!btn || !ST) return;
    let theme = ST.getSavedTheme(root.getAttribute('data-theme') || 'dark');
    ST.applyTheme(theme);
    btn.addEventListener('click', () => {
      theme = ST.applyTheme(theme === 'dark' ? 'light' : 'dark');
      btn.innerHTML = theme === 'dark' ? iconSun() : iconMoon();
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
    btn.innerHTML = theme === 'dark' ? iconSun() : iconMoon();
  }

  function initFaq() {
    document.querySelectorAll('.faq-item').forEach((item, i) => {
      const q = item.querySelector('.faq-q');
      q.addEventListener('click', () => {
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('open'));
        if (!open) item.classList.add('open');
      });
      if (i === 0) item.classList.add('open');
    });
  }

  function initStatCounters() {
    const els = document.querySelectorAll('.stat-count');
    if (!els.length) return;

    const run = (el) => {
      const target = Number(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = prefix + target + suffix;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    els.forEach((el) => io.observe(el));
  }

  function initReveal() {
    const io = new IntersectionObserver((items) => {
      items.forEach((i) => { if (i.isIntersecting) { i.target.classList.add('in'); io.unobserve(i.target); } });
    }, { threshold: 0.06 });
    document.querySelectorAll('.section').forEach((e) => { e.classList.add('reveal'); io.observe(e); });
  }

  function iconCheck() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function iconShield() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  }
  function iconWallet() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.7"/><circle cx="16.5" cy="14.5" r="1.3" fill="currentColor"/></svg>';
  }
  function iconSun() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5 4 4M20 20l-1-1M19 5l1-1M4 20l1-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  }
  function iconMoon() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFaq();
    initReveal();
    initStatCounters();
    mountReport();
  });
})();
