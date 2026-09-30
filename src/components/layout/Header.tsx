// src/components/layout/Header.tsx
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, ChevronRight, Phone, MapPin } from 'lucide-react'
import { clsx } from 'clsx'
import { business } from '@/config/business'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { track } from '@/lib/analytics'
import styles from './Header.module.css'

const navLinks = [
  { to: '/', label: 'Início', end: true },
  { to: '/estoque', label: 'Estoque' },
  { to: '/financiamento', label: 'Financiamento' },
  { to: '/venda-seu-carro', label: 'Venda seu carro' },
  { to: '/sobre', label: 'Sobre nós' },
  { to: '/contato', label: 'Contato' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { getGeneralUrl } = useWhatsAppLead()
  const location = useLocation()

  // Close mobile menu whenever location changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Render mobile drawer through React Portal into document.body to avoid backdrop-filter containing block trap
  const mobileDrawerElement = typeof document !== 'undefined' ? (
    <>
      {isMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={clsx(styles.mobileDrawer, isMenuOpen && styles.mobileDrawerOpen)}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className={styles.drawerHeader}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src="/images/logo.png" alt="Indica Automóveis" className={styles.drawerLogo} />
          </Link>
          <button
            className={styles.drawerCloseBtn}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          <nav className={styles.mobileNav} aria-label="Navegação móvel">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(styles.mobileNavLink, isActive && styles.mobileNavLinkActive)
                }
              >
                <span>{link.label}</span>
                <ChevronRight size={18} className={styles.mobileNavChevron} />
              </NavLink>
            ))}
          </nav>

          <div className={styles.drawerFooter}>
            <a
              href={getGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileWhatsappBtn}
              onClick={() => {
                track('click_whatsapp', { location: 'mobile_drawer' })
                setIsMenuOpen(false)
              }}
            >
              <MessageCircle size={20} />
              Falar no WhatsApp
            </a>
            <div className={styles.drawerContactInfo}>
              <p><Phone size={14} /> {business.whatsappDisplay}</p>
              <p><MapPin size={14} /> {business.address}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null

  return (
    <>
      <header className={clsx(styles.header, isScrolled && styles.scrolled)}>
        <div className={clsx('container', styles.inner)}>
          {/* Official Brand Logo */}
          <Link to="/" className={styles.logo} aria-label="Indica Automóveis — Página Inicial">
            <img
              src="/images/logo.png"
              alt="Indica Automóveis"
              className={styles.logoImg}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} aria-label="Navegação principal">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  clsx(styles.navLink, isActive && styles.navLinkActive)
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Actions */}
          <div className={styles.actions}>
            <a
              href={getGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
              onClick={() => track('click_whatsapp', { location: 'header' })}
              aria-label="Falar no WhatsApp"
            >
              <MessageCircle size={18} />
              <span className={styles.whatsappLabel}>Falar no WhatsApp</span>
            </a>

            {/* Mobile menu toggle button */}
            <button
              className={styles.menuToggle}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Render portal for mobile menu */}
      {typeof document !== 'undefined' && createPortal(mobileDrawerElement, document.body)}
    </>
  )
}
