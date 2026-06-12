import { useRef, type ReactNode, type ElementType, type CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Point unique d'enregistrement (idempotent, client-only via évaluation du module).
gsap.registerPlugin(useGSAP, ScrollTrigger)

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Révèle un bloc au scroll : autoAlpha 0->1 + y 28->0, une seule fois.
 * Base VISIBLE (immediateRender:false) : si le trigger ne tire pas, le
 * contenu reste lisible. Anime transform+opacity uniquement.
 * Actif mobile ET desktop (effet léger, compositor-friendly).
 */
export function Reveal({
  children,
  className,
  style,
  as: Tag = 'div',
  y = 28,
  delay = 0,
  start = 'top 86%',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: ElementType
  y?: number
  delay?: number
  start?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (reduced() || !ref.current) return
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          delay,
          immediateRender: false,
          scrollTrigger: { trigger: ref.current, start, once: true },
        },
      )
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  )
}

/**
 * Révèle les enfants DIRECTS en cascade au scroll (stagger).
 * Base visible (immediateRender:false). transform+opacity uniquement.
 * Si querySelectorAll ne trouve rien -> early return, enfants visibles.
 */
export function Stagger({
  children,
  className,
  style,
  as: Tag = 'div',
  childSelector = ':scope > *',
  y = 24,
  stagger = 0.06,
  start = 'top 82%',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: ElementType
  childSelector?: string
  y?: number
  stagger?: number
  start?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (reduced() || !ref.current) return
      const targets = ref.current.querySelectorAll(childSelector)
      if (!targets.length) return
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger,
          immediateRender: false,
          scrollTrigger: { trigger: ref.current, start, once: true },
        },
      )
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  )
}

/**
 * Parallaxe de couche : yPercent +speed -> -speed pendant la traversée du
 * viewport. DESKTOP UNIQUEMENT via matchMedia. transform-only.
 * Aucun état caché : matchMedia ne pose rien sur mobile/reduced -> contenu natif.
 * Ne JAMAIS appliquer sur un élément contenant un position:sticky.
 */
export function Parallax({
  children,
  className,
  style,
  speed = 10,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        if (!ref.current) return
        gsap.fromTo(
          ref.current,
          { yPercent: speed },
          {
            yPercent: -speed,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
