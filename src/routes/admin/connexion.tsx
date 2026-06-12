import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2, AlertCircle } from 'lucide-react'
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
    <div className="login-page">
      <div className="login-card fade-up">
        <div className="login-head">
          <img src="/logo-byoma.png" alt="Les Résidences BYOMA" className="login-logo" />
          <h1 className="section-title login-title">Espace administration</h1>
          <p className="login-sub">Connexion réservée à l'équipe BYOMA.</p>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="login-fields">
            <label className="login-label">
              <span>E-mail</span>
              <input
                name="email"
                type="email"
                className="input-byoma"
                placeholder="admin@byoma.ci"
                autoComplete="email"
                autoFocus
              />
            </label>
            <label className="login-label">
              <span>Mot de passe</span>
              <input
                name="password"
                type="password"
                className="input-byoma"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
          </div>

          {error && (
            <div role="alert" className="login-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="btn-primary login-submit" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="spin" /> : null}
            {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100dvh;
          background: var(--ivory);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(40px, 8vw, 72px) 20px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          box-shadow: var(--shadow-card);
          padding: clamp(28px, 6vw, 44px) clamp(24px, 5vw, 40px);
        }
        .login-head { text-align: center; margin-bottom: clamp(24px, 5vw, 32px); }
        .login-logo {
          display: block;
          height: 52px;
          width: auto;
          margin: 0 auto 20px;
          object-fit: contain;
        }
        .login-title {
          font-size: clamp(1.4rem, 5vw, 1.9rem);
          margin: 0;
        }
        .login-sub {
          margin: 8px 0 0;
          font-size: 0.9rem;
          color: var(--ink-soft);
        }

        .login-fields { display: flex; flex-direction: column; gap: 16px; }
        .login-label { display: block; }
        .login-label > span {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink-soft);
          margin-bottom: 7px;
        }

        .login-error {
          margin-top: 16px;
          display: flex;
          gap: 8px;
          align-items: center;
          background: var(--error-light);
          border: 1px solid rgba(178, 59, 46, 0.22);
          border-radius: var(--radius-sm);
          padding: 11px 13px;
          color: var(--error);
          font-size: 0.86rem;
          line-height: 1.4;
        }
        .login-error svg { flex-shrink: 0; }

        .login-submit {
          margin-top: 22px;
          width: 100%;
        }
        .login-submit:disabled { opacity: 0.65; cursor: default; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  )
}
