// src/components/seo/MetaTags.tsx
// Dynamic meta tags using document.head manipulation (no react-helmet needed)
import { useEffect } from 'react'
import { analyticsConfig } from '@/config/analytics'

interface MetaTagsProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  noindex?: boolean
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function MetaTags({ title, description, canonical, ogImage, noindex = false }: MetaTagsProps) {
  const siteUrl = analyticsConfig.siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  const canonicalUrl = canonical
    ? `${siteUrl}${canonical}`
    : typeof window !== 'undefined'
    ? window.location.href
    : ''

  useEffect(() => {
    document.title = title
    setMeta('description', description)
    if (noindex) setMeta('robots', 'noindex,nofollow')

    // OpenGraph
    const fullOgImage = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : `${siteUrl}${ogImage}`
      : ''

    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', 'website', true)
    if (canonicalUrl) setMeta('og:url', canonicalUrl, true)
    if (fullOgImage) setMeta('og:image', fullOgImage, true)

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    if (fullOgImage) setMeta('twitter:image', fullOgImage)

    // Canonical
    if (canonicalUrl) setLink('canonical', canonicalUrl)
  }, [title, description, canonicalUrl, ogImage, noindex, siteUrl])

  return null
}
