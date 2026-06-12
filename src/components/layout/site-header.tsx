import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/studios', label: 'Résidences' },
  { href: '/#equipements', label: 'Équipements' },
  { href: '/#localisation', label: 'Localisation' },
  { href: '/#reserver', label: 'Contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Pilule pleine et lisible dès qu'on scrolle, ou hors home (pas de hero sombre).
  // Le menu ouvert ne rend PAS la barre solide : la barre reste transparente
  // au-dessus de la feuille ivoire, avec un texte sombre (classe is-open).
  const solid = scrolled || !isHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
    <header className={`byoma-header ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav-shell">
        <div className="nav-inner">
          <Link to="/" aria-label="Accueil — Les Résidences BYOMA" className="nav-logo">
            <img src="/logo-byoma.png" alt="" width={42} height={42} />
            <span className="nav-wordmark">BYOMA<em>Résidences meublées</em></span>
          </Link>

          <nav className="nav-links" aria-label="Navigation principale">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>

          <div className="nav-actions">
            <a href="tel:+2250700255295" className="nav-phone" aria-label="Appeler les Résidences BYOMA">
              <Phone size={15} /> 07 00 25 52 95
            </a>
            <a href="/studios" className="nav-cta">Réserver <ArrowRight size={15} /></a>
            <button onClick={() => setOpen(!open)} className="nav-burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      </header>

      {/* Menu plein écran (mobile) — hors du header (qui a un transform) */}
      <div className={`nav-sheet ${open ? 'open' : ''}`} aria-hidden={!open}>
        <nav className="nav-sheet-links">
          {navLinks.map((l, i) => (
            <a key={l.href} href={l.href} className="nav-sheet-link" style={{ transitionDelay: open ? `${0.06 + i * 0.05}s` : '0s' }}>
              <span>{l.label}</span>
              <ArrowRight size={18} />
            </a>
          ))}
        </nav>
        <div className="nav-sheet-foot">
          <a href="/studios" className="btn btn-primary" style={{ width: '100%' }}>Réserver un séjour <ArrowRight size={16} /></a>
          <div className="nav-sheet-contact">
            <a href="tel:+2250700255295"><Phone size={15} /> 07 00 25 52 95</a>
            <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>

      <style>{`
        .byoma-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 60;
          padding: 0;
          transition: padding 0.5s var(--ease);
          animation: headerDrop 0.7s var(--ease) both;
        }
        @keyframes headerDrop { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        /* Au scroll / hors home : on insère des marges pour faire flotter la pilule */
        .byoma-header.is-solid { padding: clamp(10px, 1.4vw, 16px) clamp(12px, 3vw, 32px) 0; }

        .nav-shell {
          max-width: none; margin: 0 auto;
          background: transparent;
          border: 1px solid transparent; border-radius: 0;
          transition: max-width 0.55s var(--ease), background 0.4s ease, border-radius 0.55s var(--ease),
                      box-shadow 0.4s ease, border-color 0.4s ease, margin 0.5s var(--ease);
        }
        .is-solid .nav-shell {
          max-width: 1140px; margin: 0 auto;
          background: rgba(24, 20, 13, 0.90);
          backdrop-filter: blur(16px) saturate(1.3);
          -webkit-backdrop-filter: blur(16px) saturate(1.3);
          border-radius: 20px;
          border-color: rgba(217, 185, 120, 0.22);
          box-shadow: 0 20px 50px -24px rgba(0,0,0,0.6);
        }

        .nav-inner {
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          max-width: 1280px; margin: 0 auto;
          height: 80px; padding: 0 clamp(18px, 4vw, 48px);
          transition: height 0.5s var(--ease), max-width 0.55s var(--ease), padding 0.5s var(--ease);
        }
        .is-solid .nav-inner { height: 68px; max-width: 1140px; padding: 0 clamp(16px, 2.4vw, 30px); }

        .nav-logo { display: inline-flex; align-items: center; gap: 12px; min-width: 0; }
        .nav-logo img {
          height: 42px; width: 42px; display: block; flex-shrink: 0;
          background: var(--paper); border-radius: 11px; padding: 4px;
          box-shadow: 0 6px 18px -8px rgba(0,0,0,0.55);
          transition: height 0.5s var(--ease);
        }
        .is-solid .nav-logo img { height: 38px; width: 38px; }
        .nav-wordmark {
          display: flex; flex-direction: column; line-height: 1;
          font-family: var(--font-display); font-size: 1.18rem; font-weight: 600;
          letter-spacing: 0.04em; color: var(--ivory);
          text-shadow: 0 1px 16px rgba(0,0,0,0.35);
        }
        .nav-wordmark em {
          font-family: var(--font-body); font-style: normal;
          font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold-soft); margin-top: 5px; text-shadow: none;
        }

        .nav-links { display: flex; align-items: center; gap: 30px; }
        .nav-link {
          font-family: var(--font-body); font-size: 0.84rem; font-weight: 500;
          color: rgba(251,247,238,0.84); position: relative; padding: 6px 0;
          transition: color 0.2s ease; text-shadow: 0 1px 14px rgba(0,0,0,0.3);
        }
        .nav-link::after {
          content: ''; position: absolute; left: 0; bottom: 0; width: 0; height: 1.5px;
          background: var(--gold-soft); transition: width 0.3s var(--ease);
        }
        .nav-link:hover { color: var(--ivory); }
        .nav-link:hover::after { width: 100%; }

        .nav-actions { display: flex; align-items: center; gap: 14px; }
        .nav-phone {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.84rem; font-weight: 600; color: var(--ivory);
          text-shadow: 0 1px 14px rgba(0,0,0,0.3);
        }
        .nav-phone svg { color: var(--gold-soft); }
        .nav-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 0.84rem; font-weight: 600;
          color: #2A1E08; background: var(--gold); padding: 11px 22px; border-radius: 999px;
          box-shadow: 0 10px 24px -14px rgba(138,101,38,0.9);
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .nav-cta svg { transition: transform 0.3s var(--ease); }
        .nav-cta:hover { background: var(--gold-soft); color: #2A1E08; transform: translateY(-1px); }
        .nav-cta:hover svg { transform: translateX(3px); }

        .nav-burger {
          display: none; align-items: center; justify-content: center;
          width: 46px; height: 46px; border-radius: 12px; cursor: pointer;
          background: rgba(251,247,238,0.10); border: 1px solid rgba(217,185,120,0.32); color: var(--ivory);
          backdrop-filter: blur(6px);
        }

        /* ---- Feuille mobile : panneau plein écran ---- */
        .nav-sheet {
          position: fixed; inset: 0; z-index: 50;
          background: var(--ivory);
          padding: 100px clamp(22px, 6vw, 40px) 36px;
          display: flex; flex-direction: column; justify-content: space-between;
          opacity: 0; visibility: hidden; transform: translateY(-12px);
          transition: opacity 0.4s var(--ease), transform 0.4s var(--ease), visibility 0.4s;
        }
        .nav-sheet.open { opacity: 1; visibility: visible; transform: translateY(0); }
        .nav-sheet-links { display: flex; flex-direction: column; margin-top: 8px; }
        .nav-sheet-link {
          display: flex; align-items: center; justify-content: space-between;
          font-family: var(--font-display); font-size: clamp(1.7rem, 8vw, 2.3rem); font-weight: 400; color: var(--noir);
          padding: 18px 0; border-bottom: 1px solid var(--line);
          opacity: 0; transform: translateX(-10px);
          transition: opacity 0.4s ease, transform 0.4s var(--ease), color 0.2s ease;
        }
        .nav-sheet-link svg { color: var(--gold-deep); opacity: 0.6; }
        .nav-sheet.open .nav-sheet-link { opacity: 1; transform: translateX(0); }
        .nav-sheet-link:active { color: var(--gold-deep); }
        .nav-sheet-foot { display: flex; flex-direction: column; gap: 18px; }
        .nav-sheet-contact { display: flex; justify-content: center; gap: 24px; }
        .nav-sheet-contact a { font-size: 0.9rem; font-weight: 600; color: var(--ink-soft); display: inline-flex; align-items: center; gap: 7px; }
        .nav-sheet-contact svg { color: var(--gold-deep); }

        /* Menu ouvert : la barre flotte au-dessus de la feuille ivoire => texte/burger sombres */
        .byoma-header.is-open .nav-wordmark { color: var(--noir); text-shadow: none; }
        .byoma-header.is-open .nav-wordmark em { color: var(--gold-deep); }
        .byoma-header.is-open .nav-burger { color: var(--noir); background: var(--ivory-2); border-color: var(--line); }

        /* Desktop : hero clair => barre transparente avec texte sombre (sauf pilule au scroll) */
        @media (min-width: 920px) {
          .byoma-header:not(.is-solid) .nav-wordmark { color: var(--noir); text-shadow: none; }
          .byoma-header:not(.is-solid) .nav-wordmark em { color: var(--gold-deep); }
          .byoma-header:not(.is-solid) .nav-link { color: var(--ink-soft); text-shadow: none; }
          .byoma-header:not(.is-solid) .nav-link:hover { color: var(--noir); }
          .byoma-header:not(.is-solid) .nav-link::after { background: var(--gold); }
          .byoma-header:not(.is-solid) .nav-phone { color: var(--noir); text-shadow: none; }
          .byoma-header:not(.is-solid) .nav-phone svg { color: var(--gold-deep); }
        }

        @media (max-width: 920px) {
          .nav-links, .nav-phone { display: none; }
          .nav-burger { display: inline-flex; }
        }
        @media (max-width: 560px) {
          .nav-cta { display: none; }
          .nav-inner { height: 72px; }
          .is-solid .nav-inner { height: 64px; }
        }
      `}</style>
    </>
  )
}
