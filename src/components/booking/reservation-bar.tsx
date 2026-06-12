import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import * as Select from '@radix-ui/react-select'
import * as Popover from '@radix-ui/react-popover'
import { CalendarDays, Users, Home, Search, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { RangeCalendar, type Range } from './range-calendar'

const RESIDENCES = [
  { value: 'all', label: 'Toutes les résidences' },
  { value: 'studio-standard', label: 'Studio Standard · 25 000 F' },
  { value: 'studio-premium', label: 'Studio Premium · 45 000 F' },
  { value: 'appartement-2-pieces-premium', label: 'Appartement 2 Pièces · 60 000 F' },
]
const GUESTS = ['1', '2', '3', '4']
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

const fmt = (s: string) => {
  const [, m, d] = s.split('-').map(Number)
  return `${d} ${MONTHS_SHORT[m - 1]}`
}

/** Barre de réservation type hôtel : dates + voyageurs + résidence, tout en custom (pas de natif). */
export function ReservationBar() {
  const navigate = useNavigate()
  const [range, setRange] = useState<Range>({})
  const [guests, setGuests] = useState('2')
  const [residence, setResidence] = useState('all')
  const [calOpen, setCalOpen] = useState(false)

  function onRange(r: Range) {
    setRange(r)
    if (r.checkIn && r.checkOut) setCalOpen(false)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (residence !== 'all') {
      navigate({
        to: '/studios/$slug',
        params: { slug: residence },
        search: { checkIn: range.checkIn || undefined, checkOut: range.checkOut || undefined, guests },
      })
    } else {
      navigate({ to: '/studios' })
    }
  }

  const dateLabel = range.checkIn
    ? range.checkOut ? `${fmt(range.checkIn)} → ${fmt(range.checkOut)}` : `${fmt(range.checkIn)} → départ`
    : 'Choisir les dates'

  return (
    <form className="rbar" onSubmit={onSubmit}>
      {/* Dates */}
      <Popover.Root open={calOpen} onOpenChange={setCalOpen}>
        <div className="rbar-field">
          <span className="rbar-label"><CalendarDays size={13} /> Séjour</span>
          <Popover.Trigger asChild>
            <button type="button" className={`rbar-val${range.checkIn ? '' : ' is-ph'}`}>
              <span className="rbar-val-txt">{dateLabel}</span>
              <ChevronDown size={14} className="rbar-chev" />
            </button>
          </Popover.Trigger>
        </div>
        <Popover.Portal>
          <Popover.Content className="rbar-cal-pop" sideOffset={12} align="center" collisionPadding={14}>
            <RangeCalendar value={range} onChange={onRange} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <span className="rbar-div" aria-hidden />

      {/* Voyageurs */}
      <div className="rbar-field">
        <span className="rbar-label"><Users size={13} /> Voyageurs</span>
        <SelectField
          value={guests} onChange={setGuests}
          options={GUESTS.map((g) => ({ value: g, label: `${g} voyageur${g === '1' ? '' : 's'}` }))}
        />
      </div>

      <span className="rbar-div" aria-hidden />

      {/* Résidence */}
      <div className="rbar-field">
        <span className="rbar-label"><Home size={13} /> Résidence</span>
        <SelectField value={residence} onChange={setResidence} options={RESIDENCES} />
      </div>

      <button type="submit" className="rbar-submit">
        <Search size={17} /> <span>Vérifier les disponibilités</span>
      </button>

      <style>{`
        /* Base = mobile : grille 2 colonnes compacte */
        .rbar {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
          background: var(--paper); border: 1px solid var(--line); border-radius: 16px;
          padding: 7px; box-shadow: 0 26px 54px -28px rgba(0,0,0,0.5);
        }
        .rbar-field { display: flex; flex-direction: column; gap: 3px; padding: 9px 13px; border-radius: 11px; min-width: 0; transition: background 0.2s ease; }
        .rbar-field:hover, .rbar-field:focus-within { background: var(--gold-wash); }
        .rbar-label { display: inline-flex; align-items: center; gap: 6px; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); }
        .rbar-label svg { color: var(--gold-deep); }
        .rbar-val {
          display: flex; align-items: center; justify-content: space-between; gap: 6px;
          width: 100%; border: none; background: transparent; padding: 0; margin: 0; cursor: pointer;
          font-family: var(--font-body); font-size: 0.86rem; font-weight: 600; color: var(--noir);
          outline: none; min-height: 22px; text-align: left;
        }
        .rbar-val.is-ph .rbar-val-txt { color: var(--muted); font-weight: 500; }
        .rbar-val-txt { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rbar-chev { color: var(--gold-deep); flex-shrink: 0; transition: transform 0.2s ease; }
        .rbar-val[data-state="open"] .rbar-chev { transform: rotate(180deg); }
        .rbar-div { display: none; }
        .rbar-submit {
          grid-column: 1 / -1;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 2px; padding: 13px 18px; min-height: 48px;
          background: var(--gold); color: #2A1E08; border: none; border-radius: 11px;
          font-family: var(--font-body); font-weight: 700; font-size: 0.85rem; cursor: pointer;
          box-shadow: 0 14px 28px -14px rgba(138,101,38,0.9);
          transition: background 0.25s ease, transform 0.2s ease;
        }
        .rbar-submit:hover { background: var(--gold-deep); color: #FFF8EA; transform: translateY(-1px); }

        /* Desktop : pilule horizontale (hero validé) */
        @media (min-width: 880px) {
          .rbar { grid-template-columns: minmax(180px,1.1fr) auto minmax(130px,0.8fr) auto minmax(150px,1fr) auto; align-items: center; gap: 0; padding: 7px 7px 7px 10px; border-radius: 999px; }
          .rbar-field { padding: 8px 18px; gap: 4px; border-radius: 16px; }
          .rbar-label { font-size: 0.64rem; letter-spacing: 0.08em; }
          .rbar-val { font-size: 0.92rem; min-height: 24px; }
          .rbar-div { display: block; align-self: center; width: 1px; height: 34px; background: var(--line); }
          .rbar-submit { grid-column: auto; margin-top: 0; margin-left: 8px; border-radius: 999px; padding: 16px 26px; min-height: 56px; font-size: 0.9rem; white-space: nowrap; }
        }

        /* Menus déroulants custom (Radix, rendus en portail dans body) */
        .rbar-pop, .rbar-cal-pop {
          background: var(--paper); border: 1px solid var(--line); border-radius: 14px;
          box-shadow: 0 26px 56px -22px rgba(34,28,19,0.55); padding: 6px; z-index: 80;
          min-width: var(--radix-select-trigger-width); max-width: 92vw;
          animation: rbarPop 0.16s var(--ease);
        }
        .rbar-cal-pop { padding: 14px; }
        @keyframes rbarPop { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .rbar-opt {
          display: flex; align-items: center; justify-content: space-between; gap: 18px;
          padding: 11px 14px; border-radius: 10px; cursor: pointer; outline: none;
          font-size: 0.9rem; font-weight: 500; color: var(--ink); white-space: nowrap; user-select: none;
        }
        .rbar-opt[data-highlighted] { background: var(--gold-wash); color: var(--gold-deep); }
        .rbar-opt[data-state="checked"] { color: var(--gold-deep); font-weight: 600; }
        .rbar-opt-ic { color: var(--gold-deep); display: inline-flex; }
      `}</style>
    </form>
  )
}

function SelectField({
  value, onChange, options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="rbar-val" aria-label="Sélection">
        <Select.Value className="rbar-val-txt" />
        <Select.Icon><ChevronDown size={14} className="rbar-chev" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="rbar-pop" position="popper" sideOffset={12} align="start">
          <Select.Viewport>
            {options.map((o) => (
              <Select.Item key={o.value} value={o.value} className="rbar-opt">
                <Select.ItemText>{o.label}</Select.ItemText>
                <Select.ItemIndicator className="rbar-opt-ic"><Check size={15} /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

/** CTA de réservation collant (mobile) : apparaît une fois le hero dépassé,
 *  et se masque près du bas de page pour ne pas couvrir la section contact / footer. */
export function StickyBookingCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    // Vrai dès qu'une zone basse (#reserver ou footer) entre dans le viewport.
    let bottomVisible = false

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.85
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 160
      setShow(pastHero && !nearBottom && !bottomVisible)
    }

    const targets: Element[] = []
    const reserver = document.getElementById('reserver')
    const footer = document.querySelector('footer.byoma-footer') || document.querySelector('footer')
    if (reserver) targets.push(reserver)
    if (footer) targets.push(footer)

    let observer: IntersectionObserver | null = null
    if (targets.length > 0 && typeof IntersectionObserver !== 'undefined') {
      const visible = new Set<Element>()
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) visible.add(e.target)
            else visible.delete(e.target)
          }
          bottomVisible = visible.size > 0
          onScroll()
        },
        { rootMargin: '0px 0px -10% 0px' },
      )
      for (const t of targets) observer.observe(t)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      observer?.disconnect()
    }
  }, [])

  return (
    <Link to="/studios" className={`sticky-cta ${show ? 'show' : ''}`} aria-hidden={!show}>
      <span className="sticky-cta-info">
        <span className="sticky-cta-label">À partir de</span>
        <span className="sticky-cta-price">25 000 F <em>/ nuit</em></span>
      </span>
      <span className="sticky-cta-btn">Réserver <ArrowRight size={16} /></span>
      <style>{`
        .sticky-cta {
          position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 55;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 10px 12px 10px 20px;
          background: rgba(24,20,13,0.96); backdrop-filter: blur(12px);
          border: 1px solid rgba(217,185,120,0.28); border-radius: 16px;
          box-shadow: 0 20px 40px -18px rgba(0,0,0,0.6);
          transform: translateY(140%); opacity: 0; pointer-events: none;
          transition: transform 0.4s var(--ease), opacity 0.3s ease;
        }
        .sticky-cta.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
        /* Menu mobile ouvert : on masque le CTA collant pour ne pas couvrir le bouton du menu. */
        body.nav-open .sticky-cta { opacity: 0 !important; pointer-events: none !important; transform: translateY(140%) !important; }
        .sticky-cta-info { display: flex; flex-direction: column; line-height: 1.1; }
        .sticky-cta-label { font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(251,247,238,0.6); }
        .sticky-cta-price { font-family: var(--font-display); font-size: 1.2rem; font-weight: 600; color: var(--gold-soft); margin-top: 2px; }
        .sticky-cta-price em { font-family: var(--font-body); font-style: normal; font-size: 0.74rem; color: rgba(251,247,238,0.6); font-weight: 500; }
        .sticky-cta-btn { display: inline-flex; align-items: center; gap: 7px; padding: 13px 20px; background: var(--gold); color: #2A1E08; border-radius: 999px; font-weight: 700; font-size: 0.88rem; }
        @media (min-width: 721px) { .sticky-cta { display: none; } }
      `}</style>
    </Link>
  )
}
