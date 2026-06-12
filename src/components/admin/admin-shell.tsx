import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { CalendarRange, CalendarX2, LogOut, Loader2, ExternalLink } from 'lucide-react'
import { authClient, useSession } from '../../lib/auth/auth-client'

const NAV = [
  { to: '/admin/reservations', label: 'Réservations', icon: CalendarRange },
  { to: '/admin/disponibilites', label: 'Disponibilités', icon: CalendarX2 },
] as const

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: '/admin/connexion', replace: true })
    }
  }, [isPending, session, navigate])

  if (isPending) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <Loader2 size={26} className="spin" color="var(--gold)" />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin .8s linear infinite}`}</style>
      </div>
    )
  }

  if (!session) return null

  async function logout() {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => { window.location.href = '/admin/connexion' } },
    })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--cream)' }}>
      <aside className="admin-sidebar hidden-mobile">
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', display: 'block' }}>
            LES RÉSIDENCES
          </span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em', display: 'block' }}>
            BYOMA
          </span>
          <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginTop: 4 }}>
            Administration
          </span>
        </div>

        <nav style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 3,
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: active ? 'var(--dark)' : 'rgba(255,255,255,0.7)',
                  background: active ? 'var(--gold)' : 'transparent',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid rgba(201,168,76,0.2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', textDecoration: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem' }}>
            <ExternalLink size={15} /> Voir le site
          </a>
          <button type="button" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3, color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 28px', borderBottom: '1px solid var(--line)', background: 'var(--surface)' }}>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--dark)', margin: 0 }}>{title}</h1>
          <button type="button" onClick={logout} className="show-mobile" style={{ display: 'none', alignItems: 'center', gap: 8, background: 'none', border: '1px solid var(--line)', borderRadius: 3, padding: '8px 12px', color: 'var(--muted-2)', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            <LogOut size={14} /> Quitter
          </button>
        </header>
        <main style={{ flex: 1, padding: '28px', maxWidth: 1100, width: '100%' }}>{children}</main>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: inline-flex !important; }
        }
      `}</style>
    </div>
  )
}
