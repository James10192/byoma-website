import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, Phone, MessageCircle, ArrowRight } from 'lucide-react'
import { formatDate } from '../lib/format'

type ConfirmationSearch = { studio?: string; checkIn?: string; checkOut?: string }

export const Route = createFileRoute('/confirmation')({
  component: ConfirmationPage,
  validateSearch: (search: Record<string, unknown>): ConfirmationSearch => ({
    studio: typeof search.studio === 'string' ? search.studio : undefined,
    checkIn: typeof search.checkIn === 'string' ? search.checkIn : undefined,
    checkOut: typeof search.checkOut === 'string' ? search.checkOut : undefined,
  }),
  head: () => ({ meta: [{ title: 'Demande envoyée — Les Résidences BYOMA' }] }),
})

function ConfirmationPage() {
  const { studio, checkIn, checkOut } = Route.useSearch()

  return (
    <div className="confirm-page">
      <div className="confirm-card fade-up">
        <div className="confirm-icon" aria-hidden>
          <Check size={32} strokeWidth={2.4} />
        </div>

        <span className="kicker confirm-kicker">Demande envoyée</span>
        <h1 className="section-title confirm-title">Votre demande est bien envoyée</h1>
        <p className="lead confirm-lead">
          Notre équipe vous recontacte rapidement par téléphone ou WhatsApp pour confirmer votre réservation
          {studio ? <> du <strong className="confirm-strong">{studio}</strong></> : null}.
        </p>

        {(studio || checkIn) && (
          <div className="confirm-recap">
            {studio && <Row label="Logement" value={studio} />}
            {checkIn && <Row label="Arrivée" value={formatDate(checkIn)} />}
            {checkOut && <Row label="Départ" value={formatDate(checkOut)} />}
            <p className="confirm-recap-note">
              Ces dates restent susceptibles d'être confirmées par notre équipe selon les disponibilités finales.
            </p>
          </div>
        )}

        <div className="confirm-actions">
          <Link to="/studios" className="btn-primary confirm-btn">
            Voir les résidences <ArrowRight size={16} />
          </Link>
          <Link to="/" className="btn-ghost confirm-btn">Retour à l'accueil</Link>
        </div>

        <div className="confirm-contact">
          <span className="confirm-contact-label">Besoin d'une réponse immédiate ?</span>
          <div className="confirm-contact-links">
            <a href="tel:+2250700255295" className="confirm-contact-link">
              <Phone size={15} /> Appeler
            </a>
            <a
              href="https://wa.me/2250700255295"
              target="_blank"
              rel="noopener noreferrer"
              className="confirm-contact-link"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .confirm-page {
          min-height: 100dvh;
          background: var(--ivory);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(120px, 16vw, 160px) 20px clamp(56px, 9vw, 88px);
        }
        .confirm-card {
          width: 100%;
          max-width: 560px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          box-shadow: var(--shadow-card);
          padding: clamp(30px, 6vw, 52px) clamp(24px, 5vw, 48px);
          text-align: center;
        }
        .confirm-icon {
          width: 76px;
          height: 76px;
          margin: 0 auto clamp(22px, 4vw, 30px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: var(--gold-wash);
          color: var(--gold-deep);
          box-shadow: inset 0 0 0 1.5px var(--gold-deep);
        }
        .confirm-kicker { justify-content: center; }
        .confirm-title {
          margin: 14px 0 0;
          font-size: clamp(1.6rem, 6vw, 2.6rem);
        }
        .confirm-lead {
          margin: 16px auto 0;
          max-width: 44ch;
        }
        .confirm-strong { color: var(--noir); font-weight: 600; }

        .confirm-recap {
          margin-top: clamp(26px, 4vw, 32px);
          background: var(--sand);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: clamp(18px, 4vw, 24px);
          text-align: left;
        }
        .confirm-recap-note {
          margin: 14px 0 0;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.55;
        }

        .confirm-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 9px 0;
          border-bottom: 1px solid var(--line-soft);
        }
        .confirm-row:last-of-type { border-bottom: none; }
        .confirm-row-label { color: var(--ink-soft); font-size: 0.88rem; }
        .confirm-row-value { color: var(--noir); font-size: 0.94rem; font-weight: 600; }

        .confirm-actions {
          margin-top: clamp(28px, 5vw, 36px);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .confirm-btn { width: 100%; }

        .confirm-contact {
          margin-top: clamp(26px, 4vw, 32px);
          padding-top: clamp(22px, 4vw, 28px);
          border-top: 1px solid var(--line-soft);
        }
        .confirm-contact-label {
          display: block;
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 12px;
        }
        .confirm-contact-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .confirm-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 44px;
          padding: 10px 18px;
          border: 1px solid var(--line);
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gold-deep);
          transition: border-color 0.25s var(--ease), background 0.25s var(--ease), color 0.25s var(--ease);
        }
        .confirm-contact-link:hover {
          border-color: var(--gold-deep);
          background: var(--gold-wash);
        }

        @media (min-width: 480px) {
          .confirm-actions { flex-direction: row; justify-content: center; }
          .confirm-btn { width: auto; flex: 1; }
        }
      `}</style>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="confirm-row">
      <span className="confirm-row-label">{label}</span>
      <strong className="confirm-row-value">{value}</strong>
    </div>
  )
}
