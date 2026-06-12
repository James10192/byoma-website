import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { Check, X, Ban, Phone, Mail, MessageSquare, Loader2, Inbox } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import { AdminShell } from '../../components/admin/admin-shell'
import { formatXOF, formatDate } from '../../lib/format'

export const Route = createFileRoute('/admin/reservations')({
  component: () => (
    <AdminShell title="Réservations">
      <ReservationsView />
    </AdminShell>
  ),
  head: () => ({ meta: [{ title: 'Réservations — Administration BYOMA' }, { name: 'robots', content: 'noindex' }] }),
})

type Status = 'pending' | 'confirmed' | 'refused' | 'cancelled'

const TABS: Array<{ key: Status | 'all'; label: string }> = [
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'refused', label: 'Refusées' },
  { key: 'cancelled', label: 'Annulées' },
  { key: 'all', label: 'Toutes' },
]

const STATUS_META: Record<Status, { label: string; bg: string; color: string; border: string }> = {
  pending: { label: 'En attente', bg: 'var(--warning-light)', color: 'var(--warning)', border: '#F0E0A8' },
  confirmed: { label: 'Confirmée', bg: 'var(--success-light)', color: 'var(--success)', border: '#B8E0C8' },
  refused: { label: 'Refusée', bg: 'var(--error-light)', color: 'var(--error)', border: '#F0C9C4' },
  cancelled: { label: 'Annulée', bg: 'var(--cream-2)', color: 'var(--muted)', border: 'var(--line)' },
}

function ReservationsView() {
  const [tab, setTab] = useState<Status | 'all'>('pending')
  const reservations = useQuery(api.reservations.listAll, {})
  const studios = useQuery(api.studios.list)

  const studioName = useMemo(() => {
    const m = new Map<string, string>()
    studios?.forEach((s) => m.set(s._id, s.name))
    return m
  }, [studios])

  const filtered = useMemo(() => {
    if (!reservations) return undefined
    return tab === 'all' ? reservations : reservations.filter((r) => r.status === tab)
  }, [reservations, tab])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    reservations?.forEach((r) => { c[r.status] = (c[r.status] ?? 0) + 1 })
    c.all = reservations?.length ?? 0
    return c
  }, [reservations])

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 3,
                border: active ? '1px solid var(--gold)' : '1px solid var(--line)',
                background: active ? 'var(--gold)' : 'var(--surface)',
                color: active ? 'var(--dark)' : 'var(--muted-2)',
                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {t.label}
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{counts[t.key] ?? 0}</span>
            </button>
          )
        })}
      </div>

      {filtered === undefined ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader2 size={24} className="spin" color="var(--gold)" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <Inbox size={40} color="var(--line)" style={{ marginBottom: 12 }} />
          <p>Aucune réservation dans cette catégorie.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((r) => (
            <ReservationCard key={r._id} r={r} studioName={studioName.get(r.studioId) ?? 'Logement'} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}`}</style>
    </div>
  )
}

function ReservationCard({ r, studioName }: { r: Doc<'reservations'>; studioName: string }) {
  const updateStatus = useMutation(api.reservations.updateStatus)
  const [busy, setBusy] = useState(false)
  const meta = STATUS_META[r.status]

  async function act(status: 'confirmed' | 'refused' | 'cancelled') {
    setBusy(true)
    try {
      await updateStatus({ id: r._id as Id<'reservations'>, status })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 4, padding: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dark)', margin: 0 }}>{studioName}</h3>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 2, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
              {meta.label}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', color: 'var(--muted-2)', fontSize: '0.875rem' }}>
            {formatDate(r.checkIn)} → {formatDate(r.checkOut)} · {r.totalDays} {r.totalDays > 1 ? 'nuits' : 'nuit'}
          </p>
        </div>
        <div className="font-display" style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{formatXOF(r.totalPrice)}</div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--cream-2)', display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: '0.875rem', color: 'var(--ink)' }}>
        <span style={{ fontWeight: 600 }}>{r.clientName}</span>
        <a href={`tel:${r.clientPhone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted-2)', textDecoration: 'none' }}><Phone size={14} color="var(--gold)" /> {r.clientPhone}</a>
        {r.clientEmail && <a href={`mailto:${r.clientEmail}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted-2)', textDecoration: 'none' }}><Mail size={14} color="var(--gold)" /> {r.clientEmail}</a>}
      </div>

      {r.clientMessage && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'flex-start', background: 'var(--cream)', borderRadius: 4, padding: '10px 12px', fontSize: '0.875rem', color: 'var(--muted-2)' }}>
          <MessageSquare size={15} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{r.clientMessage}</span>
        </div>
      )}

      {/* Actions selon statut */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {r.status === 'pending' && (
          <>
            <button type="button" onClick={() => act('confirmed')} disabled={busy} style={actionBtn('var(--success)', '#fff')}>
              {busy ? <Loader2 size={15} className="spin" /> : <Check size={15} />} Confirmer
            </button>
            <button type="button" onClick={() => act('refused')} disabled={busy} style={actionBtn('var(--surface)', 'var(--error)', 'var(--error)')}>
              <X size={15} /> Refuser
            </button>
          </>
        )}
        {r.status === 'confirmed' && (
          <button type="button" onClick={() => act('cancelled')} disabled={busy} style={actionBtn('var(--surface)', 'var(--muted-2)', 'var(--line)')}>
            <Ban size={15} /> Annuler la réservation
          </button>
        )}
        {(r.status === 'refused' || r.status === 'cancelled') && (
          <button type="button" onClick={() => act('confirmed')} disabled={busy} style={actionBtn('var(--surface)', 'var(--success)', '#B8E0C8')}>
            <Check size={15} /> Reconfirmer
          </button>
        )}
      </div>
    </div>
  )
}

function actionBtn(bg: string, color: string, border?: string): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 3,
    background: bg, color, border: `1px solid ${border ?? bg}`, fontWeight: 600, fontSize: '0.8125rem',
    cursor: 'pointer', fontFamily: 'inherit',
  }
}
