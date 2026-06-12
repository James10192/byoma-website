import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { ChevronRight, Check, Users, Loader2, Phone, MessageCircle, Mail, ShieldCheck } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { PhotoGallery } from '../../components/studios/photo-gallery'
import { BookingCalendar, type DateRange } from '../../components/booking/booking-calendar'
import { BookingForm } from '../../components/booking/booking-form'
import { formatXOF } from '../../lib/format'
import { Reveal, SplitReveal } from '../../components/fx/gsap-fx'

const CATEGORY_LABEL: Record<string, string> = {
  standard: 'Standard',
  premium: 'Premium',
  appartement: 'Appartement',
}

export const Route = createFileRoute('/studios/$slug')({
  component: StudioDetailPage,
  // Dates transmises par la barre de réservation du hero (toutes optionnelles).
  validateSearch: (search: Record<string, unknown>): { checkIn?: string; checkOut?: string; guests?: string } => {
    const out: { checkIn?: string; checkOut?: string; guests?: string } = {}
    if (typeof search.checkIn === 'string') out.checkIn = search.checkIn
    if (typeof search.checkOut === 'string') out.checkOut = search.checkOut
    if (typeof search.guests === 'string') out.guests = search.guests
    return out
  },
  head: ({ params }) => ({
    meta: [{ title: `Réserver — Les Résidences BYOMA` }, { name: 'description', content: `Détails, photos et disponibilités en temps réel du logement ${params.slug}.` }],
  }),
})

function StudioDetailPage() {
  const { slug } = Route.useParams()
  const { checkIn, checkOut } = Route.useSearch()
  const studio = useQuery(api.studios.getBySlug, { slug })
  const initialRange: DateRange = checkIn && checkOut ? { checkIn, checkOut } : null
  const [range, setRange] = useState<DateRange>(initialRange)

  if (studio === undefined) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)' }}>
        <Loader2 size={26} className="spin" color="var(--gold)" />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}`}</style>
      </div>
    )
  }

  if (studio === null) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'var(--ivory)', textAlign: 'center', padding: 24 }}>
        <h1 className="section-title">Logement introuvable</h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: 380 }}>Ce logement n'existe pas ou n'est plus disponible.</p>
        <Link to="/studios" className="btn btn-primary">Voir toutes les résidences</Link>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <div className="detail-wrap">
        {/* Fil d'ariane */}
        <nav aria-label="Fil d'ariane" className="crumb">
          <Link to="/">Accueil</Link>
          <ChevronRight size={13} aria-hidden />
          <Link to="/studios">Résidences</Link>
          <ChevronRight size={13} aria-hidden />
          <span aria-current="page">{studio.name}</span>
        </nav>

        {/* En-tête */}
        <header className="detail-head">
          <span className="chip detail-cat">{CATEGORY_LABEL[studio.category] ?? studio.category}</span>
          <SplitReveal as="h1" className="section-title detail-title" immediate>
            {studio.name}
          </SplitReveal>
          <div className="detail-meta">
            <span className="detail-guests"><Users size={17} strokeWidth={1.6} /> Jusqu'à {studio.maxGuests} personnes</span>
            <span className="detail-price">
              <span className="price-tag">{formatXOF(studio.pricePerDay)}</span>
              <span className="detail-price-unit">/ nuit</span>
            </span>
          </div>
        </header>

        <div className="detail-grid">
          {/* Colonne gauche : galerie + détails */}
          <div className="detail-main">
            <Reveal as="div" start="top 90%">
              <PhotoGallery photos={studio.photos} name={studio.name} />
            </Reveal>

            <Reveal as="div" className="detail-desc" start="top 88%">
              <span className="kicker">À propos du logement</span>
              <p className="detail-desc-text">{studio.description}</p>
            </Reveal>

            {studio.amenities.length > 0 && (
              <Reveal as="div" className="detail-amenities" start="top 90%">
                <h2 className="amen-title">Équipements &amp; services</h2>
                <div className="amenities-grid">
                  {studio.amenities.map((a) => (
                    <div key={a} className="amen-item">
                      <span className="amen-ic"><Check size={15} strokeWidth={2} /></span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Colonne droite : réservation (sticky) */}
          <aside className="booking-col">
            <div className="booking-card">
              <div className="booking-card-head">
                <span className="kicker">Vérifier les disponibilités</span>
                <div className="rule" style={{ marginTop: 12 }} />
                <p className="booking-card-note">
                  <ShieldCheck size={14} strokeWidth={1.7} />
                  Aucun paiement en ligne. On confirme par WhatsApp.
                </p>
              </div>

              <BookingCalendar studioId={studio._id} onSelect={setRange} initialRange={initialRange} />

              <div className="booking-sep" />

              <h3 className="booking-form-title">Demander une réservation</h3>
              <BookingForm studio={studio} range={range} />
            </div>

            <div className="booking-contact">
              <span className="booking-contact-label">Une question avant de réserver ?</span>
              <div className="booking-contact-row">
                <a href="tel:+2250700255295" className="contact-link" aria-label="Appeler">
                  <Phone size={16} strokeWidth={1.7} /> Appeler
                </a>
                <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="WhatsApp">
                  <MessageCircle size={16} strokeWidth={1.7} /> WhatsApp
                </a>
                <a href="mailto:lesresidencesbyoma@byoma.ci" className="contact-link" aria-label="E-mail">
                  <Mail size={16} strokeWidth={1.7} /> E-mail
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .detail-page { background: var(--ivory); }
        .detail-wrap { max-width: 1240px; margin: 0 auto; padding: clamp(110px, 15vw, 150px) clamp(20px, 5vw, 64px) clamp(64px, 9vw, 110px); }

        /* Fil d'ariane */
        .crumb { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 0.8rem; color: var(--muted); margin-bottom: clamp(22px, 3vw, 32px); }
        .crumb a { color: var(--ink-soft); transition: color 0.2s var(--ease); }
        .crumb a:hover { color: var(--gold-deep); }
        .crumb svg { color: var(--line); }
        .crumb span[aria-current] { color: var(--ink); font-weight: 500; }

        /* En-tête */
        .detail-head { margin-bottom: clamp(28px, 4vw, 40px); }
        .detail-cat { margin-bottom: 16px; }
        .detail-cat { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold-deep); }
        .detail-title { margin: 0; }
        .detail-meta { margin-top: 16px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 14px 26px; }
        .detail-guests { display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; color: var(--ink-soft); }
        .detail-guests svg { color: var(--gold-deep); }
        .detail-price { display: inline-flex; align-items: baseline; gap: 7px; }
        .detail-price .price-tag { font-size: clamp(1.5rem, 4vw, 1.9rem); }
        .detail-price-unit { font-size: 0.85rem; color: var(--muted); font-weight: 500; }

        /* Grille */
        .detail-grid { display: grid; grid-template-columns: 1fr; gap: clamp(36px, 5vw, 56px); align-items: start; }

        /* Description */
        .detail-desc { margin-top: clamp(28px, 4vw, 40px); }
        .detail-desc-text { margin: 16px 0 0; color: var(--ink); font-size: clamp(1rem, 2.4vw, 1.08rem); line-height: 1.8; max-width: 60ch; }

        /* Équipements */
        .detail-amenities { margin-top: clamp(32px, 4vw, 44px); padding-top: clamp(28px, 4vw, 40px); border-top: 1px solid var(--line); }
        .amen-title { font-family: var(--font-display); font-weight: 400; font-size: clamp(1.4rem, 3.5vw, 1.7rem); letter-spacing: -0.015em; color: var(--noir); margin: 0 0 22px; }
        .amenities-grid { display: grid; grid-template-columns: 1fr; gap: 14px 28px; }
        .amen-item { display: flex; align-items: flex-start; gap: 12px; font-size: 0.96rem; color: var(--ink); line-height: 1.5; }
        .amen-ic { flex-shrink: 0; width: 26px; height: 26px; margin-top: 1px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; background: var(--gold-wash); color: var(--gold-deep); }

        /* Bloc réservation */
        .booking-col { position: static; }
        .booking-card { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: clamp(22px, 4vw, 30px); box-shadow: var(--shadow-card); }
        .booking-card-head { margin-bottom: 22px; }
        .booking-card-note { margin: 16px 0 0; display: flex; align-items: flex-start; gap: 9px; font-size: 0.82rem; line-height: 1.5; color: var(--ink-soft); }
        .booking-card-note svg { flex-shrink: 0; margin-top: 1px; color: var(--gold-deep); }
        .booking-sep { height: 1px; background: var(--line); margin: clamp(20px, 3vw, 26px) 0; }
        .booking-form-title { font-family: var(--font-display); font-weight: 400; font-size: 1.25rem; letter-spacing: -0.01em; color: var(--noir); margin: 0 0 18px; }

        /* Contact */
        .booking-contact { margin-top: 18px; text-align: center; }
        .booking-contact-label { display: block; font-size: 0.8rem; color: var(--muted); margin-bottom: 12px; }
        .booking-contact-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .contact-link { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 48px; padding: 0 10px; background: var(--paper); border: 1px solid var(--line); border-radius: 999px; font-size: 0.82rem; font-weight: 600; color: var(--ink); transition: border-color 0.25s var(--ease), color 0.25s var(--ease), background 0.25s var(--ease); }
        .contact-link svg { color: var(--gold-deep); transition: color 0.25s var(--ease); }
        .contact-link:hover { border-color: var(--gold-soft); background: var(--gold-wash); color: var(--gold-deep); }

        /* ====== >= tablette ====== */
        @media (min-width: 560px) {
          .amenities-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ====== >= desktop ====== */
        @media (min-width: 981px) {
          .detail-grid { grid-template-columns: 1.35fr 1fr; gap: clamp(40px, 4vw, 60px); }
          .booking-col { position: sticky; top: 100px; }
        }
      `}</style>
    </div>
  )
}
