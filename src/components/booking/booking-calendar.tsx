import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

export type DateRange = { checkIn: string; checkOut: string } | null

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

/** 'YYYY-MM-DD' en heure locale (évite les décalages UTC). */
function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Itère chaque jour de [start, end) inclus -> exclus. */
function eachDay(start: string, end: string, cb: (s: string) => void) {
  const d = new Date(start + 'T00:00:00')
  const last = new Date(end + 'T00:00:00')
  while (d < last) {
    cb(iso(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setDate(d.getDate() + 1)
  }
}

export function BookingCalendar({
  studioId,
  onSelect,
  initialRange,
}: {
  studioId: Id<'studios'>
  onSelect: (range: DateRange) => void
  initialRange?: DateRange
}) {
  const data = useQuery(api.reservations.getBookedDates, { studioId })

  const now = new Date()
  const todayStr = iso(now.getFullYear(), now.getMonth(), now.getDate())
  const initBase = initialRange ? new Date(initialRange.checkIn + 'T00:00:00') : now
  const [view, setView] = useState({ y: initBase.getFullYear(), m: initBase.getMonth() })
  const [start, setStart] = useState<string | null>(initialRange?.checkIn ?? null)
  const [end, setEnd] = useState<string | null>(initialRange?.checkOut ?? null)
  const [hover, setHover] = useState<string | null>(null)

  // Propage une fois la plage initiale (dates choisies depuis la barre de réservation du hero).
  useEffect(() => {
    if (initialRange) onSelect(initialRange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ensemble des jours indisponibles (réservations + périodes bloquées).
  const unavailable = useMemo(() => {
    const set = new Set<string>()
    if (data) {
      for (const r of data.reservations) eachDay(r.checkIn, r.checkOut, (s) => set.add(s))
      for (const b of data.blocked) eachDay(b.startDate, b.endDate, (s) => set.add(s))
    }
    return set
  }, [data])

  const canCheckout = (from: string, to: string) => {
    let ok = true
    eachDay(from, to, (s) => {
      if (unavailable.has(s)) ok = false
    })
    return ok
  }

  function pick(day: string) {
    if (day < todayStr || unavailable.has(day)) return
    if (!start || (start && end)) {
      setStart(day)
      setEnd(null)
      onSelect(null)
      return
    }
    if (day <= start) {
      setStart(day)
      return
    }
    if (canCheckout(start, day)) {
      setEnd(day)
      onSelect({ checkIn: start, checkOut: day })
    } else {
      // Un jour réservé tombe dans la plage : on recommence à ce jour.
      setStart(day)
      setEnd(null)
      onSelect(null)
    }
  }

  function reset() {
    setStart(null)
    setEnd(null)
    setHover(null)
    onSelect(null)
  }

  const inRange = (day: string) => {
    const right = end ?? (start && hover && hover > start ? hover : null)
    return start && right ? day > start && day < right : false
  }

  // Construction de la grille du mois courant.
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7 // Lundi = 0
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells: Array<number | null> = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const atMinMonth = view.y === now.getFullYear() && view.m === now.getMonth()
  const move = (dir: number) => {
    setView((v) => {
      const m = v.m + dir
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button type="button" onClick={() => move(-1)} disabled={atMinMonth} aria-label="Mois précédent" style={navBtn(atMinMonth)}>
          <ChevronLeft size={18} />
        </button>
        <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--noir)' }}>
          {MONTHS[view.m]} {view.y}
        </span>
        <button type="button" onClick={() => move(1)} aria-label="Mois suivant" style={navBtn(false)}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {WEEKDAYS.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }} role="grid">
        {cells.map((day, i) => {
          if (day == null) return <div key={`e${i}`} />
          const ds = iso(view.y, view.m, day)
          const past = ds < todayStr
          const booked = unavailable.has(ds)
          const isStart = ds === start
          const isEnd = ds === end
          const selected = isStart || isEnd
          const range = inRange(ds)
          const cls = [
            'cal-day',
            past ? 'past' : '',
            booked ? 'booked' : !past ? 'available' : '',
            selected ? 'selected' : '',
            range ? 'in-range' : '',
            ds === todayStr ? 'today' : '',
          ].filter(Boolean).join(' ')
          return (
            <button
              key={ds}
              type="button"
              className={cls}
              disabled={past || booked}
              onClick={() => pick(ds)}
              onMouseEnter={() => setHover(ds)}
              aria-label={`${day} ${MONTHS[view.m]}${booked ? ' — indisponible' : ''}`}
              style={{ border: 'none', background: 'transparent', font: 'inherit', color: 'inherit' }}
            >
              {day}
            </button>
          )
        })}
      </div>

      {(start || end) && (
        <button
          type="button"
          onClick={reset}
          style={{ marginTop: 14, background: 'none', border: 'none', color: 'var(--gold-deep)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          Réinitialiser les dates
        </button>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
        <Legend swatch="var(--noir)" label="Sélection" />
        <Legend swatch="var(--gold-wash)" label="Indisponible" border />
        <Legend swatch="var(--paper)" label="Disponible" border />
      </div>
    </div>
  )
}

function navBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--paper)',
    border: '1px solid var(--line)',
    borderRadius: '50%',
    color: disabled ? 'var(--line)' : 'var(--ink-soft)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color 0.2s var(--ease), color 0.2s var(--ease)',
  }
}

function Legend({ swatch, label, border }: { swatch: string; label: string; border?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 13, height: 13, borderRadius: 2, background: swatch, border: border ? '1px solid var(--line)' : 'none' }} />
      {label}
    </span>
  )
}
