import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { StudioCard } from '../../components/studios/studio-card'
import { FALLBACK_STUDIOS } from '../../lib/studios-fallback'
import { Stagger } from '../../components/fx/gsap-fx'

export const Route = createFileRoute('/studios/')({
  component: StudiosPage,
  head: () => ({
    meta: [
      { title: 'Nos résidences — Les Résidences BYOMA' },
      { name: 'description', content: 'Studios et appartements meublés à Abidjan : Standard, Premium et Appartement 2 pièces. Disponibilités en temps réel et réservation en ligne.' },
    ],
  }),
})

function StudiosPage() {
  const studios = useQuery(api.studios.list)
  const items = studios ?? FALLBACK_STUDIOS

  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', padding: 'clamp(118px,15vw,180px) clamp(24px,5vw,68px) clamp(72px,10vw,120px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <header style={{ maxWidth: 720, marginBottom: 'clamp(40px,6vw,68px)' }} className="fade-up">
          <span className="kicker">Nos résidences</span>
          <h1 className="section-title" style={{ marginTop: 16 }}>Choisissez votre <em style={{ fontStyle: 'italic', color: 'var(--gold-deep)', fontWeight: 300 }}>adresse</em></h1>
          <p style={{ marginTop: 18, color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.75 }}>
            Sélectionnez une résidence pour découvrir ses photos, ses équipements et ses disponibilités en temps réel, puis réservez en quelques clics.
          </p>
          <div className="rule" style={{ marginTop: 28, maxWidth: 160 }} />
        </header>

        <Stagger className="studios-list-grid" stagger={0.08} start="top 88%">
          {items.map((s, i) => <StudioCard key={s.slug} studio={s} index={i} />)}
        </Stagger>
      </div>

      <style>{`
        .studios-list-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px,2vw,28px); }
        .skeleton-card { aspect-ratio: 3 / 4.6; background: linear-gradient(100deg, var(--ivory-2) 30%, #e6dcc8 50%, var(--ivory-2) 70%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        @media (max-width: 980px) { .studios-list-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .studios-list-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
