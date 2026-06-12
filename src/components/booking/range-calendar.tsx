import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['lu', 'ma', 'me', 'je', 've', 'sa', 'di']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

export type Range = { checkIn?: string; checkOut?: string }

/**
 * Sélecteur de plage de dates compact (1 mois), sans dépendance backend.
 * Premier clic = arrivée, second clic (après) = départ. Jours passés désactivés.
 * La vérification réelle de disponibilité se fait sur la fiche (Convex).
 */
export function RangeCalendar({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  const now = new Date()
  const todayStr = iso(now.getFullYear(), now.getMonth(), now.getDate())
  const base = value.checkIn ? new Date(value.checkIn + 'T00:00:00') : now
  const [view, setView] = useState({ y: base.getFullYear(), m: base.getMonth() })
  const [hover, setHover] = useState<string | null>(null)

  const startWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7 // lundi = 0
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()

  const cells: (string | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(iso(view.y, view.m, d))

  const { checkIn, checkOut } = value
  const inRange = (s: string) => !!checkIn && !!checkOut && s > checkIn && s < checkOut
  const inHover = (s: string) => !!checkIn && !checkOut && !!hover && s > checkIn && s <= hover

  function pick(s: string) {
    if (s < todayStr) return
    if (!checkIn || checkOut || s <= checkIn) onChange({ checkIn: s, checkOut: undefined })
    else onChange({ checkIn, checkOut: s })
  }

  const prevDisabled = view.y < now.getFullYear() || (view.y === now.getFullYear() && view.m <= now.getMonth())
  const go = (delta: number) => setView((v) => {
    const m = v.m + delta
    if (m < 0) return { y: v.y - 1, m: 11 }
    if (m > 11) return { y: v.y + 1, m: 0 }
    return { ...v, m }
  })

  return (
    <div className="rcal">
      <div className="rcal-head">
        <button type="button" className="rcal-nav" disabled={prevDisabled} onClick={() => go(-1)} aria-label="Mois précédent"><ChevronLeft size={16} /></button>
        <span className="rcal-title">{MONTHS[view.m]} {view.y}</span>
        <button type="button" className="rcal-nav" onClick={() => go(1)} aria-label="Mois suivant"><ChevronRight size={16} /></button>
      </div>
      <div className="rcal-grid rcal-wd">{WEEKDAYS.map((w, i) => <span key={i}>{w}</span>)}</div>
      <div className="rcal-grid" onMouseLeave={() => setHover(null)}>
        {cells.map((s, i) => s === null ? <span key={i} /> : (
          <button
            type="button" key={i} disabled={s < todayStr}
            onMouseEnter={() => setHover(s)} onClick={() => pick(s)}
            className={[
              'rcal-day',
              s < todayStr ? 'past' : '',
              s === checkIn || s === checkOut ? 'sel' : '',
              inRange(s) || inHover(s) ? 'inr' : '',
              s === todayStr ? 'today' : '',
            ].filter(Boolean).join(' ')}
          >
            {Number(s.slice(-2))}
          </button>
        ))}
      </div>

      <style>{`
        .rcal { width: 296px; max-width: 86vw; padding: 4px 2px; }
        .rcal-head { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 12px; }
        .rcal-title { font-family: var(--font-display); font-size: 1.02rem; font-weight: 600; color: var(--noir); }
        .rcal-nav { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; border: 1px solid var(--line); background: var(--paper); color: var(--noir); cursor: pointer; transition: background 0.2s ease, border-color 0.2s ease; }
        .rcal-nav:hover:not(:disabled) { background: var(--gold-wash); border-color: var(--gold-soft); color: var(--gold-deep); }
        .rcal-nav:disabled { opacity: 0.32; cursor: not-allowed; }
        .rcal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .rcal-wd { margin-bottom: 4px; }
        .rcal-wd span { text-align: center; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); padding: 4px 0; }
        .rcal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: none; background: transparent; font-family: var(--font-body); font-size: 0.84rem; color: var(--ink); border-radius: 9px; cursor: pointer; transition: background 0.15s ease, color 0.15s ease; }
        .rcal-day:hover:not(:disabled):not(.sel) { background: var(--gold-wash); color: var(--gold-deep); }
        .rcal-day.inr { background: var(--gold-wash); color: var(--gold-deep); border-radius: 0; }
        .rcal-day.sel { background: var(--noir); color: var(--gold-soft); font-weight: 600; }
        .rcal-day.today:not(.sel) { box-shadow: inset 0 0 0 1.5px var(--gold-deep); }
        .rcal-day.past { opacity: 0.28; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
