export default function Analytics({ modules }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
      <div className="topbar" style={{ borderBottom: 'none' }}>
        <div className="topbar-title-row">
          <div className="module-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19V10M11 19V5M18 19v-7" />
            </svg>
            <div>
              <h1>Analytics</h1>
              <p>Cross-module trends across your saved search scope</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v13m0 0-4-4m4 4 4-4M5 21h14" />
              </svg>
              Export dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="analytics-wrap">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Active pipeline assets</div>
            <div className="kpi-value">{modules.drugs.count}</div>
            <div className="kpi-delta up">▲ 4.1% vs Q1</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Trials recruiting</div>
            <div className="kpi-value">{modules.trials.count}</div>
            <div className="kpi-delta up">▲ 1.8% vs Q1</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Assets facing LOE by 2028</div>
            <div className="kpi-value">312</div>
            <div className="kpi-delta down">▲ 12 new flags</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg. US/Intl price ratio</div>
            <div className="kpi-value">2.74×</div>
            <div className="kpi-delta down">▲ 0.06 vs Q1</div>
          </div>
        </div>

        <div className="chart-grid">
          <div className="chart-card">
            <h3>Sales forecast trend — tracked portfolio</h3>
            <p className="sub">Aggregate forecast, $M, across 6 lead assets</p>
            <svg viewBox="0 0 520 200" width="100%" height="200">
              <line x1="40" y1="10" x2="40" y2="170" stroke="#E1E6EC" />
              <line x1="40" y1="170" x2="500" y2="170" stroke="#E1E6EC" />
              <polyline points="40,150 130,132 220,108 310,80 400,52 490,26" fill="none" stroke="#0C7C82" strokeWidth="2.5" />
              <polyline
                points="40,160 130,150 220,140 310,128 400,118 490,108"
                fill="none"
                stroke="#B3701F"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
              <g fontFamily="IBM Plex Mono" fontSize="10" fill="#93A1B3">
                <text x="35" y="185">2026</text>
                <text x="125" y="185">2027</text>
                <text x="215" y="185">2028</text>
                <text x="305" y="185">2029</text>
                <text x="395" y="185">2030</text>
                <text x="480" y="185">2031</text>
              </g>
            </svg>
            <div className="legend">
              <span>
                <i style={{ background: '#0C7C82' }}></i>Base case
              </span>
              <span>
                <i style={{ background: '#B3701F' }}></i>Cost-of-therapy adj. case
              </span>
            </div>
          </div>

          <div className="chart-card">
            <h3>Trials by phase</h3>
            <p className="sub">Share of active trials, tracked portfolio</p>
            <svg viewBox="0 0 220 200" width="100%" height="200">
              <g transform="translate(110,100)">
                <circle r="70" fill="none" stroke="#EEF1F5" strokeWidth="24" />
                <circle r="70" fill="none" stroke="#0C7C82" strokeWidth="24" strokeDasharray="110 330" transform="rotate(-90)" />
                <circle
                  r="70"
                  fill="none"
                  stroke="#3E5B99"
                  strokeWidth="24"
                  strokeDasharray="130 330"
                  strokeDashoffset="-110"
                  transform="rotate(-90)"
                />
                <circle
                  r="70"
                  fill="none"
                  stroke="#B3701F"
                  strokeWidth="24"
                  strokeDasharray="60 330"
                  strokeDashoffset="-240"
                  transform="rotate(-90)"
                />
                <circle
                  r="70"
                  fill="none"
                  stroke="#AE3A4B"
                  strokeWidth="24"
                  strokeDasharray="30 330"
                  strokeDashoffset="-300"
                  transform="rotate(-90)"
                />
                <text textAnchor="middle" y="6" fontFamily="IBM Plex Mono" fontSize="18" fontWeight="700" fill="#0E1726">
                  {modules.trials.count}
                </text>
              </g>
            </svg>
            <div className="legend">
              <span>
                <i style={{ background: '#0C7C82' }}></i>Phase III (33%)
              </span>
              <span>
                <i style={{ background: '#3E5B99' }}></i>Phase II (39%)
              </span>
              <span>
                <i style={{ background: '#B3701F' }}></i>Phase I (18%)
              </span>
              <span>
                <i style={{ background: '#AE3A4B' }}></i>Phase IV (9%)
              </span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Top companies by pipeline value</h3>
          <p className="sub">Estimated risk-adjusted NPV of active pipeline, $B</p>
          <svg viewBox="0 0 560 190" width="100%" height="190">
            <g fontFamily="IBM Plex Sans" fontSize="12" fill="#0E1726">
              <text x="0" y="20">Meridian Biotherapeutics</text>
              <rect x="230" y="8" width="260" height="16" rx="3" fill="#0C7C82" />
              <text x="500" y="20" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="11">$18.4B</text>

              <text x="0" y="52">Solara Pharma</text>
              <rect x="230" y="40" width="205" height="16" rx="3" fill="#0C7C82" />
              <text x="445" y="52" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="11">$14.6B</text>

              <text x="0" y="84">Cascadia Therapeutics</text>
              <rect x="230" y="72" width="170" height="16" rx="3" fill="#0C7C82" />
              <text x="410" y="84" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="11">$12.1B</text>

              <text x="0" y="116">NovaGene Sciences</text>
              <rect x="230" y="104" width="140" height="16" rx="3" fill="#0C7C82" />
              <text x="380" y="116" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="11">$9.9B</text>

              <text x="0" y="148">Ondine Biosciences</text>
              <rect x="230" y="136" width="110" height="16" rx="3" fill="#0C7C82" />
              <text x="350" y="148" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="11">$7.8B</text>

              <text x="0" y="180">Arcadia Metabolics</text>
              <rect x="230" y="168" width="95" height="16" rx="3" fill="#0C7C82" />
              <text x="335" y="180" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="11">$6.7B</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
