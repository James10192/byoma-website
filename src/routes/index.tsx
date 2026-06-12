import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useQuery } from 'convex/react'
import {
  ArrowRight, Wifi, Snowflake, ChefHat, Car, Sparkles, ShieldCheck,
  MapPin, Phone, MessageCircle, Tv, Mail, BedDouble, KeyRound, Clock,
} from 'lucide-react'
import { api } from '../../convex/_generated/api'
import { StudioCard } from '../components/studios/studio-card'
import { FALLBACK_STUDIOS } from '../lib/studios-fallback'
import { Reveal, Stagger, SplitReveal, ImageReveal } from '../components/fx/gsap-fx'
import { ReservationBar, StickyBookingCTA } from '../components/booking/reservation-bar'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const HERO_PHOTOS = ['/images/60k/4.jpg', '/images/60k/1.jpg', '/images/45k/2.jpg']

const FACTS = [
  { icon: ShieldCheck, title: 'Sécurisé 24h/24', note: 'Vigile permanent et accès contrôlé à la résidence.' },
  { icon: Sparkles, title: 'Propre et entretenu', note: 'Ménage régulier, linge et serviettes fournis.' },
  { icon: KeyRound, title: 'Prêt à vivre', note: 'Meublé et entièrement équipé : posez vos valises.' },
  { icon: MessageCircle, title: 'Réservation simple', note: 'Demande en ligne, confirmation rapide par WhatsApp.' },
]

const EQUIPEMENTS = [
  { icon: Wifi, label: 'Internet WiFi', note: 'Fibre haut débit' },
  { icon: Snowflake, label: 'Climatisation', note: 'Split silencieux' },
  { icon: ChefHat, label: 'Cuisine équipée', note: 'Électroménager complet' },
  { icon: BedDouble, label: 'Lit orthopédique', note: 'Couchage 2 places' },
  { icon: Car, label: 'Parking sécurisé', note: 'Accès privatif' },
  { icon: Sparkles, label: 'Service de ménage', note: 'Entretien régulier' },
  { icon: ShieldCheck, label: 'Vigile 24h/24', note: 'Sécurité permanente' },
  { icon: Tv, label: 'Canal+', note: 'Offres Premium' },
]

const STEPS = [
  { n: '01', title: 'Choisissez votre résidence', note: 'Studio Standard, Studio Premium ou Appartement 2 pièces, selon votre budget et vos besoins.' },
  { n: '02', title: 'Envoyez votre demande', note: 'Indiquez vos dates en ligne ou directement par WhatsApp. Aucun paiement à cette étape.' },
  { n: '03', title: 'On confirme avec vous', note: 'Réponse rapide, 7j/7. Une fois confirmé, votre séjour est réservé.' },
]

function HomePage() {
  const studios = useQuery(api.studios.list)
  const items = studios ?? FALLBACK_STUDIOS
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const root = heroRef.current
    if (!root) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const imgs = gsap.utils.toArray<HTMLElement>('.hero-img', root)

    if (!prefersReduced && imgs.length > 1) {
      const hold = 4.8, fade = 1.5
      // État de départ explicite : seule la 1re image est visible. Évite le
      // gotcha immediateRender des fromTo (qui masquait la 1re image au build).
      gsap.set(imgs, { autoAlpha: 0 })
      gsap.set(imgs[0], { autoAlpha: 1 })
      const tl = gsap.timeline({ repeat: -1 })
      imgs.forEach((img, i) => {
        const next = imgs[(i + 1) % imgs.length]
        tl.to(next, { autoAlpha: 1, duration: fade, ease: 'power1.inOut' }, `+=${hold}`)
          .to(img, { autoAlpha: 0, duration: fade, ease: 'power1.inOut' }, '<')
      })
      // Ken-burns très léger : photos ~1000px, on évite de les agrandir (flou).
      imgs.forEach((img) =>
        gsap.fromTo(img, { scale: 1.0 }, { scale: 1.05, duration: (hold + fade) * 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true }),
      )
    }
  }, { scope: heroRef })

  return (
    <div>
      {/* ---------- HERO : image plein écran + copy en surimpression ---------- */}
      <section className="hero" ref={heroRef}>
        <div className="hero-inner">
          <figure className="hero-figure" aria-hidden>
            {HERO_PHOTOS.map((src, i) => (
              <img key={src} src={src} alt={i === 0 ? "Intérieur d'une résidence meublée BYOMA à Cocody" : ''} aria-hidden={i !== 0} className="hero-img" loading="eager" fetchPriority={i === 0 ? 'high' : 'low'} />
            ))}
            <div className="hero-scrim" />
            <div className="hero-grain" />
          </figure>

          <div className="hero-content">
            <span className="kicker hero-kicker fade-up">Résidences meublées · Cocody, Abidjan</span>
            <SplitReveal as="h1" className="display hero-title" immediate delay={0.1}>
              Votre appartement meublé à Cocody, <em>prêt à vivre.</em>
            </SplitReveal>
            <p className="hero-sub fade-up-delay-2">
              Réservez un studio ou un appartement meublé, propre et sécurisé, à Cocody Angré.
              Disponibilités en temps réel, réponse rapide par WhatsApp.
            </p>
            <div className="hero-underbar fade-up-delay-4">
              <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="hero-wa">
                <MessageCircle size={16} /> Réserver par WhatsApp
              </a>
              <span className="hero-trust"><ShieldCheck size={14} /> Sécurisé 24h/24 · dès 25 000 F / nuit</span>
            </div>
          </div>

          <div className="hero-rbar fade-up-delay-3">
            <ReservationBar />
          </div>
        </div>
      </section>
      <StickyBookingCTA />

      {/* ---------- POURQUOI BYOMA ---------- */}
      <section className="band-light" style={{ paddingTop: 'clamp(56px,8vw,96px)' }}>
        <div className="wrap">
          <Stagger className="facts-grid" stagger={0.07}>
            {FACTS.map(({ icon: Icon, title, note }) => (
              <div key={title} className="fact">
                <span className="fact-ic"><Icon size={20} strokeWidth={1.6} /></span>
                <div>
                  <div className="fact-title">{title}</div>
                  <p className="fact-note">{note}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- RÉSIDENCES ---------- */}
      <section id="studios" className="band-light">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal as="span" className="kicker">Nos résidences</Reveal>
              <SplitReveal as="h2" className="section-title" style={{ marginTop: 14 }}>
                Trois formats, une même exigence de confort
              </SplitReveal>
            </div>
            <Reveal as="p" className="sec-head-note" delay={0.08}>
              Du studio essentiel à l'appartement deux pièces, chaque résidence est meublée,
              équipée et entretenue. Choisissez selon votre budget.
            </Reveal>
          </div>

          <Stagger className="studios-grid" stagger={0.1}>
            {items.map((s, i) => <StudioCard key={s.slug} studio={s} index={i} />)}
          </Stagger>

          <Reveal className="studios-foot">
            <Link to="/studios" className="btn btn-ghost">Voir les disponibilités <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- BANDEAU PHOTO CINÉMATIQUE ---------- */}
      <section className="photo-band-wrap">
        <ImageReveal className="photo-band" src="/images/60k/5.jpg" alt="Cuisine équipée d'une résidence BYOMA" caption="Cuisine équipée · Cocody Angré" />
      </section>

      {/* ---------- ÉQUIPEMENTS ---------- */}
      <section id="equipements" className="band-sand">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal as="span" className="kicker">Équipements</Reveal>
              <SplitReveal as="h2" className="section-title" style={{ marginTop: 14 }}>Tout est déjà là</SplitReveal>
            </div>
            <Reveal as="p" className="sec-head-note" delay={0.08}>
              Vous arrivez, vous vous installez. Chaque résidence dispose de l'essentiel
              comme du confort, sans frais cachés.
            </Reveal>
          </div>

          <Stagger className="equip-grid" stagger={0.05}>
            {EQUIPEMENTS.map(({ icon: Icon, label, note }) => (
              <div key={label} className="equip">
                <Icon size={22} strokeWidth={1.6} />
                <div className="equip-label">{label}</div>
                <div className="equip-note">{note}</div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- COMMENT RÉSERVER ---------- */}
      <section className="band-light">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <Reveal as="span" className="kicker kicker--plain">Comment réserver</Reveal>
            <SplitReveal as="h2" className="section-title" style={{ marginTop: 14 }}>Réservé en trois étapes</SplitReveal>
          </div>

          <Stagger className="steps-grid" stagger={0.12}>
            {STEPS.map((s) => (
              <div key={s.n} className="step">
                <span className="step-n">{s.n}</span>
                <div className="step-title">{s.title}</div>
                <p className="step-note">{s.note}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- LOCALISATION ---------- */}
      <section id="localisation" className="band-sand">
        <div className="wrap">
          <Reveal className="loc-grid">
            <div>
              <Reveal as="span" className="kicker">Localisation</Reveal>
              <SplitReveal as="h2" className="section-title" style={{ marginTop: 14 }}>Au cœur de Cocody Angré</SplitReveal>
              <p className="lead" style={{ marginTop: 20, maxWidth: 440 }}>
                À Angré Djomi, derrière la pharmacie St Ambroise. Un quartier résidentiel
                calme et sûr, proche des commodités, des restaurants et des grands axes d'Abidjan.
              </p>
              <div className="loc-addr">
                <MapPin size={18} />
                <span>Angré Djomi, derrière la pharmacie St Ambroise<br />Cocody, Abidjan · Côte d'Ivoire</span>
              </div>
              <Link to="/studios" className="btn btn-primary" style={{ marginTop: 28 }}>Réserver un séjour <ArrowRight size={16} /></Link>
            </div>
            <div className="loc-map">
              <iframe
                title="Carte — Les Résidences BYOMA, Angré Djomi Cocody"
                src="https://www.google.com/maps?q=Angr%C3%A9%20Djomi%20pharmacie%20Saint%20Ambroise%20Cocody%20Abidjan&output=embed"
                width="100%" height="100%"
                style={{ border: 0, minHeight: 380, display: 'block' }}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- RÉSERVER / CONTACT ---------- */}
      <section id="reserver" className="band-light">
        <div className="wrap">
          <Reveal className="reserve-card">
            <div className="reserve-copy">
              <Reveal as="span" className="kicker">Réservation</Reveal>
              <SplitReveal as="h2" className="section-title" style={{ marginTop: 14 }}>Réservez votre séjour</SplitReveal>
              <p className="lead" style={{ marginTop: 18, maxWidth: 460 }}>
                Une question, une date, une confirmation ? Notre équipe vous répond
                rapidement par téléphone, WhatsApp ou e-mail, 7j/7.
              </p>
              <div className="reserve-hours">
                <Clock size={15} /> Réponse rapide, 7 jours sur 7
              </div>
            </div>
            <div className="reserve-actions">
              <a href="tel:+2250700255295" className="reserve-row">
                <span className="reserve-ic"><Phone size={18} /></span>
                <span><strong>07 00 25 52 95</strong><em>05 08 69 07 98</em></span>
                <ArrowRight size={16} />
              </a>
              <a href="https://wa.me/2250700255295" target="_blank" rel="noopener noreferrer" className="reserve-row">
                <span className="reserve-ic"><MessageCircle size={18} /></span>
                <span><strong>WhatsApp</strong><em>Le plus rapide pour réserver</em></span>
                <ArrowRight size={16} />
              </a>
              <a href="mailto:lesresidencesbyoma@byoma.ci" className="reserve-row">
                <span className="reserve-ic"><Mail size={18} /></span>
                <span><strong>E-mail</strong><em>lesresidencesbyoma@byoma.ci</em></span>
                <ArrowRight size={16} />
              </a>
              <Link to="/studios" className="btn btn-primary" style={{ width: '100%', marginTop: 6 }}>
                Voir les disponibilités <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        .wrap { max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 64px); }
        .band-light { background: var(--ivory); padding: clamp(64px, 9vw, 120px) 0; }
        .band-sand { background: var(--sand); padding: clamp(64px, 9vw, 120px) 0; }

        /* ====== HERO ======
           Mobile (base) : photo en fond plein écran, texte clair en surimpression.
           Desktop (>=920px) : photo dans un rectangle arrondi, fond clair, texte sombre. */
        .hero { position: relative; min-height: 100vh; min-height: 100dvh; display: flex; overflow: hidden; background: var(--noir); }
        .hero-inner { position: relative; width: 100%; max-width: 1240px; margin: 0 auto;
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(78px, 11vh, 108px) clamp(20px, 6vw, 40px) clamp(22px, 5vw, 40px); }
        /* --- figure : fond plein écran sur mobile --- */
        .hero-figure { position: absolute; inset: 0; z-index: 0; margin: 0; overflow: hidden; }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; will-change: transform, opacity; filter: contrast(1.04) saturate(1.05) brightness(0.97); }
        .hero-img:first-child { opacity: 1; }
        .hero-scrim { position: absolute; inset: 0; background:
          linear-gradient(180deg, rgba(18,14,9,0.55) 0%, rgba(18,14,9,0.22) 28%, rgba(18,14,9,0.42) 60%, rgba(18,14,9,0.86) 100%); }
        .hero-grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.055; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .hero-content { position: relative; z-index: 2; max-width: 600px; }
        .hero-kicker { color: var(--gold-soft); }
        .hero-kicker::before { background: var(--gold-soft); }
        .hero-title { color: var(--ivory); font-size: clamp(1.5rem, 6vw, 2.5rem); line-height: 1.08; margin: 12px 0 0; max-width: 18ch; }
        .hero-title em { color: var(--gold-soft); font-style: italic; }
        .hero-sub { margin-top: 11px; max-width: 520px; color: rgba(251,247,238,0.86); font-size: clamp(0.84rem, 2vw, 1rem); line-height: 1.5; }
        .hero-underbar { margin-top: 13px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px; }
        .hero-wa { display: inline-flex; align-items: center; gap: 7px; color: var(--ivory); font-weight: 600; font-size: 0.84rem; transition: color 0.2s ease; }
        .hero-wa svg { color: var(--gold-soft); width: 15px; height: 15px; }
        .hero-wa:hover { color: var(--gold-soft); }
        .hero-trust { display: inline-flex; align-items: center; gap: 7px; color: rgba(251,247,238,0.66); font-size: 0.78rem; }
        .hero-trust svg { color: var(--gold-soft); }
        .hero-rbar { position: relative; z-index: 2; margin-top: clamp(14px, 3vw, 22px); }

        /* --- Desktop : photo contenue dans un rectangle arrondi, fond clair --- */
        @media (min-width: 920px) {
          /* le hero centre verticalement son bloc (pas de stretch) -> vrai centrage */
          .hero { background: var(--ivory); align-items: center; }
          .hero-inner {
            display: grid;
            grid-template-columns: 1.04fr 0.96fr;
            grid-template-areas: "content figure" "rbar rbar";
            gap: clamp(16px, 2.2vw, 30px) clamp(36px, 5vw, 72px);
            align-items: center;
            padding: clamp(46px, 6vh, 72px) clamp(28px, 5vw, 64px);
          }
          .hero-content { grid-area: content; max-width: 620px; }
          .hero-rbar { grid-area: rbar; margin-top: 0; }
          .hero-figure { grid-area: figure; position: relative; inset: auto; aspect-ratio: 3 / 2; max-height: 54vh;
            border-radius: 22px; border: 1px solid var(--line); box-shadow: 0 40px 70px -34px rgba(34,28,19,0.45); }
          .hero-img { filter: contrast(1.02) saturate(1.04); }
          .hero-scrim { display: none; }
          .hero-grain { opacity: 0.03; border-radius: 22px; }
          /* texte sombre sur fond clair */
          .hero-kicker { color: var(--gold-deep); }
          .hero-kicker::before { background: var(--gold); }
          .hero-title { color: var(--noir); font-size: clamp(2.3rem, 4vw, 3.5rem); }
          .hero-title em { color: var(--gold-deep); }
          .hero-sub { color: var(--ink-soft); }
          .hero-wa { color: var(--noir); }
          .hero-wa svg { color: var(--gold-deep); }
          .hero-wa:hover { color: var(--gold-deep); }
          .hero-trust { color: var(--muted); }
          .hero-trust svg { color: var(--gold-deep); }
        }

        /* ---- Sections : entête ---- */
        .sec-head { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: end; margin-bottom: clamp(34px, 5vw, 56px); }
        .sec-head-note { color: var(--ink-soft); max-width: 440px; font-size: 1rem; }
        .sec-head--center { text-align: center; justify-items: center; }
        .sec-head--center .kicker { justify-content: center; }

        /* ---- Facts ---- */
        .facts-grid { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
        .fact { background: var(--paper); padding: 26px 24px; display: flex; gap: 16px; align-items: flex-start; }
        .fact-ic { flex-shrink: 0; width: 46px; height: 46px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; background: var(--gold-wash); color: var(--gold-deep); }
        .fact-title { font-weight: 600; font-size: 1.02rem; color: var(--noir); }
        .fact-note { margin: 5px 0 0; font-size: 0.9rem; color: var(--ink-soft); line-height: 1.55; }

        /* ---- Résidences ---- */
        .studios-grid { display: grid; grid-template-columns: 1fr; gap: clamp(18px, 3vw, 28px); }
        .studios-foot { margin-top: clamp(32px, 5vw, 48px); display: flex; justify-content: center; }

        /* ---- Bandeau photo ---- */
        .photo-band-wrap { background: var(--ivory); }
        .photo-band { position: relative; height: clamp(280px, 46vw, 520px); overflow: hidden; }
        .photo-band img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .photo-band-cap {
          position: absolute; left: clamp(20px,5vw,64px); bottom: clamp(20px,4vw,40px);
          padding: 9px 16px; background: rgba(20,16,10,0.66); backdrop-filter: blur(6px);
          color: var(--gold-soft); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; border-radius: 999px;
        }

        /* ---- Équipements ---- */
        .equip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px, 2vw, 18px); }
        .equip { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 22px 20px; color: var(--gold-deep); transition: border-color 0.3s var(--ease), transform 0.3s var(--ease); }
        .equip:hover { border-color: var(--gold-soft); transform: translateY(-3px); }
        .equip-label { margin-top: 14px; font-weight: 600; font-size: 0.98rem; color: var(--noir); }
        .equip-note { margin-top: 3px; font-size: 0.82rem; color: var(--ink-soft); }

        /* ---- Étapes ---- */
        .steps-grid { display: grid; grid-template-columns: 1fr; gap: clamp(16px, 3vw, 28px); }
        .step { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 30px 26px; }
        .step-n { font-family: var(--font-display); font-style: italic; font-size: 2.4rem; font-weight: 400; color: var(--gold-soft); line-height: 1; }
        .step-title { margin-top: 14px; font-weight: 600; font-size: 1.1rem; color: var(--noir); }
        .step-note { margin: 8px 0 0; font-size: 0.92rem; color: var(--ink-soft); line-height: 1.6; }

        /* ---- Localisation ---- */
        .loc-grid { display: grid; grid-template-columns: 1fr; gap: clamp(28px, 5vw, 56px); align-items: center; }
        .loc-addr { margin-top: 24px; display: flex; gap: 12px; align-items: flex-start; color: var(--ink); font-size: 0.95rem; line-height: 1.55; }
        .loc-addr svg { color: var(--gold-deep); flex-shrink: 0; margin-top: 2px; }
        .loc-map { border-radius: var(--radius); overflow: hidden; border: 1px solid var(--line); box-shadow: var(--shadow-card); min-height: 380px; }
        .loc-map iframe { filter: grayscale(0.2) sepia(0.06); }

        /* ---- Réserver ---- */
        .reserve-card { display: grid; grid-template-columns: 1fr; gap: clamp(28px, 4vw, 48px); background: var(--noir); border-radius: clamp(18px, 3vw, 28px); padding: clamp(32px, 5vw, 56px); color: var(--ivory); box-shadow: var(--shadow-soft); }
        .reserve-card .section-title { color: var(--ivory); }
        .reserve-card .kicker { color: var(--gold-soft); }
        .reserve-card .kicker::before { background: var(--gold-soft); }
        .reserve-card .lead { color: var(--muted-on-dark); }
        .reserve-hours { margin-top: 22px; display: inline-flex; align-items: center; gap: 9px; font-size: 0.86rem; color: var(--gold-soft); }
        .reserve-actions { display: flex; flex-direction: column; gap: 12px; }
        .reserve-row { display: flex; align-items: center; gap: 16px; padding: 16px 18px; border: 1px solid rgba(251,247,238,0.16); border-radius: 14px; background: rgba(251,247,238,0.03); color: var(--ivory); transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease; }
        .reserve-row:hover { border-color: var(--gold-soft); background: rgba(217,185,120,0.08); transform: translateX(3px); }
        .reserve-row span:nth-child(2) { display: flex; flex-direction: column; flex: 1; line-height: 1.3; }
        .reserve-row strong { font-size: 1rem; font-weight: 600; }
        .reserve-row em { font-style: normal; font-size: 0.8rem; color: var(--muted-on-dark); margin-top: 2px; }
        .reserve-row > svg { color: var(--gold-soft); flex-shrink: 0; }
        .reserve-ic { width: 44px; height: 44px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; background: var(--gold-wash); color: var(--gold-soft); }

        /* ====== >= tablette ====== */
        @media (min-width: 620px) {
          .facts-grid { grid-template-columns: 1fr 1fr; }
          .studios-grid { grid-template-columns: 1fr 1fr; }
          .steps-grid { grid-template-columns: repeat(3, 1fr); }
        }
        /* ====== >= desktop ====== */
        @media (min-width: 981px) {
          .sec-head { grid-template-columns: 1.4fr 1fr; gap: 40px; }
          .sec-head--center { grid-template-columns: 1fr; }
          .facts-grid { grid-template-columns: repeat(4, 1fr); }
          .studios-grid { grid-template-columns: repeat(3, 1fr); }
          .equip-grid { grid-template-columns: repeat(4, 1fr); }
          .loc-grid { grid-template-columns: 1fr 1.1fr; }
          .reserve-card { grid-template-columns: 1fr 1fr; align-items: center; }
        }
      `}</style>
    </div>
  )
}
