import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import {
  ArrowRight, Wifi, Snowflake, ChefHat, Car, Sparkles, ShieldCheck,
  MapPin, Phone, MessageCircle, Tv, Mail,
} from 'lucide-react'
import { api } from '../../convex/_generated/api'
import { StudioCard } from '../components/studios/studio-card'
import { FALLBACK_STUDIOS } from '../lib/studios-fallback'
import { Reveal, Stagger, Parallax } from '../components/fx/gsap-fx'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const ATOUTS = [
  { icon: Wifi, label: 'Internet WiFi', note: 'Fibre haut débit' },
  { icon: Snowflake, label: 'Climatisation', note: 'Split silencieux' },
  { icon: ChefHat, label: 'Cuisine équipée', note: 'Tout l\'électroménager' },
  { icon: Car, label: 'Parking sécurisé', note: 'Accès privatif' },
  { icon: Sparkles, label: 'Service de ménage', note: 'Entretien régulier' },
  { icon: ShieldCheck, label: 'Vigile 24h/24', note: 'Sécurité permanente' },
  { icon: Tv, label: 'Canal+', note: 'Offres Premium' },
  { icon: MapPin, label: 'Cocody Angré', note: 'Quartier résidentiel' },
]

function HomePage() {
  const studios = useQuery(api.studios.list)
  // Contenu instantané (SSR + 1er paint) ; Convex temps réel prend le relais.
  const items = studios ?? FALLBACK_STUDIOS

  return (
    <div>
      {/* ---------- HERO (éditorial : texte + panneau image en fondu) ---------- */}
      <section className="hero">
        <div className="hero-glow" aria-hidden />
        <div className="hero-grid">
          <div className="hero-copy">
            <img src="/logo-byoma.png" alt="Les Résidences BYOMA" width={92} height={92} className="hero-logo fade-up" />
            <span className="kicker kicker--light fade-up">Résidences meublées · Abidjan</span>
            <h1 className="display fade-up-delay-1" style={{ fontSize: 'clamp(2.7rem, 6vw, 5.4rem)', color: 'var(--ivory)', marginTop: 22, maxWidth: '12ch' }}>
              L'art de <em>séjourner</em> à Cocody
            </h1>
            <p className="fade-up-delay-2" style={{ marginTop: 24, fontSize: 'clamp(1rem, 1.5vw, 1.18rem)', color: 'rgba(245,239,227,0.82)', lineHeight: 1.7, maxWidth: 460 }}>
              Studios et appartements meublés haut de gamme, pensés pour le calme, le confort et la discrétion. Réservez en ligne, en temps réel.
            </p>
            <div className="fade-up-delay-3" style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link to="/studios" className="btn btn-gold">Découvrir les résidences <ArrowRight size={16} /></Link>
              <a href="#contact" className="btn btn-on-dark">Nous contacter</a>
            </div>

            <div className="fade-up-delay-4 hero-stats" style={{ marginTop: 'clamp(36px,5vw,56px)' }}>
              {[
                { v: '03', l: 'Catégories' },
                { v: '24/7', l: 'Sécurité & vigile' },
                { v: '25K', l: 'FCFA / nuit, dès' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display" style={{ fontSize: '1.9rem', fontWeight: 500, color: 'var(--gold-soft)', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(245,239,227,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-media fade-up-delay-2">
            <span className="hero-frame-accent" aria-hidden />
            <div className="hero-frame">
              {['/images/60k/1.jpg', '/images/45k/2.jpg', '/images/60k/4.jpg', '/images/25k/3.jpg'].map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === 0 ? 'Intérieur d\'une résidence BYOMA' : ''}
                  aria-hidden={i !== 0}
                  className="hero-slide"
                  style={{ animationDelay: `${i * 5}s` }}
                />
              ))}
              <span className="hero-frame-tag">Appartement Premium · Cocody</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MANIFESTE ---------- */}
      <section id="manifeste" style={{ background: 'var(--ivory)', padding: 'clamp(72px,11vw,150px) clamp(24px,5vw,68px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Reveal as="div" className="manifeste-grid">
            <div>
              <span className="kicker">L'esprit BYOMA</span>
              <div className="rule" style={{ marginTop: 18, marginBottom: 30, maxWidth: 120 }} />
            </div>
            <p className="display" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.7rem)', color: 'var(--noir)', lineHeight: 1.18 }}>
              Chaque résidence est meublée, équipée et entretenue pour que vous vous sentiez <em>chez vous</em> dès le seuil franchi. Le luxe, ici, c'est le soin du détail.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- BANDEAU IMAGE CINÉMATIQUE ---------- */}
      <section className="cinema-band" aria-hidden>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(21,18,11,0.4), rgba(21,18,11,0.55))' }} />
        <Parallax speed={8} style={{ position: 'relative', maxWidth: 880, padding: '0 24px', textAlign: 'center' }}>
          <p className="display" style={{ fontSize: 'clamp(1.7rem, 4vw, 3.2rem)', color: 'var(--ivory)', lineHeight: 1.18 }}>
            « Un séjour, <em style={{ color: 'var(--gold-soft)' }}>une parenthèse</em>. »
          </p>
        </Parallax>
      </section>

      {/* ---------- RÉSIDENCES ---------- */}
      <section id="studios" style={{ background: 'var(--ivory)', padding: 'clamp(72px,10vw,130px) clamp(24px,5vw,68px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 'clamp(36px,5vw,60px)' }}>
            <div>
              <span className="kicker">01 — Nos résidences</span>
              <h2 className="section-title" style={{ marginTop: 16 }}>Trois adresses,<br />un même art de vivre</h2>
            </div>
            <Link to="/studios" className="see-all">Voir tout <ArrowRight size={15} /></Link>
          </Reveal>

          <Stagger className="studios-grid" stagger={0.08}>
            {items.map((s, i) => <StudioCard key={s.slug} studio={s} index={i} />)}
          </Stagger>
        </div>
      </section>

      {/* ---------- ATOUTS ---------- */}
      <section style={{ background: 'var(--noir)', color: 'var(--ivory)', padding: 'clamp(72px,11vw,140px) clamp(24px,5vw,68px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal style={{ maxWidth: 620, marginBottom: 'clamp(44px,6vw,72px)' }}>
            <span className="kicker kicker--light">02 — Le confort BYOMA</span>
            <h2 className="section-title" style={{ marginTop: 16, color: 'var(--ivory)' }}>Tout est déjà <em style={{ color: 'var(--gold-soft)' }}>prévu</em></h2>
          </Reveal>
          <div className="atouts-grid">
            {ATOUTS.map(({ icon: Icon, label, note }) => (
              <div key={label} className="atout">
                <Icon size={24} color="var(--gold)" strokeWidth={1.5} />
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--ivory)' }}>{label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted-on-dark)', marginTop: 3 }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- LOCALISATION ---------- */}
      <section id="localisation" style={{ background: 'var(--ivory)', padding: 'clamp(72px,11vw,140px) clamp(24px,5vw,68px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Reveal as="div" className="loc-grid">
            <div>
              <span className="kicker">03 — Localisation</span>
              <h2 className="section-title" style={{ marginTop: 16 }}>Au cœur de<br />Cocody Angré</h2>
              <p style={{ marginTop: 24, color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 460 }}>
                À Angré Djomi, derrière la pharmacie St Ambroise. Un quartier résidentiel calme et sûr, proche des commodités, des restaurants et des grands axes d'Abidjan.
              </p>
              <div style={{ marginTop: 26, display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--ink)' }}>
                <MapPin size={18} color="var(--gold-deep)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>Angré Djomi, derrière la pharmacie St Ambroise<br />Cocody, Abidjan — Côte d'Ivoire</span>
              </div>
              <Link to="/studios" className="btn btn-primary" style={{ marginTop: 32 }}>Réserver un séjour <ArrowRight size={16} /></Link>
            </div>
            <div style={{ position: 'relative', minHeight: 420, border: '1px solid var(--line)', overflow: 'hidden' }}>
              <iframe
                title="Carte — Les Résidences BYOMA, Angré Djomi Cocody"
                src="https://www.google.com/maps?q=Angr%C3%A9%20Djomi%20pharmacie%20Saint%20Ambroise%20Cocody%20Abidjan&output=embed"
                width="100%" height="100%"
                style={{ border: 0, minHeight: 420, display: 'block', filter: 'grayscale(0.3) sepia(0.12)' }}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" style={{ background: 'var(--noir-2)', color: 'var(--ivory)', padding: 'clamp(72px,11vw,140px) clamp(24px,5vw,68px)' }}>
        <Reveal style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span className="kicker kicker--light">Réservation</span>
          <h2 className="section-title" style={{ marginTop: 18, color: 'var(--ivory)' }}>Réservez votre <em style={{ color: 'var(--gold-soft)' }}>séjour</em></h2>
          <p style={{ marginTop: 18, color: 'var(--muted-on-dark)', fontSize: '1.05rem', maxWidth: 540, margin: '18px auto 0' }}>
            Notre équipe vous répond rapidement par téléphone, WhatsApp ou e-mail pour confirmer votre réservation.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <a href="tel:+2250700255295" className="contact-pill"><Phone size={17} color="var(--gold)" /> 07 00 25 52 95</a>
            <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="contact-pill"><MessageCircle size={17} color="var(--gold)" /> WhatsApp</a>
            <a href="mailto:lesresidencesbyoma@byoma.ci" className="contact-pill"><Mail size={17} color="var(--gold)" /> E-mail</a>
          </div>
          <div style={{ marginTop: 40 }}>
            <Link to="/studios" className="btn btn-gold">Voir les disponibilités <ArrowRight size={16} /></Link>
          </div>
        </Reveal>
      </section>

      <style>{`
        /* ---- Base = mobile-first ; on monte ensuite en min-width ---- */
        .hero { position: relative; background: var(--noir); overflow: hidden; padding: clamp(100px,22vw,168px) clamp(20px,5vw,68px) clamp(56px,9vw,108px); }
        .hero-logo { height: 72px; width: auto; display: block; background: var(--ivory); border-radius: 14px; padding: 8px; margin-bottom: 20px; box-shadow: 0 16px 40px -20px rgba(0,0,0,0.6); }
        .hero-glow { position: absolute; top: -25%; right: -12%; width: 62%; height: 95%; background: radial-gradient(circle, rgba(201,168,76,0.16), transparent 64%); pointer-events: none; }
        .hero-grid { position: relative; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: clamp(40px,8vw,56px); align-items: center; }
        .hero-media { position: relative; max-width: 460px; }
        .hero-frame { position: relative; aspect-ratio: 4 / 5; overflow: hidden; border: 1px solid rgba(224,201,136,0.32); }
        .hero-frame-accent { position: absolute; inset: 0; transform: translate(16px, 16px); border: 1px solid rgba(224,201,136,0.32); pointer-events: none; }
        .hero-slide { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; animation: heroSlide 20s infinite; }
        .hero-slide:first-child { opacity: 1; }
        @keyframes heroSlide {
          0% { opacity: 0; transform: scale(1.06); }
          3% { opacity: 1; }
          22% { opacity: 1; transform: scale(1.0); }
          27% { opacity: 0; }
          100% { opacity: 0; }
        }
        .hero-frame-tag { position: absolute; left: 14px; bottom: 14px; z-index: 3; padding: 7px 13px; background: rgba(21,18,11,0.62); backdrop-filter: blur(5px); color: var(--gold-soft); font-size: 0.62rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
        .hero-stats { display: flex; gap: clamp(20px,5vw,48px); flex-wrap: wrap; }
        .hero-stats > div { padding-top: 20px; border-top: 1px solid rgba(224,201,136,0.22); }
        @media (prefers-reduced-motion: reduce) {
          .hero-slide { animation: none; opacity: 0; }
          .hero-slide:first-child { opacity: 1; }
        }
        .manifeste-grid { display: grid; grid-template-columns: 1fr; gap: clamp(24px,5vw,64px); align-items: start; }
        .cinema-band { position: relative; min-height: clamp(320px, 52vh, 560px); display: flex; align-items: center; justify-content: center; background-image: url('/images/45k/3.jpg'); background-size: cover; background-position: center; background-attachment: scroll; }
        .studios-grid { display: grid; grid-template-columns: 1fr; gap: clamp(16px,4vw,28px); }
        .atouts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line-dark); border: 1px solid var(--line-dark); }
        .atout { background: var(--noir); padding: 26px 22px; }
        .loc-grid { display: grid; grid-template-columns: 1fr; gap: clamp(28px,6vw,72px); align-items: center; }
        .see-all { display: inline-flex; align-items: center; gap: 8px; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-deep); padding-bottom: 4px; border-bottom: 1px solid var(--gold-deep); white-space: nowrap; }
        .contact-pill { display: inline-flex; align-items: center; gap: 10px; padding: 14px 24px; border: 1px solid var(--line-dark); color: var(--ivory); font-size: 0.92rem; transition: border-color 0.3s ease, background 0.3s ease; }
        .contact-pill:hover { border-color: var(--gold); background: rgba(201,168,76,0.08); }
        /* >= tablette : la grille des residences passe a 2 colonnes */
        @media (min-width: 601px) {
          .studios-grid { grid-template-columns: repeat(2, 1fr); }
        }
        /* >= desktop : layouts multi-colonnes complets + parallaxe fond fixe */
        @media (min-width: 981px) {
          .hero-logo { height: 92px; margin-bottom: 26px; }
          .hero-grid { grid-template-columns: 1.05fr 0.92fr; gap: clamp(36px,5vw,84px); }
          .hero-media { max-width: none; }
          .manifeste-grid { grid-template-columns: 0.5fr 1.5fr; gap: clamp(28px,5vw,64px); }
          .studios-grid { grid-template-columns: repeat(3, 1fr); gap: clamp(16px,2vw,28px); }
          .atouts-grid { grid-template-columns: repeat(4, 1fr); }
          .atout { padding: 30px 26px; }
          .loc-grid { grid-template-columns: 1fr 1.1fr; gap: clamp(32px,5vw,72px); }
          .cinema-band { background-attachment: fixed; }
        }
      `}</style>
    </div>
  )
}
