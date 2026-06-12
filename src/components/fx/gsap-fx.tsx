import { useRef, type ReactNode, type ElementType, type CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Point unique d'enregistrement (idempotent, client-only via évaluation du module).
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const whenFontsReady = (cb: () => void) => {
  const fonts = (typeof document !== 'undefined' && (document as Document).fonts) || null
  if (fonts && fonts.ready) fonts.ready.then(cb).catch(cb)
  else cb()
}

/**
 * Révèle un bloc : autoAlpha 0->1 + y, une seule fois.
 * Base VISIBLE (immediateRender:false) : si le trigger ne tire pas, le
 * contenu reste lisible (SSR / sans JS / reduced-motion).
 */
export function Reveal({
  children, className, style, as: Tag = 'div',
  y = 30, delay = 0, start = 'top 86%', immediate = false,
}: {
  children: ReactNode; className?: string; style?: CSSProperties; as?: ElementType
  y?: number; delay?: number; start?: string; immediate?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (reduced() || !ref.current) return
    const to: gsap.TweenVars = { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', delay, immediateRender: false }
    if (!immediate) to.scrollTrigger = { trigger: ref.current, start, once: true }
    gsap.fromTo(ref.current, { autoAlpha: 0, y }, to)
  }, { scope: ref })
  return <Tag ref={ref as never} className={className} style={style}>{children}</Tag>
}

/**
 * Révèle les enfants DIRECTS en cascade (stagger) avec un léger scale.
 * Base visible (immediateRender:false).
 */
export function Stagger({
  children, className, style, as: Tag = 'div',
  childSelector = ':scope > *', y = 30, stagger = 0.09, start = 'top 84%', immediate = false,
}: {
  children: ReactNode; className?: string; style?: CSSProperties; as?: ElementType
  childSelector?: string; y?: number; stagger?: number; start?: string; immediate?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (reduced() || !ref.current) return
    const targets = ref.current.querySelectorAll(childSelector)
    if (!targets.length) return
    const to: gsap.TweenVars = { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger, immediateRender: false }
    if (!immediate) to.scrollTrigger = { trigger: ref.current, start, once: true }
    gsap.fromTo(targets, { autoAlpha: 0, y, scale: 0.985 }, to)
  }, { scope: ref })
  return <Tag ref={ref as never} className={className} style={style}>{children}</Tag>
}

/**
 * Titre révélé LIGNE PAR LIGNE derrière un masque (SplitText + mask:lines).
 * Chaque ligne monte de sous son masque. Split après chargement des polices
 * pour des coupures correctes. Conteneur masqué jusqu'au split (pas de FOUC),
 * réaffiché immédiatement ; les lignes restent cachées sous le masque.
 */
export function SplitReveal({
  children, as: Tag = 'div', className, style,
  start = 'top 85%', immediate = false, delay = 0, stagger = 0.1,
}: {
  children: ReactNode; as?: ElementType; className?: string; style?: CSSProperties
  start?: string; immediate?: boolean; delay?: number; stagger?: number
}) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const el = ref.current
    if (reduced() || !el) return
    let split: SplitText | null = null
    let tween: gsap.core.Tween | null = null
    gsap.set(el, { autoAlpha: 0 })
    whenFontsReady(() => {
      if (!ref.current) return
      split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'sr-line' })
      gsap.set(el, { autoAlpha: 1 })
      const to: gsap.TweenVars = { yPercent: 0, duration: 1, ease: 'power4.out', stagger, delay: immediate ? delay : 0 }
      if (!immediate) to.scrollTrigger = { trigger: el, start, once: true }
      tween = gsap.fromTo(split.lines, { yPercent: 115 }, to)
    })
    return () => { tween?.kill(); split?.revert() }
  }, { scope: ref })
  return <Tag ref={ref as never} className={className} style={style}>{children}</Tag>
}

/**
 * Parallaxe de couche : yPercent +speed -> -speed pendant la traversée du
 * viewport. DESKTOP UNIQUEMENT via matchMedia. transform-only.
 */
export function Parallax({
  children, className, style, speed = 10,
}: {
  children: ReactNode; className?: string; style?: CSSProperties; speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      if (!ref.current) return
      gsap.fromTo(ref.current, { yPercent: speed }, {
        yPercent: -speed, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }, { scope: ref })
  return <div ref={ref} className={className} style={style}>{children}</div>
}

/**
 * Image cinématique pleine largeur : révélation par masque (clip-path) +
 * léger zoom arrière, et parallaxe verticale au scroll (desktop).
 */
export function ImageReveal({
  src, alt = '', caption, className,
}: {
  src: string; alt?: string; caption?: ReactNode; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const img = el.querySelector('img')
    const cap = el.querySelector('[data-cap]')
    if (!reduced() && img) {
      gsap.fromTo(el, { clipPath: 'inset(14% 14% 14% 14%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      })
      gsap.fromTo(img, { scale: 1.28 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      if (cap) gsap.fromTo(cap, { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      })
    }
  }, { scope: ref })
  return (
    <div ref={ref} className={className}>
      <img src={src} alt={alt} loading="lazy" />
      {caption && <span data-cap className="photo-band-cap">{caption}</span>}
    </div>
  )
}
