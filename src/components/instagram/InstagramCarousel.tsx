// src/components/instagram/InstagramCarousel.tsx
import { useRef } from 'react'
import { Heart, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { business } from '@/config/business'
import instagramPosts from '@/data/instagramPosts.json'
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
    <section className={styles.section} aria-label="Feed do Instagram">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <span className={styles.eyebrow}>
              <InstagramIcon size={14} /> Instagram Oficial
            </span>
            <h2 className={styles.title}>Acompanhe a @indica.automoveis</h2>
            <p className={styles.subtitle}>
              Confira os novos veículos em estoque, detalhes exclusivos e bastidores direto na nossa rede social.
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.navControls}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => handleScroll('left')}
                aria-label="Rolar posts para esquerda"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => handleScroll('right')}
                aria-label="Rolar posts para direita"
                style={{ marginLeft: 8 }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.followBtn}
            >
              <InstagramIcon size={16} /> Seguir Perfil
            </a>
          </div>
        </div>

        <div className={styles.trackWrapper}>
          <div ref={trackRef} className={styles.track}>
            {instagramPosts.map(post => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay}>
                  <div className={styles.overlayTop}>
                    <span className={styles.instaBadge}>
                      <InstagramIcon size={12} /> @indica.automoveis
                    </span>
                  </div>
                  <div className={styles.overlayBottom}>
                    <p className={styles.caption}>{post.caption}</p>
                    <div className={styles.stats}>
                      <span className={styles.likes}>
                        <Heart size={13} fill="#ff4b5c" /> {post.likes} curtidas
                      </span>
                      <span className={styles.viewPost}>
                        Ver post <ExternalLink size={11} />
                      </span>
                    </div>
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
