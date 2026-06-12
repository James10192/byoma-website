import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import {
  ArrowRight, ShieldCheck, Sparkles, Wifi, KeyRound,
  Phone, MessageCircle, Mail, Clock,
} from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { StudioCard } from '../../components/studios/studio-card'
import { FALLBACK_STUDIOS } from '../../lib/studios-fallback'
import { Reveal, Stagger, SplitReveal } from '../../components/fx/gsap-fx'

export const Route = createFileRoute('/studios/')({
  component: StudiosPage,
  head: () => ({
    meta: [
      { title: 'Nos résidences — Les Résidences BYOMA' },
      { name: 'description', content: 'Studios et appartements meublés à Cocody, Abidjan : Standard, Premium et Appartement 2 pièces. Propres, équipés et sécurisés, dès 25 000 F la nuit. Disponibilités en temps réel.' },
    ],
  }),
})

const INCLUS = [
  { icon: ShieldCheck, title: 'Sécurisé 24h/24', note: 'Vigile permanent et accès contrôlé à la résidence.' },
  { icon: Sparkles, title: 'Propre et entretenu', note: 'Ménage régulier, linge et serviettes fournis.' },
  { icon: Wifi, title: 'WiFi fibre, clim, cuisine', note: 'Internet haut débit, climatisation et cuisine équipée.' },
  { icon: KeyRound, title: 'Prêt à vivre', note: 'Meublé et équipé : posez vos valises, c\'est tout.' },
]

function StudiosPage() {
  const studios = useQuery(api.studios.list)
  const items = studios ?? FALLBACK_STUDIOS

  return (
    <div className="studios-page">
      {/* ---------- EN-TÊTE ---------- */}
      <section className="sp-head">
        <div className="sp-wrap">
          <span className="kicker fade-up">Nos résidences</span>
          <SplitReveal as="h1" className="section-title sp-title" immediate>
            Choisissez votre résidence
          </SplitReveal>
          <Reveal as="p" className="lead sp-intro" delay={0.15} immediate>
            Trois adresses meublées à Cocody, propres, équipées et sécurisées,
            dès 25 000 F la nuit. Sélectionnez la vôtre pour voir les photos,
            les équipements et les disponibilités en temps réel.
          </Reveal>
          <div className="rule sp-rule" />
        </div>
      </section>

      {/* ---------- GRILLE DES RÉSIDENCES ---------- */}
      <section className="sp-list">
        <div className="sp-wrap">
          <Stagger className="sp-grid" stagger={0.08}>
            {items.map((s, i) => <StudioCard key={s.slug} studio={s} index={i} />)}
          </Stagger>
        </div>
      </section>

      {/* ---------- INCLUS PARTOUT ---------- */}
      <section className="sp-incl">
        <div className="sp-wrap">
          <Reveal className="sp-incl-head">
            <span className="kicker">Inclus partout</span>
            <h2 className="section-title sp-incl-title">Les mêmes garanties, dans chaque résidence</h2>
          </Reveal>

          <Stagger className="sp-incl-grid" stagger={0.07}>
            {INCLUS.map(({ icon: Icon, title, note }) => (
              <div key={title} className="sp-incl-card">
                <span className="sp-incl-ic"><Icon size={20} strokeWidth={1.6} /></span>
                <div className="sp-incl-cardtitle">{title}</div>
                <p className="sp-incl-note">{note}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- RÉSERVER / CONTACT ---------- */}
      <section className="sp-cta">
        <div className="sp-wrap">
          <Reveal className="sp-cta-card">
            <div className="sp-cta-copy">
              <span className="kicker">Réservation</span>
              <h2 className="section-title sp-cta-title">Une résidence vous plaît ?</h2>
              <p className="lead sp-cta-lead">
                Indiquez-nous vos dates : notre équipe vous répond rapidement
                par téléphone, WhatsApp ou e-mail, 7j/7. Aucun paiement à cette étape.
              </p>
              <div className="sp-cta-hours">
                <Clock size={15} /> Réponse rapide, 7 jours sur 7
              </div>
            </div>
            <div className="sp-cta-actions">
              <a href="tel:+2250700255295" className="sp-cta-row">
                <span className="sp-cta-ic"><Phone size={18} /></span>
                <span><strong>07 00 25 52 95</strong><em>05 08 69 07 98</em></span>
                <ArrowRight size={16} />
              </a>
              <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="sp-cta-row">
                <span className="sp-cta-ic"><MessageCircle size={18} /></span>
                <span><strong>WhatsApp</strong><em>Le plus rapide pour réserver</em></span>
                <ArrowRight size={16} />
              </a>
              <a href="mailto:lesresidencesbyoma@byoma.ci" className="sp-cta-row">
                <span className="sp-cta-ic"><Mail size={18} /></span>
                <span><strong>E-mail</strong><em>lesresidencesbyoma@byoma.ci</em></span>
                <ArrowRight size={16} />
              </a>
              <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="btn btn-primary sp-cta-btn">
                Réserver <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        .studios-page { background: var(--ivory); }
        .sp-wrap { max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 64px); }

        /* ---- En-tête ---- */
        .sp-head { padding: clamp(120px, 16vw, 180px) 0 clamp(28px, 5vw, 44px); }
        .sp-title { margin-top: 16px; max-width: 18ch; }
        .sp-intro { margin-top: 18px; max-width: 560px; }
        .sp-rule { margin-top: 28px; }

        /* ---- Grille ---- */
        .sp-list { padding: 0 0 clamp(56px, 8vw, 96px); }
        .sp-grid { display: grid; grid-template-columns: 1fr; gap: clamp(18px, 3vw, 28px); }

        /* ---- Inclus partout ---- */
        .sp-incl { background: var(--sand); padding: clamp(56px, 8vw, 104px) 0; }
        .sp-incl-head { max-width: 620px; margin-bottom: clamp(32px, 5vw, 52px); }
        .sp-incl-title { margin-top: 14px; }
        .sp-incl-grid { display: grid; grid-template-columns: 1fr; gap: clamp(12px, 2vw, 18px); }
        .sp-incl-card {
          background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius);
          padding: 26px 24px;
          transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
        }
        .sp-incl-card:hover { border-color: var(--gold-soft); transform: translateY(-3px); }
        .sp-incl-ic {
          width: 46px; height: 46px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 12px; background: var(--gold-wash); color: var(--gold-deep);
        }
        .sp-incl-cardtitle { margin-top: 16px; font-weight: 600; font-size: 1.02rem; color: var(--noir); }
        .sp-incl-note { margin: 6px 0 0; font-size: 0.9rem; color: var(--ink-soft); line-height: 1.55; }

        /* ---- Réserver ---- */
        .sp-cta { background: var(--ivory); padding: clamp(56px, 8vw, 104px) 0 clamp(72px, 10vw, 120px); }
        .sp-cta-card {
          display: grid; grid-template-columns: 1fr; gap: clamp(28px, 4vw, 48px);
          background: var(--noir); border-radius: clamp(18px, 3vw, 28px);
          padding: clamp(32px, 5vw, 56px); color: var(--ivory); box-shadow: var(--shadow-soft);
        }
        .sp-cta-title { color: var(--ivory); margin-top: 14px; }
        .sp-cta-card .kicker { color: var(--gold-soft); }
        .sp-cta-card .kicker::before { background: var(--gold-soft); }
        .sp-cta-lead { color: var(--muted-on-dark); margin-top: 18px; max-width: 460px; }
        .sp-cta-hours { margin-top: 22px; display: inline-flex; align-items: center; gap: 9px; font-size: 0.86rem; color: var(--gold-soft); }
        .sp-cta-actions { display: flex; flex-direction: column; gap: 12px; }
        .sp-cta-row {
          display: flex; align-items: center; gap: 16px; padding: 16px 18px;
          border: 1px solid rgba(251,247,238,0.16); border-radius: 14px; background: rgba(251,247,238,0.03);
          color: var(--ivory); min-height: 56px;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        .sp-cta-row:hover { border-color: var(--gold-soft); background: rgba(217,185,120,0.08); transform: translateX(3px); }
        .sp-cta-row span:nth-child(2) { display: flex; flex-direction: column; flex: 1; line-height: 1.3; }
        .sp-cta-row strong { font-size: 1rem; font-weight: 600; }
        .sp-cta-row em { font-style: normal; font-size: 0.8rem; color: var(--muted-on-dark); margin-top: 2px; }
        .sp-cta-row > svg { color: var(--gold-soft); flex-shrink: 0; }
        .sp-cta-ic {
          width: 44px; height: 44px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 12px; background: var(--gold-wash); color: var(--gold-soft);
        }
        .sp-cta-btn { width: 100%; margin-top: 6px; }

        /* ====== >= tablette ====== */
        @media (min-width: 620px) {
          .sp-grid { grid-template-columns: 1fr 1fr; }
          .sp-incl-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ====== >= desktop ====== */
        @media (min-width: 981px) {
          .sp-grid { grid-template-columns: repeat(3, 1fr); }
          .sp-incl-grid { grid-template-columns: repeat(4, 1fr); }
          .sp-cta-card { grid-template-columns: 1fr 1fr; align-items: center; }
        }
      `}</style>
    </div>
  )
}
