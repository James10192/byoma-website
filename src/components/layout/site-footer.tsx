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
          {/* Marque + tagline + CTA */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Accueil — Les Résidences BYOMA">
              <img src="/logo-byoma.png" alt="" width={56} height={56} />
              <span>BYOMA<em>Résidences meublées</em></span>
            </Link>
            <p className="footer-tagline">
              Studios et appartements meublés, propres et sécurisés, pour vos courts
              et longs séjours à Cocody, Abidjan.
            </p>
            <a
              href="https://wa.me/2250700255295"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary footer-wa"
            >
              <MessageCircle size={16} /> Réserver sur WhatsApp
            </a>
          </div>

          {/* Colonnes */}
          <div className="footer-cols">
            <div className="footer-col">
              <h4 className="footer-h">Nos résidences</h4>
              <ul>
                {STUDIOS.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/studios/$slug"
                      params={{ slug: s.slug }}
                      search={{}}
                      className="footer-link footer-link--price"
                    >
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
                    {l.href.includes('#') ? (
                      <a href={l.href} className="footer-link">
                        <span>{l.label}</span>
                      </a>
                    ) : (
                      <Link to={l.href} className="footer-link">
                        <span>{l.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col footer-col--contact">
              <h4 className="footer-h">Contact</h4>
              <div className="footer-contact">
                <a href="tel:+2250700255295" className="footer-contact-row">
                  <span className="footer-contact-ic"><Phone size={16} /></span>
                  <span className="footer-contact-txt">
                    07 00 25 52 95
                    <em>05 08 69 07 98</em>
                  </span>
                </a>
                <a href="mailto:lesresidencesbyoma@byoma.ci" className="footer-contact-row">
                  <span className="footer-contact-ic"><Mail size={16} /></span>
                  <span className="footer-contact-txt">lesresidencesbyoma@byoma.ci</span>
                </a>
                <div className="footer-contact-row footer-contact-row--addr">
                  <span className="footer-contact-ic"><MapPin size={16} /></span>
                  <span className="footer-contact-txt">
                    Angré Djomi, derrière la pharmacie St Ambroise
                    <em>Cocody, Abidjan · Côte d'Ivoire</em>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Les Résidences BYOMA · Tous droits réservés.</p>
          <a
            href="https://wa.me/2250700255295"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-bottom-link"
          >
            WhatsApp <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <style>{`
        .byoma-footer {
          position: relative;
          background: var(--sand);
          color: var(--ink);
          border-top: 1px solid var(--line);
        }
        /* Filet ocre subtil en haut du footer */
        .byoma-footer::before {
          content: '';
          position: absolute; left: 0; right: 0; top: -1px; height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold-soft) 35%, var(--gold) 50%, var(--gold-soft) 65%, transparent);
          opacity: 0.6;
        }
        .footer-inner {
          max-width: 1240px; margin: 0 auto;
          padding: clamp(48px, 8vw, 88px) clamp(20px, 5vw, 64px) clamp(84px, 14vw, 110px);
        }
        .footer-top { display: grid; grid-template-columns: 1fr; gap: clamp(38px, 6vw, 64px); }

        /* ---- Marque ---- */
        .footer-logo { display: inline-flex; align-items: center; gap: 14px; }
        .footer-logo img {
          height: 56px; width: 56px; border-radius: 14px; padding: 6px;
          background: var(--paper); border: 1px solid var(--line);
          box-shadow: var(--shadow-soft);
        }
        .footer-logo span {
          display: flex; flex-direction: column; line-height: 1;
          font-family: var(--font-display); font-size: 1.4rem; font-weight: 600;
          letter-spacing: 0.04em; color: var(--noir);
        }
        .footer-logo em {
          font-family: var(--font-body); font-style: normal; font-size: 0.62rem;
          font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold-deep); margin-top: 7px;
        }
        .footer-tagline {
          margin: 22px 0 0; font-size: 0.94rem; line-height: 1.7;
          color: var(--ink-soft); max-width: 340px;
        }
        .footer-wa { margin-top: 26px; }

        /* ---- Colonnes ---- */
        .footer-cols { display: grid; grid-template-columns: 1fr; gap: clamp(30px, 5vw, 40px) 28px; }
        .footer-h {
          margin: 0 0 18px; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-deep);
          display: inline-flex; align-items: center; gap: 9px;
        }
        .footer-h::after { content: ''; flex: 1; height: 1px; background: var(--line); min-width: 28px; }
        .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
        .footer-col li { display: flex; }
        .footer-link {
          display: flex; align-items: center; gap: 12px; width: 100%;
          min-height: 44px; padding: 4px 0;
          color: var(--ink-soft); font-size: 0.94rem;
          transition: color 0.2s var(--ease), padding-left 0.2s var(--ease);
        }
        .footer-link--price { justify-content: space-between; }
        .footer-link:hover { color: var(--gold-deep); padding-left: 6px; }
        .footer-price {
          color: var(--gold-deep); font-family: var(--font-display);
          font-weight: 500; font-size: 0.96rem; white-space: nowrap;
        }

        /* ---- Contact ---- */
        .footer-contact { display: flex; flex-direction: column; gap: 6px; }
        .footer-contact-row {
          display: flex; align-items: flex-start; gap: 13px;
          min-height: 44px; padding: 5px 0;
          color: var(--ink-soft); font-size: 0.92rem; line-height: 1.45;
          transition: color 0.2s var(--ease);
        }
        a.footer-contact-row:hover { color: var(--gold-deep); }
        .footer-contact-ic {
          flex-shrink: 0; width: 38px; height: 38px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 11px; background: var(--gold-wash); color: var(--gold-deep);
          border: 1px solid var(--line);
        }
        .footer-contact-txt {
          display: flex; flex-direction: column; padding-top: 3px;
          font-weight: 500; color: var(--ink);
        }
        a.footer-contact-row:hover .footer-contact-txt { color: var(--gold-deep); }
        .footer-contact-txt em {
          font-style: normal; font-weight: 400; color: var(--muted);
          font-size: 0.84rem; margin-top: 3px;
        }
        .footer-contact-row--addr .footer-contact-txt { font-weight: 400; }

        /* ---- Bandeau bas ---- */
        .footer-bottom {
          margin-top: clamp(38px, 6vw, 64px); padding-top: 26px;
          border-top: 1px solid var(--line);
          display: flex; flex-wrap: wrap; gap: 14px;
          justify-content: space-between; align-items: center;
        }
        .footer-bottom p { margin: 0; font-size: 0.82rem; color: var(--muted); }
        .footer-bottom-link {
          display: inline-flex; align-items: center; gap: 6px;
          min-height: 44px; font-size: 0.74rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold-deep);
          transition: color 0.2s var(--ease);
        }
        .footer-bottom-link:hover { color: var(--gold); }
        .footer-bottom-link svg { transition: transform 0.2s var(--ease); }
        .footer-bottom-link:hover svg { transform: translate(2px, -2px); }

        /* ====== >= tablette ====== */
        @media (min-width: 620px) {
          .footer-cols { grid-template-columns: 1fr 1fr; }
          .footer-col--contact { grid-column: 1 / -1; }
        }
        /* ====== >= desktop ====== */
        @media (min-width: 920px) {
          .footer-inner { padding-bottom: clamp(40px, 5vw, 56px); }
          .footer-top { grid-template-columns: 1fr 1.95fr; gap: clamp(44px, 5vw, 80px); align-items: start; }
          .footer-cols { grid-template-columns: 1.15fr 0.8fr 1.25fr; gap: clamp(24px, 3vw, 44px); }
          .footer-col--contact { grid-column: auto; }
        }
      `}</style>
    </footer>
  )
}
