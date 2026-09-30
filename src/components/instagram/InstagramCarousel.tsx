// src/components/instagram/InstagramCarousel.tsx
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Eye,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  X,
  MessageCircle,
  Maximize2,
} from 'lucide-react'
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

const AUTOPLAY_DURATION = 5000 // 5 seconds per reel

export function InstagramCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const [modalPlaying, setModalPlaying] = useState(true)
  const [modalMuted, setModalMuted] = useState(false)
  const [modalProgress, setModalProgress] = useState(0)
  const [isInView, setIsInView] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const modalVideoRef = useRef<HTMLVideoElement | null>(null)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  // Scroll active card into view
  const scrollToCard = useCallback((index: number, smooth = true) => {
    if (!trackRef.current) return
    const cardEl = trackRef.current.children[index] as HTMLElement | undefined
    if (!cardEl) return

    isScrollingRef.current = true
    const track = trackRef.current
    const cardLeft = cardEl.offsetLeft
    const cardWidth = cardEl.offsetWidth
    const trackWidth = track.clientWidth

    // Center the card in the visible track
    const targetScroll = cardLeft - (trackWidth / 2) + (cardWidth / 2)
    track.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: smooth ? 'smooth' : 'auto',
    })

    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false
    }, 500)
  }, [])

  // IntersectionObserver: trigger as soon as section is even slightly near viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.05, rootMargin: '150px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Play ONLY the active video ("um por um"), pause all others
  const syncPlayback = useCallback(() => {
    if (modalIndex !== null) {
      // Pause all cards if modal is open
      videoRefs.current.forEach(v => {
        if (v && !v.paused) v.pause()
      })
      return
    }

    videoRefs.current.forEach((video, idx) => {
      if (!video) return
      if (idx === activeIndex && isInView) {
        video.muted = isMuted
        video.defaultMuted = isMuted
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Guarantee muted and try again
            video.muted = true
            video.play().catch(() => {})
          })
        }
      } else {
        if (!video.paused) {
          video.pause()
        }
        video.currentTime = 0
      }
    })
  }, [activeIndex, isInView, modalIndex, isMuted])

  useEffect(() => {
    syncPlayback()
  }, [syncPlayback])

  // Try playing immediately on mount for desktop & mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      syncPlayback()
    }, 200)
    return () => clearTimeout(timer)
  }, [syncPlayback])

  // 5-second Autoplay timer
  useEffect(() => {
    if (!isInView || isPaused || modalIndex !== null) return

    const stepMs = 50
    const increment = (stepMs / AUTOPLAY_DURATION) * 100

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          const nextIndex = (activeIndex + 1) % instagramReels.length
          setActiveIndex(nextIndex)
          scrollToCard(nextIndex)
          return 0
        }
        return prev + increment
      })
    }, stepMs)

    return () => clearInterval(timer)
  }, [activeIndex, isPaused, isInView, modalIndex, scrollToCard])

  // Manual navigation handlers
  const handleNext = () => {
    setProgress(0)
    const next = (activeIndex + 1) % instagramReels.length
    setActiveIndex(next)
    scrollToCard(next)
  }

  const handlePrev = () => {
    setProgress(0)
    const prev = (activeIndex - 1 + instagramReels.length) % instagramReels.length
    setActiveIndex(prev)
    scrollToCard(prev)
  }

  const handleSelectReel = (index: number) => {
    setProgress(0)
    setActiveIndex(index)
    scrollToCard(index)
  }

  // Handle user scroll / swipe in the carousel track
  const handleTrackScroll = () => {
    if (isScrollingRef.current || !trackRef.current) return

    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!trackRef.current) return
      const track = trackRef.current
      const center = track.scrollLeft + track.clientWidth / 2

      let closestIdx = 0
      let minDistance = Infinity

      Array.from(track.children).forEach((child, idx) => {
        const el = child as HTMLElement
        const cardCenter = el.offsetLeft + el.offsetWidth / 2
        const dist = Math.abs(center - cardCenter)
        if (dist < minDistance) {
          minDistance = dist
          closestIdx = idx
        }
      })

      if (closestIdx !== activeIndex) {
        setProgress(0)
        setActiveIndex(closestIdx)
      }
    }, 120)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    setIsPaused(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && touchStartYRef.current !== null) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current
      // Only horizontal swipes
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          handleNext()
        } else {
          handlePrev()
        }
      }
      touchStartXRef.current = null
      touchStartYRef.current = null
    }
    setIsPaused(false)
  }

  // In-card click: open modal to play directly on site without leaving
  const openReelModal = (index: number) => {
    setModalIndex(index)
    setModalPlaying(true)
    setModalProgress(0)
  }

  const closeReelModal = () => {
    setModalIndex(null)
    if (modalVideoRef.current) {
      modalVideoRef.current.pause()
    }
  }

  // Next / Prev within modal
  const handleModalNext = () => {
    if (modalIndex === null) return
    const next = (modalIndex + 1) % instagramReels.length
    setModalIndex(next)
    setModalProgress(0)
    setActiveIndex(next)
    scrollToCard(next)
  }

  const handleModalPrev = () => {
    if (modalIndex === null) return
    const prev = (modalIndex - 1 + instagramReels.length) % instagramReels.length
    setModalIndex(prev)
    setModalProgress(0)
    setActiveIndex(prev)
    scrollToCard(prev)
  }

  // Keyboard controls for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalIndex === null) return
      if (e.key === 'Escape') closeReelModal()
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleModalNext()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handleModalPrev()
      else if (e.key === ' ' && modalVideoRef.current) {
        e.preventDefault()
        if (modalVideoRef.current.paused) {
          modalVideoRef.current.play()
          setModalPlaying(true)
        } else {
          modalVideoRef.current.pause()
          setModalPlaying(false)
        }
      }
    }

    if (modalIndex !== null) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [modalIndex])

  const currentModalReel = modalIndex !== null ? instagramReels[modalIndex] : null

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Reels do Instagram">
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
                onClick={handlePrev}
                aria-label="Reel anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={handleNext}
                aria-label="Próximo reel"
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

        {/* Carousel Track */}
        <div
          className={styles.trackWrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className={styles.track}
            onScroll={handleTrackScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {instagramReels.map((reel, idx) => {
              const isActive = idx === activeIndex
              return (
                <div
                  key={reel.id}
                  className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                  onClick={() => openReelModal(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Assistir reel: ${reel.title}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openReelModal(idx)
                    }
                  }}
                >
                  {/* 5-second countdown progress bar for active card */}
                  {isActive && (
                    <div className={styles.cardProgressBarTrack}>
                      <div
                        className={styles.cardProgressBarFill}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Fallback image poster */}
                  <img
                    src={reel.image}
                    alt={reel.title}
                    className={styles.image}
                    loading={idx <= 2 ? 'eager' : 'lazy'}
                  />

                  {/* Real MP4 Video */}
                  {reel.video && (
                    <video
                      ref={el => {
                        videoRefs.current[idx] = el
                        if (el) {
                          el.muted = isMuted
                          el.defaultMuted = isMuted
                        }
                      }}
                      src={reel.video}
                      poster={reel.image}
                      className={styles.cardVideo}
                      autoPlay={isActive}
                      muted={isMuted}
                      playsInline
                      loop
                      preload={idx <= 2 ? 'auto' : 'metadata'}
                    />
                  )}

                  <div className={styles.cardShade} />

                  {/* Top badges */}
                  <div className={styles.topBadges}>
                    <span className={styles.tagBadge}>{reel.tag}</span>
                    <span className={styles.viewsBadge}>
                      <Eye size={11} /> {reel.views.replace(' visualizações', '')}
                    </span>
                  </div>

                  {/* Center play icon or status */}
                  <div className={styles.playButtonWrapper}>
                    <div className={styles.playButton}>
                      <Play size={22} fill="#ffffff" stroke="none" />
                    </div>
                  </div>

                  {/* Audio toggle button on active card */}
                  {isActive && (
                    <button
                      type="button"
                      className={styles.cardAudioBtn}
                      onClick={e => {
                        e.stopPropagation()
                        setIsMuted(prev => !prev)
                      }}
                      aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                      title={isMuted ? 'Ativar som' : 'Desativar som'}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  )}

                  {/* Bottom title & footer */}
                  <div className={styles.bottomInfo}>
                    <p className={styles.reelTitle}>{reel.title}</p>
                    <div className={styles.reelFooter}>
                      <span className={styles.reelAccount}>@indica.automoveis</span>
                      <span className={styles.watchLabel}>
                        <Maximize2 size={12} /> Assistir no site
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Dots Indicator & Reel Counter */}
          <div className={styles.carouselIndicators}>
            <div className={styles.dotsList}>
              {instagramReels.map((reel, idx) => (
                <button
                  key={reel.id}
                  type="button"
                  className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ''}`}
                  onClick={() => handleSelectReel(idx)}
                  aria-label={`Ir para o vídeo ${idx + 1}`}
                />
              ))}
            </div>
            <span className={styles.counterText}>
              {activeIndex + 1} de {instagramReels.length}
            </span>
          </div>
        </div>
      </div>

      {/* In-Site High-Resolution Reels Modal Player (no redirects to Instagram!) */}
      {currentModalReel && modalIndex !== null && (
        <div
          className={styles.modalBackdrop}
          onClick={closeReelModal}
          role="dialog"
          aria-modal="true"
          aria-label={currentModalReel.title}
        >
          <div
            className={styles.modalDialog}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={closeReelModal}
              aria-label="Fechar vídeo"
            >
              <X size={22} />
            </button>

            {/* Modal Prev / Next buttons */}
            <button
              type="button"
              className={`${styles.modalNavBtn} ${styles.modalNavPrev}`}
              onClick={handleModalPrev}
              aria-label="Vídeo anterior"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              type="button"
              className={`${styles.modalNavBtn} ${styles.modalNavNext}`}
              onClick={handleModalNext}
              aria-label="Próximo vídeo"
            >
              <ChevronRight size={26} />
            </button>

            {/* Video Container */}
            <div className={styles.modalVideoContainer}>
              <video
                ref={modalVideoRef}
                src={currentModalReel.video || ''}
                poster={currentModalReel.image}
                className={styles.modalVideo}
                autoPlay
                playsInline
                loop
                muted={modalMuted}
                onTimeUpdate={e => {
                  const target = e.currentTarget
                  if (target.duration) {
                    setModalProgress((target.currentTime / target.duration) * 100)
                  }
                }}
                onClick={() => {
                  if (modalVideoRef.current) {
                    if (modalVideoRef.current.paused) {
                      modalVideoRef.current.play()
                      setModalPlaying(true)
                    } else {
                      modalVideoRef.current.pause()
                      setModalPlaying(false)
                    }
                  }
                }}
              />

              {/* Progress Bar inside Modal */}
              <div
                className={styles.modalTimelineTrack}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pos = (e.clientX - rect.left) / rect.width
                  if (modalVideoRef.current && modalVideoRef.current.duration) {
                    modalVideoRef.current.currentTime = pos * modalVideoRef.current.duration
                  }
                }}
              >
                <div
                  className={styles.modalTimelineFill}
                  style={{ width: `${modalProgress}%` }}
                />
              </div>

              {/* Floating controls overlay */}
              <div className={styles.modalTopControls}>
                <span className={styles.modalTagBadge}>{currentModalReel.tag}</span>
                <button
                  type="button"
                  className={styles.modalVolumeBtn}
                  onClick={() => setModalMuted(prev => !prev)}
                  aria-label={modalMuted ? 'Ativar som' : 'Desativar som'}
                >
                  {modalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>

              {/* Center Play/Pause Indicator if paused */}
              {!modalPlaying && (
                <div
                  className={styles.modalPausedOverlay}
                  onClick={() => {
                    modalVideoRef.current?.play()
                    setModalPlaying(true)
                  }}
                >
                  <div className={styles.modalPlayPulse}>
                    <Play size={36} fill="#ffffff" stroke="none" />
                  </div>
                </div>
              )}

              {/* Modal Bottom Details & WhatsApp CTA */}
              <div className={styles.modalFooterOverlay}>
                <div className={styles.modalInfoText}>
                  <p className={styles.modalReelTitle}>{currentModalReel.title}</p>
                  <div className={styles.modalMetaRow}>
                    <span className={styles.modalAccountBadge}>@indica.automoveis</span>
                    <span className={styles.modalViewsCount}>
                      <Eye size={12} /> {currentModalReel.views}
                    </span>
                  </div>
                </div>

                <div className={styles.modalActionsRow}>
                  <a
                    href={`https://wa.me/${business.whatsappE164}?text=${encodeURIComponent(
                      `Olá! Assisti ao reel "${currentModalReel.title}" no site da Indica Automóveis e gostaria de mais informações!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalWhatsappBtn}
                  >
                    <MessageCircle size={18} /> Tenho Interesse neste Veículo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
