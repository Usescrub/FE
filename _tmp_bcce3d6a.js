/* global React, Ic, Underline, Spark */
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

/* ---- applicant dataset (switchable by diaspora region) ---- */
const APPLICANTS = {
  UK:  { flag: '\uD83C\uDDEC\uD83C\uDDE7', city: 'London, UK', name: 'Adaeze Okafor', initials: 'AO', purpose: 'Verifying for a \u20A645M back-home mortgage', score: 742, band: 'Low Risk', bandClass: 'chip-ok', ontime: 96, exposure: '\u20A68.2M', dti: 28, income: '\u20A61.85M', obligations: '\u20A6520k', afford: 'Strong' },
  US:  { flag: '\uD83C\uDDFA\uD83C\uDDF8', city: 'Houston, USA', name: 'Tunde Bello', initials: 'TB', purpose: 'Verifying for a \u20A612M SME facility', score: 689, band: 'Moderate', bandClass: 'chip-warn', ontime: 91, exposure: '\u20A614.6M', dti: 37, income: '\u20A62.40M', obligations: '\u20A6890k', afford: 'Adequate' },
  UAE: { flag: '\uD83C\uDDE6\uD83C\uDDEA', city: 'Dubai, UAE', name: 'Ngozi Eze', initials: 'NE', purpose: 'Verifying for an auto-loan guarantee', score: 771, band: 'Low Risk', bandClass: 'chip-ok', ontime: 99, exposure: '\u20A63.4M', dti: 19, income: '\u20A62.10M', obligations: '\u20A6400k', afford: 'Excellent' },
};
const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const HISTORY = {
  UK:  ['ok','ok','ok','ok','ok','ok','late','ok','ok','ok','ok','ok'],
  US:  ['ok','ok','late','ok','ok','ok','ok','late','ok','ok','ok','ok'],
  UAE: ['ok','ok','ok','ok','ok','ok','ok','ok','ok','ok','ok','ok'],
};
const FACILITIES = {
  UK: [
    { ic: 'wallet', n: 'GTBank Personal Loan', m: 'Opened Mar 2023 \u00b7 36mo', b: '\u20A63.1M', s: 'On track', chip: 'chip-ok', cl: 'Current' },
    { ic: 'wallet', n: 'Carbon Credit Line', m: 'Revolving \u00b7 \u20A6500k limit', b: '\u20A6480k', s: 'Current', chip: 'chip-ok', cl: 'Current' },
    { ic: 'wallet', n: 'Renmoney Installment', m: 'Opened Jan 2024 \u00b7 24mo', b: '\u20A64.6M', s: '1 late payment', chip: 'chip-warn', cl: 'Watch' },
    { ic: 'wallet', n: 'FairMoney Loan', m: 'Closed Dec 2023', b: '\u20A60', s: 'Settled in full', chip: 'chip-ok', cl: 'Closed' },
  ],
  US: [
    { ic: 'wallet', n: 'Access Bank SME Loan', m: 'Opened Jun 2022 \u00b7 48mo', b: '\u20A69.2M', s: '2 late payments', chip: 'chip-warn', cl: 'Watch' },
    { ic: 'wallet', n: 'Moniepoint Facility', m: 'Revolving \u00b7 \u20A66M limit', b: '\u20A65.4M', s: 'Current', chip: 'chip-ok', cl: 'Current' },
    { ic: 'wallet', n: 'Kuda Overdraft', m: 'Closed Aug 2023', b: '\u20A60', s: 'Settled in full', chip: 'chip-ok', cl: 'Closed' },
  ],
  UAE: [
    { ic: 'wallet', n: 'Zenith Auto Loan', m: 'Opened Feb 2024 \u00b7 36mo', b: '\u20A63.4M', s: 'On track', chip: 'chip-ok', cl: 'Current' },
    { ic: 'wallet', n: 'PiggyVest Credit', m: 'Revolving \u00b7 \u20A61M limit', b: '\u20A60', s: 'Never delinquent', chip: 'chip-ok', cl: 'Current' },
  ],
};

/* ---- animated score gauge ---- */
function Gauge({ score, color }) {
  const max = 850, min = 300;
  const r = 78, C = 2 * Math.PI * r;
  const arc = 0.75; // 270deg
  const dash = C * arc;
  return (
    <div className="gauge">
      <svg viewBox="0 0 180 180" style={{ transform: 'rotate(135deg)' }}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--panel-2)" strokeWidth="13" strokeLinecap="round" strokeDasharray={`${dash} ${C}`} />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round"
          strokeDasharray={`${dash * (score - min) / (max - min)} ${C}`} style={{ transition: 'stroke-dasharray .9s ease' }} />
      </svg>
      <div className="val"><div className="n">{score}</div><div className="o">out of 850</div></div>
    </div>
  );
}

/* ---- sample report ---- */
function SampleReport() {
  const [region, setRegion] = useStateC('UK');
  const [tab, setTab] = useStateC('Overview');
  const a = APPLICANTS[region];
  const scoreColor = a.band === 'Low Risk' ? 'var(--good)' : a.band === 'Moderate' ? 'var(--warn)' : 'var(--good)';
  const tabs = ['Overview', 'Loan History', 'Active Facilities', 'Affordability'];

  return (
    <div className="report-card">
      <div className="report-head">
        <div className="ava">{a.initials}</div>
        <div className="who" style={{ flex: 1 }}>
          <h4>{a.name} <span style={{ fontSize: 16 }}>{a.flag}</span></h4>
          <div className="meta">
            <span>{a.city}</span>
            <span style={{ opacity: .4 }}>•</span>
            <span>{a.purpose}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="verified"><Ic.check /> BVN Verified</span>
          <span className="verified"><Ic.check /> ID Matched</span>
        </div>
      </div>

      {/* region switcher */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 24px 0', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)', marginRight: 4 }}>Applicant in:</span>
        {Object.keys(APPLICANTS).map((k) => (
          <button key={k} className="rtab" style={region === k ? { background: 'var(--panel-2)', color: 'var(--text)', border: '1px solid var(--line-2)' } : {}}
            onClick={() => setRegion(k)}>{APPLICANTS[k].flag} {k}</button>
        ))}
      </div>

      <div className="report-body">
        <div className="report-score">
          <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>Scrub Score</div>
          <Gauge key={region} score={a.score} color={scoreColor} />
          <span className={`risk-tag ${a.bandClass}`}>{Ic.shield({ width: 16, height: 16 })} {a.band}</span>
          <p className="score-foot">Composite of repayment behavior, exposure, facility mix and affordability — fraud-screened by Scrub.</p>
        </div>

        <div className="report-detail">
          <div className="rtabs">
            {tabs.map((t) => <button key={t} className={`rtab ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
          </div>

          <div className="rpanel fade" key={tab + region}>
            {tab === 'Overview' && (
              <div>
                <div className="metric-row">
                  <div className="metric"><div className="mlbl">On-time repayment</div><div className="mval" style={{ color: 'var(--good)' }}>{a.ontime}%</div><div className="msub muted">last 24 months</div></div>
                  <div className="metric"><div className="mlbl">Total exposure</div><div className="mval">{a.exposure}</div><div className="msub muted">across active facilities</div></div>
                  <div className="metric"><div className="mlbl">Debt-to-income</div><div className="mval">{a.dti}%</div><div className="msub" style={{ color: a.dti < 35 ? 'var(--good)' : 'var(--warn)' }}>{a.dti < 35 ? 'Healthy' : 'Elevated'}</div></div>
                </div>
                <div className="metric" style={{ marginTop: 12 }}>
                  <div className="mlbl">Score breakdown</div>
                  {[['Repayment history', a.ontime], ['Affordability headroom', 100 - a.dti], ['Facility mix & age', 74], ['Identity & fraud signal', 99]].map(([l, v]) => (
                    <div key={l} style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}><span className="muted">{l}</span><strong>{v}%</strong></div>
                      <div className="bar"><i style={{ width: v + '%' }}></i></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Loan History' && (
              <div>
                <p className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>Month-by-month repayment status across all reporting facilities, last 12 months.</p>
                <div className="timeline">
                  {HISTORY[region].map((s, i) => (
                    <div key={i} className={`tl-cell ${s}`} title={s === 'ok' ? 'On time' : 'Late'}>{MONTHS[i]}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 18, marginTop: 16, fontSize: 12 }}>
                  <span className="muted"><b style={{ color: 'var(--good)' }}>●</b> On time</span>
                  <span className="muted"><b style={{ color: 'var(--warn)' }}>●</b> Late (1–30d)</span>
                  <span className="muted"><b style={{ color: 'var(--bad)' }}>●</b> Missed</span>
                </div>
                <div className="metric" style={{ marginTop: 18 }}>
                  <div className="mlbl">Repayment summary</div>
                  <div style={{ display: 'flex', gap: 28, marginTop: 8, flexWrap: 'wrap' }}>
                    <div><div className="mval" style={{ fontSize: 18 }}>{HISTORY[region].filter(s => s === 'ok').length}/12</div><div className="msub muted">months on-time</div></div>
                    <div><div className="mval" style={{ fontSize: 18 }}>0</div><div className="msub muted">defaults on record</div></div>
                    <div><div className="mval" style={{ fontSize: 18 }}>3.2 yrs</div><div className="msub muted">credit history depth</div></div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'Active Facilities' && (
              <div>
                {FACILITIES[region].map((f, i) => (
                  <div className="facility" key={i}>
                    <span className="fl">{Ic[f.ic]()}</span>
                    <div><div className="fname">{f.n}</div><div className="fmeta">{f.m}</div></div>
                    <div className="fbal">
                      <div className="b">{f.b}</div>
                      <span className={`status-chip ${f.chip}`}>{f.s}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Affordability' && (
              <div>
                <div className="metric-row">
                  <div className="metric"><div className="mlbl">Verified monthly income</div><div className="mval">{a.income}</div><div className="msub muted">equiv., diaspora-adjusted</div></div>
                  <div className="metric"><div className="mlbl">Monthly obligations</div><div className="mval">{a.obligations}</div><div className="msub muted">existing facilities</div></div>
                  <div className="metric"><div className="mlbl">Affordability</div><div className="mval" style={{ color: a.afford === 'Adequate' ? 'var(--warn)' : 'var(--good)' }}>{a.afford}</div><div className="msub muted">for new credit</div></div>
                </div>
                <div className="metric" style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span className="muted">Debt-to-income ratio</span><strong>{a.dti}% used · {100 - a.dti}% headroom</strong></div>
                  <div className="bar" style={{ height: 12, marginTop: 10 }}><i style={{ width: a.dti + '%', background: a.dti < 35 ? 'var(--good)' : 'var(--warn)' }}></i></div>
                  <p className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>Lenders typically approve new facilities when DTI stays below 40%. This applicant has room for additional structured credit.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- flagship section ---- */
function DiasporaSection() {
  return (
    <section className="section" id="credit" style={{ background: 'var(--bg-2)' }}>
      <div className="shell">
        <div style={{ maxWidth: 720 }}>
          <p className="eyebrow">New · For Lenders & Banks</p>
          <h2>Diaspora <span className="hl">Credit Reports<Underline /></span> <Spark /></h2>
          <p className="sub" style={{ margin: '22px 0 0', color: 'var(--text-2)' }}>
            Millions of Nigerians abroad want loans, mortgages and facilities back home — but they’re invisible to traditional underwriting. Scrub turns a BVN into a verified, fraud-screened credit profile so you can say yes with confidence.
          </p>
        </div>
        <div style={{ marginTop: 44 }}><SampleReport /></div>
      </div>
    </section>
  );
}

/* ---- how it works ---- */
function HowItWorks() {
  const steps = [
    { n: 'STEP 01', ic: 'bvn', t: 'Submit the applicant', d: 'Enter the applicant\u2019s BVN and basic details \u2014 from your dashboard or directly through the Scrub API.' },
    { n: 'STEP 02', ic: 'search', t: 'Scrub verifies & scores', d: 'We match identity, pull licensed bureau data, run fraud models and compute the Scrub Score in seconds.' },
    { n: 'STEP 03', ic: 'doc', t: 'Decision with confidence', d: 'Receive a lender-grade report with repayment history, facilities and affordability to back every approval.' },
  ];
  return (
    <section className="section" id="how">
      <div className="shell">
        <div style={{ maxWidth: 640 }}>
          <p className="eyebrow">How it works</p>
          <h2>From BVN to decision in <span className="hl">three steps<Underline /></span></h2>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span className="fic" style={{ width: 42, height: 42, color: 'var(--accent)', background: 'var(--accent-soft)', border: 'none', borderRadius: 11, display: 'grid', placeItems: 'center' }}>{Ic[s.ic]()}</span>
                <span className="num">{s.n}</span>
              </div>
              <h4>{s.t}</h4><p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- what's in a report ---- */
function WhatsInReport() {
  const cards = [
    { ic: 'gauge', t: 'The Scrub Score', d: 'A single 300\u2013850 creditworthiness score, fraud-screened and explainable \u2014 not a self-reported guess.' },
    { ic: 'history', t: 'Loan & repayment history', d: 'Month-by-month repayment behavior across every reporting facility, with defaults and depth of history.' },
    { ic: 'wallet', t: 'Active facilities & debts', d: 'A live view of open loans, credit lines and balances across Nigerian lenders and fintechs.' },
    { ic: 'scale', t: 'Affordability assessment', d: 'Diaspora-adjusted income vs. obligations and debt-to-income headroom for new credit.' },
    { ic: 'bvn', t: 'Identity verification', d: 'BVN match, government ID and liveness checks so you know the applicant is who they claim to be.' },
    { ic: 'api', t: 'API or dashboard', d: 'Pull a full report inside your underwriting flow, or review it in the Scrub dashboard \u2014 your call.' },
  ];
  return (
    <section className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="shell">
        <div style={{ maxWidth: 640 }}>
          <p className="eyebrow">Inside every report</p>
          <h2>Everything underwriting <span className="hl">needs<Underline /></span></h2>
        </div>
        <div className="cards-3">
          {cards.map((c) => (
            <div className="card" key={c.t}>
              <span className="cic">{Ic[c.ic]()}</span>
              <h4>{c.t}</h4><p>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- trust / coverage band ---- */
function TrustBand() {
  const stats = [
    { n: '17M+', l: 'Nigerians in the diaspora' },
    { n: '<8s', l: 'Avg. report turnaround' },
    { n: '98%', l: 'Identity match accuracy' },
    { n: '24/7', l: 'API availability' },
  ];
  const regions = [
    ['\uD83C\uDDEC\uD83C\uDDE7', 'United Kingdom'], ['\uD83C\uDDFA\uD83C\uDDF8', 'United States'], ['\uD83C\uDDE8\uD83C\uDDE6', 'Canada'],
    ['\uD83C\uDDE6\uD83C\uDDEA', 'UAE'], ['\uD83C\uDDE9\uD83C\uDDEA', 'Germany'], ['\uD83C\uDDF8\uD83C\uDDE6', 'Saudi Arabia'], ['\uD83C\uDDFF\uD83C\uDDE6', 'South Africa'],
  ];
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="shell">
        <div className="trust-band">
          <div className="stat-row">
            {stats.map((s) => (
              <div className="stat" key={s.l}><div className="n"><em>{s.n.charAt(0) === '<' ? s.n : s.n}</em></div><div className="l">{s.l}</div></div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 34, paddingTop: 28 }}>
            <p className="muted" style={{ fontSize: 13.5, marginBottom: 4 }}>Verifying applicants from anywhere your diaspora customers live</p>
            <div className="flags">
              {regions.map(([f, n]) => <span className="flag-chip" key={n}><span className="fg">{f}</span> {n}</span>)}
              <span className="flag-chip" style={{ color: 'var(--text-2)' }}>+ global</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { SampleReport, DiasporaSection, HowItWorks, WhatsInReport, TrustBand });
