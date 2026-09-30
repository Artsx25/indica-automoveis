// src/app/router.tsx
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import App from './App'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'))
const InventoryPage = lazy(() => import('@/pages/InventoryPage'))
const VehicleDetailPage = lazy(() => import('@/pages/VehicleDetailPage'))
const FinancingPage = lazy(() => import('@/pages/FinancingPage'))
const SellYourCarPage = lazy(() => import('@/pages/SellYourCarPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#e11d29', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

function CarrosSlugRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/veiculo/${slug ?? ''}`} replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>,
      },
      {
        path: 'estoque',
        element: <Suspense fallback={<PageLoader />}><InventoryPage /></Suspense>,
      },
      {
        path: 'carros',
        element: <Navigate to="/estoque" replace />,
      },
      {
        path: 'carros/:slug',
        element: <CarrosSlugRedirect />,
      },
      {
        path: 'veiculo/:slug',
        element: <Suspense fallback={<PageLoader />}><VehicleDetailPage /></Suspense>,
      },
      {
        path: 'financiamento',
        element: <Suspense fallback={<PageLoader />}><FinancingPage /></Suspense>,
      },
      {
        path: 'venda-seu-carro',
        element: <Suspense fallback={<PageLoader />}><SellYourCarPage /></Suspense>,
      },
      {
        path: 'sobre',
        element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense>,
      },
      {
        path: 'contato',
        element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense>,
      },
      {
        path: 'politica-de-privacidade',
        element: <Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>,
      },
      {
        path: '*',
        element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>,
      },
    ],
  },
])
