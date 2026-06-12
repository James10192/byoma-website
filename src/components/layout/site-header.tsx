import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/studios', label: 'Résidences' },
  { href: '/#localisation', label: 'Localisation' },
  { href: '/#contact', label: 'Contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Deux axes indépendants :
  // - compact : la barre se rétrécit en pilule arrondie UNIQUEMENT au scroll (toutes pages)
  // - hasBg   : fond + flou affichés au scroll, ou en haut des pages claires (lisibilité)
  const compact = scrolled
  const hasBg = scrolled || !isHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <header className={`byoma-header ${compact ? 'is-compact' : ''}`}>
      <div className={`nav-bar ${compact ? 'is-compact' : ''} ${hasBg ? 'has-bg' : ''}`}>
        <div className="nav-inner">
          <Link to="/" aria-label="Accueil — Les Résidences BYOMA" className="nav-logo">
            <img src="/logo-byoma.png" alt="Les Résidences BYOMA" width={50} height={50} />
          </Link>

          <nav className="nav-links" aria-label="Navigation principale">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>

          <div className="nav-actions">
            <a href="/studios" className="nav-cta">Réserver <ArrowRight size={14} /></a>
            <button onClick={() => setOpen(!open)} className="nav-burger" aria-label="Menu" aria-expanded={open}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile — feuille arrondie */}
      <div className={`nav-sheet ${open ? 'open' : ''}`}>
        {navLinks.map((l, i) => (
          <a key={l.href} href={l.href} className="nav-sheet-link" style={{ transitionDelay: open ? `${0.05 + i * 0.05}s` : '0s' }}>
            {l.label}
          </a>
        ))}
        <a href="/studios" className="btn btn-gold" style={{ marginTop: 14, width: '100%' }}>Réserver un séjour <ArrowRight size={15} /></a>
      </div>

      <style>{`
        .byoma-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 60;
          display: flex; flex-direction: column; align-items: stretch;
          padding: 0;
          transition: padding 0.45s var(--ease);
          animation: headerDrop 0.7s var(--ease) both;
        }
        /* Au scroll : on insère des marges latérales pour faire flotter la pilule */
        .byoma-header.is-compact { padding: clamp(12px, 1.6vw, 18px) clamp(14px, 3vw, 40px) 0; }
        @keyframes headerDrop { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .nav-bar {
          width: 100%; max-width: none; margin: 0 auto;
          border: 1px solid transparent; border-bottom: 1px solid transparent;
          border-radius: 0; background: transparent;
          transition: max-width 0.5s var(--ease), border-radius 0.5s var(--ease),
                      background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, margin 0.45s var(--ease);
        }
        /* En haut des pages claires : bandeau sombre PLEINE LARGEUR (tout le haut noir) */
        .nav-bar.has-bg {
          background: rgba(21, 18, 11, 0.92);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          border-bottom-color: rgba(224, 201, 136, 0.18);
        }
        /* Au scroll : pilule flottante centrée et arrondie (toutes pages) */
        .nav-bar.is-compact {
          max-width: 1080px; margin: 0 auto;
          border-radius: 18px;
          border-color: rgba(224, 201, 136, 0.24);
          box-shadow: 0 18px 50px -20px rgba(0,0,0,0.55);
        }

        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1280px; margin: 0 auto;
          height: 90px; padding: 0 clamp(20px, 4vw, 48px);
          transition: height 0.45s var(--ease), padding 0.45s var(--ease);
        }
        .is-compact .nav-inner { height: 66px; max-width: 1080px; padding: 0 clamp(16px, 2vw, 26px); }

        .nav-logo { display: inline-flex; align-items: center; }
        .nav-logo img {
          height: 50px; width: auto; display: block;
          background: var(--ivory); border-radius: 11px; padding: 5px;
          box-shadow: 0 6px 18px -8px rgba(0,0,0,0.5);
          transition: height 0.45s var(--ease);
        }
        .is-compact .nav-logo img { height: 42px; }

        .nav-links { display: flex; align-items: center; gap: 38px; }
        .nav-link {
          font-family: var(--font-body); font-size: 0.74rem; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(245,239,227,0.82); position: relative; padding: 6px 0;
          transition: color 0.25s ease;
        }
        .nav-link::after {
          content: ''; position: absolute; left: 0; bottom: 0; width: 0; height: 1px;
          background: var(--gold); transition: width 0.3s var(--ease);
        }
        .nav-link:hover { color: var(--ivory); }
        .nav-link:hover::after { width: 100%; }

        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .nav-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--noir); background: var(--gold); padding: 11px 22px; border-radius: 10px;
          transition: background 0.3s ease;
        }
        .nav-cta svg { transition: transform 0.3s var(--ease); }
        .nav-cta:hover { background: var(--gold-soft); }
        .nav-cta:hover svg { transform: translateX(3px); }

        .nav-burger {
          display: none; align-items: center; justify-content: center;
          width: 42px; height: 42px; border-radius: 10px; cursor: pointer;
          background: rgba(245,239,227,0.08); border: 1px solid rgba(224,201,136,0.25);
          color: var(--ivory);
        }

        .nav-sheet {
          width: 100%; max-width: 1080px;
          margin-top: 10px; padding: 0 22px;
          display: flex; flex-direction: column;
          background: rgba(21, 18, 11, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(224,201,136,0.22); border-radius: 18px;
          max-height: 0; overflow: hidden; opacity: 0;
          transform: translateY(-8px);
          transition: max-height 0.45s var(--ease), opacity 0.35s ease, transform 0.45s var(--ease), padding 0.45s var(--ease);
        }
        .nav-sheet.open { max-height: 460px; opacity: 1; transform: translateY(0); padding: 18px 22px 24px; }
        .nav-sheet-link {
          font-family: var(--font-display); font-size: 1.5rem; color: var(--ivory);
          padding: 13px 0; border-bottom: 1px solid var(--line-dark);
          opacity: 0; transform: translateX(-8px);
          transition: opacity 0.4s ease, transform 0.4s var(--ease);
        }
        .nav-sheet.open .nav-sheet-link { opacity: 1; transform: translateX(0); }

        @media (max-width: 880px) {
          .nav-links, .nav-cta { display: none; }
          .nav-burger { display: inline-flex; }
          /* Mobile : pilule compacte flottante lisible en permanence */
          .byoma-header { padding: 12px clamp(12px,4vw,20px) 0; }
          .nav-bar {
            max-width: 560px; margin: 0 auto; border-radius: 16px;
            background: rgba(21, 18, 11, 0.74);
            backdrop-filter: blur(14px) saturate(1.2);
            -webkit-backdrop-filter: blur(14px) saturate(1.2);
            border-color: rgba(224,201,136,0.2);
          }
          .nav-bar.is-compact { max-width: 560px; background: rgba(21,18,11,0.88); }
          .nav-inner, .is-compact .nav-inner { max-width: none; padding: 0 16px; }
          .nav-inner { height: 64px; }
          .is-compact .nav-inner { height: 60px; }
          .nav-logo img, .is-compact .nav-logo img { height: 40px; }
        }
      `}</style>
    </header>
  )
}
