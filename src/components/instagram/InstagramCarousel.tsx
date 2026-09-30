// src/components/instagram/InstagramCarousel.tsx
import { useRef } from 'react'
import { Play, Eye, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { business } from '@/config/business'
import instagramReels from '@/data/instagramReels.json'
import styles from './InstagramCarousel.module.css'

function InstagramIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function ReelsIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <path d="m9 9 6 3-6 3V9z" fill="currentColor" />
      <path d="M7 3v4M17 3v4M3 7h18" />
    </svg>
  )
}

export function InstagramCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollDistance = trackRef.current.clientWidth * 0.75
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className={styles.section} aria-label="Reels do Instagram">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <span className={styles.eyebrow}>
              <ReelsIcon size={14} /> Instagram Reels Oficial
            </span>
            <h2 className={styles.title}>Nossos Reels & Bastidores</h2>
            <p className={styles.subtitle}>
              Vídeos reais do nosso estoque, entregas e novidades gravados diretamente na loja.
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.navControls}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => handleScroll('left')}
                aria-label="Rolar reels para esquerda"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => handleScroll('right')}
                aria-label="Rolar reels para direita"
                style={{ marginLeft: 8 }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <a
              href={`${business.instagram}reels/`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.followBtn}
            >
              <InstagramIcon size={16} /> Ver Todos no Reels
            </a>
          </div>
        </div>

        <div className={styles.trackWrapper}>
          <div ref={trackRef} className={styles.track}>
            {instagramReels.map(reel => (
              <a
                key={reel.id}
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
                aria-label={reel.title}
              >
                <img
                  src={reel.image}
                  alt={reel.title}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.cardShade} />

                {/* Top badges */}
                <div className={styles.topBadges}>
                  <span className={styles.tagBadge}>{reel.tag}</span>
                  <span className={styles.viewsBadge}>
                    <Eye size={11} /> {reel.views.replace(' visualizações', '')}
                  </span>
                </div>

                {/* Center play icon */}
                <div className={styles.playButtonWrapper}>
                  <div className={styles.playButton}>
                    <Play size={18} fill="#ffffff" stroke="none" />
                  </div>
                </div>

                {/* Bottom title & footer */}
                <div className={styles.bottomInfo}>
                  <p className={styles.reelTitle}>{reel.title}</p>
                  <div className={styles.reelFooter}>
                    <span className={styles.reelAccount}>@indica.automoveis</span>
                    <span className={styles.watchLabel}>
                      Assistir <ExternalLink size={11} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
