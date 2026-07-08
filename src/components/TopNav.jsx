import { useEffect, useRef, useState } from 'react';
import { PLATFORMS } from '../data/platforms.js';
import { ICONS } from '../data/icons.jsx';

const VERIDIAN_TOP = ['trials', 'companies', 'drugs'];
const VERIDIAN_PRICING = ['drugprice', 'cot', 'irp'];

export default function TopNav({
  modules,
  currentModuleKey,
  homeActive,
  analyticsActive,
  onShowHome,
  onShowAnalytics,
  onSelectModule,
  onOpenAskAI,
  showToast,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState('aurion');
  const wrapRef = useRef(null);

  useEffect(() => {
    const onOutsideClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onOutsideClick);
    return () => document.removeEventListener('click', onOutsideClick);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((open) => {
      const next = !open;
      if (next) setPreview('aurion');
      return next;
    });
  };

  const goModule = (key) => {
    onSelectModule(key);
    setMenuOpen(false);
  };

  const isModulePage = !homeActive && !analyticsActive;

  return (
    <nav className="topnav" ref={wrapRef}>
      <div className="topnav-left">
        <div className="topnav-brand" onClick={onShowHome}>
          <svg viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="6" r="3.4" fill="#0C7C82" />
            <circle cx="5" cy="21" r="3.4" fill="#3E5B99" />
            <circle cx="23" cy="21" r="3.4" fill="#3E5B99" />
            <path d="M14 9.4 L6.3 18.3 M14 9.4 L21.7 18.3 M8.4 21 H19.6" stroke="#8CA0BC" strokeWidth="1.6" />
          </svg>
          <span>Veridian</span>
        </div>

        <button className={`topnav-link ${homeActive ? 'current' : ''}`} onClick={onShowHome}>
          Home
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className={`topnav-link ${isModulePage ? 'current' : ''} ${menuOpen ? 'open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            Products
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div className={`products-mega ${menuOpen ? 'open' : ''}`}>
            <div className="mega-col mega-col-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  className={`mega-row ${preview === p.key ? 'active-platform' : ''}`}
                  onClick={() => setPreview(p.key)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {p.label}
                  </span>
                  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ visibility: p.hasSubmenu ? 'visible' : 'hidden' }}>
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="mega-col mega-col-2">
              {preview === 'aurion' && (
                <>
                  <div className="mega-col-2-head">
                    <span className="ask">Ask Aurion</span>
                  </div>
                  {VERIDIAN_TOP.map((key) => (
                    <button
                      key={key}
                      className="mega-row"
                      style={
                        currentModuleKey === key && isModulePage
                          ? { fontWeight: 700, color: 'var(--accent-dark)' }
                          : undefined
                      }
                      onClick={() => goModule(key)}
                    >
                      <span>{modules[key].label}</span>
                    </button>
                  ))}
                  <hr className="mega-divider" />
                  {VERIDIAN_PRICING.map((key) => (
                    <button
                      key={key}
                      className="mega-row"
                      style={
                        currentModuleKey === key && isModulePage
                          ? { fontWeight: 700, color: 'var(--accent-dark)' }
                          : undefined
                      }
                      onClick={() => goModule(key)}
                    >
                      <span>{modules[key].label}</span>
                    </button>
                  ))}
                </>
              )}

              {preview !== 'aurion' &&
                (() => {
                  const platform = PLATFORMS.find((p) => p.key === preview);
                  const notify = () => {
                    showToast(`You're on the list for ${platform.label}.`);
                    setMenuOpen(false);
                  };

                  if (platform.hasSubmenu) {
                    return (
                      <>
                        <div className="mega-col-2-head">
                          <span className="ask">{platform.label}</span>
                        </div>
                        <button className="mega-row disabled">
                          <span>{platform.submenuItem}</span>
                        </button>
                        <div className="mega-empty" style={{ paddingTop: 6 }}>
                          {platform.sub} — join the waitlist to get notified when it&apos;s available.
                          <div>
                            <button onClick={notify}>Notify me</button>
                          </div>
                        </div>
                      </>
                    );
                  }

                  return (
                    <div className="mega-empty">
                      <b>{platform.label}</b> is launching soon — {platform.sub.toLowerCase()}.
                      <br />
                      Join the waitlist to get notified when it&apos;s available.
                      <div>
                        <button onClick={notify}>Notify me</button>
                      </div>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>

        <button className={`topnav-link ${analyticsActive ? 'current' : ''}`} onClick={onShowAnalytics}>
          <span className="hide-narrow">Industry Trends</span>
        </button>
        <button className="topnav-link reports-inline" onClick={() => showToast('Reports library would open here.')}>
          Reports
        </button>
      </div>

      <div className="topnav-right">
        <button className="topnav-ask-analyst" onClick={onOpenAskAI}>
          <ICONS.sparkles />
          <span>Ask Analyst</span>
        </button>
        <div className="topnav-avatar" title="R. Sharma · Competitive Intelligence">
          RS
        </div>
      </div>
    </nav>
  );
}
