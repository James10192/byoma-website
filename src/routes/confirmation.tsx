import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle2, Phone, MessageCircle, ArrowRight } from 'lucide-react'
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
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(110px,14vw,150px) 24px clamp(60px,8vw,90px)' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }} className="fade-up">
        <div style={{ width: 72, height: 72, border: '1px solid var(--gold-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 26px' }}>
          <CheckCircle2 size={34} color="var(--gold-deep)" strokeWidth={1.5} />
        </div>

        <div className="kicker">Demande envoyée</div>
        <h1 className="section-title" style={{ marginTop: 12 }}>Merci, nous avons bien reçu votre demande</h1>
        <p style={{ marginTop: 16, color: 'var(--muted-2)', fontSize: '1.0625rem', lineHeight: 1.7 }}>
          Notre équipe vous recontacte rapidement par téléphone ou WhatsApp pour confirmer votre réservation
          {studio ? <> du <strong style={{ color: 'var(--dark)' }}>{studio}</strong></> : null}.
        </p>

        {(studio || checkIn) && (
          <div style={{ marginTop: 28, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 4, padding: 22, textAlign: 'left' }}>
            {studio && <Row label="Logement" value={studio} />}
            {checkIn && <Row label="Arrivée" value={formatDate(checkIn)} />}
            {checkOut && <Row label="Départ" value={formatDate(checkOut)} />}
            <p style={{ margin: '14px 0 0', fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              Ces dates restent susceptibles d'être confirmées par notre équipe selon les disponibilités finales.
            </p>
          </div>
        )}

        <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <a href="tel:+2250700255295" className="btn-gold"><Phone size={16} /> Appeler maintenant</a>
          <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="btn-outline-gold"><MessageCircle size={16} /> WhatsApp</a>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link to="/studios" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gold-dark)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            Voir les autres logements <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--cream-2)' }}>
      <span style={{ color: 'var(--muted-2)', fontSize: '0.875rem' }}>{label}</span>
      <strong style={{ color: 'var(--dark)', fontSize: '0.9375rem' }}>{value}</strong>
    </div>
  )
}
