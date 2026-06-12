import { useState } from 'react'
import { useMutation } from 'convex/react'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { CalendarCheck, Loader2, AlertCircle } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import type { DateRange } from './booking-calendar'
import { formatXOF, formatDate, daysBetween } from '../../lib/format'

const schema = z.object({
  clientName: z.string().trim().min(2, 'Indiquez votre nom complet.'),
  clientPhone: z
    .string()
    .trim()
    .min(8, 'Numéro de téléphone invalide.')
    .regex(/^[0-9 +]+$/, 'Numéro de téléphone invalide.'),
  clientEmail: z.string().trim().email('Adresse e-mail invalide.').optional().or(z.literal('')),
  clientMessage: z.string().trim().max(600, 'Message trop long.').optional(),
})

export function BookingForm({ studio, range }: { studio: Doc<'studios'>; range: DateRange }) {
  const navigate = useNavigate()
  const create = useMutation(api.reservations.create)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const days = range ? daysBetween(range.checkIn, range.checkOut) : 0
  const total = days * studio.pricePerDay

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setErrors({})

    if (!range) {
      setError('Veuillez sélectionner vos dates de séjour dans le calendrier.')
      return
    }

    const fd = new FormData(e.currentTarget)
    const parsed = schema.safeParse({
      clientName: fd.get('clientName'),
      clientPhone: fd.get('clientPhone'),
      clientEmail: fd.get('clientEmail'),
      clientMessage: fd.get('clientMessage'),
    })

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      const firstKey = Object.keys(fieldErrors)[0]
      if (firstKey) (e.currentTarget.elements.namedItem(firstKey) as HTMLElement | null)?.focus()
      return
    }

    setSubmitting(true)
    try {
      await create({
        studioId: studio._id,
        clientName: parsed.data.clientName,
        clientPhone: parsed.data.clientPhone,
        clientEmail: parsed.data.clientEmail || undefined,
        clientMessage: parsed.data.clientMessage || undefined,
        checkIn: range.checkIn,
        checkOut: range.checkOut,
        totalDays: days,
        totalPrice: total,
      })
      navigate({
        to: '/confirmation',
        search: { studio: studio.name, checkIn: range.checkIn, checkOut: range.checkOut },
      })
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes('disponibles')
          ? 'Ces dates viennent d\'être réservées. Merci de choisir d\'autres dates.'
          : 'Une erreur est survenue. Réessayez ou contactez-nous par téléphone.',
      )
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Récapitulatif prix */}
      <div style={{ background: 'var(--gold-wash)', border: '1px solid var(--gold-soft)', borderRadius: 'var(--radius-sm)', padding: 18, marginBottom: 20 }}>
        {range ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--ink-soft)' }}>
              <span>Arrivée</span>
              <strong style={{ color: 'var(--noir)' }}>{formatDate(range.checkIn)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--ink-soft)', marginTop: 6 }}>
              <span>Départ</span>
              <strong style={{ color: 'var(--noir)' }}>{formatDate(range.checkOut)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--ink-soft)', marginTop: 6 }}>
              <span>{formatXOF(studio.pricePerDay)} × {days} {days > 1 ? 'nuits' : 'nuit'}</span>
              <span />
            </div>
            <div style={{ height: 1, background: 'var(--gold-soft)', opacity: 0.5, margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 600, color: 'var(--noir)' }}>Total estimé</span>
              <span className="price-tag" style={{ fontSize: '1.5rem' }}>{formatXOF(total)}</span>
            </div>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ink-soft)' }}>
            Sélectionnez vos dates dans le calendrier pour voir le total.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Nom complet" error={errors.clientName}>
          <input name="clientName" className="input-byoma" placeholder="Ex. Awa Koné" autoComplete="name" />
        </Field>
        <Field label="Téléphone" error={errors.clientPhone}>
          <input name="clientPhone" className="input-byoma" placeholder="07 00 00 00 00" inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="E-mail (facultatif)" error={errors.clientEmail}>
          <input name="clientEmail" className="input-byoma" placeholder="vous@email.com" inputMode="email" autoComplete="email" />
        </Field>
        <Field label="Message (facultatif)" error={undefined}>
          <textarea name="clientMessage" className="input-byoma" placeholder="Heure d'arrivée prévue, demandes particulières…" />
        </Field>
      </div>

      {error && (
        <div role="alert" style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--error-light)', border: '1px solid #F0C9C4', borderRadius: 'var(--radius-sm)', padding: '12px 14px', color: 'var(--error)', fontSize: '0.875rem' }}>
          <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 20, width: '100%', opacity: submitting ? 0.7 : 1 }}>
        {submitting ? <Loader2 size={16} className="spin" /> : <CalendarCheck size={16} />}
        {submitting ? 'Envoi en cours…' : 'Demander à réserver'}
      </button>

      <p style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
        Votre demande est sans engagement. Nous vous confirmons la disponibilité par téléphone ou WhatsApp.
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } } .spin { animation: spin 0.8s linear infinite }`}</style>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>{label}</span>
      {children}
      {error && <span style={{ display: 'block', marginTop: 5, fontSize: '0.75rem', color: 'var(--error)' }}>{error}</span>}
    </label>
  )
}
