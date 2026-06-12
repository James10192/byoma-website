import { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function PhotoGallery({ photos, name }: { photos: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + photos.length) % photos.length),
    [photos.length],
  )

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
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
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          border: '1px solid var(--line)',
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'zoom-in',
          padding: 0,
          background: 'var(--cream-2)',
          display: 'block',
        }}
      >
        <img
          src={photos[active]}
          alt={`${name} — photo ${active + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </button>

      {/* Miniatures */}
      {photos.length > 1 && (
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: `repeat(${Math.min(photos.length, 6)}, 1fr)`, gap: 8 }}>
          {photos.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-current={i === active}
              style={{
                aspectRatio: '1 / 1',
                border: i === active ? '2px solid var(--gold)' : '1px solid var(--line)',
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 0,
                opacity: i === active ? 1 : 0.7,
                background: 'var(--cream-2)',
              }}
            >
              <img src={p} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie ${name}`}
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(28, 18, 0, 0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Fermer"
            style={lightboxBtn({ top: 20, right: 20 })}
          >
            <X size={22} />
          </button>

          {photos.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Précédent" style={lightboxBtn({ left: 16 })}>
                <ChevronLeft size={26} />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Suivant" style={lightboxBtn({ right: 16 })}>
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <img
            src={photos[active]}
            alt={`${name} — photo ${active + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 4 }}
          />

          <span style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', letterSpacing: '0.08em' }}>
            {active + 1} / {photos.length}
          </span>
        </div>
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
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(201,168,76,0.4)',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
  }
}
