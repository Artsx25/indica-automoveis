// src/app/App.tsx
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFAB } from '@/components/whatsapp/WhatsAppFAB'
import { useUTM } from '@/hooks/useUTM'
import { track } from '@/lib/analytics'

export default function App() {
  const location = useLocation()
  useUTM() // Capture UTM on every navigation

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Track page views
  useEffect(() => {
    if (location.pathname === '/') track('view_home')
  }, [location.pathname])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
