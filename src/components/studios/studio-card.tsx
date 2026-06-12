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
    <Link to="/studios/$slug" params={{ slug: studio.slug }} className="studio-card">
      <div className="ph" style={{ position: 'relative', aspectRatio: '4 / 5' }}>
        <img
          src={studio.photos[0]}
          alt={studio.name}
          loading={index < 2 ? 'eager' : 'lazy'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span className="index-num" style={{ position: 'absolute', top: 16, left: 18, color: 'var(--ivory)', mixBlendMode: 'difference' }}>
          0{index + 1}
        </span>
        <span style={{ position: 'absolute', top: 16, right: 16, padding: '5px 11px', background: 'rgba(21,18,11,0.62)', backdropFilter: 'blur(4px)', color: 'var(--gold-soft)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {CATEGORY_LABEL[studio.category]}
        </span>
      </div>

      <div style={{ padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 className="font-display" style={{ fontSize: '1.65rem', fontWeight: 500, color: 'var(--noir)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.01em' }}>
          {studio.name}
        </h3>
        <p style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6, flex: 1 }}>
          {studio.shortDescription}
        </p>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>À partir de</div>
            <div className="font-display" style={{ fontSize: '1.7rem', fontWeight: 500, color: 'var(--gold-deep)', lineHeight: 1 }}>
              {formatXOF(studio.pricePerDay)}
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-body)' }}> /24h</span>
            </div>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontSize: '0.78rem' }}>
              <Users size={13} /> {studio.maxGuests}
            </span>
            <span style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gold-deep)', color: 'var(--gold-deep)' }}>
              <ArrowRight size={15} />
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
