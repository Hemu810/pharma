// Six compact charts shown inline on Home when "View Analytics" is toggled open.
// These mirror (a subset/variant of) the full Analytics dashboard, sized for a
// quick at-a-glance preview rather than the full-page dashboard experience.
export default function PortfolioAnalytics({ modules }) {
  return (
    <div className="chart-grid-3">
      <div className="chart-card">
        <h3>Sales forecast trend</h3>
        <p className="sub">Aggregate forecast, $M, tracked portfolio</p>
        <svg viewBox="0 0 300 160" width="100%" height="150">
          <line x1="28" y1="8" x2="28" y2="128" stroke="#E1E6EC" />
          <line x1="28" y1="128" x2="284" y2="128" stroke="#E1E6EC" />
          <polyline points="28,112 79,98 130,80 181,60 232,40 283,20" fill="none" stroke="#0C7C82" strokeWidth="2.2" />
          <polyline
            points="28,120 79,112 130,104 181,96 232,88 283,80"
            fill="none"
            stroke="#B3701F"
            strokeWidth="2.2"
            strokeDasharray="4 3"
          />
        </svg>
        <div className="legend">
          <span>
            <i style={{ background: '#0C7C82' }}></i>Base case
          </span>
          <span>
            <i style={{ background: '#B3701F' }}></i>Cost-adj. case
          </span>
        </div>
      </div>

      <div className="chart-card">
        <h3>Trials by phase</h3>
        <p className="sub">Share of active trials</p>
        <svg viewBox="0 0 200 160" width="100%" height="150">
          <g transform="translate(100,78)">
            <circle r="55" fill="none" stroke="#EEF1F5" strokeWidth="19" />
            <circle r="55" fill="none" stroke="#0C7C82" strokeWidth="19" strokeDasharray="86 259" transform="rotate(-90)" />
            <circle
              r="55"
              fill="none"
              stroke="#3E5B99"
              strokeWidth="19"
              strokeDasharray="102 259"
              strokeDashoffset="-86"
              transform="rotate(-90)"
            />
            <circle
              r="55"
              fill="none"
              stroke="#B3701F"
              strokeWidth="19"
              strokeDasharray="47 259"
              strokeDashoffset="-188"
              transform="rotate(-90)"
            />
            <circle
              r="55"
              fill="none"
              stroke="#AE3A4B"
              strokeWidth="19"
              strokeDasharray="24 259"
              strokeDashoffset="-235"
              transform="rotate(-90)"
            />
            <text textAnchor="middle" y="5" fontFamily="IBM Plex Mono" fontSize="15" fontWeight="700" fill="#0E1726">
              {modules.trials.count}
            </text>
          </g>
        </svg>
        <div className="legend">
          <span>
            <i style={{ background: '#0C7C82' }}></i>III (33%)
          </span>
          <span>
            <i style={{ background: '#3E5B99' }}></i>II (39%)
          </span>
          <span>
            <i style={{ background: '#B3701F' }}></i>I (18%)
          </span>
          <span>
            <i style={{ background: '#AE3A4B' }}></i>IV (9%)
          </span>
        </div>
      </div>

      <div className="chart-card">
        <h3>Top companies by pipeline value</h3>
        <p className="sub">Risk-adjusted NPV, $B</p>
        <svg viewBox="0 0 300 160" width="100%" height="150">
          <g fontFamily="IBM Plex Sans" fontSize="10.5" fill="#0E1726">
            <text x="0" y="16">Meridian Bio.</text>
            <rect x="105" y="6" width="145" height="13" rx="3" fill="#0C7C82" />
            <text x="254" y="16" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">$18.4B</text>

            <text x="0" y="45">Solara Pharma</text>
            <rect x="105" y="35" width="114" height="13" rx="3" fill="#0C7C82" />
            <text x="223" y="45" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">$14.6B</text>

            <text x="0" y="74">Cascadia Ther.</text>
            <rect x="105" y="64" width="95" height="13" rx="3" fill="#0C7C82" />
            <text x="204" y="74" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">$12.1B</text>

            <text x="0" y="103">NovaGene Sci.</text>
            <rect x="105" y="93" width="78" height="13" rx="3" fill="#0C7C82" />
            <text x="187" y="103" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">$9.9B</text>

            <text x="0" y="132">Ondine Biosci.</text>
            <rect x="105" y="122" width="61" height="13" rx="3" fill="#0C7C82" />
            <text x="170" y="132" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">$7.8B</text>
          </g>
        </svg>
      </div>

      <div className="chart-card">
        <h3>Patent expiry timeline</h3>
        <p className="sub">Assets reaching LOE, by year</p>
        <svg viewBox="0 0 300 160" width="100%" height="150">
          <line x1="26" y1="8" x2="26" y2="128" stroke="#E1E6EC" />
          <line x1="26" y1="128" x2="284" y2="128" stroke="#E1E6EC" />
          <rect x="42" y="88" width="32" height="40" rx="3" fill="#0C7C82" />
          <rect x="94" y="48" width="32" height="80" rx="3" fill="#B3701F" />
          <rect x="146" y="48" width="32" height="80" rx="3" fill="#B3701F" />
          <rect x="198" y="88" width="32" height="40" rx="3" fill="#0C7C82" />
          <rect x="250" y="112" width="32" height="16" rx="3" fill="#0C7C82" />
          <g fontFamily="IBM Plex Mono" fontSize="9" fill="#93A1B3">
            <text x="46" y="142">2026</text>
            <text x="98" y="142">2027</text>
            <text x="150" y="142">2028</text>
            <text x="202" y="142">2029</text>
            <text x="252" y="142">2030</text>
          </g>
        </svg>
        <div className="legend">
          <span>
            <i style={{ background: '#B3701F' }}></i>Peak LOE exposure years
          </span>
        </div>
      </div>

      <div className="chart-card">
        <h3>US vs. International price ratio</h3>
        <p className="sub">US list price ÷ international reference median</p>
        <svg viewBox="0 0 300 160" width="100%" height="150">
          <g fontFamily="IBM Plex Sans" fontSize="10.5" fill="#0E1726">
            <text x="0" y="16">Doxaglutide</text>
            <rect x="95" y="6" width="155" height="13" rx="3" fill="#AE3A4B" />
            <text x="254" y="16" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">1.81×</text>

            <text x="0" y="45">Belumizumab</text>
            <rect x="95" y="35" width="132" height="13" rx="3" fill="#AE3A4B" />
            <text x="231" y="45" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">1.54×</text>

            <text x="0" y="74">Zomarlimab</text>
            <rect x="95" y="64" width="114" height="13" rx="3" fill="#B3701F" />
            <text x="213" y="74" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">1.33×</text>

            <text x="0" y="103">Trevocitinib</text>
            <rect x="95" y="93" width="112" height="13" rx="3" fill="#B3701F" />
            <text x="211" y="103" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">1.31×</text>

            <text x="0" y="132">Ficrastenib</text>
            <rect x="95" y="122" width="109" height="13" rx="3" fill="#B3701F" />
            <text x="208" y="132" fontFamily="IBM Plex Mono" fill="#5B6B80" fontSize="9.5">1.28×</text>
          </g>
        </svg>
      </div>

      <div className="chart-card">
        <h3>Adverse event severity mix</h3>
        <p className="sub">Across tracked trials, by CTCAE grade</p>
        <svg viewBox="0 0 200 160" width="100%" height="150">
          <g transform="translate(100,78)">
            <circle r="55" fill="none" stroke="#EEF1F5" strokeWidth="19" />
            <circle r="55" fill="none" stroke="#0C7C82" strokeWidth="19" strokeDasharray="117 259" transform="rotate(-90)" />
            <circle
              r="55"
              fill="none"
              stroke="#B3701F"
              strokeWidth="19"
              strokeDasharray="78 259"
              strokeDashoffset="-117"
              transform="rotate(-90)"
            />
            <circle
              r="55"
              fill="none"
              stroke="#AE3A4B"
              strokeWidth="19"
              strokeDasharray="52 259"
              strokeDashoffset="-195"
              transform="rotate(-90)"
            />
            <circle
              r="55"
              fill="none"
              stroke="#7A2430"
              strokeWidth="19"
              strokeDasharray="12 259"
              strokeDashoffset="-247"
              transform="rotate(-90)"
            />
            <text textAnchor="middle" y="5" fontFamily="IBM Plex Mono" fontSize="15" fontWeight="700" fill="#0E1726">
              100%
            </text>
          </g>
        </svg>
        <div className="legend">
          <span>
            <i style={{ background: '#0C7C82' }}></i>Grade 1 (45%)
          </span>
          <span>
            <i style={{ background: '#B3701F' }}></i>Grade 2 (30%)
          </span>
          <span>
            <i style={{ background: '#AE3A4B' }}></i>Grade 3 (20%)
          </span>
          <span>
            <i style={{ background: '#7A2430' }}></i>Serious (5%)
          </span>
        </div>
      </div>
    </div>
  );
}
