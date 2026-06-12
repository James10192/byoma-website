import { Link } from '@tanstack/react-router'
import { ArrowRight, Users } from 'lucide-react'
import { formatXOF } from '../../lib/format'

/** Sous-ensemble suffisant pour la carte — compatible Doc<'studios'> et fallback statique. */
export type StudioSummary = {
  slug: string
  name: string
  shortDescription: string
  category: 'standard' | 'premium' | 'appartement'
  pricePerDay: number
  photos: string[]
  maxGuests: number
}

const CATEGORY_LABEL: Record<StudioSummary['category'], string> = {
  standard: 'Standard',
  premium: 'Premium',
  appartement: 'Appartement',
}

export function StudioCard({ studio, index = 0 }: { studio: StudioSummary; index?: number }) {
  return (
    <Link to="/studios/$slug" params={{ slug: studio.slug }} search={{}} className="studio-card">
      <div className="ph" style={{ position: 'relative', aspectRatio: '4 / 5' }}>
        <img
          src={studio.photos[0]}
          alt={studio.name}
          loading={index < 2 ? 'eager' : 'lazy'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span style={{ position: 'absolute', top: 14, left: 14, padding: '6px 12px', background: 'rgba(27,23,16,0.68)', backdropFilter: 'blur(5px)', color: 'var(--gold-soft)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', borderRadius: 999 }}>
          {CATEGORY_LABEL[studio.category]}
        </span>
      </div>

      <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--noir)', lineHeight: 1.12, margin: 0, letterSpacing: '-0.01em' }}>
            {studio.name}
          </h3>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontSize: '0.78rem', flexShrink: 0 }}>
            <Users size={13} /> {studio.maxGuests}
          </span>
        </div>
        <p style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, flex: 1 }}>
          {studio.shortDescription}
        </p>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.64rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>À partir de</div>
            <div className="price-tag" style={{ fontSize: '1.6rem' }}>
              {formatXOF(studio.pricePerDay)}
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 500 }}> / nuit</span>
            </div>
          </div>
          <span style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: 'var(--gold-wash)', border: '1px solid var(--gold-deep)', color: 'var(--gold-deep)' }}>
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  )
}
