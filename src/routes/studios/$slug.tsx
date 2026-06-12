import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { ArrowLeft, Check, Users, Loader2, Phone } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { PhotoGallery } from '../../components/studios/photo-gallery'
import { BookingCalendar, type DateRange } from '../../components/booking/booking-calendar'
import { BookingForm } from '../../components/booking/booking-form'
import { formatXOF } from '../../lib/format'
import { Reveal } from '../../components/fx/gsap-fx'

const CATEGORY_LABEL: Record<string, string> = {
  standard: 'Standard',
  premium: 'Premium',
  appartement: 'Appartement',
}

export const Route = createFileRoute('/studios/$slug')({
  component: StudioDetailPage,
  head: ({ params }) => ({
    meta: [{ title: `Réserver — Les Résidences BYOMA` }, { name: 'description', content: `Détails, photos et disponibilités en temps réel du logement ${params.slug}.` }],
  }),
})

function StudioDetailPage() {
  const { slug } = Route.useParams()
  const studio = useQuery(api.studios.getBySlug, { slug })
  const [range, setRange] = useState<DateRange>(null)

  if (studio === undefined) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <Loader2 size={26} className="spin" color="var(--gold)" />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}`}</style>
      </div>
    )
  }

  if (studio === null) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'var(--cream)', textAlign: 'center', padding: 24 }}>
        <h1 className="section-title">Logement introuvable</h1>
        <p style={{ color: 'var(--muted-2)' }}>Ce logement n'existe pas ou n'est plus disponible.</p>
        <Link to="/studios" className="btn-gold">Voir tous les logements</Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--ivory)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(110px,14vw,150px) clamp(24px,5vw,68px) clamp(64px,9vw,110px)' }}>
        <Link to="/studios" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted-2)', fontSize: '0.85rem', letterSpacing: '0.04em', marginBottom: 28 }}>
          <ArrowLeft size={16} /> Toutes les résidences
        </Link>

        <div className="detail-grid">
          {/* Colonne gauche : galerie + détails */}
          <div>
            <PhotoGallery photos={studio.photos} name={studio.name} />

            <Reveal as="div" style={{ marginTop: 32 }} start="top 88%">
              <span className="badge-gold">{CATEGORY_LABEL[studio.category] ?? studio.category}</span>
              <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, color: 'var(--dark)', lineHeight: 1.1, marginTop: 14 }}>
                {studio.name}
              </h1>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 18, color: 'var(--muted-2)', fontSize: '0.9375rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Users size={16} color="var(--gold)" /> Jusqu'à {studio.maxGuests} personnes</span>
                <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{formatXOF(studio.pricePerDay)} <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontWeight: 400 }}>/ 24h</span></span>
              </div>

              <p style={{ marginTop: 22, color: 'var(--ink)', fontSize: '1.0625rem', lineHeight: 1.8 }}>{studio.description}</p>

              <div style={{ marginTop: 32 }}>
                <h2 className="font-display" style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--dark)', marginBottom: 16 }}>Équipements & services</h2>
                <div className="amenities-grid">
                  {studio.amenities.map((a) => (
                    <div key={a} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9375rem', color: 'var(--ink)' }}>
                      <Check size={17} color="var(--gold-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Colonne droite : réservation (sticky) */}
          <div className="booking-col">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 28, boxShadow: '0 30px 70px -40px rgba(21,18,11,0.4)' }}>
              <div style={{ marginBottom: 20 }}>
                <span className="kicker">Réserver</span>
                <div className="rule" style={{ marginTop: 12, maxWidth: 80 }} />
              </div>
              <BookingCalendar studioId={studio._id} onSelect={setRange} />
              <div style={{ height: 1, background: 'var(--line)', margin: '24px 0' }} />
              <BookingForm studio={studio} range={range} />
            </div>

            <a href="tel:+2250700255295" style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--muted-2)', fontSize: '0.875rem', textDecoration: 'none' }}>
              <Phone size={15} color="var(--gold)" /> Une question ? 07 00 25 52 95
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .detail-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: start; }
        .amenities-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
        .booking-col { position: sticky; top: 96px; }
        @media (max-width: 960px) {
          .detail-grid { grid-template-columns: 1fr; gap: 36px; }
          .booking-col { position: static; }
        }
        @media (max-width: 480px) {
          .amenities-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
