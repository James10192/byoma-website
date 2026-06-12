import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2, AlertCircle, Lock } from 'lucide-react'
import { authClient, useSession } from '../../lib/auth/auth-client'

export const Route = createFileRoute('/admin/connexion')({
  component: LoginPage,
  head: () => ({ meta: [{ title: 'Connexion administration — BYOMA' }, { name: 'robots', content: 'noindex' }] }),
})

function LoginPage() {
  const { data: session } = useSession()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) navigate({ to: '/admin/reservations', replace: true })
  }, [session, navigate])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')
    if (!email || !password) {
      setError('Renseignez votre e-mail et votre mot de passe.')
      return
    }
    setSubmitting(true)
    const { error: authError } = await authClient.signIn.email({ email, password, rememberMe: true })
    if (authError) {
      setError('Identifiants incorrects.')
      setSubmitting(false)
      return
    }
    // Rechargement pour propager le JWT à Convex.
    window.location.href = '/admin/reservations'
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', display: 'block' }}>LES RÉSIDENCES</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.25rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em', display: 'block' }}>BYOMA</span>
          <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>Administration</span>
        </div>

        <form onSubmit={onSubmit} style={{ background: 'var(--surface)', borderRadius: 6, padding: 28 }}>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--dark)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={18} color="var(--gold-dark)" /> Connexion
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-2)', margin: '0 0 20px' }}>Espace réservé à l'équipe BYOMA.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted-2)', marginBottom: 6 }}>E-mail</span>
              <input name="email" type="email" className="input-byoma" placeholder="admin@byoma.ci" autoComplete="email" />
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted-2)', marginBottom: 6 }}>Mot de passe</span>
              <input name="password" type="password" className="input-byoma" placeholder="••••••••" autoComplete="current-password" />
            </label>
          </div>

          {error && (
            <div role="alert" style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', background: 'var(--error-light)', border: '1px solid #F0C9C4', borderRadius: 4, padding: '10px 12px', color: 'var(--error)', fontSize: '0.875rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="btn-gold" disabled={submitting} style={{ marginTop: 20, width: '100%', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? <Loader2 size={16} className="spin" /> : null}
            {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}`}</style>
      </div>
    </div>
  )
}
