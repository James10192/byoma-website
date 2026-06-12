import { Link } from '@tanstack/react-router'
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react'

const STUDIOS = [
  { label: 'Studio Standard', price: '25 000', slug: 'studio-standard' },
  { label: 'Studio Premium', price: '45 000', slug: 'studio-premium' },
  { label: 'Appartement 2 Pièces', price: '60 000', slug: 'appartement-2-pieces-premium' },
]

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Équipements', href: '/#equipements' },
  { label: 'Localisation', href: '/#localisation' },
  { label: 'Réserver', href: '/#reserver' },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="byoma-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Accueil — Les Résidences BYOMA">
              <img src="/logo-byoma.png" alt="" width={52} height={52} />
              <span>BYOMA<em>Résidences meublées</em></span>
            </Link>
            <p className="footer-tagline">
              Studios et appartements meublés, propres et sécurisés, pour vos courts
              et longs séjours à Cocody, Abidjan.
            </p>
            <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="btn btn-primary footer-wa">
              <MessageCircle size={16} /> Réserver sur WhatsApp
            </a>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4 className="footer-h">Nos résidences</h4>
              <ul>
                {STUDIOS.map((s) => (
                  <li key={s.slug}>
                    <Link to="/studios/$slug" params={{ slug: s.slug }} search={{}} className="footer-link">
                      <span>{s.label}</span>
                      <span className="footer-price">{s.price} F</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-h">Navigation</h4>
              <ul>
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="footer-link"><span>{l.label}</span></a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-h">Contact</h4>
              <div className="footer-contact">
                <a href="tel:+2250700255295"><Phone size={15} /><span>07 00 25 52 95<em>05 08 69 07 98</em></span></a>
                <a href="mailto:lesresidencesbyoma@byoma.ci"><Mail size={15} /><span>lesresidencesbyoma@byoma.ci</span></a>
                <div className="footer-addr"><MapPin size={15} /><span>Angré Djomi, derrière la pharmacie St Ambroise<br />Cocody, Abidjan · Côte d'Ivoire</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Les Résidences BYOMA · Tous droits réservés.</p>
          <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="footer-bottom-link">
            WhatsApp <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <style>{`
        .byoma-footer { background: var(--noir); color: var(--ivory); }
        .footer-inner { max-width: 1240px; margin: 0 auto; padding: clamp(56px, 8vw, 96px) clamp(20px, 5vw, 64px) 36px; }
        .footer-top { display: grid; grid-template-columns: 1fr; gap: clamp(40px, 6vw, 72px); }

        .footer-logo { display: inline-flex; align-items: center; gap: 13px; }
        .footer-logo img { height: 52px; width: 52px; background: var(--ivory); border-radius: 12px; padding: 5px; }
        .footer-logo span { display: flex; flex-direction: column; line-height: 1; font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; letter-spacing: 0.04em; }
        .footer-logo em { font-family: var(--font-body); font-style: normal; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold-soft); margin-top: 5px; }
        .footer-tagline { margin: 22px 0 0; font-size: 0.92rem; line-height: 1.7; color: var(--muted-on-dark); max-width: 320px; }
        .footer-wa { margin-top: 24px; }

        .footer-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 36px 28px; }
        .footer-h { margin: 0 0 18px; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-soft); }
        .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 13px; }
        .footer-link { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: rgba(251,247,238,0.74); font-size: 0.92rem; transition: color 0.2s ease; }
        .footer-link:hover { color: var(--ivory); }
        .footer-price { color: var(--gold-soft); font-family: var(--font-display); font-weight: 500; }

        .footer-contact { display: flex; flex-direction: column; gap: 16px; }
        .footer-contact a, .footer-addr { display: flex; align-items: flex-start; gap: 11px; color: rgba(251,247,238,0.74); font-size: 0.9rem; line-height: 1.5; transition: color 0.2s ease; }
        .footer-contact a:hover { color: var(--ivory); }
        .footer-contact svg, .footer-addr svg { color: var(--gold-soft); flex-shrink: 0; margin-top: 3px; }
        .footer-contact span { display: flex; flex-direction: column; }
        .footer-contact em { font-style: normal; color: rgba(251,247,238,0.42); font-size: 0.82rem; margin-top: 2px; }

        .footer-bottom { margin-top: clamp(40px, 6vw, 72px); padding-top: 26px; border-top: 1px solid var(--line-dark); display: flex; flex-wrap: wrap; gap: 14px; justify-content: space-between; align-items: center; }
        .footer-bottom p { margin: 0; font-size: 0.8rem; color: rgba(251,247,238,0.42); }
        .footer-bottom-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold-soft); }

        @media (min-width: 620px) {
          .footer-cols { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 920px) {
          .footer-top { grid-template-columns: 1.1fr 1.6fr; gap: clamp(48px, 6vw, 96px); }
        }
      `}</style>
    </footer>
  )
}
