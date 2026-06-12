import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { Plus, Trash2, Loader2, CalendarX2, AlertCircle } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { AdminShell } from '../../components/admin/admin-shell'
import { formatDate } from '../../lib/format'

export const Route = createFileRoute('/admin/disponibilites')({
  component: () => (
    <AdminShell title="Disponibilités">
      <AvailabilityView />
    </AdminShell>
  ),
  head: () => ({ meta: [{ title: 'Disponibilités — Administration BYOMA' }, { name: 'robots', content: 'noindex' }] }),
})

function AvailabilityView() {
  const studios = useQuery(api.studios.list)
  const [studioId, setStudioId] = useState<Id<'studios'> | null>(null)

  useEffect(() => {
    if (studios && studios.length > 0 && !studioId) setStudioId(studios[0]._id)
  }, [studios, studioId])

  return (
    <div>
      <p style={{ color: 'var(--muted-2)', fontSize: '0.9375rem', marginTop: 0, marginBottom: 22, maxWidth: 640 }}>
        Bloquez des périodes d'indisponibilité (entretien, séjour propriétaire, mise hors-ligne). Ces dates apparaissent
        immédiatement comme indisponibles dans le calendrier de réservation du site.
      </p>

      {/* Sélecteur de logement */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {studios?.map((s) => {
          const active = s._id === studioId
          return (
            <button
              key={s._id}
              type="button"
              onClick={() => setStudioId(s._id)}
              style={{
                padding: '9px 16px', borderRadius: 3, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit',
                border: active ? '1px solid var(--gold)' : '1px solid var(--line)',
                background: active ? 'var(--gold)' : 'var(--surface)',
                color: active ? 'var(--dark)' : 'var(--muted-2)',
              }}
            >
              {s.name}
            </button>
          )
        })}
      </div>

      {studioId ? <StudioBlocks studioId={studioId} /> : (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader2 size={24} className="spin" color="var(--gold)" />
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}`}</style>
    </div>
  )
}

function StudioBlocks({ studioId }: { studioId: Id<'studios'> }) {
  const periods = useQuery(api.reservations.getBlockedPeriods, { studioId })
  const block = useMutation(api.reservations.blockPeriod)
  const unblock = useMutation(api.reservations.unblockPeriod)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const startDate = String(fd.get('startDate') ?? '')
    const endDate = String(fd.get('endDate') ?? '')
    const reason = String(fd.get('reason') ?? '').trim()
    if (!startDate || !endDate) { setError('Indiquez une date de début et de fin.'); return }
    if (endDate <= startDate) { setError('La date de fin doit être après la date de début.'); return }
    setBusy(true)
    try {
      await block({ studioId, startDate, endDate, reason: reason || undefined })
      e.currentTarget.reset()
    } catch {
      setError('Impossible d\'enregistrer ce blocage.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dispo-grid">
      {/* Formulaire d'ajout */}
      <form onSubmit={add} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 4, padding: 22, alignSelf: 'start' }}>
        <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dark)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarX2 size={18} color="var(--gold-dark)" /> Bloquer une période
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted-2)', marginBottom: 6 }}>Du</span>
            <input name="startDate" type="date" className="input-byoma" required />
          </label>
          <label style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted-2)', marginBottom: 6 }}>Au (exclu)</span>
            <input name="endDate" type="date" className="input-byoma" required />
          </label>
          <label style={{ display: 'block' }}>
            <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted-2)', marginBottom: 6 }}>Motif (facultatif)</span>
            <input name="reason" className="input-byoma" placeholder="Entretien, séjour propriétaire…" />
          </label>
        </div>
        {error && (
          <div role="alert" style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center', background: 'var(--error-light)', border: '1px solid #F0C9C4', borderRadius: 4, padding: '10px 12px', color: 'var(--error)', fontSize: '0.875rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <button type="submit" className="btn-gold" disabled={busy} style={{ marginTop: 18, width: '100%', opacity: busy ? 0.7 : 1 }}>
          {busy ? <Loader2 size={15} className="spin" /> : <Plus size={16} />} Bloquer ces dates
        </button>
      </form>

      {/* Liste des périodes bloquées */}
      <div>
        <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dark)', margin: '0 0 16px' }}>Périodes bloquées</h3>
        {periods === undefined ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader2 size={22} className="spin" color="var(--gold)" /></div>
        ) : periods.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>Aucune période bloquée pour ce logement.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {periods
              .slice()
              .sort((a, b) => a.startDate.localeCompare(b.startDate))
              .map((p) => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 4, padding: '14px 16px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--dark)', fontSize: '0.9375rem' }}>
                      {formatDate(p.startDate)} → {formatDate(p.endDate)}
                    </div>
                    {p.reason && <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: 2 }}>{p.reason}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => unblock({ id: p._id as Id<'blockedPeriods'> })}
                    aria-label="Supprimer ce blocage"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 3, color: 'var(--error)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <Trash2 size={14} /> Retirer
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <style>{`
        .dispo-grid { display: grid; grid-template-columns: 360px 1fr; gap: 32px; align-items: start; }
        @media (max-width: 860px) { .dispo-grid { grid-template-columns: 1fr; gap: 28px; } }
      `}</style>
    </div>
  )
}
