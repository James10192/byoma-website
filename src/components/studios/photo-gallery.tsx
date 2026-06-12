import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function PhotoGallery({ photos, name }: { photos: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  // Le portail vise document.body : indisponible au SSR, donc on attend le montage client.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = useCallback(() => setLightbox(false), [])

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + photos.length) % photos.length),
    [photos.length],
  )

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    // Verrou du défilement, restauré exactement à sa valeur d'origine au démontage.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [lightbox, go])

  if (photos.length === 0) return null

  return (
    <div>
      {/* Image principale */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label="Agrandir la photo"
        className="gallery-main"
      >
        <img
          src={photos[active]}
          alt={`${name} — photo ${active + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </button>

      {/* Miniatures */}
      {photos.length > 1 && (
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: `repeat(${Math.min(photos.length, 6)}, 1fr)`, gap: 10 }}>
          {photos.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-current={i === active}
              className={`gallery-thumb${i === active ? ' is-active' : ''}`}
            >
              <img src={p} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}

      <style>{`
        .gallery-main {
          width: 100%;
          aspect-ratio: 4 / 3;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
          cursor: zoom-in;
          padding: 0;
          background: var(--ivory-2);
          display: block;
          box-shadow: var(--shadow-soft);
        }
        .gallery-main img { transition: transform 0.9s var(--ease); }
        .gallery-main:hover img { transform: scale(1.04); }
        .gallery-thumb {
          aspect-ratio: 1 / 1;
          border: 1.5px solid var(--line);
          border-radius: var(--radius-sm);
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          opacity: 0.78;
          background: var(--ivory-2);
          transition: opacity 0.25s var(--ease), border-color 0.25s var(--ease), transform 0.25s var(--ease);
        }
        .gallery-thumb:hover { opacity: 1; transform: translateY(-2px); }
        .gallery-thumb.is-active { border-color: var(--gold); opacity: 1; }
      `}</style>

      {/*
        Lightbox rendue dans un portail vers document.body.
        Indispensable : la galerie est enveloppée par <Reveal> (GSAP), qui laisse
        un `transform` résiduel sur son conteneur. Un enfant `position: fixed`
        serait alors positionné par rapport à ce conteneur transformé (et non au
        viewport), cassant le plein écran, le fond et le z-index au-dessus de la
        navbar. Le portail extrait le noeud de cet ancêtre transformé.
      */}
      {mounted &&
        lightbox &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Galerie ${name}`}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(27, 23, 16, 0.92)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); close() }}
              aria-label="Fermer"
              style={lightboxBtn({ top: 20, right: 20 })}
            >
              <X size={22} />
            </button>

            {photos.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Photo précédente" style={lightboxBtn({ left: 16 })}>
                  <ChevronLeft size={26} />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Photo suivante" style={lightboxBtn({ right: 16 })}>
                  <ChevronRight size={26} />
                </button>
              </>
            )}

            <img
              src={photos[active]}
              alt={`${name} — photo ${active + 1}`}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 'var(--radius-sm)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />

            {photos.length > 1 && (
              <span style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(251,247,238,0.72)', fontSize: '0.8125rem', letterSpacing: '0.08em' }}>
                {active + 1} / {photos.length}
              </span>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}

function lightboxBtn(pos: Record<string, number>): React.CSSProperties {
  return {
    position: 'absolute',
    ...pos,
    top: pos.top ?? '50%',
    transform: pos.top == null ? 'translateY(-50%)' : undefined,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(251,247,238,0.10)',
    border: '1px solid rgba(217,185,120,0.45)',
    borderRadius: '50%',
    color: 'var(--ivory)',
    cursor: 'pointer',
  }
}
