import { Link } from '@tanstack/react-router'
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import { Reveal } from '../fx/gsap-fx'

const STUDIOS = [
  { label: 'Studio Standard', price: '25 000', slug: 'studio-standard' },
  { label: 'Studio Premium', price: '45 000', slug: 'studio-premium' },
  { label: 'Appartement 2 Pièces', price: '60 000', slug: 'appartement-2-pieces-premium' },
]

export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--noir)', color: 'var(--ivory)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px, 8vw, 96px) clamp(20px, 4vw, 48px) 40px' }}>
        {/* Grande accroche éditoriale */}
        <Reveal as="div" style={{ maxWidth: 720, marginBottom: 'clamp(48px, 7vw, 80px)' }} start="top 90%">
          <span className="kicker kicker--light">Réservez votre séjour</span>
          <p className="display" style={{ fontSize: 'clamp(1.6rem, 6vw, 3.4rem)', color: 'var(--ivory)', marginTop: 16 }}>
            Une adresse <em>confidentielle</em>, au cœur de Cocody.
          </p>
        </Reveal>

        <div className="footer-grid">
          <div>
            <img
              src="/logo-byoma.png"
              alt="Les Résidences BYOMA"
              width={104}
              height={104}
              style={{ width: 104, height: 104, display: 'block', background: 'var(--ivory)', borderRadius: 14, padding: 8, marginBottom: 20, boxShadow: '0 12px 30px -16px rgba(0,0,0,0.6)' }}
            />
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--muted-on-dark)', maxWidth: 280 }}>
              Studios et appartements meublés haut de gamme pour vos courts et longs séjours à Abidjan.
            </p>
          </div>

          <div>
            <h4 className="kicker kicker--light" style={{ marginBottom: 20, display: 'block' }}>Nos résidences</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {STUDIOS.map((s) => (
                <li key={s.slug}>
                  <Link to="/studios/$slug" params={{ slug: s.slug }} className="footer-link">
                    <span>{s.label}</span>
                    <span style={{ color: 'var(--gold-soft)', fontFamily: 'var(--font-display)' }}>{s.price} F</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="kicker kicker--light" style={{ marginBottom: 20, display: 'block' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="tel:+2250700255295" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--muted-on-dark)', fontSize: '0.9rem' }}>
                <Phone size={15} color="var(--gold)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>07 00 25 52 95<br /><span style={{ color: 'rgba(245,239,227,0.4)', fontSize: '0.8rem' }}>05 08 69 07 98</span></span>
              </a>
              <a href="mailto:lesresidencesbyoma@byoma.ci" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--muted-on-dark)', fontSize: '0.9rem' }}>
                <Mail size={15} color="var(--gold)" /> lesresidencesbyoma@byoma.ci
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--muted-on-dark)', fontSize: '0.9rem' }}>
                <MapPin size={15} color="var(--gold)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>Angré Djomi, derrière la pharmacie St Ambroise<br />Cocody, Abidjan — Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'clamp(48px, 7vw, 80px)', paddingTop: 28, borderTop: '1px solid var(--line-dark)', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(245,239,227,0.4)', margin: 0, letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} Les Résidences BYOMA — Tous droits réservés.
          </p>
          <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            WhatsApp <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <style>{`
        /* Base = mobile-first : 1 colonne empilee */
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 40px; }
        .footer-link { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: rgba(245,239,227,0.7); font-size: 0.9rem; transition: color 0.25s ease; }
        .footer-link:hover { color: var(--gold-soft); }
        /* >= tablette : 2 colonnes */
        @media (min-width: 620px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px 48px; } }
        /* >= desktop : 3 colonnes (version desktop d'origine) */
        @media (min-width: 880px) { .footer-grid { grid-template-columns: 1.4fr 1fr 1.2fr; gap: clamp(32px, 5vw, 72px); } }
      `}</style>
    </footer>
  )
}
